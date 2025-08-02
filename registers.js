const Campground = require("./campground");
const register = require("./register");
const User = require("./user");

module.exports.displayregister = (req, res) => {
  res.render("register.ejs");
};

module.exports.postregister = async (req, res, next) => {
  const { email, username, password } = req.body;
  const user = new User({ email, username });
  const newUser = await User.register(user, password);

  req.login(newUser, (err) => {
    if (err) {
      return next(err);
    }
    // req.flash("success", "welcome to summer camp ");
    res.redirect("/login");
    req.flash("sucess", "username already exist");
  });
}; //catch(e){
//
//}
