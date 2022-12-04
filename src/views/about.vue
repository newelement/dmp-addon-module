<template>
    <div class="text-2xl font-bold">ABOUT</div>
</template>
<script>
import { mapState } from 'pinia';
import { usePostersStore } from '@/store/posters';

export default {
    data: () => {
        return {};
    },
    computed: {
        ...mapState(usePostersStore, []),
    },
    methods: {},
    created() {},
    mounted() {},
};
</script>
