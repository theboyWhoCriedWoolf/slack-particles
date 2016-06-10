/**
 * strip a slack message of user values
 * @return {string} stripped string
 */
export function cleanMessage( str ) {
    let response = str.replace(/<(.*?)>(:)/igm, '');
    return response.trim();
}

/**
 * Remove the bot ID from string
 * @param  {string} str
 * @param  {string} id
 * @return {string} stripped string
 */
export function removeBotId( str, id ) {
    return str.replace(`<@${id}>`, '').trim();
}

/**
 * is this a chat message
 * @param  {string}  message
 * @return {Boolean}
 */
export function isChatMessage( message ) {
    return message.type === 'message' && Boolean(message.text);
}

/**
 * is this message mentioning the bot
 * @param  {string}  message
 * @param  {string}  bot name
 * @param  {string}  bot ID
 * @return {Boolean}
 */
export function isMentioningChatbot( message = '', name, id ) {
    if(!message.text){ return false; }

    return message.text.toLowerCase().indexOf(name) > -1 ||
        message.text.indexOf(`<@${id}>`) > -1;
}
