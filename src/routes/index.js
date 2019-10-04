const loadAssetEndpoints = require('./assets');
const loadSearchEndpoint = require('./search');
const loadHomepageEndpoints = require('./homepage');
const loadBlogEndpoints = require('./blog');
const loadProjectEndpoints = require('./projects');
const loadAdminEndpoints = require('./admin');
const loadStaticsEndpoints = require('./statics');

// router.use('/', [
//     require('./statics')
// ]);
// router.use('/hobbies', require('./hobbies/'));

module.exports = (server) => {
    loadAssetEndpoints(server);
    loadSearchEndpoint(server);
    loadHomepageEndpoints(server);
    loadBlogEndpoints(server);
    loadProjectEndpoints(server);
    loadStaticsEndpoints(server);
    loadAdminEndpoints(server);
    return server;
};
