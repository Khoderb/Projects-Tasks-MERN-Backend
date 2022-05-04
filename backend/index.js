// const express = require('express'); luego de cambiar type: 'commonjs' por type 'module'
import express from 'express' //1°
import dotenv from 'dotenv' //2°
import conectarDB  from './config/db.js'; //3°
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
const app = express(); //1°
app.use(express.json()); // habilitar recibir y leer JSON, 5°

dotenv.config(); //2°

conectarDB(); //3°
//Router
app.use("/api/users", userRoutes); //4°
app.use("/api/projects", projectRoutes); //4°
app.use("/api/task", taskRoutes); //4°


const PORT = process.env.port || 3800; 

app.listen(PORT, () => console.log(`MERN app listening on port ${PORT}!`));

