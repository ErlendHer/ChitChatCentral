<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

	let _class: string = '';
	export { _class as class };
	export let icon: IconDefinition;

	$: iconPath = icon.icon[4] as string;
</script>

{#if icon}
	<svg
		aria-hidden="true"
		class={_class}
		role="img"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 {icon.icon[0]} {icon.icon[1]}"
	>
		<path fill="currentColor" d={iconPath} />
	</svg>
{/if}
