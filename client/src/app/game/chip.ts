declare var THREE: any;

export class Chip {
    x;
    y;
    meshLoader;
    range;
    mesh;
    animator;
    settings

    constructor(meshLoader, range, animator, settings) {
        const pieceMaterial = new THREE.MeshPhongMaterial({
            color: settings.chipsColors[range],
            shininess: 20,
            transparent: true
        });
        this.mesh = new THREE.Mesh(meshLoader.geom['chip'].clone());
        this.mesh.material = pieceMaterial;
        this.mesh.position.set(0, 0, 0);
        this.mesh.meshType = 'chip';
        this.animator = animator;
        this.range = range;
        this.settings = settings;
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

    animateMoveTo(x, y, z) {
        return this.animator.animationMove(this.mesh.position, {x: x, y: y, z: z});
    }

    remove() {
        // this.mesh.position.set(pos.x, pos.y, pos.z);
        return this.animator.removeFromDesk(this.mesh.material)
    }
}