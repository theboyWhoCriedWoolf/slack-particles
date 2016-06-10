import mongoose  from 'mongoose';
import {
    ChannelModel,
    UserlModel
}  from './Models';

const options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

/**
 * SlackData Constructor
 * @param {object} settings
 */
export default function SlackDb( settings ) {
    const {dbUri} = settings;
    console.log('---- connecting -----'+ dbUri );
    this.dbUri = dbUri;
}

/**
 * Extend prototype
 * @type {Object}
 */
SlackDb.prototype = {

    /**
     * connect DB
     * @return {promise}
     */
    connect() {
        return new Promise( ( resolve, reject )=> {

            mongoose.connect(this.dbUri, options, ( err )=> {
                if( err ) {
                    console.log(`--- [ connection error ] : ${err}`);
                    // reject( err );
                }
                else {
                    console.log('---- DB connected -----');
                    resolve();
                }
            });

        });
    },

    /**
     * populate mongo with Channels
     * @param {array} channels
     */
    addChannels( channels ) {
        channels.forEach( ( channel )=> {
            if(channel.is_channel && !channel.is_archived) {
                // check channel exists
                _channelExists( channel.id ).then( ( exists, foundChannel )=> {
                    if( exists ){ return false; }

                    let channelInstance = new ChannelModel({
                        channel_id  : channel.id,
                        name        : channel.name
                    });
                    channelInstance.save();
                })
                .catch( err => console.log(`Error adding Channel ${err}`) );
            }; // END if
        });
        console.log('--- channels created on mongo ---');
    },

    /**
     * populate users
     * @param {array} addUsers
     */
    addUsers( addUsers ) {
        addUsers.forEach( ( user )=> {
            // is is actual user
            if(!user.is_bot) {
                // make sure adding only once
                _userExists( user.id ).then( ( exists, foundUser )=> {
                    if( exists ){ return false; }

                    let userInstance = new UserlModel({
                        user_id         : user.id,
                        username        : user.name,
                        colour          : `#${user.color}`,
                        real_name       : ( user.profile.real_name_normalized || user.real_name),
                        /**
                         * Possible image size
                         * image_24
                         * image_32
                         * image_48
                         * image_72
                         * image_192
                         * image_512
                         */
                        image           : user.profile.image_512,
                        image_small     : user.profile.image_72,
                        message_count   : 0
                    });
                    userInstance.save();
                })
                .catch( err => console.log(`Error adding User ${err}`) );

            } // END if
        });
        console.log('--- users created on mongo ---');
    },

    /**
     * update channel by ID
     * @param  {string} channelId
     * @return {promise}
     */
    channelById( channelId ) {
        return new Promise( ( resolve, reject )=> {
            ChannelModel.findOne({ channel_id : channelId }, (err, channel) => {
               if( err ) { reject(); }
               if(!err && channel) { resolve( channel ); }
           });
       }); // END Promise
    },

    /**
     * update user by ID
     * @param  {string} userId
     * @return {promise}
     */
    userById( userId ) {
        return new Promise( ( resolve, reject )=> {
            UserlModel.findOne({ user_id : userId }, (err, user) => {
               if( err ) { reject(); }
               if(!err && user) { resolve( user ); }
           });
       }); // END Promise
   },

   /**
    * update user by username
    * @param  {string} username
    * @return {promise}
    */
   userByUsername( username ) {
       return new Promise( ( resolve, reject )=> {
           UserlModel.findOne({ username : username }, (err, user) => {
              if( err ) { reject(); }
              if(!err && user) { resolve( user ); }
          });
      }); // END Promise
   },

   /**
    * update message count
    * @param  {object} user
    * @return {object}
    */
   updateMessageCount( user ) {
       user.message_count += 1;
       user.save();
       return user;
   }

}

/**
 * Check if the User already exists in the database
 * @param  {string} userId
 * @return {boolean}
 */
function _userExists( userId ) {
    return new Promise( ( resolve, reject )=>{
        UserlModel.findOne({ user_id : userId }, ( err, docs )=> {
            if(err) { return reject( err ); }

            if(!docs) { resolve(false); }
            else { resolve(true, docs); }
        });
    });
}

/**
 * Check if the Channel already exists in the database
 * @param  {string} userId
 * @return {boolean}
 */
function _channelExists( channelId ) {
    return new Promise( ( resolve, reject )=>{
        ChannelModel.findOne({ channel_id : channelId }, ( err, docs )=> {
            if(err) { return reject( err ); }

            if(!docs) { resolve(false); }
            else { resolve(true, docs); }
        });
    });
}
