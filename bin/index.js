#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");
const {
    modifyMainHtmlDom,
    processHtml,
    modifyPopupHtmlDom
} = require("./mutator");
const getConfig = require("./config");

const cfgPath = process.argv.length > 3
    ? process.argv[2]
    : path.join(process.cwd(), "html-builder.config.json")

const cfgDir = path.dirname(cfgPath)
const cfg = getConfig(cfgPath)

const srcTreeHtmlFilePath = path.join(cfgDir, cfg.entry)
const treeFileName = path.basename(cfg.entry)
const srcTreeHtmlFilesDir = path.join(cfgDir, path.join(path.dirname(cfg.entry), treeFileName + '.files'))
const outputDir = path.join(cfgDir, cfg.output)
const outputTreeHtmlFilePath = path.join(outputDir, treeFileName)
const outputTreeHtmlFilesDir = path.join(outputDir, treeFileName + '.files')
const popupCustomCssFileName = 'popup-custom.css'
const srcPopupCustomCssPath = path.join(__dirname, '..', 'web', popupCustomCssFileName)
const outputPopupCustomCssPath = path.join(outputDir, popupCustomCssFileName)
const indexJsFileName = 'index.js'
const srcIndexJsPath = path.join(__dirname, '..', 'dist', indexJsFileName)
const outputIndexJsPath = path.join(outputDir, indexJsFileName)
const faviconFileName = path.basename(cfg.favicon)
const outputFaviconFilePath = path.join(outputDir, faviconFileName)
const srcFaviconPath = path.join(cfgDir, cfg.favicon)

if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {recursive: true});
}
fs.ensureDirSync(outputDir);

// process tree html

if (cfg.favicon && path.normalize(srcFaviconPath) !== path.normalize(outputFaviconFilePath)) {
    console.log(`Copying ${srcFaviconPath} to ${outputFaviconFilePath}...`);
    fs.copySync(srcFaviconPath, outputFaviconFilePath);
}

fs.copySync(srcTreeHtmlFilePath, outputTreeHtmlFilePath);
processHtml(outputTreeHtmlFilePath, dom => modifyMainHtmlDom(
    dom,
    indexJsFileName,
    cfg.favicon ? faviconFileName : undefined,
    cfg.noIndex,
    cfg.page,
));

// process tree.html.files

fs.copySync(srcTreeHtmlFilesDir, outputTreeHtmlFilesDir);
glob(path.join(outputTreeHtmlFilesDir, "*.html"), undefined, function (err, files) {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach(file => processHtml(file, dom => modifyPopupHtmlDom(
        dom,
        popupCustomCssFileName,
        cfg.noIndex
    )));
});

// copying assets

fs.copySync(srcPopupCustomCssPath, outputPopupCustomCssPath);
fs.copySync(srcIndexJsPath, outputIndexJsPath);