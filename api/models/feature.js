const mongoose = require('mongoose');

const featureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    image: {
        type: String,
    },
    description: {
        type: String
    },
    name: {
        type: String,
        required:true
    }
});

module.exports = FeatureModel = mongoose.model('Feature', featureSchema);