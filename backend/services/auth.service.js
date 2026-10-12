const connection = require('../config/database');

//Función para registrar un nuevo usuario en la BD
function registerUser(user, callback) {
    const sql = `
        INSERT INTO users (name, email, password, role)
        VALUES(?, ?, ?, ?)
    `;

    //Obtiene los datos del usuario que se van a registrar
    const values = [
        user.name,
        user.email,
        user.password,
        user.role
    ];

    //Ejecuta la consulta para registrar el usuario
    connection.query(sql, values, (error, result) => {
        //En caso haya un error devuelve el error
        if(error) {
            callback(error, null);
            return;
        }

        //En caso se registre correctamente devuelve el resultado
        callback(null, result);
    });
}

//Función para buscar un usuario por su correo electrónico
function findUserByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`;

    //Ejecuta la consulta para buscar al usuario por su email
    connection.query(sql, [email], (error, results) => {
        //En caso haya un error devuelve el error
        if(error) {
            callback(error, null);
            return;
        }

        //Devuelve el primer usuario encontrado
        callback(null, results[0]);
    });
}

//Función para buscar un usuario por su ID
function findUserById(id, callback) {
    const sql = `
        SELECT id, name, role
        FROM users
        WHERE id = ?
    `;

    //Ejecuta la consulta para buscar al usuario por su ID
    connection.query(sql, [id], (error, results) => {
        //En caso haya un error devuelve el error
        if(error) {
            callback(error, null);
            return;
        }

        //Devuelve el primer usuario encontrado
        callback(null, results[0]);
    });
}

//Exporta las funciones
module.exports = {
    registerUser,
    findUserByEmail,
    findUserById
};