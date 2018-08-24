const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const config = require('./src/config');

const app = express();

app.use(bodyParser.json());
app.use(cors());

require('./src/passport');
require('./src/routes')(app);

app.use(history());
app.use(serveStatic(__dirname + '/public'));

app.listen(config.port, function() {
  console.log('Express server running at port ' + config.port);
});
