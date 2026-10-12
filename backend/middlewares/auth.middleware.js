const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    //Obtener el encabezado authorization
    const authorization = req.headers.authorization;

    //Verificar que se haya enviado el token con el formato Bearer
    if(!authorization || !authorization.startsWith('Bearer')) {
        return res.status(401).json({
            message: 'Token no proporcionado'
        });
    }

    //Extraer el token del encabezado
    const token = authorization.split(' ')[1];

    try {
        //Verificar la firma y la expiración del token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Guardar los datos del usuario para las siguientes funciones
        req.user = decoded;

        //Permite que la petición continúe
        next();
    } catch(error) {
        return res.status(401).json({
            message: 'Token inválido o expirado'
        });
    }
}

module.exports = verifyToken;
