<script lang="ts">
	import type { FileSettings } from '$types/FileSettings.type';
	import UploadIcon from 'virtual:icons/tabler/user-hexagon';

	const sizes = {
		small: 64,
		medium: 128,
		large: 256
	};

	export let size: keyof typeof sizes = 'medium';
	export let image: File | undefined;
	export let settings: FileSettings = {
		crop: { x: 0, y: 0 },
		zoom: 1
	};
	export let DefaultIcon = UploadIcon;

	$: isTaller = true;

	// the crop x and y value refer to the scaled px to from the center of the image to the center of
	// so we need to calculate the margin to center the image
	$: marginTop = -settings.crop.y;
	$: marginLeft = -settings.crop.x;

	$: imageUrl = image ? URL.createObjectURL(image) : undefined;
	$: transformStatement = `transform: translate(calc(${marginLeft}% ), calc(${marginTop}%))`;
</script>

<div
	class="portrait"
	class:empty={!image}
	style={`width: ${sizes[size]}px; height: ${sizes[size]}px;`}
>
	{#if imageUrl}
		<img
			src={imageUrl}
			alt="Cropped"
			width={isTaller ? `${100 * settings.zoom}%` : 'auto'}
			height={isTaller ? 'auto' : `${100 * settings.zoom}%`}
			style={transformStatement}
			on:load={(evt) => {
				isTaller = evt.currentTarget.clientHeight > evt.currentTarget.clientWidth;
			}}
		/>
	{:else}
		<DefaultIcon font-size="2rem" stroke-width="1px" />
	{/if}
</div>

<style lang="scss">
	.portrait {
		overflow: hidden;

		background-color: $background-inset-alt;
		color: $text-tertiary;
		display: block;
		border-width: 1px;
		border-style: solid;
		border-color: $divider;
		border-radius: $border-radius;
		flex-shrink: 0;

		img {
			position: relative;
			max-width: unset;
		}

		&.empty {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
