<script lang="ts">
	export let open: boolean;
	export { _class as class };
	let _class: string = '';
</script>

<div class="modal {open ? 'modal-open' : 'modal-closed'}">
	<div class="modal-box max-w-screen-xl {_class}">
		<slot />
	</div>
</div>
