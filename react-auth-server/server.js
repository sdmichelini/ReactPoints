// server.js

require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwt2 = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

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

var events = [
  {
    id: 1,
    name: "Work Party",
    type: 0,
    required: true,
    when: "2016-10-27T20:57:44.286Z",
    points_present: 5,
    points_missed: 0
  }
];

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

var all_point_items = [
  {
    id: 1,
    user_id: 1,
    _event: {
      name: "Work Party",
      id: 1
    },
    points: 5
  },
  {
    id: 2,
    user_id: 2,
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

app.get('/api/events', (req, res) => {
  const allEvents = events.map(event => {
    return { id: event.id, name: event.name, type: event.type, required: event.required, when: event.when, points_present: event.points_present, points_missed: event.points_missed}
  });
  res.json(allEvents);
});

app.get('/api/events/:id', authCheck, (req, res) => {
  res.json(events.filter(event => event.id === parseInt(req.params.id)));
});

app.get('/api/points', (req, res)=> {
  const allPoints = points.map(point => {
    return { name: point.name, points: point.points, id: point.id, user_id: point.user_id }
  });
  res.json({ points: allPoints, message:"Success!" });
});

app.get('/api/users/:user_id/points', (req, res) => {
  user_id = parseInt(req.params.user_id);
  const user = all_users.filter(user => user.id === user_id);
  if(user.length < 0){
    res.status(404);
    res.json({error: "User Not Found"});
  }else{
    const userPoints = all_point_items.filter(point_item => point_item.user_id=== user_id);
    res.json({ user: user[0], items: userPoints});
  }
});

app.get('/api/auth', authCheck,(req, res) => {
  console.log(req.user.sub);
  let auth = false;
  for(let client of ALLOWED_CLIENTS) {
    if(client === req.user.sub) {
      auth = true;
      break;
    }
  }
  if(auth)
    res.json({message:"Hi"});
  else {
    res.status(403);
    res.json({error:"Client not allowed to access resource."});
  }
});

app.listen(3001);
console.log('Listening on http://localhost:3001');
