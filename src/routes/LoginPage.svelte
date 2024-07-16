<script lang="ts">
	import { completeMagicLinkSignupIfPresent } from '$lib/firebase/auth';
	import { navigate } from 'svelte-routing';

	completeMagicLinkSignupIfPresent().then(() => {
		navigate('/characters', { replace: true });
	});
</script>
