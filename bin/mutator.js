const fs = require("fs-extra");
const jsdom = require("jsdom");

function element(dom, tagName, attrs) {
    const element = dom.window.document.createElement(tagName);
    for (const attr in attrs) {
        element.setAttribute(attr, attrs[attr]);
    }
    return element;
}

function processHtml(filePath, fn) {
    console.log(`Processing ${filePath}...`);
    const html = fs.readFileSync(filePath);
    const dom = new jsdom.JSDOM(html);
    fn(dom);
    fs.writeFileSync(filePath, dom.serialize());
}

function modifyMainHtmlDom(dom, indexJsRelPath, faviconRelPath, noIndex, pageCfg) {
    const head = dom.window.document.head;
    const body = dom.window.document.body;
    head.appendChild(element(dom,'link', {rel: 'prefetch', href: indexJsRelPath}));
    if (faviconRelPath !== undefined) {
        head.appendChild(element(dom, 'link', {rel: 'icon', type: 'image/x-icon', href: faviconRelPath}));
    }
    if (noIndex) {
        head.appendChild(element(dom, 'meta', {name: 'robots', content: 'noindex'}));
    }
    head.appendChild(element(dom,'meta',{
        name: "viewport",
        content: "user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    }));
    body.appendChild(element(dom,'script', {src: indexJsRelPath}));
    setSvgAttributes(dom, pageCfg);
}

function setSvgAttributes(dom, pageCfg) {
    const svgEl = dom.window.document.body.querySelector('svg')
    svgEl.setAttribute('panning-min-zoom', pageCfg.min_zoom.toString());
    svgEl.setAttribute('panning-max-zoom', pageCfg.max_zoom.toString());
    svgEl.setAttribute('panning-zoom-step', pageCfg.zoom_step.toString());
    svgEl.setAttribute('panning-use-anchor-state', pageCfg.use_anchor_state ? 'true': 'false');
}

function modifyPopupHtmlDom(dom, popupCustomCssRelPath, noIndex) {
    const head = dom.window.document.head;
    if (noIndex) {
        head.appendChild(element(dom, 'meta', {name: 'robots', content: 'noindex'}));
    }
    head.appendChild(element(dom,'link',{rel: 'stylesheet', href: popupCustomCssRelPath}));
}

module.exports = {
    processHtml,
    modifyMainHtmlDom,
    modifyPopupHtmlDom
}