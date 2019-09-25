const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    }
});

const TaskUser = mongoose.model('taskUser', UserSchema);

module.exports = TaskUser;
