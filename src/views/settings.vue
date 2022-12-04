<template>
    <div>
        <div class="text-2xl font-bold mb-5">Settings</div>

        <div class="mb-5">
            <label for="random" class="text-gray-300 block mb-2 font-bold flex items-center">
                <input
                    type="checkbox"
                    class="text-black"
                    id="random"
                    aria-describedby="randomHelp"
                    v-model="localSettings.override_parent_sequence"
                />
                <span class="ml-2">Override Parent Poster Ordering</span>
            </label>
            <div id="randomHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="random" class="text-gray-300 block mb-2 font-bold flex items-center">
                <input
                    type="checkbox"
                    class="text-black"
                    id="random"
                    aria-describedby="randomHelp"
                    v-model="localSettings.override_parent_transitons"
                />
                <span class="ml-2">Override Parent Poster Transitions</span>
            </label>
            <div id="randomHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="random" class="text-gray-300 block mb-2 font-bold flex items-center">
                <input
                    type="checkbox"
                    class="text-black"
                    id="random"
                    aria-describedby="randomHelp"
                    v-model="localSettings.override_parent_colors"
                />
                <span class="ml-2">Override Parent Theme/Colors</span>
            </label>
            <div id="randomHelp" class="text-gray-400 text-sm"></div>
        </div>

        <hr class="mt-3 mb-7 border-gray-700" />

        <div class="mb-5">
            <label for="random" class="text-gray-300 block mb-2 font-bold flex items-center">
                <input
                    type="checkbox"
                    class="text-black"
                    id="random"
                    aria-describedby="randomHelp"
                    v-model="localSettings.random_order"
                />
                <span class="ml-2">Randomize Poster Order</span>
            </label>
            <div id="randomHelp" class="text-gray-400 text-sm">
                Randomize poster order or display posters in order you selected.
            </div>
        </div>

        <div class="mb-5">
            <label for="type" class="text-gray-300 block mb-2 font-bold"> Transition Type </label>
            <select
                class="text-black mb-3"
                id="type"
                aria-describedby="typeHelp"
                v-model="localSettings.transition_type"
            >
                <option value="fade">Fade</option>
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
            </select>

            <div id="typeHelp" class="text-gray-400 text-sm">
                Fade in/out or Vertical slide transition.
            </div>
        </div>

        <div class="mb-5">
            <label for="display-speed" class="text-gray-300 block mb-2 font-bold"
                >Poster Display Speed</label
            >

            <input
                type="text"
                class="text-black w-full mb-2"
                id="display-speed"
                aria-describedby="display-speedHelp"
                v-model="localSettings.poster_display_speed"
            />
            <div id="display-speedHelp" class="text-gray-400 text-sm">
                Time between each poster. In ms. 15000 = 15 seconds.
            </div>
        </div>

        <hr class="mt-3 mb-7 border-gray-700" />

        <div class="mb-5">
            <label for="coming-soon-text" class="text-gray-300 block mb-2 font-bold"
                >Coming Soon Text</label
            >

            <input
                type="text"
                class="text-black w-full"
                id="coming-soon-text"
                aria-describedby="coming-soon-textHelp"
                v-model="localSettings.coming_soon_text"
            />
            <div id="coming-soon-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="now-playing-text" class="text-gray-300 block mb-2 font-bold"
                >Now Playing Text</label
            >

            <input
                type="text"
                class="text-black w-full"
                id="now-playing-text"
                aria-describedby="now-playing-textHelp"
                v-model="localSettings.now_playing_text"
            />
            <div id="now-playing-textHelp" class="text-gray-400 text-sm"></div>
        </div>
        <div class="mb-2">
            <label for="speaker-config" class="text-gray-300 block mb-2 font-bold flex items-center"
                >Speaker Config</label
            >
            <input
                type="text"
                class="text-black mb-2"
                id="speaker-config"
                aria-describedby="speaker-configHelp"
                v-model="localSettings.speaker_config"
                @input="formatSpeakerConfig"
                maxlength="12"
            />

            <div id="speaker-configHelp" class="text-gray-400 text-sm">
                Speaker config such as 5.1, 7.1.2, 9.4.6
            </div>
        </div>

        <div class="mb-2">
            <label
                for="speaker-config-location"
                class="text-gray-300 block mb-2 font-bold flex items-center"
                >Speaker Config Location</label
            >
            <select
                class="text-black mb-2"
                id="speaker-config-location"
                aria-describedby="speaker-config-locationHelp"
                v-model="localSettings.speaker_config_location"
            >
                <option value="bottom">Bottom</option>
                <option value="top-right">Top Right</option>
            </select>

            <div id="speaker-config-locationHelp" class="text-gray-400 text-sm"></div>
        </div>

        <label class="text-gray-300 block mb-5 font-bold flex items-center"
            ><input
                class="text-black"
                type="checkbox"
                v-model="localSettings.show_speaker_config"
            />
            <span class="ml-2">Show Speaker Config</span></label
        >

        <hr class="mt-3 mb-7 border-gray-700" />

        <div class="mb-5">
            <label for="poster-bg-color" class="text-gray-300 block mb-2 font-bold"
                >Poster Background Color</label
            >

            <input
                type="color"
                class="w-full rounded-none"
                id="poster-bg-color"
                aria-describedby="poster-bg-color-textHelp"
                v-model="localSettings.poster_bg_color"
            />
            <div id="header-bg-color-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="header-bg-color" class="text-gray-300 block mb-2 font-bold"
                >Top Background Color</label
            >

            <input
                type="color"
                class="w-full rounded-none"
                id="header-bg-color"
                aria-describedby="header-bg-color-textHelp"
                v-model="localSettings.header_bg_color"
            />
            <div id="header-bg-color-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="header-text-color" class="text-gray-300 block mb-2 font-bold"
                >Top Text Color</label
            >

            <input
                type="color"
                class="w-full rounded-none"
                id="header-text-color"
                aria-describedby="header-text-color-textHelp"
                v-model="localSettings.header_text_color"
            />
            <div id="header-text-color-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label
                for="show-header-border"
                class="text-gray-300 block mb-2 font-bold flex items-center"
            >
                <input
                    type="checkbox"
                    class="text-black"
                    id="show-header-border"
                    v-model="localSettings.show_header_border"
                />
                <span class="ml-2">Show Top Border</span>
            </label>
            <div id="show-header-border-Help" class="text-gray-400 text-sm">
                Displays thin border around "Coming Soon/Now Playing" text.
            </div>
        </div>

        <div class="mb-5">
            <label for="header-border-color" class="text-gray-300 block mb-2 font-bold"
                >Top Border Color</label
            >

            <input
                type="color"
                class="w-full rounded-none"
                id="header-border-color"
                aria-describedby="header-border-color-textHelp"
                v-model="localSettings.header_border_color"
            />
            <div id="header-border-color-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="header-font" class="text-gray-300 block mb-2 font-bold"
                >Coming Soon/Now Playing Font</label
            >

            <select
                class="w-full text-black"
                id="header-font"
                aria-describedby="header-font-textHelp"
                v-model="localSettings.header_font"
            >
                <option value="default">Default</option>
                <option value="riemann-theater">Riemann Theater</option>
                <option value="great-attraction">Great Attraction</option>
                <option value="midnight-champion">Midnight Champion</option>
                <option value="emerald">Emerald</option>
                <option value="airstrike">Airstrike</option>
                <option value="space-ranger">Space Ranger</option>
                <option value="feast-flesh">Feast of Flesh</option>
                <option value="camp-blood">Camp Blood</option>
                <option value="friday13">Friday 13th</option>
            </select>
            <div id="header-font-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="header-font-size" class="text-gray-300 block mb-2 font-bold"
                >Coming Soon/Now Playing Font Size</label
            >

            <select
                class="w-full text-black"
                id="header-font-size"
                aria-describedby="header-font-size-textHelp"
                v-model="localSettings.header_font_size"
            >
                <option value="xsmall">X-Small</option>
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xlarge">X-Large</option>
            </select>
            <div id="header-font-size-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="footer-bg-color" class="text-gray-300 block mb-2 font-bold"
                >Bottom Background Color</label
            >

            <input
                type="color"
                class="w-full rounded-none"
                id="footer-bg-color"
                aria-describedby="footer-bg-color-textHelp"
                v-model="localSettings.footer_bg_color"
            />
            <div id="footer-bg-color-textHelp" class="text-gray-400 text-sm"></div>
        </div>

        <div class="mb-5">
            <label for="footer-text-color" class="text-gray-300 block mb-2 font-bold"
                >Bottom Text Color</label
            >

            <input
                type="color"
                class="w-full rounded-none"
                id="footer-text-color"
                aria-describedby="footer-text-color-textHelp"
                v-model="localSettings.footer_text_color"
            />
            <div id="footer-text-color-textHelp" class="text-gray-400 text-sm"></div>
        </div>
        <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3"
            role="alert"
            v-if="settingsMessage"
            v-cloak
        >
            {{ settingsMessage }}
            <div v-for="(err, eIndex) in errors" :key="'err-' + eIndex">
                {{ err }}
            </div>
        </div>
        <div class="flex justify-between pt-4">
            <button
                type="submit"
                class="btn text-black bg-gray-300 text-md px-3 py-1 rounded-sm hover:bg-gray-100"
                @click.prevent="saveSettings"
            >
                Save Settings
            </button>

            <button
                type="submit"
                class="btn text-white bg-gray-600 text-md px-3 py-1 rounded-sm hover:bg-gray-500"
                @click.prevent="resetDefaults"
            >
                Reset Defaults
            </button>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { usePostersStore } from '@/store/posters';

