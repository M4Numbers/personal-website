const cookiesConverter = (req, res, next) => {
  res.cookies = {};
  const regex = /login-token=([^ ]*)/i;
  const tokenHeader = regex.exec(req.header('cookie'));
  res.cookies['login-token'] = tokenHeader === null ? '' : tokenHeader[1];
  next();
};

module.exports = cookiesConverter;
