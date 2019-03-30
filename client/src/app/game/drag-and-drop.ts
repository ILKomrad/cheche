declare var THREE: any;

export class DragAndDrop {
    raycaster = new THREE.Raycaster();
    camera;
    scene;
    renderer;
    desk;
    x; 
    y;

    constructor(renderer, desk) {
        this.renderer = renderer.getRenderer();
        this.camera = renderer.getCamera();
        this.scene = renderer.getScene();
        this.desk = desk;
    }

    setMousePosition(event) {
        this.x = ((event.clientX - this.renderer.domElement.offsetLeft) / this.renderer.domElement.width) * 2 * this.renderer.getPixelRatio() - 1;
        this.y = -((event.clientY - this.renderer.domElement.offsetTop) / this.renderer.domElement.height) * 2 * this.renderer.getPixelRatio() + 1;
    }

    getIntersects(event) {
        this.setMousePosition(event);
        this.raycaster.setFromCamera({x: this.x, y: this.y}, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        return intersects;
    }

    getRegardingPosition(obj) {
        const vector = new THREE.Vector3(this.x, this.y, 1);
        vector.unproject(this.camera);
        this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
       
        return this.raycaster.intersectObject(obj);
    }

    start(obj, onDrop) {
        const th = this;
        window.addEventListener('mousemove', drug);
        document.addEventListener('mouseup', drop);

        function drug(e) {
            th.setMousePosition(e);
            let i = th.getRegardingPosition(th.desk);
            
            if (i[0]) {
                obj.position.set(i[0].point.x, i[0].point.y, i[0].point.z - 0.5);
            }

            e.preventDefault();
        }

        function drop(event) {
            if (onDrop) {
                const intersects = th.getIntersects(event);
                
                for (let item in intersects) {       
                    if (intersects[item].object.meshType === 'cell') {
                        onDrop(intersects[item].object.name);
                    }
                }
            }

            window.removeEventListener('mousemove', drug);
            document.removeEventListener('mouseup', drop);
        }
    }
}