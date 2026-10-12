require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.route');

const app = express();

app.use(cors());
app.use(express.json());

//Define que las rutas de autenticación empiezan con /api
app.use('/api', authRoutes);

//Escucha el puerto 3000 para el servidor
app.listen(process.env.PORT, () => {
    console.log(`Servidor ejecutandose en puerto ${process.env.PORT}`);
});

