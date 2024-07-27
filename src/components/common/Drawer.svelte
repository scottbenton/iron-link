<script lang="ts">
	import IconButton from '$components/IconButton.svelte';
	import { createDialog, createSync, melt } from '@melt-ui/svelte';
	import { sineInOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import CloseIcon from 'virtual:icons/tabler/x';
	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;

	export let open: boolean = false;
	export let side: 'left' | 'right' = 'left';

	const {
		elements: {
			trigger,
			portalled,
			overlay,
			content,
			title: titleElement,
			description: descriptionElement,
			close
		},
		states
	} = createDialog({
		forceVisible: true
	});

	const { open: openState } = states;

	const sync = createSync(states);
	$: sync.open(open, (v) => (open = v));

	function closeDialog() {
		openState.set(false);
	}

	function swipeToClose(node: HTMLElement) {
		let startX: number;

		function handleTouchStart(event: TouchEvent) {
			startX = event.touches[0].clientX;
		}

		function handleTouchMove(event: TouchEvent) {
			// Optional: You can implement feedback as the user swipes
		}

		function handleTouchEnd(event: TouchEvent) {
			const endX = event.changedTouches[0].clientX;
			const diffX = endX - startX;

			// Adjust the threshold as needed, here it's set to 50px
			if (Math.abs(diffX) > 50) {
				// Assuming a left swipe should close the drawer
				// For right swipe, you can check the direction and call closeDialog accordingly
				closeDialog();
			}
		}

		node.addEventListener('touchstart', handleTouchStart);
		node.addEventListener('touchmove', handleTouchMove);
		node.addEventListener('touchend', handleTouchEnd);

		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
				node.removeEventListener('touchend', handleTouchEnd);
			}
		};
	}
</script>

{#if $$slots.trigger}
	<slot name="trigger" trigger={$trigger} />
{/if}

{#if $openState}
	<div use:melt={$portalled}>
		<div use:melt={$overlay} transition:fade={{ duration: 200, easing: sineInOut }} />
		<div
			use:melt={$content}
			use:swipeToClose
			class={side}
			transition:slide={{ duration: 200, easing: sineInOut, axis: 'x' }}
		>
			{#if $$slots.title}
				<slot name="title" {title} />
			{/if}
			{#if $$slots.description}
				<slot name="description" {description} />
			{/if}
			{#if title}
				<h2 class="screen-reader-only" use:melt={$titleElement}>{title}</h2>
			{/if}
			{#if description}
				<p class="screen-reader-only" use:melt={$descriptionElement}>{description}</p>
			{/if}
			<div class="button-container">
				<IconButton meltAction={$close} label="Close">
					<CloseIcon />
				</IconButton>
			</div>
			<slot {closeDialog} />
		</div>
	</div>
{/if}

<style lang="scss">
	div[data-melt-dialog-overlay] {
		background-color: transparentize($color: $gray-950, $amount: 0.4);
		backdrop-filter: blur($space-1);
		position: fixed;
		z-index: 99;
		inset: 0;
	}
	div[data-melt-dialog-content] {
		background-color: $background-default;
		// min-width: 200px;
		color: $text-primary;
		// border-radius: $border-radius;
		border: 1px solid $divider;
		position: fixed;
		z-index: 100;
		&.left {
			left: 0px;
		}
		&.right {
			right: 0px;
		}
		top: 0px;
		bottom: 0px;
		overflow: auto;
	}
	.button-container {
		display: flex;
		justify-content: flex-end;
		padding: $space-2;
	}
</style>
