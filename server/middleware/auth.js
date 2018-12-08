const models = require("../models");
const Promise = require("bluebird");
const cookie = require("./cookieParser");
const Session = require("../models/session");
const User = require("../models/user");

module.exports.createSession = (req, res, next) => {
  console.log(req.cookies);
  if (!Object.keys(req.cookies).length) {
    cookie(req, res);
    Session.create().then(result => {
      // console.log(result);
      Session.get({ id: result.insertId }).then(results => {
        req.session = {};
        req.session.hash = results.hash;
        res.cookies = {};
        res.cookies.shortlyid = {};
        res.cookies.shortlyid.value = results.hash;
        // console.log(results);
        if (results.userId) {
          // console.log("doko");
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
    req.session = {};
    req.session.hash = req.cookies.shortlyid;
    Session.get({ hash: req.cookies.shortlyid }).then(results => {
      res.cookies = {};
      res.cookies.shortlyid = {};
      res.cookies.shortlyid.value = req.cookies.shortlyid;
      // console.log(results);
      if (results.userId) {
        // console.log("doko");
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
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
