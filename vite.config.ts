import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import iconsPlugin from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import './src/styles/styles.scss';`
			}
		}
	},
	plugins: [
		svelte(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				cleanupOutdatedCaches: true
			},
			pwaAssets: {},
			// devOptions: {
			// 	enabled: true
			// },
			manifest: {
				name: 'Iron Link',
				short_name: 'Iron Link',
				theme_color: '#fff'
			}
		}),
		iconsPlugin({
			compiler: 'svelte'
		})
	]
});
