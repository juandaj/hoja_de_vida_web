const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
module.exports = (formulario, res) => {
    var transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'c-deg-desarrollo@hotmail.com',
            pass: 'c-deg-controller'
        }
    });
    let token = jwt.sign({
        usuario: {
            correo: formulario.correo,
            cambio: true
        }
    }, process.env.SEED, { expiresIn: parseInt(60 * 20) });
    const mailOptions = {
        from: 'c-deg-desarrollo@hotmail.com',
        to: formulario.correo,
        subject: 'Cambio de contraseña de aplicacion c-deg-controller',
        text: `Buen día, has solicitado cambiar de contraseña en nuestra aplicación, para ello seguir el siguiente link: 
                ${formulario.ip}#/${formulario.ruta}?cambio=true&token=${token}`
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            res.json({
                ok: false,
                message: 'El mensaje no pudo ser mandado',
                err
            });
        } else {
            res.json({
                ok: true,
                message: 'El mensaje enviado',
                info
            });
        }
    });
}