import { Chip } from './chip';
import { GameSettings } from 'src/app/game/game.settings';
import { ThreeCommon } from 'src/app/game/common';
declare var THREE: any;

export class Desk {
    desk;
    gameRenderer;
    deskPos = {x:0, y: 0}; 
    meshLoader;
    cells;
    chips;
    gameSettings = new GameSettings;
    common;
    highlights = [];

    constructor(gameRenderer, meshLoader, common) {
        this.gameRenderer = gameRenderer;
        this.meshLoader = meshLoader;
        this.cells = [];
        this.chips = [];
        this.common = common;
    }

    create(cells, chips) {
        this.deskPos.x = -(cells.length / 2) * this.gameSettings.cellSize.w + this.gameSettings.cellSize.w / 2;
        this.deskPos.y = -(cells[0].length / 2) * this.gameSettings.cellSize.h + this.gameSettings.cellSize.h / 2;
        this.createCells(cells);
        this.createChips(chips);
        this.createDesk(cells.length + 1);
    }

    restart(chips) {
        this.chips.forEach(c => {
            this.gameRenderer.removeFromScene(c.getMesh());
        });
        this.chips = [];
        this.createChips(chips);
    }

    removeHighlightCells() {
        this.highlights.forEach(h => {
            this.gameRenderer.removeFromScene(h); 
        });
        this.highlights = [];
    }

    highlightCell(cellName, to = false) {
        let c = this.getCellPosition(cellName),
            color = '#3a873c',
            cell;
        
        if (to) {
            cell = this.common.createCircleMesh(
                this.gameSettings.cellSize.w / 8,
                {x: -Math.PI / 2},
                color
            );
        } else {
            cell = this.common.createPlaneMesh(
                {w: this.gameSettings.cellSize.w, h: this.gameSettings.cellSize.h},
                {x: -Math.PI / 2},
                color
            );
        }
    
        cell.position.set(c.position.x, c.position.y + 0.1, c.position.z);
        this.highlights.push(cell);
        this.gameRenderer.addToScene(cell);   
    }

    createChips(chips) {
        for (let y = 0; y < chips.length; y++) {
            for (let x = 0; x < chips[y].length; x++) {
                let range = chips[y][x];

                if (range !== '0') {
                    let chip = new Chip(this.meshLoader, range, this.gameSettings);
                    this.gameRenderer.addToScene(chip.mesh);  
                    chip.setName([x, y]);
                    chip.moveTo(this.deskPos.x + x * this.gameSettings.cellSize.w, 0.1, this.deskPos.y + y * this.gameSettings.cellSize.h);
                    this.chips.push(chip);
                }
            }
        }
    }

