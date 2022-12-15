exports.lowerCaseQueries = (req, res, next) => {
  const entries = Object.entries(req.query);
  req.query = Object.fromEntries(
    entries.map(([key, value]) => {
      return [key.toLowerCase(), value.toLowerCase()];
    })
  );
  next();
};
