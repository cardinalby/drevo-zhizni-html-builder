export default function disableNodeClickAfterPanning(svgElement) {
    const originalNodeClick = window.nodeclick
    let disableNodeClick = false
    window.nodeclick = function (node) {
        if (!disableNodeClick) {
            originalNodeClick(node)
        }
    }

    let isPanning = false
    const onPan = () => {
        isPanning = true
    }
    svgElement.addEventListener('mousedown', e => {
        isPanning = false
    });
    svgElement.addEventListener('mouseup', e => {
        if (isPanning) {
            disableNodeClick = true
            setTimeout(() => {
                disableNodeClick = false
            }, 100)
        }
    });

    return onPan
}