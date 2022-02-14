const mongoose = require('mongoose');
const schema = mongoose.Schema;

const contactSchema = new schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    uid: {
        type: String,
        required: true
    }
});

const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;
