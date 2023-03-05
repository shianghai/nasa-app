const mongoose = require('mongoose');


const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate : {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rockect: {
        type: String,
        required: true,
    },
    target: {
        type: String,
    },
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
    customers: [String]
});

//connects launchesSchema with "launches" collection
module.exports = mongoose.model("launches", launchesSchema); 