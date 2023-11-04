//Uvoz modula potrebnih za server
const express = require('express');
const path = require("path");
const https = require('https');
var http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const serialise = require('./database/serialize');
var session = require('express-session');

const cookieParser = require('cookie-parser');
/* Dodati certifikate
//Certifikati SSL
const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/city-ctrl.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/city-ctrl.com/privkey.pem')
};*/

//Rute
const authRoutes = require('./routes/auth.routes');
const parkingRoutes = require('./routes/parking.routes');
const dashRoutes = require('./routes/dash.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const parkingMapRoutes = require('./routes/parkingMap.routes');
const reportsRoutes = require('./routes/reports.routes');
const settingsRoutes = require('./routes/settings.routes');


const authCheck = require('./middleware/authorisation.middleware');

//Definiranje aplikacaije i porta
const app = express();
const httpsPort = 443;
const httpPort = 80;

// use dotenv
require('dotenv').config();
console.log(process.env.API_TOKEN);

//Postavljanje pogleda (view) za EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// turn on debug
app.set('debug', true);
// show routes called in console during development
if (app.get('debug')) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

//Middleware - staticki resursi iz public direktorija
app.use(express.static(path.join(__dirname, 'public')));

//Middleware - dekodiranje parametara
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "Your secret very oh very secret key"}));
//app.use(express.cookieParser());

//Ruta za glavnu stranicu
app.use('/', authRoutes);
app.use('/parking', parkingRoutes);
app.use('/dashboard',authCheck, dashRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/parkingMap', parkingMapRoutes);
app.use('/reports', reportsRoutes);
app.use('/settings',authCheck, settingsRoutes);




const db = require('./database/db');
serialise.serialise();
const parkingSpaces = require('./models/parking_space');
const parkingMiddleware = require('./middleware/parking.middleware');

app.use((req, res, next) => {
 parkingMiddleware.getAllParking().then(function (response) {
    response = JSON.parse(response);
    response.forEach(element => {
      db.run(parkingSpaces.addParkingSpace, [element.id, element.latitude, element.longitude, element.parkingSpotZone, element.isReserved, element.reservedUntil, element.reservedBy], (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    });
  });
});
  


app.use((req, res, next) => {
  res.status(404).redirect("/");
})

app.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 3000);
});

/* Sve za https i rerouting
// Middleware for HTTP to HTTPS redirection
app.use((req, res, next) => {
  if (req.protocol !== 'https') {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
});

// Redirect www.city-ctrl.com to https://city-ctrl.com
app.use((req, res, next) => {
  if (req.hostname === 'www.city-ctrl.com') {
    return res.redirect(301, `https://city-ctrl.com${req.originalUrl}`);
  }
  next();
});

app.use((req, res, next) => {
  if (req.hostname === 'https://www.city-ctrl.com') {
    return res.redirect(301, `https://city-ctrl.com${req.originalUrl}`);
  }
  next();
});


// Create HTTP server for redirection
http.createServer((req, res) => {
  res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(httpPort, () => {
  console.log(`HTTP server for redirection is running on port ${httpPort}`);
});

// Create HTTPS server
https.createServer(options, app).listen(httpsPort, () => {
  console.log(`HTTPS server is running on port ${httpsPort}`);
});
*/