const localsStarter = (req, res, next) => {
  res.locals = {};
  res.nunjucks = {};
  next();
};

module.exports = localsStarter;
