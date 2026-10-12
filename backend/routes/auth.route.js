const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');;

//Ruta para registrar un usuario
router.post('/register', authController.register); //utiliza método del controller

//Ruta para login
router.post('/login', authController.login); //utiliza método del controller

//Ruta consultar información protegida para Home
router.get('/home', verifyToken, verifyRole(['ADMIN']), authController.home);

//Exporta el router
module.exports = router;
