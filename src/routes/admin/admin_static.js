/*
 * MIT License
 *
 * Copyright (c) 2018 Jayne Doe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const renderer = require('../../lib/renderer').nunjucksRenderer();

const StaticHandler = require('../../lib/StaticHandler');
const staticHandlerInstance = StaticHandler.getHandler();
const statics = require('../../lib/StaticDocumentTypes');

const viewAllStatics = (req, res, next) => {
    res.contentType = 'text/html';
    res.header('content-type', 'text/html');
    res.send(200, renderer.render('pages/admin/statics/admin_statics_view.njk', {
        top_page: {
            title: 'Administrator Toolkit',
            tagline: 'All the functions that the administrator of the site has available to them',
            fa_type: 'fas',
            fa_choice: 'fa-toolbox'
        },

        content: {
            statics: Object.values(statics).sort()
        },

        head: {
            title: 'J4Numbers',
            description: 'Home to the wild things',
            current_page: 'admin',
            current_sub_page: 'statics-view'
        }
    }));
    next();
};

const viewSingleTextStaticDocument = (req, res, next) => {
    staticHandlerInstance.findStatic(res.locals['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            req.log.warn('Issue getting static document');
            req.log.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.contentType = 'text/html';
            res.header('content-type', 'text/html');
            res.send(200, renderer.render('pages/admin/statics/admin_statics_view_single_text.njk', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: res.locals['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-view'
                }
            }));
            next();
        });
};

const cullListItems = (items) => Promise.resolve(
    items.filter(toValidate =>
        toValidate.page_name !== ''
        && toValidate.page_link !== ''));

const cullContactListItems = (items) => Promise.resolve(
    items.filter(toValidate =>
        toValidate.contact_method !== ''
        && toValidate.contact_link !== ''
        && toValidate.fa_style !== ''
        && toValidate.fa_icon !== ''));

const viewSingleListContactStaticDocument = (req, res, next) => {
    staticHandlerInstance.findStatic(res.locals['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            req.log.warn('Issue getting static document');
            req.log.debug(error.message);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.contentType = 'text/html';
            res.header('content-type', 'text/html');
            res.send(200, renderer.render('pages/admin/statics/admin_statics_view_single_list_contact.njk', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: res.locals['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-view'
                }
            }));
            next();
        });
};

const viewSingleListSiteMapStaticDocument = (req, res, next) => {
    staticHandlerInstance.findStatic(res.locals['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            req.log.warn('Issue getting static document');
            req.log.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.contentType = 'text/html';
            res.header('content-type', 'text/html');
            res.send(200, renderer.render('pages/admin/statics/admin_statics_view_single_list_sitemap.njk', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: res.locals['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-view'
                }
            }));
            next();
        });
};

const editSingleTextStaticDocument = (req, res, next) => {
    staticHandlerInstance.findStatic(res.locals['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            req.log.warn('Issue getting static document');
            req.log.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.contentType = 'text/html';
            res.header('content-type', 'text/html');
            res.send(200, renderer.render('pages/admin/statics/admin_statics_edit_single_text.njk', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: res.locals['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-edit'
                }
            }));
            next();
        });
};

const editSingleListContactStaticDocument = (req, res, next) => {
    staticHandlerInstance.findStatic(res.locals['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            req.log.warn('Issue getting static document');
            req.log.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.contentType = 'text/html';
            res.header('content-type', 'text/html');
            res.send(200, renderer.render('pages/admin/statics/admin_statics_edit_single_list_contact.njk', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: res.locals['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-edit'
                }
            }));
            next();
        });
};

const editSingleListSiteMapStaticDocument = (req, res, next) => {
    staticHandlerInstance.findStatic(res.locals['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            req.log.warn('Issue getting static document');
            req.log.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.contentType = 'text/html';
            res.header('content-type', 'text/html');
            res.send(200, renderer.render('pages/admin/statics/admin_statics_edit_single_list_sitemap.njk', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: res.locals['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-edit'
                }
            }));
            next();
        });
};

const editTextDocument = (req, res, next) => {
    staticHandlerInstance.updateStatic(
        res.locals['staticId'], req.body['document-text']
    ).then(() => {
        res.redirect(303, `/admin/statics/${res.locals['staticId']}`, next);
    }, rejection => {
        req.log.warn({static_id: res.locals['staticId'], error: rejection});
        res.redirect(303, `/admin/statics/${res.locals['staticId']}`, next);
    });
};

const editSitemapListDocument = (req, res, next) => {
    cullListItems(req.body['sitemap-page'] || [])
        .then(minimisedItems => {
            staticHandlerInstance.updateStatic(
                res.locals['staticId'], minimisedItems
            ).then(() => {
                res.redirect(303, `/admin/statics/${res.locals['staticId']}`, next);
            }, rejection => {
                req.log.warn({static_id: res.locals['staticId'], error: rejection});
                res.redirect(303, `/admin/statics/${res.locals['staticId']}`, next);
            });
        });
};

const editContactListDocument = (req, res, next) => {
    cullContactListItems(req.body['sitemap-page'] || [])
        .then(minimisedItems => {
            staticHandlerInstance.updateStatic(
                res.locals['staticId'], minimisedItems
            ).then(() => {
                res.redirect(303, `/admin/statics/${res.locals['staticId']}`, next);
            }, rejection => {
                req.log.warn({static_id: res.locals['staticId'], error: rejection});
                res.redirect(303, `/admin/statics/${res.locals['staticId']}`, next);
            });
        });
};

const extractStatic = (req, res, next) => {
    res.locals.staticId = req.getPath().split('/')[3];
    next();
};

module.exports = (server) => {
    server.get('/admin/statics', viewAllStatics);

    server.get(`/admin/statics/${statics.ABOUT_ME}`, extractStatic, viewSingleTextStaticDocument);
    server.get(`/admin/statics/${statics.KINK_WARNING}`, extractStatic, viewSingleTextStaticDocument);
    server.get(`/admin/statics/${statics.KNOWING_ME}`, extractStatic, viewSingleTextStaticDocument);
    server.get(`/admin/statics/${statics.CONTACT_ME}`, extractStatic, viewSingleListContactStaticDocument);
    server.get(`/admin/statics/${statics.SITEMAP}`, extractStatic, viewSingleListSiteMapStaticDocument);

    server.get(`/admin/statics/${statics.ABOUT_ME}/edit`, extractStatic, editSingleTextStaticDocument);
    server.get(`/admin/statics/${statics.KINK_WARNING}/edit`, extractStatic, editSingleTextStaticDocument);
    server.get(`/admin/statics/${statics.KNOWING_ME}/edit`, extractStatic, editSingleTextStaticDocument);
    server.get(`/admin/statics/${statics.CONTACT_ME}/edit`, extractStatic, editSingleListContactStaticDocument);
    server.get(`/admin/statics/${statics.SITEMAP}/edit`, extractStatic, editSingleListSiteMapStaticDocument);

    server.post(`/admin/statics/${statics.ABOUT_ME}/edit`, extractStatic, editTextDocument);
    server.post(`/admin/statics/${statics.KINK_WARNING}/edit`, extractStatic, editTextDocument);
    server.post(`/admin/statics/${statics.KNOWING_ME}/edit`, extractStatic, editTextDocument);
    server.post(`/admin/statics/${statics.CONTACT_ME}/edit`, extractStatic, editContactListDocument);
    server.post(`/admin/statics/${statics.SITEMAP}/edit`, extractStatic, editSitemapListDocument);
};
