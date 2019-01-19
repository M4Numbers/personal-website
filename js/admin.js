/*
 * MIT License
 *
 * Copyright (c) 2018 Matthew D. Ball
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

/* eslint-disable no-unused-vars */

const refreshAnimeItems = () => {
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {};

    xmlHttp.open('POST', '/admin/anime/refresh', true);
    xmlHttp.send({});
};

const refreshMangaItems = () => {
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {};

    xmlHttp.open('POST', '/admin/manga/refresh', true);
    xmlHttp.send({});
};

const generateNewEntry = (number) => {
    let controller = document.createElement('div');
    controller.setAttribute('class', 'static-item mb4');

    let nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', `sitemap-page-name-${number}`);
    let nameLabelName = document.createTextNode('Page name');
    nameLabel.appendChild(nameLabelName);

    let nameInput = document.createElement('input', {'class': 'form-control', 'type': 'text', 'id': `sitemap-page-name-${number}`, 'name': `sitemap-page[${number}][page_name]`});
    nameInput.setAttribute('class', 'form-control');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('name', `sitemap-page[${number}][page_name]`);
    nameInput.setAttribute('id', `sitemap-page-name-${number}`);

    let linkLabel = document.createElement('label', {'for': `sitemap-page-link-${number}`});
    linkLabel.setAttribute('for', `sitemap-page-link-${number}`);
    let linkLabelName = document.createTextNode('Page link');
    linkLabel.appendChild(linkLabelName);

    let linkInput = document.createElement('input', {'class': 'form-control', 'type': 'text', 'id': `sitemap-page-link-${number}`, 'name': `sitemap-page[${number}][page_link]`});
    linkInput.setAttribute('class', 'form-control');
    linkInput.setAttribute('type', 'text');
    linkInput.setAttribute('name', `sitemap-page[${number}][page_link]`);
    linkInput.setAttribute('id', `sitemap-page-link-${number}`);

    controller.append(nameLabel, nameInput, linkLabel, linkInput);
    return controller;
};

const addNewMapEntry = () => {
    let collection = document.getElementById('sitemap-collection');
    collection.append(generateNewEntry(collection.children.length));
};

const generateNewContactEntry = (number) => {
    let controller = document.createElement('div');
    controller.setAttribute('class', 'static-item mb4');

    let nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', `sitemap-contact-method-${number}`);
    let nameLabelName = document.createTextNode('Contact method');
    nameLabel.appendChild(nameLabelName);

    let nameInput = document.createElement('input', {'class': 'form-control', 'type': 'text', 'id': `sitemap-contact-method-${number}`, 'name': `sitemap-page[${number}][contact_method]`});
    nameInput.setAttribute('class', 'form-control');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('name', `sitemap-page[${number}][contact_method]`);
    nameInput.setAttribute('id', `sitemap-contact-name-${number}`);

    let linkLabel = document.createElement('label', {'for': `sitemap-contact-link-${number}`});
    linkLabel.setAttribute('for', `sitemap-contact-link-${number}`);
    let linkLabelName = document.createTextNode('Contact link');
    linkLabel.appendChild(linkLabelName);

    let linkInput = document.createElement('input', {'class': 'form-control', 'type': 'text', 'id': `sitemap-contact-link-${number}`, 'name': `sitemap-page[${number}][contact_link]`});
    linkInput.setAttribute('class', 'form-control');
    linkInput.setAttribute('type', 'text');
    linkInput.setAttribute('name', `sitemap-page[${number}][contact_link]`);
    linkInput.setAttribute('id', `sitemap-contact-link-${number}`);

    let faStyleLabel = document.createElement('label', {'for': `sitemap-contact-fa-style-${number}`});
    faStyleLabel.setAttribute('for', `sitemap-contact-fa-style-${number}`);
    let faStyleLabelName = document.createTextNode('Contact FA style');
    faStyleLabel.appendChild(faStyleLabelName);

    let faStyleInput = document.createElement('input', {'class': 'form-control', 'type': 'text', 'id': `sitemap-contact-fa-style-${number}`, 'name': `sitemap-page[${number}][fa_style]`});
    faStyleInput.setAttribute('class', 'form-control');
    faStyleInput.setAttribute('type', 'text');
    faStyleInput.setAttribute('name', `sitemap-page[${number}][fa_style]`);
    faStyleInput.setAttribute('id', `sitemap-contact-fa-style-${number}`);

    let faIconLabel = document.createElement('label', {'for': `sitemap-contact-fa-icon-${number}`});
    faIconLabel.setAttribute('for', `sitemap-contact-fa-icon-${number}`);
    let faIconLabelName = document.createTextNode('Contact FA icon');
    faIconLabel.appendChild(faIconLabelName);

    let faIconInput = document.createElement('input', {'class': 'form-control', 'type': 'text', 'id': `sitemap-contact-fa-icon-${number}`, 'name': `sitemap-page[${number}][fa_icon]`});
    faIconInput.setAttribute('class', 'form-control');
    faIconInput.setAttribute('type', 'text');
    faIconInput.setAttribute('name', `sitemap-page[${number}][fa_icon]`);
    faIconInput.setAttribute('id', `sitemap-contact-fa-icon-${number}`);

    controller.append(nameLabel, nameInput, linkLabel, linkInput, faStyleLabel, faStyleInput, faIconLabel, faIconInput);
    return controller;
};

const addNewContactEntry = () => {
    let collection = document.getElementById('contact-collection');
    collection.append(generateNewContactEntry(collection.children.length));
};
