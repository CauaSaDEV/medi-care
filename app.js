require("dotenv").config();
const cors = require('cors')
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())

app.use("/api/auth", require("../NODE/routes/auth"));

app.use('/api/pacientes', require('./routes/pacienteRoutes'));
app.use('/api/medicos',   require('./routes/medicoRoutes'));

app.listen(port, () => {
  console.log("Servidor funcionando na porta: " + port);
});
