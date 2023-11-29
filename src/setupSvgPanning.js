import PanningState from './panningState';
import svgPanZoom from 'svg-pan-zoom';
import touchPanningEventsHandler from './touchPanningEventsHandler';
import disableNodeClickAfterPanning from './disableClickAfterPanning';

const panningState = new PanningState();

export function setupSvgPanning() {
    const svgElement = document.querySelector('svg');
    const onPan = disableNodeClickAfterPanning(svgElement)

    const minZoom = parseFloat(svgElement.getAttribute("panning-min-zoom"))
    const maxZoom = parseFloat(svgElement.getAttribute("panning-max-zoom"))
    const zoomStep = parseFloat(svgElement.getAttribute("panning-zoom-step"))
    const useAnchorState = svgElement.getAttribute("panning-use-anchor-state") === "true"

    const stateToRestore = useAnchorState ? PanningState.loadFromLocationHash() : undefined;
    const panPlugin = svgPanZoom('svg', {
        zoomEnabled: true,
        controlIconsEnabled: false,
        minZoom: minZoom,
        maxZoom: maxZoom,
        zoomScaleSensitivity: zoomStep,
        customEventsHandler: touchPanningEventsHandler,
        onPan: pan => {
            if (useAnchorState) {
                panningState.update(pan, panPlugin.getZoom())
            }
            onPan()
        },
        onZoom: zoom => {
            if (useAnchorState) {
                panningState.update(panPlugin.getPan(), zoom)
            }
        }
    });

    if (stateToRestore) {
        if (stateToRestore.zoom) {
            panPlugin.zoom(stateToRestore.zoom);
        }
        if (stateToRestore.pan) {
            panPlugin.pan(stateToRestore.pan);
        }
    } else {
        const svgWidth = Number(svgElement.getAttribute('width'));
        const svgHeight = Number(svgElement.getAttribute('height'));
        const zoom = Math.min(window.innerWidth / svgWidth, window.innerHeight / svgHeight);
        panPlugin.zoom(zoom);
        panPlugin.pan({x: 0, y: 0});
    }
}

