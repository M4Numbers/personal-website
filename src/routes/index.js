const loadAssetEndpoints = require('./assets');
const loadHomepageEndpoints = require('./homepage');

// router.use('/', [
//     require('./homepage'),
//     require('./statics')
// ]);
// router.use('/search', require('./search'));
// router.use('/admin', require('./admin/'));
// router.use('/blog', require('./blog'));
// router.use('/projects', require('./projects'));
// router.use('/hobbies', require('./hobbies/'));

module.exports = (server) => {
    loadAssetEndpoints(server);
    loadHomepageEndpoints(server);
    return server;
};
