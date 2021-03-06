/*
    Purpose: setup KnexJS with environment-specific configuration
*/

const knex        = require('knex');
const environment = process.env.NODE_ENV || 'development';
const config      = require('../../knexfile');

exports.db = knex(config[environment]);

// expose a TABLES object; holds string name values of the tables
// we're interacting with.
exports.TABLES = {
    TAGS       		: 'tags',
    PROJECTS      : 'projects',
    PROJECTS_TAGS : 'projects_tags',
    USERS 				: 'users'
};