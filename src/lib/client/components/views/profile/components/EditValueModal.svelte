<script lang="ts">
	import IconButtonWithLoadingSpinner from '$lib/client/components/common/IconButtonWithLoadingSpinner.svelte';
	import InputWithErrorMessage from '$lib/client/components/common/InputWithErrorMessage.svelte';

	import Modal from '$lib/client/components/common/Modal.svelte';
	import { validateNotEmpty } from '$lib/client/utils/validator.util';
	import { faCancel, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

	export let name: string;
	export let value: string;
	export let onSave: (newValue: string) => void;
	export let onExit: () => void;

	let open = true;
	let newValue: string = value;
</script>

<Modal {open} class=" max-w-xs">
	<div class="flex flex-col gap-4">
		<InputWithErrorMessage
			id="valueInput"
			labelText={`Edit ${name}`}
			bind:value={newValue}
			placeholder={newValue}
			validator={validateNotEmpty}
		/>
		<div class="flex flex-row gap-4">
			<IconButtonWithLoadingSpinner
				text="Cancel"
				icon={faCancel}
				class="btn-accent flex-1"
				onClick={() => {
					open = false;
					onExit();
				}}
			/>
			<IconButtonWithLoadingSpinner
				text="Save"
				icon={faFloppyDisk}
				class="flex-1"
				onClick={() => {
					onSave(newValue);
					open = false;
					onExit();
				}}
			/>
		</div>
	</div>
</Modal>
