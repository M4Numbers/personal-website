const loadAssetEndpoints = require('./assets');
const loadHomepageEndpoints = require('./homepage');
const loadBlogEndpoints = require('./blog');
const loadAdminEndpoints = require('./admin');

// router.use('/', [
//     require('./statics')
// ]);
// router.use('/search', require('./search'));
// router.use('/projects', require('./projects'));
// router.use('/hobbies', require('./hobbies/'));

module.exports = (server) => {
    loadAssetEndpoints(server);
    loadHomepageEndpoints(server);
    loadBlogEndpoints(server);
    loadAdminEndpoints(server);
    return server;
};
