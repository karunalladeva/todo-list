var express = require('express');
var router = express.Router();

var todoController = require('../controllers/todoController');

router.get(['/', '/todo/'], todoController.todo_list);
router.get('/todo/:todo_id', todoController.todo_detail);

router.post('/todo', todoController.todo_create_post);
router.post('/todo/:id', todoController.todo_update_post);

module.exports = router;