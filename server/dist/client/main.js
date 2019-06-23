(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./game/game.module": [
		"./src/app/game/game.module.ts",
		"game-game-module"
	],
	"./meetings/meetings.module": [
		"./src/app/meetings/meetings.module.ts",
		"meetings-meetings-module"
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}
	return __webpack_require__.e(ids[1]).then(function() {
		var id = ids[0];
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var routes = [
    {
        path: '',
        redirectTo: 'meetingList',
        pathMatch: 'full'
    },
    {
        path: 'meetingList',
        loadChildren: './meetings/meetings.module#MeetingsModule'
    },
    {
        path: 'game',
        loadChildren: './game/game.module#GameModule'
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <app-user-area></app-user-area> -->\n<router-outlet></router-outlet>"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  display: block;\n  height: 100%; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pbGEvRG9jdW1lbnRzL3Byb2dyYW0vYW5nL2NoZWNrZXJzL25ldy9jbGllbnQvc3JjL2FwcC9hcHAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxlQUFjO0VBQ2QsYUFBWSxFQUNmIiwiZmlsZSI6InNyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGhlaWdodDogMTAwJTtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_http_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var src_app_services_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var src_app_services_meetings_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/meetings.service */ "./src/app/services/meetings.service.ts");
/* harmony import */ var src_app_services_sound_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/sound.service */ "./src/app/services/sound.service.ts");








var AppComponent = /** @class */ (function () {
    function AppComponent(httpService, authService, dataService, meetingService, router, soundService) {
        this.httpService = httpService;
        this.authService = authService;
        this.dataService = dataService;
        this.meetingService = meetingService;
        this.router = router;
        this.soundService = soundService;
        this.title = 'client';
        this.init = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.init) {
            this.init = true;
            this.soundService.startLoad();
            this.httpService.sendMessage('hello', { playerId: this.authService.getTocken() });
            this.httpService.listen('helloFromServer').subscribe(function (data) {
                _this.dataService.start();
                if (data.user === undefined) {
                    _this.authService.logout();
                }
                else {
                    _this.authService.setUser(data.user);
                }
                _this.dataService.setData(data.mettings);
                if (!data.currentMeeting && !data.currentGame) {
                    _this.router.navigate(['/']);
                }
                else {
                    _this.dataService.setCurrentMeeting(data.currentMeeting, data.currentGame);
                }
                _this.httpService.listen('currentMeeting')
                    .subscribe(function (data) {
                    _this.dataService.setCurrentMeeting(data.currentMeeting, data.currentGame);
                });
                _this.httpService.listen('newMeeting')
                    .subscribe(function (data) {
                    _this.dataService.addData(data);
                });
                _this.httpService.listen('meetingCreated')
                    .subscribe(function (data) {
                    if (!_this.authService.bot) {
                        _this.dataService.addData(data.meeting);
                    }
                    _this.dataService.setCurrentMeeting(data.meeting, data.game);
                    _this.router.navigate(['/game']);
                    _this.authService.inGame(data.meeting, data.game);
                });
                _this.httpService.listen('removeMeeting')
                    .subscribe(function (id) {
                    _this.dataService.removeData(id);
                    var currentMeetingId = _this.dataService.getCurrentMeetingId();
                    if (currentMeetingId === id) {
                        _this.dataService.setCurrentMeeting(null, null);
                        _this.authService.leaveMeeting();
                    }
                });
                _this.httpService.listen('meetingFinish')
                    .subscribe(function () {
                    _this.dataService.setCurrentMeeting(null, null);
                    _this.authService.leaveMeeting();
                });
                _this.httpService.listen('startMeeting')
                    .subscribe(function (data) {
                    _this.dataService.setCurrentMeeting(data, data.currentGame);
                    _this.router.navigate(['/game']);
                    _this.authService.inGame(data.id, data.currentGame.id);
                });
                _this.httpService.listen('makeStep')
                    .subscribe(function (data) {
                    _this.meetingService.opponentStep(data.whoWin);
                    _this.dataService.setCurrentGame(data);
                });
                _this.httpService.listen('opponentStep')
                    .subscribe(function (data) {
                    _this.meetingService.opponentStep(data.steps);
                    _this.dataService.setCurrentGame(data.game);
                });
                _this.httpService.listen('continueGame')
                    .subscribe(function (data) {
                    _this.dataService.setCurrentMeeting(data.currentMeeting, data.currentGame);
                    _this.router.navigate(['/game']);
                });
            });
        }
    };
    AppComponent.prototype.ngAfterViewInit = function () {
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"],
            src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"],
            src_app_services_data_service__WEBPACK_IMPORTED_MODULE_5__["DataService"],
            src_app_services_meetings_service__WEBPACK_IMPORTED_MODULE_6__["MeetingsService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            src_app_services_sound_service__WEBPACK_IMPORTED_MODULE_7__["SoundService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _user_area_user_area_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./user-area/user-area.component */ "./src/app/user-area/user-area.component.ts");
/* harmony import */ var _components_select_select_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/select/select.component */ "./src/app/components/select/select.component.ts");







var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _user_area_user_area_component__WEBPACK_IMPORTED_MODULE_5__["UserAreaComponent"],
                _components_select_select_component__WEBPACK_IMPORTED_MODULE_6__["SelectComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/components/select/select.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/select/select.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  select works!\n</p>\n"

/***/ }),

/***/ "./src/app/components/select/select.component.scss":
/*!*********************************************************!*\
  !*** ./src/app/components/select/select.component.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvc2VsZWN0L3NlbGVjdC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/components/select/select.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/select/select.component.ts ***!
  \*******************************************************/
/*! exports provided: SelectComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectComponent", function() { return SelectComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var SelectComponent = /** @class */ (function () {
    function SelectComponent() {
    }
    SelectComponent.prototype.ngOnInit = function () {
    };
    SelectComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-select',
            template: __webpack_require__(/*! ./select.component.html */ "./src/app/components/select/select.component.html"),
            styles: [__webpack_require__(/*! ./select.component.scss */ "./src/app/components/select/select.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], SelectComponent);
    return SelectComponent;
}());



/***/ }),

/***/ "./src/app/models/models.ts":
/*!**********************************!*\
  !*** ./src/app/models/models.ts ***!
  \**********************************/
/*! exports provided: User, Meeting */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Meeting", function() { return Meeting; });
var User = /** @class */ (function () {
    function User(id, category, name, playerId, currentMeetingId, inGame) {
        if (id === void 0) { id = null; }
        if (category === void 0) { category = null; }
        if (name === void 0) { name = null; }
        if (playerId === void 0) { playerId = false; }
        if (currentMeetingId === void 0) { currentMeetingId = null; }
        if (inGame === void 0) { inGame = null; }
        this.id = id;
        this.category = category;
        this.name = name;
        this.playerId = playerId;
        this.currentMeetingId = currentMeetingId;
        this.inGame = inGame;
    }
    return User;
}());

var Meeting = /** @class */ (function () {
    function Meeting(id, currentGame, games, isStart, score, secondPlayer, firstPlayer) {
        if (id === void 0) { id = null; }
        if (currentGame === void 0) { currentGame = null; }
        if (games === void 0) { games = null; }
        if (isStart === void 0) { isStart = null; }
        if (score === void 0) { score = null; }
        if (secondPlayer === void 0) { secondPlayer = null; }
        if (firstPlayer === void 0) { firstPlayer = null; }
        this.id = id;
        this.currentGame = currentGame;
        this.games = games;
        this.isStart = isStart;
        this.score = score;
        this.secondPlayer = secondPlayer;
        this.firstPlayer = firstPlayer;
    }
    return Meeting;
}());



/***/ }),

/***/ "./src/app/services/auth.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/auth.service.ts ***!
  \******************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var src_app_services_http_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var src_app_models_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/models/models */ "./src/app/models/models.ts");





