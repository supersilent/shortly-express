const parseCookies = (req, res, next) => {
  if (!req.headers.cookie) {
    req.cookies = {};
  } else {
    const cookies = req.headers.cookie;
    let cookieObj = {};
    const splitCookies = cookies.split("; ");
    const keyValueArr = splitCookies.map(cookie => cookie.split("="));
    keyValueArr.map(pair => (cookieObj[pair[0]] = pair[1]));
    req.cookies = cookieObj;
    if (next) {
      next();
    }
  }
};

module.exports = parseCookies;
