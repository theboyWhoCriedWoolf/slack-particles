/**
 * register babel and then load in server
 */
require("babel-core/register");
require("babel-polyfill");
require('./core/express');
