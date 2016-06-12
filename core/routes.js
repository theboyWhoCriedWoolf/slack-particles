
const reqtoken      = '/* your Slcak token */',
      slashCommand  = '/yourSlashCommand';


/**
 * Setup all application routes
 * @param  {object} expresss application
 */
export default ( app ) => {

    app.post( slashCommand, (req, res) => {
        let { token, command } = req.body;
        if(token === reqtoken && command === slashCommand) {
            /* handle command request */
        }
    });
}
