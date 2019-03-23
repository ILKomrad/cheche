var Checkers = require('./checkers');

class Giveaway extends Checkers {
    constructor() {
        super('giveaway');
    }

    checkValid(paths, step) {
        console.log('check', this.cells, paths, step);
    }
}

module.exports = Giveaway;