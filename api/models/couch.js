const mongoose = require('mongoose');

const couchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
});


module.exports = CouchModel= mongoose.model('Couch', couchSchema);