const models = require("../models");
const Promise = require("bluebird");
const cookie = require("./cookieParser");
const Session = require("../models/session");
const User = require("../models/user");

module.exports.createSession = (req, res, next) => {
  // console.log(req.cookies);
  if (req.cookies && !Object.keys(req.cookies).length) {
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
  } else if (req.cookies) {
    req.session = {};
    req.session.hash = req.cookies.shortlyid;
    Session.get({ hash: req.cookies.shortlyid }).then(results => {
      if (!results) {
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
        res.cookies = {};
        res.cookies.shortlyid = {};
        res.cookies.shortlyid.value = req.cookies.shortlyid;
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
      }
    });
  } else {
    Session.create().then(results => {
      Session.get({ id: results.insertId }).then(session => {
        console.log(session.hash);
        res.cookies = session.hash;
        next();
      });
    });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
