declare var THREE: any;

export class ThreeCommon {
    createBoxMesh(size, rotation, color) {
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true
        });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.w, size.h, size.deep), bodyMaterial);
        
        if (rotation) {
            if (rotation.x) { mesh.rotation.x = -Math.PI / 2; }
        }
        
        return mesh;
    }

    createPlaneMesh(size, rotation, color) {
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size.w, size.h), bodyMaterial);
        
        if (rotation) {
            if (rotation.x) { mesh.rotation.x = -Math.PI / 2; }
        }
        
        return mesh;
    }

    compareArrays(firstArray, secondArray) {
        if (firstArray.length !== secondArray.length) { return; }

        let flag = true;
        firstArray.forEach((i, index) => {
            if (i !== secondArray[index]) {
                flag = false;
            }
        });

        return flag;
    }
}