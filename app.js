const express = require('express');
const app = express();
const cors = require('cors');

const {
  handleBadPaths,
  handleServerErrors,
  handleCustomErrors,
  handleBadRequests,
} = require('./controllers/controllers.errors');
const { lowerCaseQueries } = require('./controllers/controllers.utility');
const apiRouter = require('./routes/api-router');

app.use(cors());

app.use(express.json());
app.use(lowerCaseQueries);
app.use('/api', apiRouter);

app.all('*', handleBadPaths);
app.use(handleBadRequests);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
