import { createRouter, createWebHistory } from 'vue-router';
import Posters from '@/views/posters.vue';
import Settings from '@/views/settings.vue';
import About from '@/views/about.vue';

import MainHeader from '@/partials/main-header.vue';
import MainNav from '@/partials/main-nav.vue';

const routes = [
    {
        path: '/',
        name: 'Posters',
        components: {
            posterscontent: Posters,
        },
        meta: {
            requiresSetup: true,
        },
    },
    {
        path: '/settings',
        name: 'Settings',
        components: {
            header: MainHeader,
            nav: MainNav,
            content: Settings,
        },
    },
    {
        path: '/about',
        name: 'About',
        components: {
            header: MainHeader,
            nav: MainNav,
            content: About,
        },
    },
];

let router = createRouter({
    history: createWebHistory('/'),
    linkExactActiveClass: 'active',
    routes,
});

export default router;
