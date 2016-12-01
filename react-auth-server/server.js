// server.js
"use strict";
require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

let port = process.env.PORT || 3001;

//FEATURE FLAGS
const USE_MEMCACHE = (process.env.ENVIRONMENT != 'prod');

//The cache configuration is only populated if the USE_MEMCACHE feature flag is enabled
let cache_config = {};

const path = require('path');
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));


app.use(cors());

// create application/json parser
const jsonParser = bodyParser.json();

// Authentication middleware provided by express-jwt.
// This middleware will check incoming requests for a valid
// JWT on any routes that it is applied to.
const authCheck = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

let db;
let points_collection;
let events_collection;

var totals = {};

const ALLOWED_CLIENTS = [
  'auth0|5813aac8f1413bed0950e515',
  'auth0|582b89e18724638206744c82'
];

function checkAdmin(req, res, next) {
  let auth = false;
  for(let client of ALLOWED_CLIENTS) {
    if(client === req.user.sub) {
      auth = true;
      next();
      break;
    }
  }
  if(!auth) {
    res.status(403);
    res.json({error:"Client not allowed to access resource."});
  }

}

function calculatePointTotals() {
  let pointTotals = {};
  points_collection.find().toArray((err, items) => {
    let name_date;
    for(let item of items) {
      if(pointTotals[item.user_id]) {
        pointTotals[item.user_id].points = pointTotals[item.user_id].points + item.points;
        //Newest Date Should Have Name
        if(item._id.getTimestamp() > name_date) {
          name_date = item._id.getTimestamp();
          pointTotals[item.user_id].name = item.name;
        }
      } else {
        pointTotals[item.user_id] = {};
        pointTotals[item.user_id].points = item.points;
        pointTotals[item.user_id].name = item.name;
        name_date = item._id.getTimestamp();
      }
    }
    totals = pointTotals;
    if(USE_MEMCACHE) {
      cache_config.mc.set('totals', JSON.stringify(pointTotals), (err, val) => {
        if(err) {
          console.log('Memcahed Set Error');
        }
      }, cache_config.cache_time);
    }
  });
}
/*
  Update the points cache from all_point_items
*/
function calculatePoints(use_cache) {
  let pointTotals = {};

  if(use_cache && USE_MEMCACHE) {
    cache_config.mc.get('totals', (err, val)=> {
      if(err) {
        console.log('Unable to Retreive Points Cache.');
        calculatePointTotals();
      } else if(!val) {
        console.log('Cache Miss.');
        calculatePointTotals();
      } else {
        totals = JSON.parse(val);
      }
    });
  } else {
    calculatePointTotals();
  }
}

//EVENTS FUNCTION

//Fetch Events from MongoDB
let events_db_fetch = (res, cb) => {
  events_collection.find().toArray((err, events) => {
    if (err) {
      res.status(500);
      res.json({message:'Database Error.'});
      return console.log(err)
    }
    const allEvents = events.map(event => {
      return { id: event._id, name: event.name, type: event.type, required: event.required, when: event.when, points_present: event.points_present, points_missed: event.points_missed}
    });
    res.json(allEvents);
    cb(allEvents);
  });
}

app.get('/api/events', (req, res) => {
  if(USE_MEMCACHE) {
    //If we need to update the cache do it
    if(cache_config.need_events_update) {
      events_db_fetch(res, (events) => {
        cache_config.mc.set('events',JSON.stringify(events), (err, val) => {
          if(err) {
            console.log('Event Cache Set Error.');
          } else {
            cache_config.need_events_update = false;
          }
        }, cache_config.cache_time);
      });
      //Grab the latest cache
    } else {
      cache_config.mc.get('events', (err, val) => {
        if(err || !val) {
          if(err) {
            console.log('Cache Error w/ Events Get');
          } else {
            console.log('Cache Miss w/ Events Get');
          }
          events_db_fetch(res, (events) => {
            console.log('MongoDB Events GET');
            if(!err) {
              cache_config.mc.set('events',JSON.stringify(events), (err, val) => {
                if(err) {
                  console.log('Event Cache Set Error.');
                } else {
                  cache_config.need_events_update = false;
                }
              }, cache_config.cache_time);
            }
          });
        } else {
          res.json(JSON.parse(val));
        }
      });
    }
  } else {
    events_db_fetch(res, (events) => {
      console.log('MongoDB Events GET');
    });
  }
});

