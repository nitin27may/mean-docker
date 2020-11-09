// contact.model.js
var mongoose = require("mongoose");
// Setup schema
var contactSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: String,
    city: String,
    postalCode: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});
// Export Contact model
var Contact = (module.exports = mongoose.model("contact", contactSchema));
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
};
