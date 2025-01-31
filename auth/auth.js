const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secreto = process.env.PASSWORD;

let generarToken = (login,rol) => {
    return jwt.sign({login: login, rol: rol}, secreto, {expiresIn: "2 hours"});
};


let verificarToken = token =>{
    try {
        let resultado = jwt.verify(token, secreto);
        return resultado;
    }catch (e) {}
};


let protegerRuta =rolesPermitidos =>{
    return (req, res, next)=>{
    let token = req.headers['authorization'];

    if(token) {
        token = token.substring(7);
        let resultado = verificarToken(token);
        console.log("Token válido:", resultado);
                console.log("Roles permitidos:", rolesPermitidos);
                if (!rolesPermitidos || rolesPermitidos.includes(resultado.rol)) {
                    req.userId = resultado.login; // Guardar el usuario en req para usarlo después
                    next();
                }
        
      /*  if (resultado && (rol === "" || rol === resultado.rol))
        
            next();*/
        else
        res.status(403)
         .send({ok:false, error: "Acceso no autorizado"});
     }else 
        res.send({ ok: false, error: "Error"});
    

}};
        


module.exports= {
    generarToken: generarToken,
    verificarToken: verificarToken,
    protegerRuta: protegerRuta
};