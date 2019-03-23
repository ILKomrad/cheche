var game = require('./checkers/game'),
    secretKey = 'checkers-checkers-checkers-checkers-secret',
    Meeting = require('./checkers/meeting'),
    jwt = require('jsonwebtoken'),
    sessionTime = '365d'; //60 = 1minute '2h' - 2hours '365d' - год

class Controller {
    constructor(model) {
        this.model = model;
        this.game = game;
    }

    checkTocken(token) {
        return new Promise((res, rej) => {
            try {
                if (token) {
                    const decoded = jwt.verify(token, secretKey);
                    res(decoded);
                } else {
                    res(false); //'not auth'
                }
            } catch (err) {
                res(false); //token invalid
            }
        });
    }

    getUserByToken(token) {
        return new Promise(res => {
            this.checkTocken(token)
            .then(decoded => {
                if (decoded) {
                    this.model.getUser(decoded.id)
                    .then(event => {
                        if (event && (event !== '0 results')) {
                            const data = JSON.parse(event)[0];
                            res(data);
                        } else {
                            res();
                        }
                    });
                } else {
                    res();
                }
            })
        })
    }

    setSocketId(playerId, socketId) {
        return this.model.setSocketId(playerId, socketId);
    }

    getUpdatedUser(socketId, token) {
        return new Promise((res, rej) => {
            this.getUserByToken(token)
            .then(user => {
                if (user) {
                    this.setSocketId(user.id, socketId);
                    res(new User(user.id, user.name, user.category, token, user.currentMeetingId, user.inGame));
                } else {
                    res();
                }
            })
        });
    }

    login(player, socketId) {
        return new Promise((res, rej) => {
            this.model.getUser(null, player.email)
            .then((event) => {
                if (event === '0 results') {
                   res(false); //player not finded
                } else {
                    const user = JSON.parse(event)[0];
 
                    if (player.password === user.password) {
                        const token = jwt.sign({
                            id: user.id,
                            email: user.email
                        }, secretKey, { expiresIn: sessionTime });
                        this.setSocketId(user.id, socketId);
                        res(new User(user.id, user.name, user.category, token, user.currentMeetingId, user.inGame)); //ok
                    } else {
                        res(false); //password invalid
                    }
                }
            })
        })
    }

    logout(id, socketId) {
        this.model.logout(id, socketId);
    }

    checkIn(user) {
        return new Promise((res, rej) => {
            this.model.checkIn(user)
            .then((event) => {
                const data = JSON.parse(event);
                res(data);
            })
        });
    }

    async hello(socketId, token) {
        let data = {mettings: []};
        
        if (token) { data['user'] = await this.getUpdatedUser(socketId, token); }
        
        data.mettings = await this.getMeetings(data['user']);
        
        return data;
    }

    async newMeeting(type, user) {
        let meeting, game;
        const _user = await this.getUserByToken(user.playerId);

        if (_user) { game = await this.createNewGame(_user, type); }

        if (game) { meeting = await this.createNewMeeting(_user, game); }
    
        if (meeting) { this.model.setMeetingToUser(_user.id, meeting.id, game.id); }
       
        return Promise.resolve({meeting, game});
    }

    async selectMeeting(token, meetingId) {
        const user = await this.getUserByToken(token);

        if (user) {
            const data = await this.getMeetingById(meetingId),
                meeting = this.transformMeeting(data)[0];
            const currentGame = await this.getGame(meeting.currentGame.id);
            this.model.setMeetingToUser(user.id, meeting.id, currentGame.id);

            if (meeting.isStart !== 1) {
                if (meeting.score.length === 1) { 
                    meeting.score.push({id: user.id, name: user.name, category: user.category}); 
                }
                meeting.secondPlayer = user.id;
                meeting.currentGame = currentGame;
                this.model.startMeeting(meeting);
                
                if (currentGame.players.length === 1) { 
                    currentGame.players.push({ id: user.id, range: 'b' });
                }
                this.model.startGame(currentGame);
                
                return Promise.resolve(meeting);
            } else {
                return Promise.resolve(null);
            }
        } else {
            return Promise.resolve(null);
        }
    }

