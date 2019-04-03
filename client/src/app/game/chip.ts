declare var THREE: any;

export class Chip {
    x;
    y;
    meshLoader;
    range;
    mesh;
    chipsColors = {
        1: 0xffffff, //w
        11: 0xffffff,
        2: '#645247', //b
        22: '#645247'
    };

    constructor(meshLoader, range) {
        const pieceMaterial = new THREE.MeshPhongMaterial({
            color: this.chipsColors[range],
            shininess: 20
        });
        this.mesh = new THREE.Mesh(meshLoader.geom['chip'].clone());
        this.mesh.material = pieceMaterial;
        this.mesh.position.set(0, 0, 0);
        this.mesh.meshType = 'chip';
    }

    getName() {
        return this.mesh.name;
    }

    setName(name) {
        this.mesh.name = name;
    }

    moveTo(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    remove() {
        this.mesh.position.set(this.mesh.position.x + 550, 11.1, this.mesh.position.z);
        this.setName([]);
    }
}