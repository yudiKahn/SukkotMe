const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    address: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zip: {type: String, required: true}
    },
    phone_number: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
});

module.exports = User = mongoose.model('User', schema);