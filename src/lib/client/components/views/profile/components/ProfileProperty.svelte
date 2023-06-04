<script lang="ts">
	import IconButton from '$lib/client/components/common/IconButton.svelte';
	import { faEdit } from '@fortawesome/free-solid-svg-icons';

	export let name: string;
	export let value: string;
	export let editable = false;

	export let onEditClick: () => void = () => {};
</script>

<tr>
	<td class="text-base-content text-2xl whitespace-nowrap sm:p-2">{name}:</td>
	<td class="flex flex-row items-center gap-2 whitespace-nowrap sm:p-2">
		<div class="text-base-content text-2xl italic font-bold">{value}</div>
		{#if editable}
			<IconButton icon={faEdit} onClick={onEditClick} />
		{/if}
	</td>
</tr>
