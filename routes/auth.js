const express = require('express');
const bcrypt = require('bcrypt');
const auth = require(__dirname + '/../auth/auth.js');
const User = require(__dirname + '/../models/users.js');
require('dotenv').config();


let router = express.Router();


router.post('/login',async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    try {
        const usuario = await User.findOne({ login: login });
        
        if (usuario) {
            const match = await bcrypt.compare(password, usuario.password);
             if (match) {
                const token = auth.generarToken(usuario.login, usuario.rol);
                res.status(200).send({ ok: true, token: token });
            } else {
                res.status(401).send({ ok: false, error: "Login incorrecto" });
            }
        } else {
            res.status(401).send({ ok: false, error: "Login incorrecto" });
        }
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error al procesar la solicitud" });
    }
 });   


    

module.exports = router;