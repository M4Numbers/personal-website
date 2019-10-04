const loadAssetEndpoints = require('./assets');
const loadHomepageEndpoints = require('./homepage');
const loadBlogEndpoints = require('./blog');

// router.use('/', [
//     require('./statics')
// ]);
// router.use('/search', require('./search'));
// router.use('/admin', require('./admin/'));
// router.use('/projects', require('./projects'));
// router.use('/hobbies', require('./hobbies/'));

module.exports = (server) => {
    loadAssetEndpoints(server);
    loadHomepageEndpoints(server);
    loadBlogEndpoints(server);
    return server;
};
