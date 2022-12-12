exports.handleBadPaths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
  next();
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "500 server error" });
};
