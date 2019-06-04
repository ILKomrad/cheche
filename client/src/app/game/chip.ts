declare var THREE: any;

export class Chip {
    x;
    y;
    meshLoader;
    range;
    mesh;
    settings

    constructor(meshLoader, range, settings) {
        const pieceMaterial = new THREE.MeshPhongMaterial({
            color: settings.chipsColors[range],
            shininess: 20,
            transparent: true
        });
        this.mesh = new THREE.Mesh(meshLoader.geom['chip'].clone());
        this.mesh.material = pieceMaterial;
        this.mesh.position.set(0, 0, 0);
        this.mesh.meshType = 'chip';
        this.mesh.renderOrder = 3;
        this.mesh.castShadow = true;
        this.range = range;
        this.settings = settings;
        // this.mesh.material.opacity = 0.1;

        if ((range === 'bb') || (range === 'ww')) {
            this.transformToQueen();
        }
    }

    getRange() {
        return this.range;
    }

    getName() {
        return this.mesh.name;
    }

    setName(name) {
        this.mesh.name = name;
    }

    getMesh() {
        return this.mesh;
    }

    moveTo(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    getPosition() {
        return this.mesh.position;
    }

    getMaterial() {
        return this.mesh.material;
    }

    transformToQueen() {
        this.mesh.rotation.x = Math.PI;
        this.mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -1, 0))
    }
}