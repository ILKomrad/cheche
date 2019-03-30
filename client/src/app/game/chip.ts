declare var THREE: any;

export class Chip {
    x;
    y;
    meshLoader;
    range;
    mesh;
    chipsColors = {
        1: 0xffffff,
        11: 0xffffff,
        2: '#645247',
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

    setName(name) {
        this.mesh.name = name;
    }

    moveTo(x, y, z) {
        this.mesh.position.set(x, y, z);
    }
}