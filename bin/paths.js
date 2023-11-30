const path = require("path");
const fs = require("fs-extra");

module.exports.getPaths = (cfgDir, cfg) => {
    const srcTreeHtmlFilePath = path.join(cfgDir, cfg.entry)
    const treeFileName = path.basename(cfg.entry)
    const srcTreeHtmlFilesDir = path.join(cfgDir, path.join(path.dirname(cfg.entry), treeFileName + '.files'))
    const outputDir = path.join(cfgDir, cfg.output)
    const outputTreeHtmlFilePath = path.join(outputDir, treeFileName)
    const outputTreeHtmlFilesDir = path.join(outputDir, treeFileName + '.files')
    const popupCustomCssFileName = 'popup-custom.css'
    const srcPopupCustomCssPath = path.join(__dirname, '..', 'web', popupCustomCssFileName)
    const outputPopupCustomCssPath = path.join(outputTreeHtmlFilesDir, popupCustomCssFileName)
    const indexJsFileName = 'index.js'
    const srcIndexJsPath = path.join(__dirname, '..', 'dist', indexJsFileName)
    const outputIndexJsPath = path.join(outputDir, indexJsFileName)
    const faviconFileName = cfg.favicon ? path.basename(cfg.favicon) : undefined
    const outputFaviconFilePath = cfg.favicon
        ? path.normalize(path.join(outputDir, faviconFileName))
        : undefined
    const srcFaviconPath = cfg.favicon
        ? path.normalize(path.join(cfgDir, cfg.favicon))
        : undefined

    const paths = {
        srcTreeHtmlFilePath: path.normalize(srcTreeHtmlFilePath),
        treeFileName: treeFileName,
        srcTreeHtmlFilesDir: path.normalize(srcTreeHtmlFilesDir),
        outputDir: path.normalize(outputDir),
        outputTreeHtmlFilePath: path.normalize(outputTreeHtmlFilePath),
        outputTreeHtmlFilesDir: path.normalize(outputTreeHtmlFilesDir),
        popupCustomCssFileName: popupCustomCssFileName,
        srcPopupCustomCssPath: path.normalize(srcPopupCustomCssPath),
        outputPopupCustomCssPath: path.normalize(outputPopupCustomCssPath),
        indexJsFileName: indexJsFileName,
        srcIndexJsPath: path.normalize(srcIndexJsPath),
        outputIndexJsPath: path.normalize(outputIndexJsPath),
        faviconFileName: faviconFileName,
        outputFaviconFilePath: outputFaviconFilePath,
        srcFaviconPath: srcFaviconPath,
    }
    validateSrcPaths(paths)
    return paths
}

function validateSrcPaths(paths) {
    if (!fs.existsSync(paths.srcTreeHtmlFilePath)) {
        throw new Error(`Entry html file not found: ${paths.srcTreeHtmlFilePath}`)
    }
    if (!fs.existsSync(paths.srcTreeHtmlFilesDir)) {
        throw new Error(`Entry html files directory not found: ${paths.srcTreeHtmlFilesDir}`)
    }
    if (paths.srcFaviconPath !== undefined && !fs.existsSync(paths.srcFaviconPath)) {
        throw new Error(`Favicon file not found: ${paths.srcFaviconPath}`)
    }
}