var AuthService = /** @class */ (function () {
    function AuthService(httpService) {
        this.httpService = httpService;
        this.isLoggedIn = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](null);
        this.user = new src_app_models_models__WEBPACK_IMPORTED_MODULE_4__["User"]();
        this.state = 'guest';
    }
    AuthService.prototype.login = function (email, password) {
        var _this = this;
        this.httpService.sendMessage('login', { email: email, password: password });
        return new Promise(function (res) {
            _this.httpService.listenPromise('loginResult')
                .then(function (data) {
                res(data);
                if (data && data.playerId) {
                    _this.setUser(data);
                }
                else {
                    _this.logout();
                }
            });
        });
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem('checkers_playerId');
        if (this.user && this.user.id) {
            this.httpService.sendMessage('logout', { id: this.user.id });
            this.setUser(new src_app_models_models__WEBPACK_IMPORTED_MODULE_4__["User"]());
        }
        this.isLoggedIn.next(false);
    };
    AuthService.prototype.checkIn = function (user) {
        this.httpService.sendMessage('checkIn', user);
        return this.httpService.listenPromise('checkInResult');
    };
    AuthService.prototype.setUser = function (user) {
        this.user = user;
        this.setState();
        this.isLoggedIn.next(user.playerId);
        localStorage.setItem('checkers_playerId', user.playerId + '');
    };
    AuthService.prototype.leaveMeeting = function () {
        this.user.currentMeetingId = null;
        this.user.inGame = null;
        this.setUser(this.user);
    };
    AuthService.prototype.inGame = function (meetingId, gameId) {
        if (gameId === void 0) { gameId = null; }
        this.user.inGame = gameId;
        this.user.currentMeetingId = meetingId;
        this.setUser(this.user);
    };
    AuthService.prototype.setState = function () {
        if (this.user.currentMeetingId !== null) {
            this.state = 'inGame';
        }
        else if (this.user.id !== null) {
            this.state = 'isLogin';
        }
        else {
            this.state = 'guest';
        }
    };
    AuthService.prototype.getCurrentMeetingId = function () {
        return this.user.currentMeetingId;
    };
    AuthService.prototype.getUserId = function () {
        return this.user.id;
    };
    AuthService.prototype.getState = function () {
        return this.state;
    };
    AuthService.prototype.getUser = function () {
        return this.user;
    };
    AuthService.prototype.getPlayerId = function () {
        return this.user.playerId;
    };
    AuthService.prototype.getTocken = function () {
        return localStorage.getItem('checkers_playerId');
    };
    AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_http_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/services/data.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/data.service.ts ***!
  \******************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var DataService = /** @class */ (function () {
    function DataService() {
        this.data$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"]([]);
        this.currentGame$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"]({});
        this.data = [];
    }
    DataService.prototype.start = function () {
        this.appInit = true;
    };
    DataService.prototype.isInit = function () {
        return this.appInit;
    };
    DataService.prototype.setData = function (data) {
        this.data = data;
        this.data$.next(data);
    };
    DataService.prototype.addData = function (data) {
        this.data.push(data);
        this.data = this.data.slice();
        this.data$.next(this.data);
    };
    DataService.prototype.setCurrentGame = function (currentGame) {
        this.currentGame = currentGame;
        this.currentGame$.next(currentGame);
    };
    DataService.prototype.getCurrentGame = function () {
        return this.currentGame$;
    };
    DataService.prototype.isStart = function () {
        if (this.currentGame && this.currentGame.players) {
            return this.currentGame.players.length === 2;
        }
        else {
            return false;
        }
    };
    DataService.prototype.getPlayers = function () {
        if (this.currentMeeting) {
            return this.currentMeeting.score;
        }
    };
    DataService.prototype.setCurrentMeeting = function (meeting, currentGame) {
        this.currentMeeting = meeting;
        this.setCurrentGame(currentGame);
        if (meeting) {
            this.currentMeetingId = meeting.id;
        }
        else {
            this.currentMeetingId = null;
        }
    };
    DataService.prototype.getCurrentMeetingId = function () {
        return this.currentMeetingId;
    };
    DataService.prototype.getCurrentMeeting = function () {
        return this.currentMeeting;
    };
    DataService.prototype.getData = function () {
        return this.data$;
    };
    DataService.prototype.removeData = function (id) {
        this.data = this.data.filter(function (meeting) { return meeting.id !== id; });
        this.data$.next(this.data);
    };
    DataService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/services/http.service.ts":
/*!******************************************!*\
  !*** ./src/app/services/http.service.ts ***!
  \******************************************/
/*! exports provided: HttpService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpService", function() { return HttpService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var HttpService = /** @class */ (function () {
    function HttpService() {
        this.instance = io();
    }
    HttpService.prototype.sendMessage = function (eventName, msg) {
        if (msg === void 0) { msg = null; }
        console.log('send', eventName, msg);
        this.instance.emit(eventName, JSON.stringify(msg));
    };
    HttpService.prototype.listenPromise = function (eventName) {
        var _this = this;
        return new Promise(function (res) {
            var clbck = function (event) {
                _this.instance.removeListener(eventName, clbck);
                var data = JSON.parse(event);
                console.log('listenPromise', eventName, data);
                res(data);
            };
            _this.instance.on(eventName, clbck);
        });
    };
    HttpService.prototype.listen = function (eventName) {
        var _this = this;
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (obs) {
            _this.instance.on(eventName, function (event) {
                var data = JSON.parse(event);
                console.log('listen', eventName, data);
                obs.next(data);
            });
        });
    };
    HttpService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root',
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], HttpService);
    return HttpService;
}());