    getMeetingById(meetingId) {
        return new Promise(res => {
            this.model.getMeetingById(meetingId)
            .then(meeting => {
                if (meeting) {
                    meeting = JSON.parse(meeting);
                }
                res(meeting);
            });
        });
    }

    createNewGame(user, type) {   
        return new Promise(res => {
            const game = this.game.generate(type);
            game.init();
            game.addPlayer(user.id);
        
            this.model.addGame(game).then(gameId => {
                game.id = gameId;
                res(game);
            })
        });
    }

    createNewMeeting(user, game) {
        return new Promise(res => {
            const meeting = new Meeting();
            meeting.addPlayer({id: user.id, name: user.name, category: user.category});
            meeting.setCurrentGame(game.id, game.type);
            meeting.addGame(game);
            meeting.firstPlayer = user.id;

            this.model.addMeeting(meeting, user.id).then(meetingId => {
                meeting.setId(meetingId);
                res(meeting);
            })
        });
    }

    async removeMeeting(token) {
        const user = await this.getUserByToken(token);
        this.model.removeMeeting(user.currentMeetingId);
        this.model.removeGame(user.inGame);
        this.model.leaveMeeting(user.id);
        
        return Promise.resolve(user.currentMeetingId);
    }

    newGame() {
        const game = this.game.generate('classic');
        game.init();
        game.checkValid({d: 'd'}, {ds: 'ds'});
    }

    getGame(id) {
        return new Promise(res => {
            this.model.getGame(id).then(data => {
                const game = JSON.parse(data)[0];
                game.cells = JSON.parse(game.cells);
                game.hitsChips = JSON.parse(game.hitsChips);
                game.paths = JSON.parse(game.paths);
                game.players = JSON.parse(game.players);

                res(game);
            })
        });
    }

    async getMeetings(user) {
        const data = await this.model.getMeetings();
        let currentGame;
      
        if (!data || (data === '0 results')) { return Promise.resolve([]); }

        if (user && user.inGame) { 
            currentGame = await this.getGame(user.inGame);
        }
        
        const parseData = JSON.parse(data);
        const meetings = parseData.map(m => {
            const meeting = {
                id: m.id,
                isStart: m.isStart,
                score: JSON.parse(m.score),
                firstPlayer: m.firstPlayer,
                secondPlayer: m.secondPlayer,
                currentGame: JSON.parse(m.currentGame)
            }

            if (currentGame && (m.id === user.currentMeetingId)) {
                meeting.currentGame = currentGame;
            }

            return meeting;
        });
        
        return Promise.resolve(meetings);
    }

    transformMeeting(data) {
        const meetings = data.map(m => {
            const meeting = {
                id: m.id,
                isStart: m.isStart,
                score: JSON.parse(m.score),
                firstPlayer: m.firstPlayer,
                secondPlayer: m.secondPlayer,
                currentGame: JSON.parse(m.currentGame)
            }

            return meeting;
        });

        return meetings;
    }
}

class User {
    constructor(id, name, category, playerId, currentMeetingId, inGame) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.playerId = playerId;
        this.currentMeetingId = currentMeetingId;
        this.inGame = inGame;
    }
}

module.exports = (model) => new Controller(model);

