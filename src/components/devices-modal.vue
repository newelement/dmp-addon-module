<template>
    <div v-if="showDevicesModal" class="modal">
        <div class="modal-overlay"></div>
        <div class="modal-content w-full max-w-xl rounded-sm overflow-hidden">
            <div class="inner p-6">
                <header class="modal-header p-4 text-center">
                    <h4 class="text-2xl font-bold text-white">Parent Devices</h4>
                </header>
                <div class="modal-body p-4">
                    <p class="text-center font-bold" v-if="parentDevices.length === 0">
                        Looking for parent devices ...
                    </p>
                    <a
                        v-for="(device, dIndex) in parentDevices"
                        class="
                            block
                            mb-3
                            border
                            rounded-sm
                            px-4
                            py-2
                            hover:bg-slate-700
                            cursor-pointer
                            flex
                            items-center
                            justify-between
                        "
                        @click.prevent="setParentDevice(device)"
                        rol="button"
                        :key="'device-' + dIndex"
                    >
                        <div>
                            <h3 class="text-lg font-bold">{{ device.name }}</h3>
                            <p class="text-slate-300 text-base">{{ device.host.slice(0, -1) }}</p>
                        </div>
                        <span class="font-bold text-md">Connect</span>
                    </a>
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
                <footer class="modal-footer flex justify-center items-center p-4">
                    <button
                        type="button"
                        class="bg-slate-400 text-black px-6 py-2 rounded-sm hover:bg-gray-100"
                        @click.prevent="cancel"
                    >
                        Close
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
        ...mapState(usePostersStore, [
            'localSettings',
            'setParentHostname',
            'showDevicesModal',
            'parentDevices',
        ]),
    },
    methods: {
        ...mapActions(usePostersStore, ['setShowDevicesModal']),
        setParentDevice(device) {
            this.errors = [];
            this.messages = [];
            let host = device.host.slice(0, -1);
            this.setParentHostname(host);
            axios
                .post('http://' + location.hostname + ':3005/set-device', { host: host })
                .then((response) => {
                    this.setShowDevicesModal(false);
                })
                .catch((e) => {
                    console.log(e.message);
                    this.errors.push({ message: e.message });
                });
        },
        cancel() {
            this.errors = [];
            this.messages = [];
            this.setShowDevicesModal(false);
        },
    },
    created() {},
    mounted() {},
};
</script>
