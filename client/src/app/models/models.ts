export class User {
    constructor(
        public id = null,
        public category = null,
        public name = null,
        public playerId = false,
        public currentMeetingId = null,
        public inGame = null
    ) {}
}

export class Meeting {
    constructor(
        public id = null,
        public currentGame = null,
        public games = null,
        public isStart = null,
        public score = null,
        public secondPlayer = null,
        public firstPlayer = null
    ) {}
}