export default {
    data: () => {
        return {
            errors: [],
            saving: false,
            settingsMessage: false,
        };
    },
    computed: {
        ...mapState(usePostersStore, ['localSettings']),
    },
    methods: {
        ...mapActions(usePostersStore, ['setLocalSettings']),
        saveSettings() {
            this.errors = [];
            this.saving = true;
            axios
                .post('http://' + location.hostname + ':3005/settings', {
                    settings: this.localSettings,
                })
                .then(() => {
                    this.saving = false;
                    this.settingsMessage = 'Settings saved!';
                    setTimeout(() => {
                        this.settingsMessage = false;
                    }, 3000);
                })
                .catch((e) => {
                    this.saving = false;
                    this.errors.push({ message: e.message });
                    console.log(e.message);
                });
        },
        resetDefaults() {
            this.errors = [];
            axios
                .get('http://' + location.hostname + ':3005/reset-settings')
                .then((response) => {
                    this.setLocalSettings(response.settings);
                    this.settingsMessage = 'Defaults set!';
                    setTimeout(() => {
                        this.settingsMessage = false;
                    }, 3000);
                })
                .catch((e) => {
                    this.errors.push({ message: e.message });
                    console.log(e.message);
                });
        },
    },
    created() {},
    mounted() {},
};
</script>
