const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = require('../services/auth.service');
const Usuario = require('../models/user.model');

// Función para registrar un nuevo usuario
async function register(req, res) {
    //Obtiene los datos del usuario del body del request
    const { name, email, password, role } = req.body;

    //Hashea la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    //Crear un usuario sin un ID, ya que este lo crea la BD
    const user = new Usuario(null, name, email, passwordHash, role);

    //Registrar el usuario en la BD
    authService.registerUser(user, (error, result) => {
        //En caso haya un error devuelve esta respuesta
        if(error) {
            return res.status(500).json({
                message: 'Error al registrar el usuario'
            });
        }
        //En caso se registre correctamente devuelve este mensaje
        res.status(201).json({
            message: 'Usuario registrado'
        });
    });
}

// Función para iniciar sesión
function login(req, res) {
    //Obtiene email y password ingresados por el usuario del body del request
    const { email, password } = req.body;

    //Busca el usuario con base en el email proporcionado
    authService.findUserByEmail(email, async (error, user) => {
        //En caso de error muestra mensaje de error en el servidor
        if(error) {
            return res.status(500).json({
                message: 'Error del servidor'
            });
        }
        //En caso el usuario sea undefined devuelve mensaje de credenciales incorrectas
        if(!user) {
            return res.status(401).json({
                message: 'Credenciales incorrectas'
            });
        }
        
        //Compara la password ingresada con la que se obtuvo del usuario encontrado en la BD
        const passwordValido = await bcrypt.compare(password, user.password);

        //Si las passwords no coinciden muestra mensaje de credenciales incorrectas
        if(!passwordValido) {
            return res.status(401).json({
                message: 'Credenciales incorrectas'
            });
        }

        //Crea un token con id del usuario y su rol, usa JWT_SECRET definido en el .env para verificar que si sea nuestro token y expira en 1 hora
        const token = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        //En caso salga correctamente respone el token, nombre del usuario y rol
        res.json({
            token: token,
            name: user.name,
            role: user.role
        });
    });
}

//Función para obtener la información del usuario autenticado
function home(req, res) {
    //Obtiene el ID del usuario recuperado del JWT
    const id = req.user.id;

    //Busca al usuario en la BD por su ID
    authService.findUserById(id, (error, user) => {
        //En caso haya un error devuelve un mensaje de error del servidor
        if(error) {
            return res.status(500).json({
                message: 'Error del servidor'
            });
        }

        //En caso el usuario ya no exista devuelve un error
        if(!user) {
            return res.status(401).json({
                message: 'Usuario no encontrado'
            });
        }

        //Verifica que el usuario tenga el rol de administrador
        if(user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'No tienes permisos para acceder a este recurso'
            });
        }

        //Devuelve el nombre y rol del usuario autenticado
        res.status(200).json({
            name: user.name,
            role: user.role
        });
    });
}

//Exporta las funciones
module.exports = {
    register,
    login,
    home
};