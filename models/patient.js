const mongoose = require ('mongoose');

let patientSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    surname: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 50
    },

    birthDate: {
        type: Date,
        require: true
    },
    
    address: {
        type: String,
        maxlength: 100
    },

    insuranceNumber: {
        type: String,
        require: true,
        unique: true,
        match: /^[a-zA-Z0-9]{9}$/

    }
   
});

let Patient = mongoose.model('patients', patientSchema);
module.exports = Patient;