/***/ }),

/***/ "./src/app/services/meetings.service.ts":
/*!**********************************************!*\
  !*** ./src/app/services/meetings.service.ts ***!
  \**********************************************/
/*! exports provided: MeetingsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MeetingsService", function() { return MeetingsService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/http.service */ "./src/app/services/http.service.ts");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");




var MeetingsService = /** @class */ (function () {
    function MeetingsService(httpService) {
        this.httpService = httpService;
        this.step$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"]({});
    }
    MeetingsService.prototype.createMeeting = function (type, user) {
        this.httpService.sendMessage('createMeeting', { type: type, user: user });
    };
    MeetingsService.prototype.selectMeeting = function (token, meetingId) {
        if (meetingId === 'robot') {
            this.createMeeting('giveaway', 'you');
        }
        else {
            this.httpService.sendMessage('selectMeeting', { playerId: token, meetingId: meetingId });
        }
    };
    MeetingsService.prototype.removeMeeting = function (tokenId) {
        this.httpService.sendMessage('removeMeeting', { tokenId: tokenId });
    };
    MeetingsService.prototype.makeStep = function (steps, token) {
        this.httpService.sendMessage('makeStep', { steps: steps, token: token });
        // window.dispatchEvent(new CustomEvent('makeStep', {detail: {steps, token}}));
    };
    MeetingsService.prototype.continueMeeting = function (token) {
        console.log('continueGame', token);
        this.httpService.sendMessage('continueGame', { token: token });
    };
    MeetingsService.prototype.stepHandler = function () {
        return this.step$;
    };
    MeetingsService.prototype.removeSteps = function () {
        this.step$.next({});
    };
    MeetingsService.prototype.opponentStep = function (steps) {
        this.step$.next({ steps: steps });
    };
    MeetingsService.prototype.newGame = function (tokenId) {
        this.httpService.sendMessage('getData', { token: tokenId });
    };
    MeetingsService.prototype.finishGame = function (tokenId) {
        this.httpService.sendMessage('finishGame', { token: tokenId });
    };
    MeetingsService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_http_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]])
    ], MeetingsService);
    return MeetingsService;
}());



