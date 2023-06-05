<script lang="ts">
	import IconFa from '$lib/client/components/common/IconFa.svelte';
	import SimpleLoadingSpinner from '$lib/client/components/common/SimpleLoadingSpinner.svelte';
	import RoomError from '$lib/client/components/views/rooms/RoomError.svelte';
	import { openSuccessToast } from '$lib/client/toast';
	import { cccApiGET } from '$lib/client/utils/apiUtils';
	import type { RoomsResponses } from '@cccApi/rooms';
	import { faWarning } from '@fortawesome/free-solid-svg-icons';
	import { API } from 'aws-amplify';
	import { onMount } from 'svelte';

	export let data: {
		roomId: string | undefined;
	};

	const roomId = data.roomId;

	let roomInfoLoading = false;
	let roomInfoFetchError: string | undefined = undefined;

	let unauthorized = false;
	let roomNotFound = false;

	async function loadRoomInfo() {
		roomInfoLoading = true;
		unauthorized = false;
		roomNotFound = false;
		roomInfoFetchError = undefined;

		try {
			const roomInfo = await cccApiGET<RoomsResponses['[id]']>(`/rooms/${roomId}`);
			if (!roomInfo.success) {
				if (roomInfo.error.statusCode === 401 || roomInfo.error.statusCode === 403) {
					unauthorized = true;
					return;
				}

				if (roomInfo.error.statusCode === 404) {
					roomNotFound = true;
					return;
				}

				throw new Error(roomInfo.error.messageWithCode);
			}
			openSuccessToast('Room joined successfully');
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

<div class="flex flex-col items-center w-full">
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
	{:else}
		<div>Room</div>
	{/if}
</div>