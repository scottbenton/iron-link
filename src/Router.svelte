<script lang="ts">
	import { Route, Router } from 'svelte-routing';
	import Layout from '$components/Layout/Layout.svelte';
	import CharacterSelectPage from './routes/characters/CharacterSelectPage/CharacterSelectPage.svelte';
	import { type DB } from './lib/db';
	import CharacterCreatePage from '$routes/characters/CharacterCreatePage/CharacterCreatePage.svelte';
	import AuthBlocker from '$components/Layout/AuthBlocker.svelte';
	import LoginPage from '$routes/LoginPage.svelte';
</script>

<Router>
	<Layout>
		<Route path="/login"><LoginPage /></Route>
		<Route path="/characters/*">
			<AuthBlocker>
				<Router>
					<Route path="/"><CharacterSelectPage /></Route>
					<Route path="/add"><CharacterCreatePage /></Route>
					<Route path="/:id" let:params>Character Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</AuthBlocker>
		</Route>
		<Route path="/campaigns/*">
			<AuthBlocker>
				<Router>
					<Route path="/">Campaign Select Page</Route>
					<Route path="/add">Create Page</Route>
					<Route path="/:id" let:params>Campaign Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</AuthBlocker>
		</Route>
		<Route path="/worlds/*">
			<AuthBlocker>
				<Router>
					<Route path="/">World Select Page</Route>
					<Route path="/:id" let:params>World Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</AuthBlocker>
		</Route>
		<Route path="/homebrew/*">
			<AuthBlocker>
				<Router>
					<Route path="/">Homebrew Select Page</Route>
					<Route path="/:id" let:params>Homebrew Sheet Page {params.id}</Route>
					<Route path="*">404 Page</Route>
				</Router>
			</AuthBlocker>
		</Route>
		<Route path="*">404 Page</Route>
	</Layout>
</Router>
