import Bot              from 'slackbots';
import IO               from 'socket.io';
import SlackDb          from './data/SlackDb';

import {
    cleanMessage,
    removeBotId,
    isChatMessage,
    isMentioningChatbot
}   from './utils';


/**
 * export Slackbot class
 * @param {object} settings
 */
export default function SlackBot( server, creds ) {
    if(!server){ throw new Error('--- server needs to be passed as a parameter ---'); }

    this.settings = Object.assign( {
        name : 'slackBot'
    }, creds );

    // start socket io
    this.io = new IO(server);

    // init the database
    this.db = new SlackDb({ dbUri : this.settings.dbUri });
}


SlackBot.prototype = {

    /**
     * Start the BOT
     */
    run() {

        this.db.connect().then( ()=> {

            this.bot = new Bot( this.settings );
            this._connectIO();

            // bind methods
            let _start      = this._start.bind(this),
                _messsage   = this._messsage.bind(this),
                _close      = this._close.bind(this);

            // add listeners
            this.bot.on( 'start', _start );
            this.bot.on( 'message', _messsage );
            this.bot.on( 'close', _close );
        })
        .catch( err => console.log(`--- slackbot error - could not connect db ${err} ---`) );

    },

    // socketio connection code
    _connectIO() {
        this.io.on('connection', ( socket )=> { console.log('--- io client connected ---'); } );
        this.io.on('disconnect', ( socket )=> { console.log('--- io client disconnected ---'); } );
    },

    // start
    _start( data ) {
        console.log(`--- ${this.bot.name} initiated with ID ${this.bot.self.id} ---`);
        this.bot.getChannels().then( data => this.db.addChannels( data.channels )).catch(err => console.log(err));
        this.bot.getUsers().then( data => this.db.addUsers( data.members ) ).catch(err => console.log(err));
    },

    // send message
    _messsage( message ) {

        if( isChatMessage( message ) && isMentioningChatbot( message, this.bot.name, this.bot.self.id ) ) {

            let channel = this.db.channelById( message.channel ),
                user    = this.db.userById( message.user );

            Promise.all([ user, channel ]).then( ( params )=> {
                let [ _user, _channel ] = params;

                this.io.emit( 'slack.message', {
                     text    : removeBotId(cleanMessage(message.text), this.bot.self.id ),
                     user    : this.db.updateMessageCount(_user),
                     channel : _channel.name
                 });
            })
            .catch( err => console.log(`Error creating slack message bundle ${err}`) );

        } // END if
    },

    _close() {},

}
