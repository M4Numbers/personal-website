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

const express = require('express');
const router = express.Router();

const Logger = require('../../lib/Logger');
const logger = Logger.getLogger('master');

const StaticHandler = require('../../lib/StaticHandler');
const staticHandlerInstance = StaticHandler.getHandler();
const statics = require('../../lib/StaticDocumentTypes');

router.get('/', (req, res) => {
    res.render('./pages/admin/statics/admin_statics_view', {
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
    });
});

const viewSingleTextStaticDocument = (req, res) => {
    staticHandlerInstance.findStatic(req.params['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            logger.warn('Issue getting static document');
            logger.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.render('./pages/admin/statics/admin_statics_view_single_text', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: req.params['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-view'
                }
            });
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

const viewSingleListContactStaticDocument = (req, res) => {
    staticHandlerInstance.findStatic(req.params['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            logger.warn('Issue getting static document');
            logger.debug(error.message);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.render('./pages/admin/statics/admin_statics_view_single_list_contact', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: req.params['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-view'
                }
            });
        });
};

const viewSingleListSiteMapStaticDocument = (req, res) => {
    staticHandlerInstance.findStatic(req.params['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            logger.warn('Issue getting static document');
            logger.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.render('./pages/admin/statics/admin_statics_view_single_list_sitemap', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: req.params['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-view'
                }
            });
        });
};

const editSingleTextStaticDocument = (req, res) => {
    staticHandlerInstance.findStatic(req.params['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            logger.warn('Issue getting static document');
            logger.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.render('./pages/admin/statics/admin_statics_edit_single_text', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: req.params['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-edit'
                }
            });
        });
};

const editSingleListContactStaticDocument = (req, res) => {
    staticHandlerInstance.findStatic(req.params['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            logger.warn('Issue getting static document');
            logger.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.render('./pages/admin/statics/admin_statics_edit_single_list_contact', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: req.params['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-edit'
                }
            });
        });
};

const editSingleListSiteMapStaticDocument = (req, res) => {
    staticHandlerInstance.findStatic(req.params['staticId'])
        .then(staticData => {
            return Promise.resolve(staticData.content);
        })
        .catch(error => {
            logger.warn('Issue getting static document');
            logger.debug(error);
            return Promise.resolve('');
        })
        .then(staticData => {
            res.render('./pages/admin/statics/admin_statics_edit_single_list_sitemap', {
                top_page: {
                    title: 'Administrator Toolkit',
                    tagline: 'All the functions that the administrator of the site has available to them',
                    fa_type: 'fas',
                    fa_choice: 'fa-toolbox'
                },

                content: {
                    static_id: req.params['staticId'],
                    static_detail: staticData
                },

                head: {
                    title: 'J4Numbers',
                    description: 'Home to the wild things',
                    current_page: 'admin',
                    current_sub_page: 'statics-edit'
                }
            });
        });
};

const editTextDocument = (req, res) => {
    staticHandlerInstance.updateStatic(
        req.params['staticId'], req.body['document-text']
    ).then(() => {
        res.redirect(303, `/admin/statics/${req.params['staticId']}`);
    }, rejection => {
        res.cookie('static-update-error', {static_id: req.params['staticId'], error: rejection}, {signed: true, maxAge: 1000});
        res.redirect(303, `/admin/statics/${req.params['staticId']}`);
    });
};

const editSitemapListDocument = (req, res) => {
    cullListItems(req.body['sitemap-page'] || [])
        .then(minimisedItems => {
            staticHandlerInstance.updateStatic(
                req.params['staticId'], minimisedItems
            ).then(() => {
                res.redirect(303, `/admin/statics/${req.params['staticId']}`);
            }, rejection => {
                res.cookie('static-update-error', {static_id: req.params['staticId'], error: rejection}, {
                    signed: true,
                    maxAge: 1000
                });
                res.redirect(303, `/admin/statics/${req.params['staticId']}`);
            });
        });
};

const editContactListDocument = (req, res) => {
    cullContactListItems(req.body['sitemap-page'] || [])
        .then(minimisedItems => {
            staticHandlerInstance.updateStatic(
                req.params['staticId'], minimisedItems
            ).then(() => {
                res.redirect(303, `/admin/statics/${req.params['staticId']}`);
            }, rejection => {
                res.cookie('static-update-error', {static_id: req.params['staticId'], error: rejection}, {
                    signed: true,
                    maxAge: 1000
                });
                res.redirect(303, `/admin/statics/${req.params['staticId']}`);
            });
        });
};

router.get(`/:staticId(${statics.ABOUT_ME})`, viewSingleTextStaticDocument);
router.get(`/:staticId(${statics.KINK_WARNING})`, viewSingleTextStaticDocument);
router.get(`/:staticId(${statics.KNOWING_ME})`, viewSingleTextStaticDocument);
router.get(`/:staticId(${statics.CONTACT_ME})`, viewSingleListContactStaticDocument);
router.get(`/:staticId(${statics.SITEMAP})`, viewSingleListSiteMapStaticDocument);

router.get(`/:staticId(${statics.ABOUT_ME})/edit`, editSingleTextStaticDocument);
router.get(`/:staticId(${statics.KINK_WARNING})/edit`, editSingleTextStaticDocument);
router.get(`/:staticId(${statics.KNOWING_ME})/edit`, editSingleTextStaticDocument);
router.get(`/:staticId(${statics.CONTACT_ME})/edit`, editSingleListContactStaticDocument);
router.get(`/:staticId(${statics.SITEMAP})/edit`, editSingleListSiteMapStaticDocument);

router.post(`/:staticId(${statics.ABOUT_ME})/edit`, editTextDocument);
router.post(`/:staticId(${statics.KINK_WARNING})/edit`, editTextDocument);
router.post(`/:staticId(${statics.KNOWING_ME})/edit`, editTextDocument);
router.post(`/:staticId(${statics.CONTACT_ME})/edit`, editContactListDocument);
router.post(`/:staticId(${statics.SITEMAP})/edit`, editSitemapListDocument);

module.exports = router;
