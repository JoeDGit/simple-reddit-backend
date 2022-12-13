exports.handleBadRequests = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
    res.status(400).send({ msg: "400 Error - Bad Request" });
  } else {
    next(err);
  }
};
exports.handleBadPaths = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
  next();
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "500 server error" });
};
