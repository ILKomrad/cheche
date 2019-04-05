declare var TWEEN: any;

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