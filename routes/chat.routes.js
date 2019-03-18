var db = require("../models");

 // Create a new example
 app.post("/api/chats", function (req, res) {
    db.Chat.create(req.body).then(function (dbChat) {
      res.json(dbChat);
    });
  });
