const loadAssetEndpoints = require('./assets');
const loadSEOEndpoints = require('./seo');
const loadSearchEndpoint = require('./search');
const loadHomepageEndpoints = require('./homepage');
const loadBlogEndpoints = require('./blog');
const loadProjectEndpoints = require('./projects');
const loadHobbiesEndpoints = require('./hobbies');
const loadAdminEndpoints = require('./admin');
const loadStaticsEndpoints = require('./statics');

module.exports = (server) => {
    loadAssetEndpoints(server);
    loadSEOEndpoints(server);
    loadSearchEndpoint(server);
    loadHomepageEndpoints(server);
    loadBlogEndpoints(server);
    loadProjectEndpoints(server);
    loadHobbiesEndpoints(server);
    loadStaticsEndpoints(server);
    loadAdminEndpoints(server);
    return server;
};
