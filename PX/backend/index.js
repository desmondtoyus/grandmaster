const dotenv = require('dotenv');
dotenv.load();

const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router');
const C = require('./utils/vars');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/ui', require('./ui.routes'));
app.use('/optout', require('./ui.routes'));
app.use('/signup', require('./ui.routes'));
app.use('/terms', require('./ui.routes'));
app.use('/forgot', require('./ui.routes'));
// app.use(bodyParser.json({ type: '*/*' }));

router(app);

const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Listening on port ' + port);
  console.log('DEVELOPMENT ENVIRONMENT IN', process.env.NODE_ENV);
});