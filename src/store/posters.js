import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

export const usePostersStore = defineStore('posters', {
    state: () => ({
        loading: true,
        loadingMessage: '',
        bootTime: 5000,
        socket: null,
        posters: [],
        poster: {},
        overlays: [],
        activeOverlay: {
            file_name: null,
        },
        overlayTime: false,
        localSettings: {
            parent_hostname: '',
            poster_display_speed: 15000,
            transition_type: 'fade',
            wifi_country_code: '',
            wifi_sid: '',
            wifi_password: '',
            override_parent_sequence: false,
            override_parent_transitons: false,
        },
        parentSettings: {
            poster_display_speed: 15000,
            transition_type: 'fade',
            wifi_country_code: '',
            wifi_sid: '',
            wifi_password: '',
            footer_text_color: '#ffffff',
        },
        parentDevices: [],
        contentRating: '',
        mpaaRating: '',
        rating: 0,
        audienceRating: 0,
        currentImage: 0,
        borderWidth: 2,
        starPadding: 2,
        controller: '',
        iframeEl: '',
        audio: null,
        runtime: 0,
        nowPlayingRuntime: 0,
        theme_music: null,
        nowPlaying: false,
        isPlaying: false,
        videoPlaying: false,
        couldNotLoadParent: false,
        show_dolby_atmos_vertical: false,
        show_dolby_vision_vertical: false,
        show_dts: false,
        show_auro_3d: false,
        show_imax: false,
        show_dolby_51: false,
        servicePlaying: null,
        canRefreshTransitionTime: true,
        videoPlayer: null,
        showWifiModal: false,
        showDevicesModal: false,
        nowPlayingPoster: '',
        recentlyAddedInterval: null,
        nowPlayingInterval: null,
        transitionImagesInterval: null,
        pgLimits: ['G', 'PG'],
        pg13Limits: ['G', 'PG', 'PG-13'],
        rLimits: ['G', 'PG', 'PG-13', 'R'],
        nc17Limits: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
        tvMaLimits: ['TV-Y', 'TV-Y7', 'TV-Y7 FV', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
        tv14Limits: ['TV-Y', 'TV-Y7', 'TV-Y7 FV', 'TV-G', 'TV-PG', 'TV-14'],
        tvPgLimits: ['TV-Y', 'TV-Y7', 'TV-Y7 FV', 'TV-G', 'TV-PG'],
        tvGLimits: ['TV-Y', 'TV-Y7', 'TV-Y7 FV', 'TV-G'],
        tvY7fvLimits: ['TV-Y', 'TV-Y7', 'TV-Y7 FV'],
        tvY7Limits: ['TV-Y', 'TV-Y7'],
    }),
    actions: {
        boot() {
            console.log('--- BOOTING ---');
            this.getLocalSettings().then(() => {
                if (
                    this.localSettings.parent_hostname &&
                    this.localSettings.parent_hostname.length > 5
                ) {
                    this.getParentSettings().then(() => {
                        this.getPosters();
                        this.canRefreshTransitionTime = false;
                        setTimeout(() => {
                            this.booted = true;
                            console.log('--- BOOTED ---');
                        }, this.bootTime + 3000);
                    });
                } else {
                    this.couldNotLoadParent = true;
                    this.showDevicesModal = true;
                }
            });
        },
        bootReady() {
            setTimeout(() => {
                this.loading = false;
                this.loadingMessage = 'Loading<br />Posters ...';
            }, this.bootTime);
        },
        getLocalSettings() {
            return axios
                .get('http://' + location.hostname + ':3005/settings')
                .then((response) => {
                    console.log('-- GET LOCAL SETTINGS');
                    this.localSettings = response.data.settings;
                    return response;
                })
                .catch((e) => {
                    console.log('getParentSettings', e.message);
                });
        },
        getParentSettings() {
            return axios
                .get('http://digital-movie-poster.test/api/settings')
                .then((response) => {
                    console.log('-- GET PARENT SETTINGS');
                    this.parentSettings = response.data;
                    return response;
                })
                .catch((e) => {
                    console.log('getParentSettings', e.message);
                });
        },
        getPosters() {
            console.log('GET MOVIE POSTERS');
            this.stopTransitionImages();
            axios
                .get('http://digital-movie-poster.test/api/posters?show_in_rotation=true')
                .then((response) => {
                    this.posters = response.data.posters;
                    if (this.posters.length === 0) {
                        this.loadingMessage =
                            'You do not have any posters loaded yet.<br/>Visit <span class="lowercase">http://' +
                            location.hostname +
                            '/posters</span> to start.';
                    } else {
                        this.setSocket();
                        this.bootReady();
                    }
                })
                .catch((e) => {
                    console.log(e.message);
                });
        },
        reloadPosters() {
            console.log('RELOAD POSTERS');
            axios
                .get(
                    'http://' +
                        this.localSettings.parent_hostname +
                        '/api/posters?show_in_rotation=true'
                )
                .then((response) => {
                    this.posters = response.data.posters;
                })
                .catch((e) => {
                    console.log(e.message);
                });
        },
        handlePosterView(poster) {
            console.log('HANDLE POSTER VIEW');
            this.stopMusic();

            this.mpaaRating = poster.mpaa_rating;
            if (poster.audience_rating) {
                this.audienceRating = poster.audience_rating / 2;
            }
            if (poster.trailer_path && poster.show_trailer) {
                if (typeof this.videoPlayer !== 'undefined') {
                    this.playTrailer(poster.trailer_path);
                }
            }
            if (poster.show_runtime) {
                this.runtime = poster.runtime;
            }
            if (
                poster.play_theme_music &&
                poster.theme_music_path &&
                this.parentSettings.play_theme_music
            ) {
                this.theme_music = poster.theme_music_path;
                this.playMusic();
            }

            if (!this.parentSettings.use_global_prologos) {
                if (this.parentSettings.use_global_prologos_if_no_poster_prologos) {
                    if (
                        !poster.show_dolby_atmos &&
                        !poster.show_dolby_vision &&
                        !poster.show_dtsx &&
                        !poster.show_auro_3d &&
                        !poster.show_imax &&
                        !poster.show_dolby_51
                    ) {
                        this.useSettingsProLogos();
                    } else {
                        this.usePosterProLogos(poster);
                    }
                } else {
                    this.usePosterProLogos(poster);
                }
            } else {
                this.useSettingsProLogos();
            }
        },
        transitionImages() {
            console.log('TRANSITION IMAGES');
            let poster = '';
            if (this.videoPlayer) {
                this.videoPlayer.innerHTML = '';
            }
            this.stopMusic();

            if (this.posters.length > 0) {
                poster = this.getInSequencePoster();
                this.handlePosterView(poster);
            }
        },
        startTransitionImages() {
            console.log('START TRANSITIONS');
            window.transitionImagesInterval = setInterval(() => {
                this.transitionImages();
            }, this.parentSettings.poster_display_speed);
            this.canRefreshTransitionTime = false;
        },
        stopTransitionImages() {
            console.log('STOP TRANSITIONS');
            clearInterval(window.transitionImagesInterval);
        },
        playMusic() {
            setTimeout(() => {
                window.audio = new Audio('/storage/music/' + this.theme_music);
                window.audio.play();
            }, 1500);
        },
        stopMusic() {
            if (window.audio) {
                let vol = 1;
                let interval = 40;
                if (window.audio.volume == 1) {
                    var intervalID = setInterval(() => {
                        if (vol > 0) {
                            vol -= 0.05;
                            window.audio.volume = vol.toFixed(2);
                        } else {
                            clearInterval(intervalID);
                            window.audio.pause();
                            window.audio = null;
                        }
                    }, interval);
                }
            }
        },
        playTrailer(youTubeId) {
            this.iframeEl = document.createElement('iframe');
            this.iframeEl.setAttribute(
                'src',
                `https://www.youtube.com/embed/${youTubeId}?enablejsapi=1&autoplay=1&mute=1&autohide=2&modestbranding=1&showinfo=0&controls=0&rel=0&border=0&wmode=opaque`
            );
            this.iframeEl.setAttribute('frameborder', '0');
            this.iframeEl.setAttribute('allow', 'autoplay; encrypted-media;');
            this.iframeEl.addEventListener('load', this.playVideo);
            this.videoPlayer.appendChild(this.iframeEl);
            this.iframeEl.focus();
        },
        playVideo(e) {
            this.videoPlaying = true;
            this.iframeEl.contentWindow.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                '*'
            );
        },
        usePosterProLogos(poster) {
            this.show_dolby_atmos_vertical = poster.show_dolby_atmos;
            this.show_dolby_vision_vertical = poster.show_dolby_vision;
            this.show_dts = poster.show_dtsx;
            this.show_auro_3d = poster.show_auro_3d;
            this.show_imax = poster.show_imax;
            this.show_dolby_51 = poster.show_dolby_51;
        },
        useSettingsProLogos() {
            this.show_dolby_atmos_vertical = this.parentSettings.show_dolby_atmos_vertical;
            this.show_dolby_vision_vertical = this.parentSettings.show_dolby_vision_vertical;
            this.show_dts = this.parentSettings.show_dts;
            this.show_auro_3d = this.parentSettings.show_auro_3d;
            this.show_imax = this.parentSettings.show_imax;
            this.show_dolby_51 = this.parentSettings.show_dolby_51;
        },
        withinMpaaLimit(rating) {
            let mpaaLimit = this.parentSettings.mpaa_limit;
            if (!mpaaLimit) {
                return true;
            }
            if (mpaaLimit === 'PG') {
                return this.pgLimits.includes(rating);
            }
            if (mpaaLimit === 'PG-13') {
                return this.pg13Limits.includes(rating);
            }
            if (mpaaLimit === 'R') {
                return this.rLimits.includes(rating);
            }
            if (mpaaLimit === 'NC-17') {
                return this.nc17Limits.includes(rating);
            }
            return true;
        },
        withinTvLimit(rating) {
            let mpaaLimit = this.parentSettings.tv_limit;
            if (!mpaaLimit) {
                return true;
            }
            if (mpaaLimit === 'TV-Y7') {
                return this.tvY7Limits.includes(rating);
            }
            if (mpaaLimit === 'TV-Y7 FV') {
                return this.tvY7fvLimits.includes(rating);
            }
            if (mpaaLimit === 'TV-G') {
                return this.tvGLimits.includes(rating);
            }
            if (mpaaLimit === 'TV-PG') {
                return this.tvPgLimits.includes(rating);
            }
            if (mpaaLimit === 'TV-14') {
                return this.tv14Limits.includes(rating);
            }
            if (mpaaLimit === 'TV-MA') {
                return this.tvMaLimits.includes(rating);
            }
            return true;
        },
        setNowPlaying(data) {
            let withinMpaaLimit = this.withinMpaaLimit(data.contentRating);
            let withinTvLimit = this.withinTvLimit(data.contentRating);
            if (withinMpaaLimit && withinTvLimit) {
                console.log('SET NOW PLAYING');
                this.nowPlayingPoster = data.poster;
                this.contentRating = data.contentRating;

                if (data.audienceRating) {
                    this.rating = data.audienceRating / 2;
                }

                if (data.duration && this.parentSettings.show_runtime) {
                    this.nowPlayingRuntime = data.duration;
                }
                this.isPlaying = true;
            } else {
                this.isPlaying = false;
                this.contentRating = 0;
            }
        },
        setIsPlaying(state) {
            this.isPlaying = state;
        },
        controlPlayerState(state) {
            switch (state) {
                case 'playing':
                    console.log('-- STARTED NOW PLAYING');
                    this.nowPlaying = true;
                    break;
                case 'paused':
                case 'stopped':
                    console.log('-- STOPPED NOW PLAYING');
                    this.nowPlaying = false;
                    this.isPlaying = false;
                    this.contentRating = 0;
                    break;
            }
        },
        processApiEvent(data) {
            if (data.event === 'now-playing') {
                console.log('-- NOW PLAYING EVENT --');
                this.servicePlaying = data.mediaSource;
                this.controlPlayerState('playing');
                this.setNowPlaying(data);
            }
            if (data.event === 'stopped') {
                console.log('-- STOPPED EVENT --');
                this.controlPlayerState('stopped');
                this.servicePlaying = null;
            }
            if (data.event === 'posters-updated') {
                console.log('-- POSTERS UPDATED --');
                this.reloadPosters();
            }
            if (data.event === 'refresh-settings') {
                console.log('-- REFRESH PARENT SETTINGS EVENT --');
                this.canRefreshTransitionTime = true;
                this.getParentSettings();
            }
        },
        setSyncPoster() {
            const currIndex = this.posters.findIndex((poster) => poster.show === true);
            if (currIndex >= 0) {
                this.posters[currIndex].show = false;
            }

            let activePoster = this.posters.find((item) => {
                return item.id === this.poster.id;
            });
            activePoster.show = true;
            //this.getInSequencePoster();
            this.setNextPoster();
            this.handlePosterView(activePoster);
        },
        setNextPoster() {},
        getRandomPoster() {
            return Math.floor(Math.random() * this.posters.length);
        },
        getInSequencePoster() {
            console.log('GET NEXT POSTER');
            const len = this.posters.length;
            const currIndex = this.posters.findIndex((poster) => poster.show === true);
            let poster,
                pastPoster,
                activeIndex = 0;

            if (this.parentSettings.random_order) {
                activeIndex = this.getRandomPoster();
            } else {
                activeIndex = currIndex + 1 === len ? 0 : currIndex + 1;
            }

            if (len === 1) {
                poster = this.posters[0];
                pastPoster = Object.assign(this.posters[0], {});
                poster.show = true;
            } else {
                poster = this.posters[activeIndex];
                pastPoster = this.posters[currIndex];
                if (poster) {
                    poster.show = true;
                }
                if (pastPoster) {
                    pastPoster.show = false;
                }
            }

            return poster;
        },
        showOverlay(overlay) {
            this.activeOverlay = overlay;
            this.activeOverlay.show = true;
            this.overlayTime = true;
            this.stopMusic();
            this.stopVideo();
            this.stopTransitionImages();
            this.canRefreshTransitionTime = false;
        },
        hideOverlay() {
            console.log('OVERLAY DONE!!!');
            this.activeOverlay.show = false;
            this.startTransitionImages();
        },
        setSocket() {
            console.log(' --- STARTING WEBSOCKET CONNECTION ---');
            this.socket = io('http://' + this.localSettings.parent_hostname + ':3000');

            this.socket.on('AppEventsDmpEvent', (data) => {
                this.processApiEvent(data);
            });

            this.socket.on('receive:command', (data) => {
                /*switch (data.command) {
                    case 'reload':
                        console.log('-- RELOAD COMMAND --');
                        this.reload();
                        break;
                }*/
            });

            this.socket.on('poster:handlePosterView', (data) => {
                console.log('poster:handlePosterView', data);
                this.poster = data.poster;
                this.parentSettings = data.settings;
                this.setSyncPoster();
            });

            this.socket.on('overlay:show', (data) => {
                console.log('overlay:show', data);
                this.showOverlay(data.overlay);
            });

            this.socket.on('overlay:hide', (data) => {
                console.log('overlay:hide', data);
                this.hideOverlay();
            });

            this.socket.on('poster:controlTv', (data) => {
                console.log('poster:controlTv', data);
            });

            this.socket.on('poster:command', (data) => {
                console.log('poster:command', data);
            });
        },
        controlTV(command) {
            if (this.parentSettings.use_cec_power) {
                if (!this.isOnTime()) {
                    if (command === 'on') {
                        command = 'standby';
                    }
                }
                /*axios
                    .get('/api/control-display/' + command)
                    .then((response) => {
                        console.log(response.data);
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });*/
            }
        },
        isOnTime() {
            let presentDate = new Date();
            presentDate = this.changeTimezone(presentDate, 'America/New_York');
            let date = new Date();
            date = this.changeTimezone(date, 'America/New_York');
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            const date1 = new Date(
                month + '/' + day + '/' + year + ' ' + this.parentSettings.start_power_time
            );
            const date2 = new Date(
                month + '/' + day + '/' + year + ' ' + this.parentSettings.end_power_time
            );

            if (
                presentDate.getTime() > date1.getTime() &&
                presentDate.getTime() < date2.getTime()
            ) {
                return true;
            } else {
                return false;
            }
        },
        changeTimezone(date, ianatz) {
            var invdate = new Date(
                date.toLocaleString('en-US', {
                    timeZone: ianatz,
                })
            );
            var diff = date.getTime() - invdate.getTime();
            return new Date(date.getTime() - diff);
        },
        setVideoPlayerRef(data) {
            this.videoPlayer = data;
        },
        setShowWifiModal(data) {
            this.showWifiModal = data;
        },
        setShowDevicesModal(data) {
            console.log('setShowDevicesModal');
            this.showDevicesModal = data;
        },
        discoverDevices() {
            axios
                .get('http://' + location.hostname + ':3005/discover-devices')
                .then((response) => {
                    this.parentDevices = response.data.services;
                })
                .catch((e) => {
                    console.log(e.message);
                });
        },
        setParentHostname(hostname) {
            this.localSettings.parent_hostname = hostname;
            if (this.couldNotLoadParent) {
                this.boot();
                this.couldNotLoadParent = false;
            }
        },
        setLocalSettings(settings) {
            this.localSettings = settings;
        },
    },
});
