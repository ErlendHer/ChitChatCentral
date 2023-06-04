<script lang="ts">
	import { onMount } from 'svelte';

	let _class: string = '';

	export let label: string;
	export let checked: boolean;
	export let persistenceId: string | undefined = undefined;

	let initialized = false;

	onMount(() => {
		// If persistenceId is set, we should persist the value with the given ID in local storage
		if (persistenceId) {
			initialized = true;
			const savedValue = localStorage.getItem(persistenceId);
			if (savedValue) {
				checked = savedValue === 'true';
			}
		}
	});

	$: if (initialized) updateLocalStorage(checked);

	/**
	 * Updates local storage with the checked value of the checkbox using the {@link persistenceId}
	 * @param checked checkbox value
	 */
	function updateLocalStorage(checked: boolean) {
		if (persistenceId) {
			localStorage.setItem(persistenceId, checked.toString());
		}
	}

	export { _class as class };
</script>

<div class="flex flex-row items-center gap-4">
	<label class="label px-0" for="toggleCommandMode">{label}</label>
	<input
		type="checkbox"
		class="toggle-primary toggle {_class}"
		bind:checked
		id="toggleCommandMode"
	/>
</div>
