const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    mail: {
        type: String,
        isRequired: true
    },
    username: {
        type: String,
        isRequired: true
    },
    password: {
        type: String,
        isRequired: true
    },

});

const User = module.exports = mongoose.model("User", UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
    console.log("username" + username);
    const query = { "username": username };
    console.log("query" + query.username);
    const user = User.findOne({ "username": username }, callback);
    console.log("user : " + user.username);

}
module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);

        });
    });
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}
