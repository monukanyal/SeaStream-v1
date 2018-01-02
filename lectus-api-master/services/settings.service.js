"use strict"
const MovieRepository = require('../repositories/movie-repository'),
    WatchedRepository = require('../repositories/watched-repository'),
    WatchingRepository = require('../repositories/watching-repository'),
    LectusCache = require('../helpers/lectus-cache'),
    SettingsRepository = require('../repositories/setting-repository');

class SettingsService {

    constructor() {
        this.movieRepository = new MovieRepository();
        this.watchedRepository = new WatchedRepository();
        this.watchingRepository = new WatchingRepository();
        this.lectusCache = new LectusCache();
        this.settingsRepository = new SettingsRepository();
    }


}

module.exports = SettingsService;