// STUB External modules
// tell our app to require the express and request modules
const express = require("express");
const request = require("express");

// STUB Instanced modules
// we create a new express instance
app = express();

// STUB Configuration
// set our templating engine to EJS
app.set("view engine", "ejs");

// STUB middleware
// tell express to serve static files from the  "Public" directory 
app.use(express.static(path.join(__dirname, "public")));

// STUB Routes

// view routes
app.get("/", function(req, res) {
    console.log("Hello!");
})







// Server Listener
// process.env.PORT will let our environment (ex: Heroku) set the variable for us later
app.listen(process.env.PORT || 3000, function() {
    console.log("Server running on port 3000")
})
