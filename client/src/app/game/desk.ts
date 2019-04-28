import { Chip } from './chip';
import { ThreeCommon } from 'src/app/game/common';
import { GameSettings } from 'src/app/game/game.settings';
// w = 1 b = 2
export class Desk {
    desk;
    gameRenderer;
    deskPos = {x:0, y: 0}; 
    meshLoader;
    cells;
    chips;
    gameSettings = new GameSettings;
    common = new ThreeCommon();
    highlights = [];

    constructor(gameRenderer, meshLoader) {
        this.gameRenderer = gameRenderer;
        this.meshLoader = meshLoader;
        this.cells = [];
        this.chips = [];
    }

    create(cells, chips) {
        this.deskPos.x = -(cells.length / 2) * this.gameSettings.cellSize.w + this.gameSettings.cellSize.w / 2;
        this.deskPos.y = -(cells[0].length / 2) * this.gameSettings.cellSize.h + this.gameSettings.cellSize.h / 2;
        
        this.createCells(cells);
        this.createChips(chips);
        this.createDesk(cells.length + 1);
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