app.get('/api/events/:id', authCheck, (req, res) => {
  if(!req.params.id || (req.params.id.length != 24)) {
    res.status(400);
    res.json({message: 'Invalid Event ID.'});
    return console.log('Invalid Event ID.');
  } else {
    let obj_id = new ObjectId(req.params.id);
    events_collection.findOne({'_id':obj_id}, (err, event_) => {
      if(err) {
        res.status(500);
        res.json({message:'Database Error.'});
        return console.log(err);
      }
      res.json({id: event_._id, name: event_.name, type: event_.type, required: event_.required, when: event_.when,
      points_present: event_.points_present, points_missed: event_.points_missed});
    });
  }
});

app.post('/api/events', authCheck, checkAdmin, jsonParser, (req, res) => {
  if(!req.body.name) {
    res.status(400);
    res.json({message:'Missing name.'});
  } else if(req.body.required===undefined) {
    res.status(400);
    res.json({message:'Missing required parameter.'});
  } else if(req.body.present === undefined){
    res.status(400);
    res.json({message:'Missing points for completion parameter.'});
  } else if(req.body.missed === undefined){
    res.status(400);
    res.json({message:'Missing points for missed parameter.'});
  } else if(!req.body.date){
    res.status(400);
    res.json({message:'Missing date parameter.'});
  } else {
    let event_ = {
      name: req.body.name,
      type: 0,
      required: req.body.required,
      when: req.body.date,
      points_present: req.body.present,
      points_missed: req.body.missed
    };
    //Save it in the database
    events_collection.save(event_, (err, result) => {
      if (err) {
        res.status(500);
        res.json({message:'Database Error.'});
        return console.log(err)
      }
      res.status(201);//HTTP Created
      let event_result = {id: result.ops[0]._id, name: event_.name, type: event_.type, required: event_.required, when: event_.when,points_present: event_.points_present, points_missed: event_.points_missed};
      res.json({message:'Success.', _event: event_result});
      if(USE_MEMCACHE) {
        cache_config.need_events_update = true;
      }
    });

  }
});

app.delete('/api/events/:id', authCheck, checkAdmin, (req, res) => {
  if(USE_MEMCACHE) {
    cache_config.need_events_update = true;
  }
  if(!req.params.id || (req.params.id.length != 24)) {
    res.status(400);
    res.json({message: 'Invalid Event Item ID.'});
    return console.log('Invalid Event Item ID.');
  } else {
    let obj_id = new ObjectId(req.params.id);
    //Drop all the points w/ event id
    points_collection.deleteMany({'_event.id':obj_id}, (err, result) => {
      if(err) {
        res.status(500);
        res.json({message:'Internal Server Error.'});
      } else {
        events_collection.deleteOne({'_id':obj_id}, (err, result) => {
          if(err) {
            res.status(500);
            res.json({message:'Internal Server Error.'});
          } else {
            res.status(200);
            res.json({message:'Deleted Event.'});
          }
        });
      }
    });
  }
});

app.get('/api/points', (req, res)=> {
  res.json({ points: totals, message:"Success!" });
});

