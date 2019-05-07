declare var TWEEN: any;
declare var THREE: any;

export class Animator {
    sound;

    constructor(sound) {
        this.sound = sound;
    }

    async animationMove(objPosition, to) {
        let startPos = Object.assign({}, objPosition);
        await this.move(objPosition, {x: startPos.x, y: startPos.y + 5, z: startPos.z});
        await this.move(objPosition, {x: to.x, y: to.y + 5, z: to.z});
        await this.move(objPosition, {x: to.x, y: to.y, z: to.z});
    }

    async removeFromDesk(material) {
        await this.fadeOut(material);
    }

    async transformToQueen(obj) {
        let startY = obj.position.y;
        await this.moveWithRotate(obj, {y: startY + 12}, Math.PI);
        await this.move(obj.position, {x: obj.position.x, y: startY + 1, z: obj.position.z}).then(() => {
            obj.position.y = startY;
            obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -1, 0))
        });
    }

    fadeOut(material) {
        let to = {val: 0},
            from = {val: material.opacity};

        return new Promise((res) => {
            const tween = new TWEEN.Tween(from)
                .to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    material.opacity = from.val;
                })
                .onComplete(() => {
                    res();
                })
                .start();
        })
    }

    moveWithRotate(obj, posTo, rotation) {
        let from = {y: obj.position.y},
            rotationTo = rotation,
            startRotation = obj.rotation.x;

        return new Promise((res) => {
            const tween = new TWEEN.Tween(from)
                .to(posTo, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    let pers;
                    
                    if (from.y <= posTo.y) {
                        pers = from.y / posTo.y;
                    } else {
                        pers = posTo.y / from.y;
                    }

                    obj.position.y = from.y;
                    obj.rotation.x = startRotation + rotation * pers;
                })
                .onComplete(() => {
                    res();
                })
                .start();
        })
    }

    move(from, to) {
        return new Promise((res) => {
            const tween = new TWEEN.Tween(from)
                .to(to, 350)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    res();
                })
                .start();
        })
    }

    zoomTo(camera, pos, toFov, zoomOut, startZoom) {
        const finishPos = {x: pos.x, y: pos.y, z: pos.z},
            cameraStartX = camera.position.x,
            fromFov = {f: camera.fov},
            startFov = camera.fov,
            deltaCameraX = finishPos.x - cameraStartX,
            lookAt = {
                delta: {x: zoomOut.x - startZoom.x, y: zoomOut.y - startZoom.y, z: zoomOut.z - startZoom.z},
                start: {x: startZoom.x, y: startZoom.y, z: startZoom.z}
            },
            fovDelta = Math.abs(toFov.f - startFov);

        return new Promise((res) => {
            const tween = new TWEEN.Tween(fromFov)
                .to(toFov, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    let pers = 1 - (Math.abs(toFov.f - fromFov.f) / fovDelta);
                    camera.position.x = cameraStartX + deltaCameraX * pers;
                    camera.lookAt(new THREE.Vector3(lookAt.start.x + lookAt.delta.x * pers, lookAt.start.y + lookAt.delta.y * pers, lookAt.start.z + lookAt.delta.z * pers));
                    camera.fov = fromFov.f;
                    camera.updateProjectionMatrix();
                })
                .onComplete(() => {
                    res();
                })
                .start();
        });
    }

    soundDump(soundName, duration) {
        let from = {v: 1},
            to = {v: 0};

        return new Promise((res) => {
            const tween = new TWEEN.Tween(from)
                .to(to, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    this.sound.setVolume(from.v, soundName);
                })
                .onComplete(() => {
                    res();
                })
                .start();
        });
    }

    lightGlitter(light) {
        let from = {x: 0},
            to = {x: 1000};
        this.sound.reproduceSound('lamp');
        this.soundDump('lamp', 3000);

        return new Promise((res) => {
            const tween = new TWEEN.Tween(from)
                .to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    light.intensity = this.getRandom(0, 1.2);
                    light.distance = this.getRandomInt(0, 200);
                    light.penumbra = Math.random() + 0.5;
                })
                .onComplete(() => {
                    res();
                })
                .start();
        });
    }

    lightOn(light) {
        let from = light.position,
            to = {x: 0, y: 100, z: 0};  
        light.intensity = 1.2;
        light.distance = 200;
        light.penumbra = 0.5;

        return new Promise((res) => {
            const tween = new TWEEN.Tween(from)
                .to(to, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    res();
                })
                .start();
        });
    }

    rotateCamera(camera, cameraPos) {
        let from = camera.position,
            to = cameraPos,
            deltaY = to.y - camera.position.y,
            fromFov = 20,
            toFov = 32,
            deltaFov = toFov - fromFov;

        return new Promise((res) => {
            const tween = new TWEEN.Tween(from)
                .to(to, 2500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    let pers = 1 - (Math.abs(to.y - from.y) / deltaY);
                    camera.fov = fromFov + deltaFov * pers;
                    camera.updateProjectionMatrix();
                    camera.lookAt(new THREE.Vector3(0.89, -15, 0));
                })
                .onComplete(() => {
                    res();
                })
                .start();
        });
    }

    async renderAnimation(camera, light, rotateCamera) {    
        await this.lightGlitter(light);
        this.lightOn(light);
        await this.rotateCamera(camera, rotateCamera);
    }

    getRandomInt(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);

        return rand;
    }

    getRandom(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1)
        
        return rand;
    }

    degreesToRadians(degrees) {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
}