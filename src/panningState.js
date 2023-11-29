import throttle from "lodash.throttle"

export default class PanningState {
    constructor() {
        this.pan = undefined;
        this.zoom = undefined;
        this.setLocationHash = throttle(
            hash => history.replaceState(undefined, undefined, hash),
            200
            );
    }

    static loadFromLocationHash() {
        if (window.location.hash) {
            try {
                const hashPos = JSON.parse(decodeURIComponent(
                    window.location.hash.replace('#', '')
                ));
                const state = new PanningState();
                if (hashPos.p) {
                    state.pan = hashPos.p;
                }
                if (hashPos.z) {
                    state.zoom = hashPos.z;
                }
                return state;
            } catch (err) {
                return undefined;
            }
        }
    }

    update(pan, zoom) {
        this.pan = pan;
        if (this.pan) {
            this.pan.x = Math.round(this.pan.x);
            this.pan.y = Math.round(this.pan.y);
        }
        this.zoom = zoom;
        if (this.zoom) {
            this.zoom = Math.round(this.zoom * 100) / 100;
        }
        this.updateLocationHash();
    }

    updateLocationHash() {
        const hashObj = {};
        if (this.pan && this.pan.x !== 0 && this.pan.y !== 0) {
            hashObj.p = this.pan;
        }
        if (this.zoom && this.zoom !== 1) {
            hashObj.z = this.zoom;
        }

        this.setLocationHash(hashObj.z || hashObj.p
            ? "#" + JSON.stringify(hashObj)
            : ''
        );
    }
}