app.post('/api/points', authCheck, checkAdmin, jsonParser, (req, res) => {
  if(!req.body.event_id) {
    res.status(400);
    res.json({message:'Missing event_id.'});
  } else if(!req.body.users) {
    res.status(400);
    res.json({message:'Missing users.'});
  } else {
    let obj_id = new ObjectId(req.body.event_id);
    events_collection.findOne({_id: obj_id}, (err, _event)=>{
      if(err) {
        res.status(500);
        res.json({message:'Internal Server Error.'});
      }
      else if(!_event) {
        res.status(404);
        res.json({message:'Event not found.'});
      } else {
        let items = [];
        for(let user of req.body.users) {
          let points;
          //Do we need to add this item?
          let need_push = true;
          switch(user.selection) {
            case 0: //Present
              points = _event.points_present;
              break
            case 1: //Absent and Unexcused
              points = -_event.points_missed;
              break
            case 2: //Absent and Excused
              points = 0;
              break
            case 4:
              points = user.points || 0;
              break
            default:
              need_push = false;
              points = 0;
              break
          }
          if(need_push) {
            let item = {
              user_id: user.id,
              name: user.name,
              _event: {
                name: _event.name,
                id: _event._id
              },
              points: points
            };
            items.push(item);
          }
        }
        points_collection.insert(items, (err, result) => {
          if (err) {
            res.status(500);
            res.json({message:'Database Error.'});
            return console.log(err);
          }
          res.status(201);//HTTP Created
          res.json({message:'Success.'});
          calculatePoints();
        });
      }
    });
  }
});

//Update Points Item
app.put('/api/points/:id', authCheck, checkAdmin, jsonParser, (req, res) => {
  if(!req.params.id || (req.params.id.length != 24)) {
    res.status(400);
    res.json({message: 'Invalid Point Item ID.'});
    return console.log('Invalid Point Item ID.');
  } else if(req.body.points === undefined) {
    res.status(400);
    res.json({message: 'Invalid Point Item Point Count.'});
    return console.log('Invalid Point Item Point Count.');
  } else {
    let obj_id = new ObjectId(req.params.id);
    points_collection.update({_id: obj_id}, {$set: {points:Number(req.body.points)}},(err, count, result) => {
      if(err) {
        res.status(500);
        res.json({message:'Database Error.'});
        return console.log(err);
      } else {
        res.status(200);
        res.json({message:'Update Successful.'});
        calculatePoints(false);
      }
    });
  }
});
//Delete Points Item
app.delete('/api/points/:id', authCheck, checkAdmin, jsonParser, (req, res) => {
  if(!req.params.id || (req.params.id.length != 24)) {
    res.status(400);
    res.json({message: 'Invalid Point Item ID.'});
    return console.log('Invalid Point Item ID.');
  } else {
    let obj_id = new ObjectId(req.params.id);
    points_collection.remove({_id: obj_id},(err, count) => {
      if(err) {
        res.status(500);
        res.json({message:'Database Error.'});
        return console.log(err);
      } else {
        res.status(200);
        res.json({message:'Delete Successful.'});
        calculatePoints(false);
      }
    });
  }
});

app.get('/api/users/:user_id/points', (req, res) => {
  let user_id = req.params.user_id;
  points_collection.find({user_id: user_id}).toArray((err, items) => {
    if(err) {
      res.status(500);
      res.json({message:'Databse Error.'});
      return console.log(err);
    } else if (!items || (items.length == 0)) {
      res.status(404);
      res.json({message:'User ID not found.'});
      return console.log('404: points w/ user_id'+err);
    }
    let name = items[0].name;
    let user_id = items[0].user_id;
    let items2 = [];
    for(let item of items) {
      items2.push({ event: item._event, points: item.points, id: item._id});
    }
    let response = {user:{name: name, id: user_id}, items: items2};
    res.json(response);
  });
});

app.get('/api/auth', authCheck, checkAdmin, (req, res) => {
  res.json({message:"Token",token:process.env.AUTH0_TOKEN});
});

app.use('*', express.static(path.join(__dirname, 'dist')));

//Set up memcached only if use memcache is allowed
if(USE_MEMCACHE) {
  cache_config.memjs = require('memjs');
  cache_config.mc = cache_config.memjs.Client.create();
  cache_config.need_events_update = false;
  cache_config.need_points_update = false;
  cache_config.cache_time = 86400;
}

MongoClient.connect(process.env.MONGODB_URI, (err, database) => {
  if(err){
    console.log('MongoDB Error:');
    return console.log(err);
  }
  db = database;
  points_collection = db.collection('points');
  events_collection = db.collection('events');
  calculatePoints(true);
  app.listen(port);
  console.log('Listening on http://localhost:3001');
});
