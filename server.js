// =============================================================
require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
// Sets up the Express App
var socket = require('socket.io');
// Requiring our models for syncing
var db = require("./models");
//=======================================================
const nodemailer = require('nodemailer');
const path = require('path');


// =============================================================
var PORT = process.env.PORT || 8080;
var app = express();
//var PORT = server.listen(process.env.PORT || 8080);


// Creating express app and configuring middleware needed for authentication
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Static directory
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/author-api-routes.js")(app);
require("./routes/post-api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/user-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
/*db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  */
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}
// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  const server = app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
  //gg

  users = [];
  connections = [];
  //gg
  app.get("/", function (req, res) {
    res.sendFile(__dirname + "/chat.html");
  });

  const io = socket(server);

  io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connection: %S sockets connected', connections.length);

    //this will disconnect the connection
    socket.on('disconnect', function (data) {
      if (!socket.username) return;
      users.splice(users.indexOf(socket.username), 1);
      updateusernames();
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %S sockets connected', connections.length);
      //to run the app type "node server" inside the console then press enter
    });
    //send message
    socket.on('send message', function (data) {
      io.sockets.emit('new message', { msg: data, user: socket.username });
    });
    //new user
    socket.on('new user', function (data, callback) {
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateusernames();
    });
    function updateusernames() {
      io.sockets.emit('get users', users);
    }
    socket.on('typing', function(data) {
      socket.broadcast.emit('typing', data);
  });

  });
  //gg
  
  // app.use('/public', express.static(path.join(__dirname, 'public')));
  // app.get('/', (req, res) => {
  //   res.render('contact');
  // });
  // app.post('/send', (req, res) => {
  //   const output = `
  //   <p>You have a new contact request from your BLOGGER APP!</p>
  //   <h3>Contact Details</h3>
  //   <ul>  
  //     <li>Name: ${req.body.name}</li>
  //     <li>Company: ${req.body.company}</li>
  //     <li>Email: ${req.body.email}</li>
  //     <li>Phone: ${req.body.phone}</li>
  //   </ul>
  //   <h3>Message</h3>
  //   <p>${req.body.message}</p>
  // `;
 


  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   // host: 'smpt.gmail.com',
  //   // port: 587,
  //   // secure: false, // true for 465, false for other ports
  //   service: 'gmail',
  //   auth: {
  //       user: process.env.EMAIL, // generated ethereal user
  //       pass: process.env.PASSWORD  // generated ethereal password
  //   },
  //   tls:{
  //     rejectUnauthorized:false
  //   }
  // });

  // // setup email data with unicode symbols
  // let mailOptions = {
  //     from: req.body.email, //'"Nodemailer Contact" <gezaworku@gmail.com>', // sender address
  //     to: 'gezahegnw@gmail.com', // list of receivers
  //     subject: 'This EMAIL from my BLOGGER APP', // Subject line
  //     text: 'Hello world?', // plain text body
  //     html: output // html body
  // };

  // // send mail with defined transport object
  // transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //         return console.log(error);
  //     }
  //     console.log('Message sent: %s', info.messageId);   
  //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  //     res.render('contact', {msg:'Email has been sent'});
  // });
  // });
});
module.exports = app;
