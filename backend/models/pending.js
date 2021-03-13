const mongoose = require('mongoose');

const pendingSchema = mongoose.Schema(
    {
        'email': {type: String, required: true},
        'code': {type: Number, required: true}

});

module.exports = mongoose.model("Pending", pendingSchema, "pending");