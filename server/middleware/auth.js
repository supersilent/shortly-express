const models = require("../models");
const Promise = require("bluebird");
const cookie = require("./cookieParser");
const Session = require("../models/session");
const User = require("../models/user");

module.exports.createSession = (req, res, next) => {
  cookie(req, res);
  if (!Object.keys(req.cookies).length) {
    Session.create().then(result => {
      console.log(result);
      Session.get({ id: result.insertId }).then(results => {
        req.session = {};
        req.session.hash = results.hash;
        res.cookies = {};
        res.cookies.shortlyid = {};
        res.cookies.shortlyid.value = results.hash;
        console.log(results);
        if (results.userId) {
          console.log("doko");
          User.getUsername(results.userId).then(queryUser => {
            req.session.user = {};
            req.session.user.username = queryUser.username;
            req.session.userId = results.userId;
            next();
          });
        } else {
          next();
        }
      });
    });
  } else {
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
