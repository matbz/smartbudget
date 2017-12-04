const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const path = require('path');
const config = require('./src/config');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(history());
app.use(serveStatic(__dirname + '/public'));

require('./src/passport');
require('./src/routes')(app);

app.listen(config.port, function() {
  console.log('Express server running at port ' + config.port);
});