    createCells(cells) {
        const deskX = -this.gameSettings.deskPlayZoneSize.w / 2 + this.gameSettings.cellSize.w / 2,
            deskY = -this.gameSettings.deskPlayZoneSize.h / 2 + this.gameSettings.cellSize.h / 2;

        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
                this.addCell(deskX + x * this.gameSettings.cellSize.w, deskY + y * this.gameSettings.cellSize.h, cells[x][y], [x, y]);
            }
        }
    }

    createDesk(cellsLength) {
        this.desk = this.common.createBoxMesh(
            {w: this.gameSettings.deskSize.w, h: this.gameSettings.deskSize.h, deep: this.gameSettings.deskSize.deep},
            {x: -Math.PI / 2},
            this.gameSettings.deskColor
        );
        this.desk.material.map = this.meshLoader.geom['treeTexture'];
        this.desk.position.set(this.gameSettings.deskPosition.x, this.gameSettings.deskPosition.y, this.gameSettings.deskPosition.z);
        this.desk.name = 'desk';
        this.desk.receiveShadow = true;
        this.gameRenderer.addToScene(this.desk);  
        this.addNumbers(cellsLength - 1);
        this.desk.material.map.wrapS = THREE.RepeatWrapping;
        this.desk.material.map.wrapT = THREE.RepeatWrapping;
        this.desk.material.map.repeat.set(0.5, 2);
        this.addBorder();
    }

    addNumbers(cellsLength) {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

        for (let y = 0; y < cellsLength; y++) {
            this.addNumber(0, y, (y + 1) + '', 'left');
            this.addNumber(8, y, (y + 1) + '', 'right');
            
            if ((y === 0) || (y === 7)) {
                for (let x = 0; x < cellsLength; x++) {
                    if (y === 0) { this.addNumber(x, y, letters[x], 'top'); }

                    if (y === 7) { this.addNumber(x, y, letters[x], 'bottom'); }
                }
            }
        }
    }

    addNumber(x, y, text, desc) {
        const deskX = -this.gameSettings.deskPlayZoneSize.w / 2,
            deskY = -this.gameSettings.deskPlayZoneSize.h / 2,
            cellSize = this.gameSettings.cellSize,
            fontSize = this.gameSettings.fontSize;
        const mesh = this.common.createText(text + '', this.meshLoader.geom['helvetica'], fontSize, '#382f23');
        this.gameRenderer.addToScene(mesh); 
        mesh.scale.set(0.5, 0.5, 0.5);

        switch (desc) {
            case 'right':
                mesh.position.set(deskX + x * cellSize.w + fontSize / 5.5, 0, deskY + y * cellSize.h + cellSize.h / 2);
                break;
            case 'left':
                mesh.position.set(deskX + x * cellSize.w - fontSize / 3, 0, deskY + y * cellSize.h + cellSize.h / 2);
                break;
            case 'bottom':
                mesh.position.set(deskX + x * cellSize.w + cellSize.w / 2 - fontSize / 15, 0, deskY + y * cellSize.h + cellSize.h + fontSize / 3);
                break;
            case 'top':
                mesh.position.set(deskX + x * cellSize.w + cellSize.w / 2 - fontSize / 15, 0, deskY + y * cellSize.h - fontSize / 5.5);
                break;
        }
    }

    addBorder() {
        const deskXL = -this.gameSettings.deskPlayZoneSize.w / 2,
            deskXR = this.gameSettings.deskPlayZoneSize.w / 2,
            deskTY = -this.gameSettings.deskPlayZoneSize.h / 2,
            deskTB = this.gameSettings.deskPlayZoneSize.h / 2,
            line = this.common.createLine([
                [deskXL, 0.15, deskTY], 
                [deskXR, 0.15, deskTY],
                [deskXR, 0.15, deskTB],
                [deskXL, 0.15, deskTB], 
                [deskXL, 0.15, deskTY]
            ],
            this.gameSettings.cellsColors['b']
        );

        this.gameRenderer.addToScene(line);
    }

    getDeskMesh() {
        return this.desk;
    }

    addCell(x, y, colorName, name) {
        const cell = this.common.createPlaneMesh(
            {w: this.gameSettings.cellSize.w, h: this.gameSettings.cellSize.h},
            {x: -Math.PI / 2},
            this.gameSettings.cellsColors[colorName]
        );

        if (colorName === 'b') {
            cell.material.opacity = 0.7;
        } else {
            cell.material.opacity = 0.4;
        }
 
        cell.position.set(x, 0.15, y);
        cell.name = name;
        cell.renderOrder = 2; //fix blend bug
        cell.receiveShadow = true;
        cell.meshType = 'cell';
        this.cells.push(cell);
        this.gameRenderer.addToScene(cell);  
    }

    getCellPosition(nameCell) {
        let cell;
        this.cells.forEach(c => {
            if (ThreeCommon.compareArrays(nameCell, c.name)) {
                cell = c;
            }
        });

        return cell;
    }

    getChip(chipName) {
        let chip;
        this.chips.forEach(c => {
            if (ThreeCommon.compareArrays(chipName, c.getName())) {
                chip = c;
            }
        });

        return chip;
    }
}