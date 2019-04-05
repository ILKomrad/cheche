import { Chip } from './chip';
import { Animator } from './animator';

export class Desk {
    desk;
    gameRenderer;
    common;
    deskPos = {x:0, y: 0}; 
    meshLoader;
    cells;
    chips;
    animator;
    gameSettings;

    constructor(gameRenderer, common, meshLoader, gameSettings) {
        this.gameRenderer = gameRenderer;
        this.common = common;
        this.meshLoader = meshLoader;
        this.cells = [];
        this.chips = [];
        this.animator = new Animator();
        this.gameSettings = gameSettings;
    }

    create(cells, chips) {
        this.deskPos.x = -(cells.length / 2) * this.gameSettings.cellSize.w + this.gameSettings.cellSize.w / 2;
        this.deskPos.y = -(cells[0].length / 2) * this.gameSettings.cellSize.h + this.gameSettings.cellSize.h / 2;
        
        this.createCells(cells);
        this.createChips(chips);
        this.createDesk(cells.length + 1);
    }

    createChips(chips) {
        for (let y = 0; y < chips.length; y++) {
            for (let x = 0; x < chips[y].length; x++) {
                let range = chips[y][x];

                if (range !== 0) {
                    let chip = new Chip(this.meshLoader, range, this.animator);
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
                let color = this.gameSettings.cellsColors[cells[x][y]];
                this.addCell(deskX + x * this.gameSettings.cellSize.w, deskY + y * this.gameSettings.cellSize.h, color, [x, y]);
            }
        }
    }

    createDesk(cellsLength) {
        this.desk = this.common.createBoxMesh(
            {w: this.gameSettings.deskSize.w, h: this.gameSettings.deskSize.h, deep: this.gameSettings.deskSize.deep},
            {x: -Math.PI / 2},
            this.gameSettings.deskColor
        );
        this.desk.position.set(this.gameSettings.deskPosition.x, this.gameSettings.deskPosition.y, this.gameSettings.deskPosition.z);
        this.desk.name = 'desk';
        this.desk.receiveShadow = true;
        this.gameRenderer.addToScene(this.desk);  
    }

    getDeskMesh() {
        return this.desk;
    }

    addCell(x, y, color, name) {
        const cell = this.common.createPlaneMesh(
            {w: this.gameSettings.cellSize.w, h: this.gameSettings.cellSize.h},
            {x: -Math.PI / 2},
            color
        );
        cell.position.set(x, 0.1, y);
        cell.name = name;
        cell.receiveShadow = true;
        cell.meshType = 'cell';
        this.cells.push(cell);
        this.gameRenderer.addToScene(cell);    
    }

    getCellPosition(nameCell) {
        let cell;
        this.cells.forEach(c => {
            if (this.common.compareArrays(nameCell, c.name)) {
                cell = c;
            }
        });

        return cell;
    }

    getChip(chipName) {
        let chip;
        this.chips.forEach(c => {
            if (this.common.compareArrays(chipName, c.getName())) {
                chip = c;
            }
        });

        return chip;
    }
}