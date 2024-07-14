<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import Theme from './lib/theme/theme.svelte';
	import { initDB } from './lib/db/rxdb';
	import Router from './Router.svelte';

	const dbPromise = initDB();
	useRegisterSW({
		immediate: true
	});
</script>

<Theme />

{#await dbPromise then db}
	<Router {db} />
{:catch error}
	<p>{error.message}</p>
{/await}
