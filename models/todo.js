var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
  title: { type: String, required: true },
  assigned_to: { type: Schema.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  is_done: { type: Boolean, required: true },
  is_deleted: { type: Boolean, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


TodoSchema
  .virtual('todo_id')
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model('Todo', TodoSchema);
