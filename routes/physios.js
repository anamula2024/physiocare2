const express = require('express');
const Physio = require(__dirname +'/../models/physio.js');
const auth = require(__dirname +'/../auth/auth.js')

let router = express.Router();



router.get('/', auth.protegerRuta(['admin','physio', 'patient']), (req, res)=> {
    Physio.find().then(resultado =>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
        res.status(404)
        .send({ok: false, error: "No hay fisios en el sistema"});    

    }).catch(error=>{
        res.status(500)
        .send({ok: false, error: "Error del servidor"});
    });
});

router.get('/find', auth.protegerRuta(['admin','physio', 'patient']), (req, res)=> {
    const { specialty } = req.query;
    const query = specialty ? {specialty: { $regex: specialty, $options: 'i'}} :{};

    Physio.find(query).then(resultado =>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
           res.status(404)
           .send({ok: false, error: "No se ha encontrado ninguna coincidencia"});    
    
    }).catch( error=>{
        res.status(500)
        .send({ ok: false, error: "Error en el servidor"});
    });
});


router.get('/:id', auth.protegerRuta(['admin','physio', 'patient']), (req, res)=>{
    
    Physio.findById(req.params.id).then(resultado =>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
          res.status(404)
          .send({ok: false, error: "Fisio no encontrado"});    
    }).catch(error=>{
        res.status(500)
        .send({ok: false, error: "Error en el servidor"});
    });
});

router.post('/', auth.protegerRuta(['admin']), (req, res)=>{
    const nuevoFisio = new Physio({
        name: req.body.name,
        surname: req.body.surname,
        specialty: req.body.specialty,
        licenseNumber: req.body.licenseNumber
    });

    nuevoFisio.save().then(resultado =>{
         res.status(200)
         .send({ ok: true, resultado: resultado});
    }).catch(error =>{
        res.status(400)
        .send({ok: false, error: "Error al insertar el nuevo Fisio"});
    });
});


router.put('/:id', auth.protegerRuta(['admin']), (req,res)=>{
    Physio.findByIdAndUpdate(req.params.id, {
         $set: { name: req.body.name,
                 surname: req.body.surname,
                 specialty: req.body.specialty,
                  lisenseNumber: req.body.lisenseNumber
                 }
             }, { new: true }).then(resultado =>{
                if(resultado)
                    res.status(200)
                    .send({ok: true, resultado: resultado});
                else
                req.status(400)
                .send({ok: false, error: "Error actualizando los datos de fisio"});    
    }).catch(erro=>{
        res.status(500)
        .send({ok: false, error: "Error interno del servidor"});
    });
});


router.delete('/:id', auth.protegerRuta(['admin']), (req, res)=>{
    Physio.findByIdAndDelete(req.params.id).then(resultado=>{
        if(resultado)
            res.status(200)
            .send({ok: true, resultado: resultado});
        else
           res.status(404)
           .send({ok: false, error: "Ese fisio no existe"});    
    }).catch(error=>{
        res.status(500)
        .send({ok: false, error: "Error del servidor"});
    });
});


module.exports = router;