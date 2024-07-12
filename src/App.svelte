<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import Theme from './lib/theme/theme.svelte';
	import { Route, Router } from 'svelte-routing';
	import Layout from '$components/Layout/Layout.svelte';
	import CharacterSelectPage from './routes/characters/CharacterSelectPage/CharacterSelectPage.svelte';
	import { initDB } from './lib/db/rxdb';
	import CharacterCreatePage from '$routes/characters/CharacterCreatePage/CharacterCreatePage.svelte';

	const dbPromise = initDB();
	useRegisterSW({ immediate: true });
</script>

<Theme />

{#await dbPromise then}
	<Router>
		<Layout>
			<Route path="/characters/*">
				<Router>
					<Route path="/"><CharacterSelectPage /></Route>
					<Route path="/add"><CharacterCreatePage /></Route>
					<Route path="/:id" let:params>Character Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</Route>
			<Route path="/campaigns/*">
				<Router>
					<Route path="/">Campaign Select Page</Route>
					<Route path="/add">Create Page</Route>
					<Route path="/:id" let:params>Campaign Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</Route>
			<Route path="/worlds/*">
				<Router>
					<Route path="/">World Select Page</Route>
					<Route path="/:id" let:params>World Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</Route>
			<Route path="/homebrew/*">
				<Router>
					<Route path="/">Homebrew Select Page</Route>
					<Route path="/:id" let:params>Homebrew Sheet Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</Route>
			<Route path="*">404 Page</Route>
		</Layout>
	</Router>
{/await}

<style>
	.test {
		min-height: 200vh;
	}
</style>
