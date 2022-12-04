<template>
    <div
        :class="{ 'speaker-config-bottom': parentSettings.speaker_config_location === 'bottom' }"
        v-if="parentSettings.show_speaker_config"
    >
        <span
            class="speaker-config rounded-md px-1 border-2"
            :class="{
                'speaker-config-top': parentSettings.speaker_config_location === 'top-right',
                'speaker-config-bottom': parentSettings.speaker_config_location === 'bottom',
            }"
            :style="'border-color:' + color + '; text-color: ' + color"
        >
            <span class="speaker-config-text">{{ parentSettings.speaker_config }}</span>
        </span>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { usePostersStore } from '@/store/posters';

export default {
    name: 'SpeakerConfig',
    data: function () {
        return {};
    },
    computed: {
        ...mapState(usePostersStore, ['parentSettings']),
        color() {
            if (this.parentSettings.speaker_config_location === 'bottom') {
                return this.parentSettings.footer_text_color;
            }
            if (this.parentSettings.speaker_config_location === 'top-right') {
                return this.parentSettings.header_text_color;
            }
            return '#ffffff';
        },
    },
    methods: {},
    mounted() {},
};
</script>
<style lang="scss" scoped>
.speaker-config {
    font-size: 2vw;
    font-weight: 400;
    line-height: 1;
}
.speaker-config-top {
    position: absolute;
    right: 4%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.8vw;
}

.speaker-config-bottom {
    max-width: 7.5vw;
}
</style>
