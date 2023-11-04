//Uvoz modula potrebnih za server
const express = require('express');
const path = require("path");
const https = require('https');
var http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
/* Dodati certifikate
//Certifikati SSL
const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/city-ctrl.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/city-ctrl.com/privkey.pem')
};

*/
// serialise
const serialize = require('./database/serialize');
serialize.serialise();
//Rute
const userRoutes = require('./routes/users.routes');
const normalRoutes = require('./routes/normal.routes');

//Definiranje aplikacaije i porta
const app = express();
const httpsPort = 443;
const httpPort = 80;

//Postavljanje pogleda (view) za EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware - staticki resursi iz public direktorija
app.use(express.static(path.join(__dirname, 'public')));

//Middleware - dekodiranje parametara
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
//Ruta za glavnu stranicu
app.use('/', normalRoutes);
app.use('/users', userRoutes)

//Za krivi link
// Handling non matching request from the client
app.use((req, res, next) => {
  res.status(404).redirect("/");
})

app.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 3000);
});