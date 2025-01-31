const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const Patient = require(__dirname +'/routes/patients');
const Physio = require(__dirname +'/routes/physios');
const Record = require(__dirname +'/routes/records');
const Auth = require(__dirname +'/routes/auth');


mongoose.connect(process.env.URLDB).then(() => console.log('Conexión exitosa a la base de datos'))
.catch((error) => console.error('Error al conectar a la base de datos:', error));


let app = express();

app.use(express.json());
app.use('/patients', Patient);
app.use('/physios', Physio);
app.use('/records', Record);
app.use('/auth', Auth);

app.listen(process.env.PORT);