const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true }, //unique: true,
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    email: {type: String, required: true },
    phoneno: {type: Number, required: true},
    country:{type: String },
    city: { type: { type: String},
    //city:{type: String },
    gender:{type: String },
    consent:{type: String },
    hobbie:{type: String },
    dob: {type: String },
    image:{type: String}
}});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);