import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import babel from '@rollup/plugin-babel';

export default defineConfig({
    plugins: [vue()],
    /*rollupInputOptions: {
        plugins: [
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            corejs: 2,
                            useBuiltIns: 'usage',
                            targets: {
                                ie: '11',
                            },
                        },
                    ],
                ],
            }),
        ],
    },*/
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
