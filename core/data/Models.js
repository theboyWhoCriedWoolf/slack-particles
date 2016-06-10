import mongoose, {Schema} from 'mongoose';


/**
 * define channel Schema
 * @type {Object}
 */
const ChannelSchema = {
    channel_id      : String,
    name            : String,
}

/**
 * define user Schema
 * @type {Object}
 */
const UserSchema = {
    user_id         : String,
    username        : String,
    colour          : String,
    real_name       : String,
    image           : String,
    image_small     : String,
    message_count   : Number
}

/**
 * Export models
 * @return {object} mongoose models
 */
export const ChannelModel = mongoose.model( 'Channel', new Schema(ChannelSchema));
export const UserlModel   = mongoose.model( 'User', new Schema(UserSchema));
