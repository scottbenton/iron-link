<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import Router from './Router.svelte';
	import './index.scss';
	import './styles/styles.scss';
	import { listenToAuth } from '$lib/firebase/auth';

	listenToAuth();

	useRegisterSW({
		immediate: true
	});
</script>

<Router />
