declare var TWEEN: any;
declare var THREE: any;

export class Animator {
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
                .to(to, 500)
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
}