<template>
    <div class="admin py-5" :class="{ rotated: rotated }">
        <div class="md:container md:mx-auto lg:container lg:mx-auto">
            <div class="grid lg:grid-cols-12 gap-4">
                <div class="lg:col-span-3">
                    <router-view name="nav"></router-view>
                </div>
                <main class="main lg:col-span-9 p-4 relative">
                    <router-view name="content"></router-view>
                </main>
            </div>
        </div>
        <div :class="{ rotated: rotated }">
            <router-view name="posterscontent"></router-view>
        </div>
        <wifi-modal></wifi-modal>
        <devices-modal></devices-modal>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { usePostersStore } from '@/store/posters';
import WifiModal from '@/components/wifi-modal.vue';
import DevicesModal from '@/components/devices-modal.vue';

export default {
    data: () => {
        return {
            rotated: false,
            isDashboard: false,
        };
    },
    components: {
        WifiModal,
        DevicesModal,
    },
    computed: {
        ...mapState(usePostersStore, []),
        currentRouteName() {
            return this.$route.name;
        },
    },
    methods: {
        ...mapActions(usePostersStore, [
            'boot',
            'discoverDevices',
            'setShowWifiModal',
            'setShowDevicesModal',
        ]),
        kbListener(event) {
            if (event.key === 'W') {
                this.setShowWifiModal(true);
            }
            if (event.key === 'D') {
                console.log('DEEZ NUTS');
                this.setShowDevicesModal(true);
            }
        },
    },
    created() {
        this.boot();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.has('rotate') && urlParams.get('rotate') === 'true') {
            this.rotated = true;
        }
    },
    mounted() {
        window.addEventListener('keydown', this.kbListener);
        setTimeout(() => {
            this.discoverDevices();
        }, 3000);
    },
};
</script>
