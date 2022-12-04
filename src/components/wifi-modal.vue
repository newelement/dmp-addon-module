<template>
    <div v-if="showWifiModal" class="modal">
        <div class="modal-overlay"></div>
        <div class="modal-content w-full max-w-xl rounded-sm overflow-hidden">
            <div class="inner p-6">
                <header class="modal-header p-4 text-center">
                    <h4 class="text-2xl font-bold text-white">WIFI Settings</h4>
                </header>
                <div class="modal-body p-4">
                    <div class="mb-5">
                        <label class="text-gray-300 block mb-2 font-bold" for="name">
                            Country Code
                        </label>
                        <select
                            id="country-code"
                            class="text-black w-full"
                            v-model="localSettings.wifi_country_code"
                        >
                            <option value="CA">CA</option>
                            <option value="GB">GB</option>
                            <option value="US">US</option>
                        </select>
                    </div>
                    <div class="mb-5">
                        <label class="text-gray-300 block mb-2 font-bold" for="sid"
                            >Wifi Name \ SID</label
                        >
                        <input
                            type="text"
                            id="sid"
                            class="text-black w-full"
                            v-model="localSettings.wifi_sid"
                        />
                    </div>
                    <div class="mb-5">
                        <label class="text-gray-300 block mb-2 font-bold" for="wifi-password"
                            >Password</label
                        >
                        <input
                            type="password"
                            id="wifi-password"
                            class="text-black w-full"
                            v-model="localSettings.wifi_password"
                        />
                    </div>
                    <ul class="px-3 mt-3 py-1 bg-white text-red-700" v-if="errors.length > 0">
                        <li v-for="(error, eIndex) in errors" :key="'err-' + eIndex">
                            {{ error.message }}
                        </li>
                    </ul>
                    <ul class="px-3 mt-3 py-1 bg-white text-green-700" v-if="messages.length > 0">
                        <li v-for="(mess, mIndex) in messages" :key="'mess-' + mIndex">
                            {{ mess.message }}
                        </li>
                    </ul>
                </div>
                <footer class="modal-footer flex justify-between items-center p-4">
                    <button
                        type="button"
                        class="bg-gray-500 text-black px-6 py-2 rounded-sm hover:bg-gray-100"
                        @click.prevent="cancel"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        class="bg-white text-black px-6 py-2 rounded-sm hover:bg-gray-400"
                        @click.prevent="saveWifiInfo"
                    >
                        Save WIFI Info
                    </button>
                </footer>
            </div>
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
            messages: [],
        };
    },
    components: {},
    computed: {
        ...mapState(usePostersStore, ['showWifiModal', 'localSettings']),
    },
    methods: {
        ...mapActions(usePostersStore, ['setShowWifiModal']),
        saveWifiInfo(plugin) {
            this.errors = [];
            this.messages = [];
            axios
                .post('/api/wifi', {
                    country_code: this.localSettings.wifi_country_code,
                    sid: this.localSettings.wifi_sid,
                    password: this.localSettings.wifi_password,
                })
                .then((response) => {
                    this.messages.push({ message: 'WIFI info saved. Please reboot.' });
                })
                .catch((e) => {
                    console.log(e.message);
                    this.errors.push({ message: e.message });
                });
        },
        getSettings() {
            axios
                .get('/api/settings')
                .then((response) => {
                    this.settings = response.data;
                })
                .catch((e) => {
                    console.log(e.message);
                });
        },
        cancel() {
            this.errors = [];
            this.messages = [];
            this.setShowWifiModal(false);
        },
    },
    created() {},
    mounted() {},
};
</script>
