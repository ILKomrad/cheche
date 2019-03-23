var Checkers = require('./checkers');

class Classic extends Checkers {
    constructor() {
        super('classic');
    }

    checkValid(paths, step) {
        console.log('check', this.cells, paths, step);
    }
}

module.exports = Classic;