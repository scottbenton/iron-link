<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import { i18n } from './lib';
	import Theme from './lib/theme/theme.svelte';
	import { Link, Route, Router } from 'svelte-routing';
	import Layout from './lib/components/Layout/Layout.svelte';

	useRegisterSW({ immediate: true });
</script>

<Theme />

<Router>
	<Layout>
		<nav>
			Navbar
			<Link to="/characters" let:active>Characters {active}</Link>
			<Link to="/campaigns" let:active>Campaigns {active}</Link>
			<Link to="/worlds" let:active>Worlds {active}</Link>
			<Link to="/homebrew" let:active>Homebrew {active}</Link>
		</nav>
		<Route path="/characters/*">
			<Router>
				<Route path="/">Character Select Page</Route>
				<Route path="/add">Create Page</Route>
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

<style>
	.test {
		min-height: 200vh;
	}
</style>
