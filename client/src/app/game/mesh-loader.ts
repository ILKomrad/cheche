declare var THREE: any;

export class MeshLoader {
    textures = {
        'chip': 'assets/models/piece.js'
    };
    geom = {};

    loadFromTo(from, to) {
        const loader = new THREE.JSONLoader();

        return new Promise((res, rej) => {
            for (let z in from) {
                loader.load(from[z], function (geometry) {
                    to[z] = geometry;
                    return res();
                });
            }
        })
    }

    waitLoadData() {
        return Promise.all([
            this.loadFromTo(this.textures, this.geom)
        ])
    }
}