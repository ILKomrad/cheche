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
    chipsColors = {
        'w': 0xffffff, //w
        'ww': 0xffffff,
        'b': '#645247', //b
        'bb': '#645247'
    };
    deskColor = '#926b2b';
}