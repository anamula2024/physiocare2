const express = require('express');
let Record = require(__dirname +'/../models/record.js');
const Patient = require(__dirname +'/../models/patient.js');
const auth= require(__dirname +'/../auth/auth.js')

let router = express.Router();


router.get('/', auth.protegerRuta(['admin','physio']),  (req, res)=>{
    Record.find().populate('patient').then(resultado=>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
          res.status(404)
         .send({ok: false, error: "No se han encontrado expedientes en el sistema"});    
    }).catch(error=>{
        res.status(500)
        .send({ok: false, error: "Error interno del servidor"});
    });
});

router.get('/find', auth.protegerRuta(['admin','physio']), (req, res)=>{
    const { surname } = req.query;
    const query = {surname :{ $regex: surname, $options: 'i'}};

    Record.find(query).then(resultado =>{
        if(resultado.length>0){
            res.status(200)
            .send({ok: true, resultado: resultado});
        } else{
            res.status(404)
            .send({ok: false, error: "No se encontraron expedientes"});  
        }
    }).catch(error =>{
        res.status(500)
        .send({ok: false, error: "Error interno del servidor"});
    });
});


router.get('/:id',auth.protegerRuta(['admin','physio', 'patient']), (req, res)=>{
    if (req.params.id !== req.userId) {
        return res.status(403).send({ ok: false, error: 'Acceso no autorizado' });
    }
    Record.findById(req.params.id).populate('patient').populate('medicalRecord').populate('appointments.physio').then(resultado =>{
        if(resultado)
            res.status(200)
           .send({ok: true, resultado: resultado});
        else
            res.status(404)
            .send({ok: false, error: "El expediente no se ha encontrado"});   
    }).catch(error=>{
        res.status(500)
        .send({ok: false, error: "Error interno del servidor"});
    });
});

router.post('/', auth.protegerRuta(['admin','physio']), async(req, res)=>{
    const {patient, medicalRecord, appointments} =req.body;
    try {
        const pacienteExistente = await Patient.findById(patient);
        if (!pacienteExistente) {
            return res.status(400).send({ ok: false, error: 'Paciente no encontrado' });
        }
        const nuevoExpediente = new Record({
            patient,
            medicalRecord,
            appointments
        });

        const expedienteGuardado = await nuevoExpediente.save();
        res.status(201).send({ ok: true, resultado: expedienteGuardado });

    } catch (error) {
        console.error(error);
        res.status(400).send({ ok: false, error: "Error al insertar expediente." });
    }
});

router.delete('/:id', auth.protegerRuta(['admin','physio']), (req, res)=>{
    Record.findByIdAndDelete(req.params.id).then(resultado=>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
           res.status(404)
           .send({ok: false, error: "El expediente no existe"});    
    }).catch(error=>{
        res.status(500)
        .send({ok: false, error: "Error en el servidor"});
    });
});

module.exports = router;