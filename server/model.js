var fetch = require('node-fetch');

class Http {
    constructor(url) {
        this.url = url;
    }

    send(url) {
        return fetch(url)
            .then(res => res.text());
    }

    sendPost(data) {
        return fetch(this.url, {
            method: "POST",
            mode: "same-origin",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.text());
    }
}

class Model {
    constructor(url) {
        this.url = url;
        this.http = new Http(url);
    }

    getUser(userId, email = false) {
        let url;
        
        if (email) {
            url = this.url + '?action=getUser&email=' + email;
        } else {
            url = this.url + '?action=getUser&id=' + userId;
        }

        return this.http.send(url);
    }

    getMeetings(currentMeetingId) {
        let url;

        if (currentMeetingId) {
            url = this.url + '?action=getMeetings&currentMeetingId=' + currentMeetingId;
        } else {
            url = this.url + '?action=getMeetings';
        }

        return this.http.send(url);
    }

    getMeetingById(id) {
        let url = this.url + '?action=getMeetingById&id=' + id;

        return this.http.send(url);
    }

    addGame(game) {
        return this.http.sendPost({
            addGame: {
                type: game.type,
                cells: JSON.stringify(game.cells),
                paths: JSON.stringify(game.paths),
                hitsChips: JSON.stringify(game.hitsChips),
                whoseTurn: game.whoseTurn,
                whoWin: game.whoWin,
                players: JSON.stringify(game.players)
            }
        });
    }

    getGame(id) {
        let url = this.url + '?action=getGame&id=' + id;

        return this.http.send(url);
    }

    addMeeting(meeting) {
        return this.http.sendPost({
            addMeeting: {
                games: JSON.stringify(meeting.games),
                isStart: false,
                score: JSON.stringify(meeting.score),
                firstPlayer: meeting.firstPlayer,
                currentGame: JSON.stringify(meeting.getCurrentGame())
            }
        });
    }

    removeMeeting(meetingId) {
        return this.http.sendPost({
            removeMeeting: {
                id: meetingId
            }
        });
    }

    removeGame(id) {
        return this.http.sendPost({
            removeGame: {
                id
            }
        });
    }

    leaveMeeting(id) {
        return this.http.sendPost({
            leaveMeeting: {
                id
            }
        });
    }

    startMeeting(meeting) {
        return this.http.sendPost({
            startMeeting: {
                score: JSON.stringify(meeting.score),
                secondPlayer: meeting.secondPlayer,
                meetingId: meeting.id
            }
        });
    }

    startGame(game) {
        return this.http.sendPost({
            startGame: {
                players: JSON.stringify(game.players),
                gameId: game.id,
                whosTurn: game.players[0].id
            }
        });
    }

    checkIn(user) {
        return this.http.sendPost({
            addPlayer: user
        });
    }

    logout(id, socketId) {
        if (id) {
            return this.http.sendPost({
                logout: {id}
            });
        } else {
            return this.http.sendPost({
                logout: {
                    id: null,
                    socketId
                }
            });
        }
    }

    setMeetingToUser(userId, meetingId, gameId) {
        return this.http.sendPost({
            setCurrentGameToUser: {userId, meetingId, gameId}
        });
    }

    setSocketId(playerId, socketId) {
        return this.http.sendPost({
            setSocketId: {playerId, socketId}
        });
    }
}

module.exports = (url) => new Model(url);