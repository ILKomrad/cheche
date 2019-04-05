declare var THREE: any;

export class Chip {
    x;
    y;
    meshLoader;
    range;
    mesh;
    animator;
    chipsColors = {
        1: 0xffffff, //w
        11: 0xffffff,
        2: '#645247', //b
        22: '#645247'
    };

    constructor(meshLoader, range, animator) {
        const pieceMaterial = new THREE.MeshPhongMaterial({
            color: this.chipsColors[range],
            shininess: 20,
            transparent: true
        });
        this.mesh = new THREE.Mesh(meshLoader.geom['chip'].clone());
        this.mesh.material = pieceMaterial;
        this.mesh.position.set(0, 0, 0);
        this.mesh.meshType = 'chip';
        this.animator = animator;
        this.range = range;
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

    moveTo(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    animateMoveTo(x, y, z) {
        this.animator.animationMove(this.mesh.position, {x: x, y: y, z: z});
    }

    remove() {
        // this.mesh.position.set(pos.x, pos.y, pos.z);
        this.animator.removeFromDesk(this.mesh.material);
        this.setName([]);
    }
}