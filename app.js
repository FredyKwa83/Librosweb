const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));


app.listen(3002, function () {
    console.log("Servidor corriendo");
});

// agregue un comentario 