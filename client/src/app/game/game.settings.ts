export class GameSettings {
    deskSize = {w: 90, h: 90, deep: 4};
    deskPlayZoneSize = {w: 80, h: 80};
    deskPosition = {x: 0, y: -this.deskSize.deep / 2, z: 0};
    cellSize = {
        w: 10,
        h: 10
    };
    cellsColors = {
        'w': 0xe9bb6e,
        'b': 0x512d17
    };
    deskColor = '#926b2b';
}