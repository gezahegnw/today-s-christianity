// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
// Sets up the Express App
var socket = require('socket.io');

// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
//var PORT = server.listen(process.env.PORT || 8080);

// Requiring our models for syncing
var db = require("./models");

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
db.sequelize.sync(syncOptions).then(function() {
  const server = app.listen(PORT, function() {
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
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/chat.html");
});

const io = socket(server);

io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log('Connection: %S sockets connected', connections.length);

  //this will disconnect the connection
  socket.on('disconnect', function(data){
      if(!socket.username) return;
      users.splice(users.indexOf(socket.username), 1);
      updateusernames();
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %S sockets connected', connections.length);
      //to run the app type "node server" inside the console then press enter
  });
  //send message
  socket.on('send message', function(data){
      io.sockets.emit('new message', {msg: data, user: socket.username});
  });
  //new user
  socket.on('new user', function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateusernames();
  });
  function updateusernames(){
      io.sockets.emit('get users', users);
  }
});
//gg

});
