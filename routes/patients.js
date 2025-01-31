const express = require('express');
const bcrypt = require('bcrypt');
const Patient = require(__dirname +'/../models/patient.js');
const User = require(__dirname +'/../models/users');
const auth = require(__dirname +'/../auth/auth.js')
let router = express.Router();


router.get('/', auth.protegerRuta(['admin','physio']), (req, res) =>{
    Patient.find().then(resultado =>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
           res.status(400)
           .send({ok: false, error: "Error, no se ha encontrado"}); 
    }).catch(error =>{
        res.status(500)
        .send({ ok: false, error:"Error obteniendo datos"});
    });
});

router.get('/find', auth.protegerRuta(['admin', 'physio']), (req, res) => {
    const { surname } = req.query;
    if (!surname) {
        Patient.find().then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json({ ok: true, resultado });
            } else {
                res.status(404).send({ ok: false, error: "No hay pacientes registrados." });
            }
        }).catch(error => {
            console.error(error);
            res.status(500).send({ ok: false, error: "Hubo un problema al procesar la búsqueda. Inténtelo más tarde." });
        });
    } else {
        const query = { surname: { $regex: surname, $options: 'i' } };
        Patient.find(query).then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json({ ok: true, resultado });
            } else {
                res.status(404).send({ ok: false, error: "No hay pacientes con ese apellido." });
            }
        }).catch(error => {
            console.error(error);
            res.status(500).send({ ok: false, error: "Error en el servidor." });
        });
    }
});


router.get('/:id', auth.protegerRuta(['admin','physio', 'patient']), (req, res) => {
  
    Patient.findById(req.params.id).then(resultado =>{
        if(resultado)
            res.status(200)
            .json({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error:" Error paciente no encontrado"});    
    }).catch(error =>{
        res.status(500)
        .send({error: "Error en el servidor "});

    });
});



router.post('/', auth.protegerRuta(['admin','physio']),async (req, res) => {
    const { name, surname, birthDate,address,insuranceNumber,login, password } = req.body;
  
    try {
      const nuevoPaciente = new Patient({
        name,
        surname,
        birthDate,
        address,
        insuranceNumber
      });
      const pacienteGuardado = await nuevoPaciente.save();
       const passwordEncriptado = await bcrypt.hash(password, 10);
      
       const nuevoUsuario = new User({
        login,
        password: passwordEncriptado,
        rol: 'patient',  
        patient_id: pacienteGuardado._id, 
      });
      await nuevoUsuario.save();
      res.status(201).json({ mensaje: 'Paciente y usuario creados exitosamente' });
    } catch (error) {   
      res.status(500).json({ mensaje: 'Error al crear paciente y usuario' });
    }
  });



router.put('/:id', auth.protegerRuta(['admin','physio']), (req, res)=>{

    Patient.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthday,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        }
    }, { new: true,}).then(resultado =>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(400)
            .send({ok: false, error: "Error al actualizar datos"});    
    }).catch(error =>{
        res.status(500)
        .send({ok: false, error: "Error del servidor"});
    });
});

router.delete('/:id', auth.protegerRuta(['admin','physio']), (req, res)=>{
    Patient.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
            res.status(404)
            .send({ok: false, error: "El paciente no se pudo eliminar"});    
    }).catch(error =>{
        res.status(500)
        .send({ok: false, error: "Error en el servidor"});
    });
});

module.exports = router;
