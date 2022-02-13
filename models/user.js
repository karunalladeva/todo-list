var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    first_name: { type: String, required: true, max: 100 },
    last_name: { type: String, max: 100 },
  }, { timestamps: { createdAt: 'created_at' } }
);


UserSchema
  .virtual('user_id')
  .get(function () {
    return this._id
  });


module.exports = mongoose.model('User', UserSchema);
