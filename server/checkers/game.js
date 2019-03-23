var Classic = require('./classic'),
    Giveaway = require('./giveaway');

class Game {
    generate(type) {
        switch (type) {
            case 'classic':
                return new Classic();
                break;
            case 'giveaway':
                return new Giveaway();
                break;
        }
    }
}

module.exports = new Game();