/***/ }),

/***/ "./src/app/services/sound.service.ts":
/*!*******************************************!*\
  !*** ./src/app/services/sound.service.ts ***!
  \*******************************************/
/*! exports provided: SoundService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoundService", function() { return SoundService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var SoundService = /** @class */ (function () {
    function SoundService() {
        this.sounds = [];
        this.path = '../assets/sound/';
        this.state = localStorage.getItem('soundState_checkers') ? localStorage.getItem('soundState_checkers') : 'on';
        this.state$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](this.state);
    }
    SoundService.prototype.getState = function () {
        return this.state$;
    };
    SoundService.prototype.soundToggle = function () {
        var _this = this;
        if (this.state === 'on') {
            this.state = 'off';
            this.sounds.forEach(function (sound) {
                _this.setVolume(0, sound);
            });
        }
        else {
            this.state = 'on';
            this.sounds.forEach(function (sound) {
                _this.setVolume(null, sound);
            });
        }
        localStorage.setItem('soundState_checkers', this.state);
        this.state$.next(this.state);
    };
    SoundService.prototype.loadSound = function (name, soundName) {
        this[name] = new Audio();
        this[name].src = this.path + soundName;
        this[name].load();
        this[name]['initialVolume'] = 1;
        if (this.state === 'off') {
            this.setVolume(0, name);
        }
        this.sounds.push(name);
    };
    SoundService.prototype.startLoad = function () {
        this.loadSound('step', 'step.mp3');
        this.loadSound('queen', 'queen.mp3');
        this.loadSound('remove', 'remove.mp3');
        this.loadSound('queen', 'queen.mp3');
        this.loadSound('win', 'win.mp3');
        this.loadSound('loose', 'loose.mp3');
        this.loadSound('lamp', 'lamp.wav');
    };
    SoundService.prototype.reproduceSound = function (name) {
        if (this[name]) {
            this.stopSound(name);
            this[name].play();
        }
    };
    SoundService.prototype.stopSound = function (name) {
        if (this[name]) {
            this[name].pause();
            this[name].currentTime = 0;
        }
    };
    SoundService.prototype.setVolume = function (vol, soundName) {
        if (this[soundName]) {
            if (vol !== null) {
                this[soundName].volume = vol;
            }
            else {
                this[soundName].volume = this[soundName].initialVolume;
            }
        }
    };
    SoundService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], SoundService);
    return SoundService;
}());



