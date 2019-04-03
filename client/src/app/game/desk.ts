import { Chip } from './chip';

export class Desk {
    desk;
    cellSize = {w: 10, h: 10};
    gameRenderer;
    common;
    deskPos = {x:0, y: 0};
    cellsColors = {
        'w': 0xe9bb6e,
        'b': 0x512d17
    };
    deskColor = '#926b2b';
    meshLoader;
    cells;
    chips;

    constructor(gameRenderer, common, meshLoader) {
        this.gameRenderer = gameRenderer;
        this.common = common;
        this.meshLoader = meshLoader;
        this.cells = [];
        this.chips = [];
    }

    create(cells, chips) {
        this.deskPos.x = -(cells.length / 2) * this.cellSize.w + this.cellSize.w / 2;
        this.deskPos.y = -(cells[0].length / 2) * this.cellSize.h + this.cellSize.h / 2;
        
        this.createCells(cells);
        this.createChips(chips);
        this.createDesk(cells.length + 1);
    }

    createChips(chips) {
        for (let y = 0; y < chips.length; y++) {
            for (let x = 0; x < chips[y].length; x++) {
                let range = chips[y][x];

                if (range !== 0) {
                    let chip = new Chip(this.meshLoader, range);
                    this.gameRenderer.addToScene(chip.mesh);  
                    chip.setName([x, y]);
                    chip.moveTo(this.deskPos.x + x * this.cellSize.w, 0.1, this.deskPos.y + y * this.cellSize.h);
                    this.chips.push(chip);
                }
            }
        }
    }

    createCells(cells) {
        const deskX = -(cells.length / 2) * this.cellSize.w + this.cellSize.w / 2,
            deskY = -(cells[0].length / 2) * this.cellSize.h + this.cellSize.h / 2;

        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
                let color = this.cellsColors[cells[x][y]];
                this.addCell(deskX + x * this.cellSize.w, deskY + y * this.cellSize.h, color, [x, y]);
            }
        }
    }

    createDesk(cellsLength) {
        this.desk = this.common.createBoxMesh(
            {w: this.cellSize.w * cellsLength, h: this.cellSize.h * cellsLength, deep: 4},
            {x: -Math.PI / 2},
            this.deskColor
        );
        this.desk.position.set(0, -2, 0);
        this.desk.name = 'desk';
        this.desk.receiveShadow = true;
        this.gameRenderer.addToScene(this.desk);  
    }

    getDeskMesh() {
        return this.desk;
    }

    addCell(x, y, color, name) {
        const cell = this.common.createPlaneMesh(
            {w: this.cellSize.w, h: this.cellSize.h},
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