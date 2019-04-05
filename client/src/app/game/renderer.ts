declare var THREE: any;

export class Renderer {
    camera;
    scene;
    renderer;
    container;
    maxFps;
    fps;
    fpsControl
    controls;
    range;

    createEnvironment(range, container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.add(this.camera);
        this.range = range;

        if (range === 'w') {
            this.setCameraPos(1, 110, 110);
        } else {
            this.setCameraPos(0.5, 110, -110);
        }
        
        var ambientLight = new THREE.AmbientLight(0x0c0c0c);
        this.scene.add(ambientLight);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, 50);
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        this.renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance"});
        // this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;
        let devicePixelRatio = (window.devicePixelRatio > 1) ? 1 : window.devicePixelRatio;
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild( this.renderer.domElement );
    }

    setCameraPos(x, y, z) {
        
        this.camera.position.set(x, y, z);
        // this.camera.lookAt(this.scene.position);
        this.camera.lookAt(new THREE.Vector3(0.89, 0, 0));
        // this.camera.position.set(x - 5, y, z);
        console.log( this.camera.position )
    }

    render() {
        this.show();
    }

    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    show() {
        this.renderer.render(this.scene, this.camera);
    }

    addToScene(mesh) {
        this.scene.add(mesh);
    }

    removeFromScene(mesh) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh = undefined;
    }

    getScene() {
        return this.scene;
    }

    getDomElement() {
        return this.renderer.domElement;
    }

    getRenderer() {
        return this.renderer;
    }

    getCamera() {
        return this.camera;
    }

    getControls() {
        return this.controls;
    }
}