/***/ }),

/***/ "./src/app/user-area/user-area.component.html":
/*!****************************************************!*\
  !*** ./src/app/user-area/user-area.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"user-area\" *ngIf=\"user\">\n  Здравствуйте {{user.name}} <button (click)=\"logout()\" class=\"btn btn_md\">logout</button>\n</div>\n"

/***/ }),

/***/ "./src/app/user-area/user-area.component.scss":
/*!****************************************************!*\
  !*** ./src/app/user-area/user-area.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".user-area {\n  position: absolute;\n  top: 1rem;\n  right: 1rem; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pbGEvRG9jdW1lbnRzL3Byb2dyYW0vYW5nL2NoZWNrZXJzL25ldy9jbGllbnQvc3JjL2FwcC91c2VyLWFyZWEvdXNlci1hcmVhLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksbUJBQWtCO0VBQ2xCLFVBQVM7RUFDVCxZQUFXLEVBQ2QiLCJmaWxlIjoic3JjL2FwcC91c2VyLWFyZWEvdXNlci1hcmVhLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnVzZXItYXJlYSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMXJlbTtcbiAgICByaWdodDogMXJlbTtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/user-area/user-area.component.ts":
/*!**************************************************!*\
  !*** ./src/app/user-area/user-area.component.ts ***!
  \**************************************************/
/*! exports provided: UserAreaComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAreaComponent", function() { return UserAreaComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/auth.service */ "./src/app/services/auth.service.ts");



var UserAreaComponent = /** @class */ (function () {
    function UserAreaComponent(authService) {
        this.authService = authService;
    }
    UserAreaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.isLoggedIn.subscribe(function (token) {
            if (token !== null) {
                if (token) {
                    _this.user = _this.authService.getUser();
                }
                else {
                    _this.user = null;
                }
            }
        });
    };
    UserAreaComponent.prototype.logout = function () {
        this.authService.logout();
    };
    UserAreaComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user-area',
            template: __webpack_require__(/*! ./user-area.component.html */ "./src/app/user-area/user-area.component.html"),
            styles: [__webpack_require__(/*! ./user-area.component.scss */ "./src/app/user-area/user-area.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]])
    ], UserAreaComponent);
    return UserAreaComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/ila/Documents/program/ang/checkers/new/client/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map