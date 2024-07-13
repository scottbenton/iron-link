<script lang="ts" generics="T">
	interface $$Slots {
		item: { item: T };
	}
	export let items: T[] = [];
</script>

<ul>
	{#each items as item}
		<li>
			<slot name="item" {item} />
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: $space-4;
		list-style: none;
		padding: unset;
	}
	li {
		padding: unset;
		margin: unset;
	}
</style>
