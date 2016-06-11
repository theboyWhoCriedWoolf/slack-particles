import path             from 'path';
import express          from 'express';
import http             from 'http';
import SlackBot         from './SlackBot';
import bodyParser       from 'body-parser';
import creds            from '../credentials.json';
import routes           from './routes';

// setup
const app         = express(),
      server      = http.createServer(app),
      bot         = new SlackBot( server, creds ),
      port        = process.env.port || 8080,
      env         = process.env.NODE_ENV || 'development';

/**
* Set app details
*/
app.set('port', port);
app.set('env', env);

/**
* add tamplating
*/
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'views' ));
app.use(express.static( path.join(__dirname, '..', 'static' ) ));

// parsing
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/**
 * set application routes
 */
// routes( app );

/**
* render the htm and
* pass in any attributes
*/
app.use( ( req, res ) => {
  res.render('index', {
     pageTitle  : 'Slack Particles'
  });
});

/**
 * run the slackbot
 */
bot.run();

/**
* Star listening
*/
server.listen(port, (error) => {
    if (error) { return console.error('---- server error ---- [ ', error); }
    console.info(`🌎 ==> Front-End server is running on http://localhost:%s`, port );
})