/*
страница списка встреч
  client
    берем айди playerId из кук и шлем на сервер хелло {cmd: 'helloFromList', playerId: playerId}
  server
    если playerId есть то находим игрока player из базы, проверяем player.token, если все ок то обновялем сокетайди в базе;
    берем встречи из бд, фильтруем те в которых есть клиент и шлем на клиент {cmd: 'helloFromServer', meetings: meetings}
  client
    на событие helloFromServer показыавем встречи
нажали создать игру
  client
    если есть playerId то шлем {cmd: 'newGame', gameType: 'classic', playerId: playerId}
  server
    проверяем игрока
    создаем встречу meeting, создаем игру game, устанавливаем meeting.currentGame = game, meeting.games.push(game),
    meeting.score.push({id: playerId(айди создателя), wins: 0}) шлем всем (кроме создателя) эту новую встречу. 
    Записываем в базу новую встречу, на сервере нигде не храним; записываем в базу игроку currentMeetingId айди этой новой встречи *1
нажали start
  client
    {cmd: 'startMeeting', meetingId: meetingId, playerId: playerId}
  server
    находим игрока player по playerId; находим встречу meeting по meetingId если meeting.score.length === 1 
    то meeting.score.push({id: player.id, wins: 2});
    находим игру game по meeting.currentGameId, устанавливаем meeting.currentGame = game;
    меняем meeting.score в базе данных, перебираем игроков встречи meeting.score и устанавливаем у всех игроков 
    currentMeetingId = meeting.id;
    шлем {cmd: 'startMeeting', meeting: meeting} всем из списка meeting.score;
  client
    на событие startMeeting переходим на страницу игры и устанавливаем в модель model.meeting = meeting;
страница игры
  client
    берем айди playerId из кук и {cmd: 'helloFromGame', playerId: playerId}
  server
    находим игрока player по playerId, находим встречу meeting по player.currentMeetingId, находим игру game по meeting.currentGameId
    и устанавливаем meeting.currentGame = game;
    устанавливаем свежий сокет айди у игрока в базе
    шлем {cmd: 'hello', meeting: meeting}
  client 
    устанавливаем model.meeting = meeting, model.game = model.meeting.currentGame на событие hello
делаем шаг
  client 
    {cmd: 'makeStep', playerId: playerId, gameId: model.game.id, step: step}
  server
    находим игру game по gameId;
    находим игрока player по playerId, проверяем игрока, сравниваем game.whosTurnId и playerId чтобы проверить что его ли шаг
    проверяем валидность шага, если все ок то меняем paths в game.paths, меняем game.whosTurnId на айди второго игрока
    записываем в базу game.paths и game.whosTurnId, 
    шлем игрокам {cmd: 'step', game: game} *2

база данных
  player
    id, currentMeetingId, name, разряд, описание(необязательно), socketId
    id - генерируем на серваке через uniqid
    если socketId === 0 то офлайн
  game
    id, score, paths, hits, whosTurn, whosWin, type
    score - количество убитых шашек
  meeting
    id, currentGameId, games, score
    score - количество побед

class Meeting {
  constructor() {
    this.games = [];
  }

  setCurrentGame(game) {
    this.currentGame = game;
  }

  addGame(game) {
    this.games.push(game);
  }

  addPlayer(playerId) {
    this.score.push({
      id: playerId,
      win: 0
    })
  }
}

*1 - сервер в ответ на {cmd: 'newGame', gameType: 'classic', playerId: playerId}
  получаем игрока из бд
    проверяем игрока;
  создаем игру 
    var game = new Game(gameType);
    записываем в базу данных игру, и получаем айди игры gameId;
  создаем встречу
    var meeting = new Meeting();
    meeting.addPlayer(playerId); 
    meeting.addGame(gameId);
    meeting.setCurrentGame(game);
    записываем в базу данных встречу
  устанавливаем игроку currentMeetingId в базе данных
  
  {cmd: 'newGame', meeting: meeting}

*2 - сервер в ответ на {cmd: 'makeStep', playerId: playerId, gameId: gameId, step: step}
  находим игрока player по playerId;
  проверяем игрока;
  находим игру game по gameId;
  проверяем имеет ли право игрок ходить
  создаем обьект шашек checkers по game.type
  проверяем валидность checkers.checkValid(step);

авторизация
  клиент
    {cmd: 'auth', password: 123, email: 'dddd'}
  сервер
    находим игрока player по email, сверяем пароли;
    формируем токен token из player.email и player.id
    {cmd: 'auth', token: token}
  клиент
    сохраняем token в playerId в куки. То есть в playerId на самом деле токен

проверка игрока
  сервер
    получаем playerId это же токен token, проверяем token; находим игрока player по token.id и token.email
*/