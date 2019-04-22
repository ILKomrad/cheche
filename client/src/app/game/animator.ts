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

    async transformToQueen(obj, rightNow) {
        if (rightNow) {
            obj.rotation.x = Math.PI;
            obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -1, 0))
        } else {
            let startY = obj.position.y;
            await this.moveWithRotate(obj, {y: startY + 12}, Math.PI);
            await this.move(obj.position, {x: obj.position.x, y: startY + 1, z: obj.position.z}).then(() => {
                obj.position.y = startY;
                obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -1, 0))
            });
        }
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
}