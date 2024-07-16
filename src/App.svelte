<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { initDB } from './lib/db/rxdb';
	import Router from './Router.svelte';
	import './index.scss';
	import { listenToAuth } from '$lib/firebase/auth';

	listenToAuth();

	const dbPromise = initDB();
	useRegisterSW({
		immediate: true
	});
</script>

{#await dbPromise then db}
	<Router {db} />
{:catch error}
	<p>{error.message}</p>
{/await}
