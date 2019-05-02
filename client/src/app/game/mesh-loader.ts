declare var THREE: any;

export class MeshLoader {
    models = {
        'chip': 'assets/models/piece.js',
    };
    textures = {
        'treeTexture': 'assets/desk.jpg',
        'table': 'assets/table.jpg',
        'cell': 'assets/floor-wood-small.jpg'
    };
    fonts = {
        'helvetica': 'assets/fonts/helvetiker_regular.typeface.json'
    }
    geom = {};
    // treeTexture = new THREE.TextureLoader().load( 'assets/floor-wood.jpg' );
    // treeTextureSmall = new THREE.TextureLoader().load( 'assets/floor-wood-small.jpg' );

    loadFromTo(from, to, type) {
        let loader;

        switch (type) {
            case 'json':
                loader = new THREE.JSONLoader();
                break;
            case 'texture':
                loader = new THREE.TextureLoader();
                break;
            case 'text':
                loader = new THREE.FontLoader();
                break;
        }
        let objLength = 0;

        for (let z in from) {
            objLength++;
        }
        
        let loaded = 0;

        return new Promise((res, rej) => {
            for (let z in from) {
                loader.load(from[z], (geometry) => {
                    loaded++;
                    to[z] = geometry;

                    if (objLength === loaded) {
                        res();
                    }
                });
            }
        })
    }

    waitLoadData() {
        return Promise.all([
            this.loadFromTo(this.models, this.geom, 'json'),
            this.loadFromTo(this.textures, this.geom, 'texture'),
            this.loadFromTo(this.fonts, this.geom, 'text')
        ])
    }
}