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
const getPaths = require("./paths").getPaths;

const cfgPath = process.argv.length > 3
    ? process.argv[2]
    : path.join(process.cwd(), "html-builder.config.json")

const cfgDir = path.dirname(cfgPath)
const cfg = getConfig(cfgPath)
const paths = getPaths(cfgDir, cfg)

if (fs.existsSync(paths.outputDir)) {
    fs.rmSync(paths.outputDir, {recursive: true});
}
fs.ensureDirSync(paths.outputDir);

// process tree html

if (cfg.favicon && paths.srcFaviconPath !== paths.outputFaviconFilePath) {
    console.log(`Copying ${paths.srcFaviconPath} to ${paths.outputFaviconFilePath}...`);
    fs.copySync(paths.srcFaviconPath, paths.outputFaviconFilePath);
}

fs.copySync(paths.srcTreeHtmlFilePath, paths.outputTreeHtmlFilePath);
processHtml(paths.outputTreeHtmlFilePath, dom => modifyMainHtmlDom(
    dom,
    paths.indexJsFileName,
    cfg.favicon ? paths.faviconFileName : undefined,
    cfg.noIndex,
    cfg.page,
));

// process tree.html.files

fs.copySync(paths.srcTreeHtmlFilesDir, paths.outputTreeHtmlFilesDir);
glob(path.join(paths.outputTreeHtmlFilesDir, "*.html"), undefined, function (err, files) {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach(file => processHtml(file, dom => modifyPopupHtmlDom(
        dom,
        paths.popupCustomCssFileName,
        cfg.noIndex
    )));
});

// copying assets

fs.copySync(paths.srcPopupCustomCssPath, paths.outputPopupCustomCssPath);
fs.copySync(paths.srcIndexJsPath, paths.outputIndexJsPath);