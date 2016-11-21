# React Points #

This project is a point tracking system written using Node.js w/ ExpressJS on the back-end, and React w/ Flux on the front-end.

## Concepts ##

### Event ###

An event is something in which a person attends or an activity in which they complete.

### Point Item ###

A point item is directly linked to an event and is the amount of points a person receives for attending or missing an event.

## To-Do ##

- [ ] Caching(HTTP and Database)
- [ ] Backend Testing
- [ ] Handle Errors Better

## Running Locally ##

1. Clone the repository
2. Install npm dependencies using `npm install`
3. Run the backend server using `npm start`
  - Note: This will fail if it can't connect to MongoDB
4. Run the webpack server for live-reload using `npm run serve`
