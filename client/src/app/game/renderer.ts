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
    angle = 0;
    radius = 500;
    spotLight;

    createEnvironment(range, container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.add(this.camera);
        this.range = range;
        this.addLight();

        if (range === 'b') {
            // spotLight.position.set(0, 90, 100);
        } 

        this.renderer = new THREE.WebGLRenderer({antialias: true, powerPreference: "high-performance"});
        // this.renderer.sortObjects = true;
        // this.renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
        // this.renderer.setClearColor( 0xffffff, 1 );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;
        let devicePixelRatio = (window.devicePixelRatio > 1) ? 1 : window.devicePixelRatio;
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild( this.renderer.domElement );
        this.setInitialCamera();
    }

    addLight() {
        var ambientLight = new THREE.AmbientLight(0x3a3a3a);
        this.scene.add(ambientLight);
        ambientLight.intensity = 0.3;

        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight(0xe0e0e0);
        // this.spotLight.position.set(0, 39, 65);
        this.spotLight.angle = 1;
        this.spotLight.position.set(0, 20, 0);
        this.spotLight.intensity = 0;
        this.spotLight.distance = 0;
        this.spotLight.penumbra = 0.5;
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);
    }

    getLight() {
        return this.spotLight;
    }

    setInitialCamera() {
        this.setCameraPos(250, 80, 0);
        this.camera.fov = 20;
        this.camera.lookAt(new THREE.Vector3(0.89, -10, 0));
        this.camera.updateProjectionMatrix();
    }

    getCameraPos() {
        if (this.range === 'w') {
            return {x: 1, y: 110, z: 110};
        } else {
            return {x: 0.5, y: 110, z: -110};
        }
    }

    setCamera() {
        if (this.range === 'w') {
            this.setCameraPos(1, 110, 110);
        } else {
            this.setCameraPos(0.5, 110, -110);
        }
    }

    setCameraPos(x, y, z) {
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0.89, -10, 0));
    }

    zoomTo(pos) {
        this.camera.position.x = pos.x;
        this.camera.lookAt(new THREE.Vector3(pos.x, pos.y + 6, pos.z));
        this.camera.fov *= 0.199;
        this.camera.updateProjectionMatrix();
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