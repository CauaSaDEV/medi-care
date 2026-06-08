require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/auth", require("../NODE/routes/auth"));

app.listen(port, () => {
  console.log("Servidor funcionando na porta: " + port);
});
