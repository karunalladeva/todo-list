#! /usr/bin/env node

console.log('This script populates some test books, users, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return false
}

var async = require('async')
var Todo = require('./models/todo')
var User = require('./models/user')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var todos = []

function userCreate(first_name, last_name,cb) {
  var user = new User({ first_name: first_name, last_name: last_name });

  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user._id);
    users.push(user._id)
    cb(null, user)
  });
}

function todoCreate(title, description, is_done, user, is_deleted, cb) {

  var todo = new Todo({
    title: title,
    description: description,
    assigned_to: user,
    is_done: is_done,
    is_deleted: is_deleted
  });
  console.log(user)
  todo.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New todo: ' + todo);
    todos.push(todo)
    cb(null, todo)
  });
}

function createUsers(cb) {
  async.parallel([
    function (callback) {
      userCreate('Patrick', 'Rothfuss', callback);
    },
    function (callback) {
      userCreate('Ben', 'Bova', callback);
    },
    function (callback) {
      userCreate('Isaac', 'Asimov', callback);
    },
    function (callback) {
      userCreate('Bob', 'Billings', callback);
    },
    function (callback) {
      userCreate('Jim', 'Jones', callback);
    },
  ],
    // optional callback
    cb);
}


function createTodo(cb) {
  async.parallel([
    function (callback) {
      todoCreate('Test todo 1', 'Summary of test todo 1', false, users[0], false, callback);
    },
    function (callback) {
      todoCreate('Test todo 2', 'Summary of test todo 2', false, users[1], false, callback)
    },
    function (callback) {
      todoCreate('Test todo 3', 'Summary of test todo 3', false, users[2], false, callback);
    },
    function (callback) {
      todoCreate('Test todo 4', 'Summary of test todo 4', true, users[3], true, callback)
    },
    function (callback) {
      todoCreate('Test todo 5', 'Summary of test todo 5', true, users[4], false, callback);
    },
    function (callback) {
      todoCreate('Test todo 6', 'Summary of test todo 6', true, users[4], false, callback)
    }
  ],
    // optional callback
    cb);
}

async.series([
  createUsers,
  createTodo,
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('TODOS: ' + todos);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });




