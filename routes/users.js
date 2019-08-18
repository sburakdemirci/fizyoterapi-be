const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const config = require("../config/database");


router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.username,
    mail: req.body.mail,
    password: req.body.password,
    username: req.body.username
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, message: "Failed to register user" })
    } else {
      res.json({ success: true, message: "Register is successful" })
    }
  })
});

router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    console.log("dönen user : " + user);
    if (!user) {
      return res.json({ success: false, message: "User not Found" })
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 60000
        });
        res.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            mail: user.mail
          }
        })
      } else {
        return res.json({ success: false, message: "Wrong password" });
      }
    })
  })
})

router.get("/profile", passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: req.user })
})

module.exports = router;