<template>
    <div>
        <div class="movie-posters">
            <div class="loading-overlay" v-if="loading">
                <a href="/settings" class="p-6" v-html="loadingMessage"></a>
            </div>
            <transition name="fade">
                <a
                    id="recent-added-container"
                    class="poster-container"
                    href="/settings"
                    v-if="!isPlaying"
                >
                    <TopHeader />
                    <div class="recent-poster-container">
                        <div class="trailer-container has-trailer">
                            <div
                                class="poster-items"
                                :style="'background-color: ' + parentSettings.poster_bg_color"
                            >
                                <div
                                    v-for="(poster, index) in filteredPosters"
                                    v-bind:key="`key-${index}`"
                                    class="poster"
                                    :class="{
                                        'has-trailer': poster.show_trailer && poster.trailer_path,
                                    }"
                                    :style="blackBars(poster)"
                                >
                                    <transition :name="transitionName">
                                        <div
                                            v-if="poster.show"
                                            :style="
                                                'background-image: url(http://192.168.86.58/storage/posters/' +
                                                poster.file_name +
                                                ')'
                                            "
                                        ></div>
                                    </transition>
                                </div>
                            </div>

                            <div id="trailer">
                                <div ref="videoPlayer" id="youtube-player"></div>
                            </div>
                            <div id="music"></div>
                        </div>
                    </div>
                    <BottomFooter />
                </a>
            </transition>
            <transition name="fade">
                <a
                    id="now-playing-container"
                    class="poster-container"
                    v-if="isPlaying"
                    href="/posters"
                >
                    <TopHeader />
                    <div class="now-playing-wrap">
                        <div
                            class="now-playing-container"
                            :style="'background-color: ' + parentSettings.poster_bg_color"
                        >
                            <div
                                class="now-playing-poster"
                                :style="
                                    'background-image: url(' +
                                    nowPlayingPoster +
                                    ');' +
                                    blackBars(false)
                                "
                            ></div>
                        </div>
                    </div>
                    <BottomFooter />
                </a>
            </transition>
        </div>
        <div class="overlays" v-if="settings.show_overlays">
            <div v-for="(overlay, oIndex) in overlays" :key="'overlay-' + oIndex">
                <transition name="fade">
                    <div v-show="overlay.show">
                        <div
                            v-if="overlay.type === 'image'"
                            class="
                                fixed
                                z-100
                                inset-0
                                w-full
                                h-full
                                bg-no-repeat bg-center bg-black
                            "
                            :class="settings.overlay_background_size"
                            :style="
                                'background-image: url(/storage/overlays/' + overlay.file_name + ')'
                            "
                        ></div>
                        <div
                            v-show="overlay.type === 'video'"
                            class="fixed z-40 inset-0 w-full h-full bg-black"
                        ></div>
                    </div>
                </transition>
            </div>
            <video
                id="overlayVideo"
                v-if="overlayTime && activeOverlay.file_name && activeOverlay.type === 'video'"
                ref="overlayVideo"
                class="fixed z-50 inset-0 w-full h-full"
                :src="'/storage/overlays/' + activeOverlay.file_name"
                autoplay
                muted
                loop
            ></video>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { usePostersStore } from '@/store/posters';
import TopHeader from '@/partials/top-header.vue';
import BottomFooter from '@/partials/bottom-footer.vue';

export default {
    data: () => {
        return {};
    },
    components: {
        TopHeader,
        BottomFooter,
    },
    watch: {
        nowPlaying: {
            handler: function (val) {
                if (!val) {
                    this.setVideoPlayerRef(this.$refs.videoPlayer);
                    this.setIsPlaying(false);
                }
            },
            deep: true,
        },
        isPlaying: {
            handler: function (val) {
                if (val) {
                    this.stopMusic();
                    this.controlTV('on');
                } else {
                    if (!this.loading) {
                        console.log('WATCHER - nowPlaying START TRANSITION IMAGES');
                    }
                }
            },
            deep: true,
        },
    },
    computed: {
        ...mapState(usePostersStore, [
            'loading',
            'loadingMessage',
            'parentSettings',
            'posters',
            'nowPlaying',
            'isPlaying',
            'nowPlayingPoster',
            'theme_music',
            'withinMpaaLimit',
            'withinTvLimit',
            'overlayTime',
            'activeOverlay',
        ]),
        filteredPosters() {
            return this.posters.filter((poster) => {
                if (poster.media_type === 'movie') {
                    return this.withinMpaaLimit(poster.mpaa_rating);
                }
                if (poster.media_type === 'tv') {
                    return this.withinTvLimit(poster.mpaa_rating);
                }
            });
        },
        transitionName() {
            if (this.parentSettings.transition_type === 'fade') {
                return 'fade-poster';
            }
            if (this.parentSettings.transition_type === 'vertical') {
                return 'slide-poster';
            }
            if (this.parentSettings.transition_type === 'horizontal') {
                return 'slide-left-poster';
            }
        },
    },
    methods: {
        ...mapActions(usePostersStore, [
            'stopTransitionImages',
            'startTransitionImages',
            'controlTV',
            'getNowPlaying',
            'setIsPlaying',
            'setVideoPlayerRef',
            'playMusic',
            'stopMusic',
            'playTrailer',
            'playVideo',
        ]),
        blackBars(poster) {
            if (poster) {
                if (poster.show_trailer && poster.trailer_path) {
                    return '';
                }
            }
            return this.parentSettings.remove_black_bars
                ? ' left: 0; right: 0; '
                : ' left: 1.5vw; right: 1.5vw; ';
        },
    },
    created() {},
    mounted() {
        this.setVideoPlayerRef(this.$refs.videoPlayer);
    },
};
</script>
