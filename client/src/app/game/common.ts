declare var THREE: any;

export class ThreeCommon {
    createBoxMesh(size, rotation, color) {
        const bodyMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            // depthWrite: false,
            // blending: THREE.CustomBlending,
            color: color,
            // blendSrc: THREE.OneFactor
        });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.w, size.h, size.deep), bodyMaterial);
        
        if (rotation) {
            if (rotation.x) { mesh.rotation.x = -Math.PI / 2; }
        }
        
        return mesh;
    }

    createPlaneMesh(size, rotation, color) {
        const bodyMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            // depthWrite: false,
            // blending: THREE.CustomBlending,
            color: color,
            // blendSrc: THREE.OneFactor
        });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size.w, size.h), bodyMaterial);
        
        if (rotation) {
            if (rotation.x) { mesh.rotation.x = -Math.PI / 2; }
        }
        
        return mesh;
    }

    createCircleMesh(r, rotation, color) {
        const bodyMaterial = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true
            }),
            mesh = new THREE.Mesh(new THREE.CircleGeometry(r, 32), bodyMaterial);
        
        if (rotation) {
            if (rotation.x) { mesh.rotation.x = -Math.PI / 2; }
        }
        
        return mesh;
    }

    static compareArrays(firstArray, secondArray) {
        if (firstArray.length !== secondArray.length) { return; }
        
        let flag = true;
        firstArray.forEach((i, index) => {
            if (i !== secondArray[index]) {
                flag = false;
            }
        });
        
        return flag;
    }

    createText(text, font, fontSize, color) {
        var geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 3,
            height: 0.1,
            // curveSegments: 12,
            // bevelEnabled: true,
            // bevelThickness: 10,
            // bevelSize: 2,
            // bevelOffset: 0,
            // bevelSegments: 5
        });

        const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: color, transparent: true}));
        mesh.rotation.x = -Math.PI / 2;

        return mesh;
    }

    createLine(lines, color) {
        var material = new THREE.LineDashedMaterial({
            color: color,
            linewidth: 55
        });
        
        var geometry = new THREE.Geometry();
        lines.forEach(line => {
            geometry.vertices.push(new THREE.Vector3(line[0], line[1], line[2]))
        });
        
        var line = new THREE.Line( geometry, material );

        return line;
    }

    static copyArray(array) {
        let arr = [];

        array.forEach(a => {
            let type = {}.toString.call(a).slice(8, -1);

            if (type === 'Array') {
                arr.push(ThreeCommon.copyArray(a));
            } else if (type === 'Object') {
                arr.push(ThreeCommon.copyObj(a));
            } else {
                arr.push(a);
            }
        });

        return arr;
    }

    static copyObj(obj) {
        let arr = {};

        for (let i in obj) {
            let type = {}.toString.call(obj[i]).slice(8, -1);
            
            if (type === 'Array') {
                arr[i] = ThreeCommon.copyArray(obj[i]);
            } else {
                arr[i] = obj[i];
            }
        }

        return arr;
    }
}