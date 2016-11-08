// server.js
"use strict";
require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

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

let next_event_id = 3;

let db;

let events = [
  {
    id: 1,
    name: "Work Party",
    type: 0,
    required: true,
    when: "2016-10-27T20:57:44.286Z",
    points_present: 5,
    points_missed: 0
  },
  {
    id: 2,
    name: "Work Party 2",
    type: 0,
    required: true,
    when: "2016-10-27T20:57:44.286Z",
    points_present: 5,
    points_missed: 0
  }
];

var totals = {};

var points = [
  {
    name: "Test User",
    points: 1000,
    id: 1,
    user_id: 1
  },
  {
    name: "Test User 2",
    points: 200,
    id: 2,
    user_id: 2
  }
];

let next_point_item = 3;

var all_point_items = [
  {
    id: 1,
    user_id: 1,
    name: 'J',
    _event: {
      name: "Work Party",
      id: 1
    },
    points: 5
  },
  {
    id: 2,
    user_id: 2,
    name: 'Bill',
    _event: {
      name: "Work Party",
      id: 1
    },
    points: 5
  }
];

var all_users = [
  {
    id: 1,
    name: "Test User"
  },
  {
    id: 2,
    name: "Test User 2"
  }
]

var point_items = [
  {
    id: 1,
    _user: {
      id: 1,
      name: "Test User",
    },
    _event: {
      name: "Work Party",
      id: 1
    },
    points: 5
  },
  {
    id: 2,
    _user: {
      id: 2,
      name: "Test User 2",
    },
    _event: {
      name: "Work Party",
      id: 1
    },
    points: 5
  }
];

const ALLOWED_CLIENTS = [
  'auth0|5813aac8f1413bed0950e515'
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
/*
  Update the points cache from all_point_items
*/
function calculatePoints() {
  let pointTotals = {};
  for(let item of all_point_items) {
    if(pointTotals[item.user_id]) {
      pointTotals[item.user_id].points = pointTotals[item.user_id].points + item.points;
    } else {
      pointTotals[item.user_id] = {};
      pointTotals[item.user_id].points = item.points;
      pointTotals[item.user_id].name = item.name;
    }
  }
  totals = pointTotals;
}

app.get('/api/events', (req, res) => {
  const allEvents = events.map(event => {
    return { id: event.id, name: event.name, type: event.type, required: event.required, when: event.when, points_present: event.points_present, points_missed: event.points_missed}
  });
  res.json(allEvents);
});

app.get('/api/events/:id', authCheck, (req, res) => {
  res.json(events.filter(event => event.id === parseInt(req.params.id)));
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
    let _event = {
      id: next_event_id,
      name: req.body.name,
      type: 0,
      required: req.body.required,
      when: req.body.date,
      points_present: req.body.present,
      points_missed: req.body.missed
    };
    events.push(_event);
    next_event_id = next_event_id + 1;
    db.collection('events').save(_event, (err, result) => {
      if (err) {
        res.status(500);
        res.json({message:'Database Error.'});
        return console.log(err)
      }
      res.status(201);//HTTP Created
      res.json({message:'Success.'});
    });

  }
});

app.get('/api/points', (req, res)=> {
  res.json({ points: totals, message:"Success!" });
});

app.post('/api/points', authCheck, checkAdmin, jsonParser, (req, res) => {
  /*
  {
    "event_id":"dhhdd",
    "users":[
      {"id":"dhdhdh", "status":0}
    ]
  }
  */

  if(!req.body.event_id) {
    res.status(400);
    res.json({message:'Missing event_id.'});
  } else if(!req.body.users) {
    res.status(400);
    res.json({message:'Missing users.'});
  } else {
    let _event = events.filter(e => e.id === parseInt(req.body.event_id));
    if(!_event) {
      res.status(404);
      res.json({message:'Event not found.'});
    } else {
      _event = _event[0];
      let items = [];
      for(let user of req.body.users) {
        let points;
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
          default:
            points = 0;
            break
        }
        let item = {
          id: next_point_item,
          user_id: user.id,
          name: user.name,
          _event: {
            name: _event.name,
            id: _event.id
          },
          points: points
        };
        items.push(item);
        next_point_item = next_point_item + 1;
        all_point_items.push(item);
      }
      calculatePoints();
      db.collection('points').insert(items, (err, result) => {
        if (err) {
          res.status(500);
          res.json({message:'Database Error.'});
          return console.log(err)
        }
        res.status(201);//HTTP Created
        res.json({message:'Success.'});
      });
    }
  }

});

app.get('/api/users/:user_id/points', (req, res) => {
  let user_id = parseInt(req.params.user_id);
  const user = all_users.filter(user => user.id === user_id);
  if(user.length < 0){
    res.status(404);
    res.json({error: "User Not Found"});
  }else{
    const userPoints = all_point_items.filter(point_item => point_item.user_id=== user_id);
    res.json({ user: user[0], items: userPoints});
  }
});

app.get('/api/auth', authCheck, checkAdmin, (req, res) => {
  res.json({message:"Token",token:process.env.AUTH0_TOKEN});
});

calculatePoints();
MongoClient.connect(process.env.MONGO_URL, (err, database) => {
  if(err) return console.log(err);
  db = database;
  app.listen(3001);
  console.log('Listening on http://localhost:3001');
});
