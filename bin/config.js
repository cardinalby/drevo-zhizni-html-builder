const fs = require("fs-extra");

function getConfig(cfgPath) {
    let cfg = undefined
    try {
        cfg = fs.readJSONSync(cfgPath)
    } catch (e) {
        console.error('Error reading config file: ' + cfgPath)
        throw e
    }

    if (!cfg.output) {
        throw new Error('"output" is not set in ' + cfgPath)
    }
    if (!cfg.entry) {
        throw new Error('"entry" is not set in ' + cfgPath)
    }
    if (!cfg.page) {
        cfg.page = {}
    }
    if (cfg.page.min_zoom === undefined) {
        cfg.page.min_zoom = 0.1
    } else if (typeof cfg.page.min_zoom !== 'number') {
        throw new Error('"page.min_zoom" must be a number')
    }
    if (cfg.page.max_zoom === undefined) {
        cfg.page.max_zoom = 4
    } else if (typeof cfg.page.max_zoom !== 'number') {
        throw new Error('"page.max_zoom" must be a number')
    }
    if (cfg.page.zoom_step === undefined) {
        cfg.page.zoom_step = 0.1
    } else if (typeof cfg.page.zoom_step !== 'number') {
        throw new Error('"page.zoom_step" must be a number')
    }
    if (cfg.page.use_anchor_state === undefined) {
        cfg.page.use_anchor_state = true
    } else if (typeof cfg.page.use_anchor_state !== 'boolean') {
        throw new Error('"page.use_anchor_state" must be a boolean')
    }
    return cfg
}

module.exports = getConfig;