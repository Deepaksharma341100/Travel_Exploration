if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//console.log(process.env.MAPBOX_TOKEN)

const { config } = require("dotenv");
const express = require("express");
const app = express();
const path = require("path");
//onst bodyParser = require('body-parser')
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("cookie-session");
const routeropen = require("./router.js");
const User = require("./user");
const passport = require("passport");
const localstrategy = require("passport-local");
const registerRoutes = require("./register");
//const helmet = require('helmet');
//const dotenv = require('dotenv');
//dotenv.config();
//const mongoSanitize = require("express-mongo-sanitize");
const Campground = require("./campground");
const dburl = process.env.DB_URL;
/*
if(process.env.NODE_ENV != "production"){
   require("dotenv").config();
}

const {config} = require("dotenv")
const dburl = process.env.DB_URl;
in dotenv
DB_URL="";

*/
main().catch((err) => console.log(err));
async function main() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(dburl);
  console.log("CONNECTED");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsmate);
app.use(methodOverride("_method"));
const sessionopen = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionopen));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  next();
});
//app.use(helmet({contentSecurityPolicy:false}));

app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//app.get('/dogs', async(req,res)=>{
//// const user = new User({email:'coltttt@gmail.com' , username:'deepak'})
// const newuser= await User.register(user, 'deepak');
// res.send(newuser);
//})

app.use("/", registerRoutes);
app.use("/campground", routeropen);

app.use(express.static(path.join(__dirname, "public")));

//app.get('/campground/:id/edit' , async(req,res)=>{
//const Campground = await campground.findById(req.params.id)
// await Campground.save();
//res.render('edit.ejs', {campground})
//

app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.all("*", (err, req, res, next) => {
  next(new ExpressError("something went wrong", 401));
});

app.use((err, req, res, next) => {
  const { statuscode = 404 } = err;
  if (!err.message) err.message = "something went wrong";
  res.status(statuscode).render("error.ejs", { err });
});

app.listen(3600, (req, res) => {
  console.log("serving on port");
});
