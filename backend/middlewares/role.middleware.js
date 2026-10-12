function verifyRole(allowedRoles) {
    return (req, res, next) => {
        //Obtener el rol del usuario autenticado
        const role = req.user?.role;

        //Verificar si el rol está permitido
        if(!role || !allowedRoles.includes(role)) {
            return res.status(403).json({
                message: 'No tienes permisos para acceder a este recurso'
            });
        }

        //Permitir que la petición continúe
        next();
    };
}

module.exports = verifyRole;