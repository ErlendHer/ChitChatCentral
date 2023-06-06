<script lang="ts">
	import SimpleLoadingSpinner from '$lib/client/components/common/SimpleLoadingSpinner.svelte';
	import WrapWithAuth from '$lib/client/components/common/WrapWithAuth.svelte';
	import RoomError from '$lib/client/components/views/rooms/RoomError.svelte';
	import type { RoomInfo } from '$lib/client/components/views/rooms/RoomView.svelte';
	import RoomView from '$lib/client/components/views/rooms/RoomView.svelte';
	import { openSuccessToast } from '$lib/client/toast';
	import { cccApiGET } from '$lib/client/utils/apiUtils';
	import type { RoomsResponses } from '@cccApi/rooms';
	import { onMount } from 'svelte';

	export let data: {
		roomId: string | undefined;
	};

	const roomId = data.roomId;

	let roomInfoLoading = false;
	let roomInfoFetchError: string | undefined = undefined;

	let unauthorized = false;
	let roomNotFound = false;

	let roomInfo: RoomInfo | undefined = undefined;

	async function loadRoomInfo() {
		roomInfoLoading = true;
		unauthorized = false;
		roomNotFound = false;
		roomInfoFetchError = undefined;

		try {
			const roomInfoResult = await cccApiGET<RoomsResponses['[id]']>(`/rooms/${roomId}`);
			if (!roomInfoResult.success) {
				if (roomInfoResult.error.statusCode === 401 || roomInfoResult.error.statusCode === 403) {
					unauthorized = true;
					return;
				}

				if (roomInfoResult.error.statusCode === 404) {
					roomNotFound = true;
					return;
				}

				throw new Error(roomInfoResult.error.messageWithCode);
			}
			openSuccessToast('Room joined successfully');
			roomInfo = roomInfoResult.data.data;
		} catch (err) {
			roomInfoFetchError = `${(err as Error).message}`;
		} finally {
			roomInfoLoading = false;
		}
	}

	onMount(async () => {
		await loadRoomInfo();
	});
</script>

<div class="flex flex-col items-center w-full h-full">
	{#if roomInfoLoading}
		<div class="flex flex-col gap-2 items-center">
			<SimpleLoadingSpinner size="large" />
			<div class="text-info font-bold text-lg text-center mb-2">Joining room...</div>
		</div>
	{:else if unauthorized}
		<RoomError message="Not so fast... ⛔" error="You are not authorized to join this room." />
	{:else if roomNotFound}
		<RoomError
			message="Room not found 🤷‍♂️"
			error="The room you are trying to join does not exist."
		/>
	{:else if roomInfoFetchError}
		<RoomError message="Failed to join room 😭" error={roomInfoFetchError} />
	{:else if roomInfo}
		<WrapWithAuth let:user>
			<RoomView {roomInfo} {user} />
		</WrapWithAuth>
	{:else}
		<RoomError message="Failed to join room 😭" error="Unknown error" />
	{/if}
</div>
