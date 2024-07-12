<script lang="ts">
	import { announcer } from '$lib/stores/announcer.store';
</script>

<div role="status" aria-live="polite" class="screen-reader-only">
	{$announcer ?? ''}
</div>

<style lang="scss"></style>
