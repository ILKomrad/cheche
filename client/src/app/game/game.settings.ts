export class GameSettings {
    deskSize = {w: 90, h: 90, deep: 4};
    deskPlayZoneSize = {w: 80, h: 80};
    deskPosition = {x: 0, y: -this.deskSize.deep / 2, z: 0};
    cellSize = {
        w: 10,
        h: 10
    };
    fontSize = 10;
    cellsColors = {
        'w': '#fff',
        'b': '#412e2a'
    };
    chipsColors = {
        'w': '#f6ebdb', //w
        'ww': '#f6ebdb',
        'b': '#382f23', //b
        'bb': '#382f23'
    };
    deskColor = '#f9deab';
}