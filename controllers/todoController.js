var Todo = require('../models/todo');
var User = require('../models/user');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all todos.
exports.todo_list = async function (req, res, next) {
    let userList = await User.find({}).exec()
    Todo.find({})
        .populate('user')
        .exec(function (err, list_todos) {
            if (err) { return next(err); }
            // Successful, so render
            res.render('index', { page: 'todo_list', title: 'Todo List', todo_list: list_todos, userList: userList });
        });

};

// Display detail page for a specific todo.
exports.todo_detail = function (req, res, next) {
    Todo.findById(req.params.todo_id)
        .populate('user')
        .exec(function (err, todo) {
            if (err) { return next(err); }
            if (todo == null) { // No results.
                var err = new Error('Todo not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render
            res.render('index', { page: 'todo_detail', title: 'Todo Details', todo: todo });
        });
};

// Handle todo create on POST.
exports.todo_create_post = [
    (req, res, next) => {
        req.body.is_done = typeof req.body.is_done !== 'undefined' ? req.body.is_done : false
        req.body.is_deleted = typeof req.body.is_deleted !== 'undefined' ? req.body.is_deleted : false
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('description', 'description must not be empty.').isLength({ min: 1 }).trim(),
    body('assigned_to', 'assigned_to must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Todo object with escaped and trimmed data.
        var todo = new Todo(
            {
                title: req.body.title,
                description: req.body.description,
                assigned_to: req.body.assigned_to,
                is_done: req.body.is_done,
                is_deleted: req.body.is_deleted
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.redirect('/todo/');
            return
        }
        else {
            // Data from form is valid. Save todo.
            todo.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new todo record.
                res.redirect('/todo/' + todo._id);
            });
        }
    }
];

// Handle todo update on put.
exports.todo_update_post = [
    (req, res, next) => {
        req.body.is_done = typeof req.body.is_done !== 'undefined' ? req.body.is_done : false
        next();
    },

    // Sanitize fields.
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.redirect('/todo/');
            return
        }
        else {
            // Data from form is valid. Update the record.
            Todo.findByIdAndUpdate(req.params.id, { $set: { is_done: req.body.is_done } }, function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new todo record.
                res.redirect('/todo/' + req.params.id);
            });
        }
    }
];

