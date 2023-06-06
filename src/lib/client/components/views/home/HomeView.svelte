<script lang="ts">
	import { goto } from '$app/navigation';
	import IconButtonWithLoadingSpinner from '$lib/client/components/common/IconButtonWithLoadingSpinner.svelte';
	import { openErrorToast, openSuccessToast } from '$lib/client/toast';
	import { cccApiPOST } from '$lib/client/utils/apiUtils';
	import type { RoomsResponses } from '@cccApi/rooms';
	import { faAnglesRight, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
	import InputWithErrorMessage from '../../common/InputWithErrorMessage.svelte';

	let createRoomLoading = false;
	let roomCode = '';

	const validateRoomCode = (code: string): string | null => {
		if (!code || code === '') {
			return 'Room code cannot be empty';
		}

		if (!/^[a-zA-Z0-9]+$/.test(code)) {
			return 'Room code can only contain letters and numbers';
		}

		if (code.length !== 5) {
			return 'Room code must be 5 characters long';
		}

		return null;
	};

	async function createRoom() {
		try {
			createRoomLoading = true;
			const roomsResult = await cccApiPOST<RoomsResponses['create']>('/rooms/create');
			if (!roomsResult.success) {
				throw new Error(roomsResult.error.messageWithCode);
			}
			const roomId = roomsResult.data.data.roomId;
			openSuccessToast(`Created room ${roomId}`);
			goto(`/rooms/${roomId}`);
		} catch (err) {
			console.error(err);
			openErrorToast(`Failed to create room: ${(err as Error).message}`);
		} finally {
			createRoomLoading = false;
		}
	}
</script>

<div class="w-full flex flex-col items-center">
	<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold font-BubbleGumSans text-accent">
		Chit Chat Central
	</h1>
	<p class="text-lg italic text-base-content max-w-xs text-center">
		To chit chat, create your own room and invite friends, or join an existing one!
	</p>
	<h2 class="text-accent font-BubbleGumSans text-3xl sm:text-4xl lg:text-5xl mt-2">Rooms</h2>
	<div class="flex flex-col items-stretch gap-4 m-4">
		<div class="border-2 rounded-lg border-base-200 p-4 flex-1 flex flex-col items-center gap-4">
			<p class="text-lg italic text-base-content font-bold">Start your own...</p>
			<IconButtonWithLoadingSpinner
				text="Create Chat Room"
				icon={faCirclePlus}
				onClick={createRoom}
				loading={createRoomLoading}
				disabled={createRoomLoading}
			/>
		</div>

		<div class="flex flex-col items-center border-2 rounded-lg border-base-200 p-4 flex-1">
			<p class="text-lg italic text-base-content font-bold">Or join an existing one!</p>
			<div class="flex flex-row items-end justify-center gap-2 flex-wrap">
				<InputWithErrorMessage
					id="roomCodeInput"
					labelText="Room Code"
					bind:value={roomCode}
					placeholder="CCC99"
					validator={validateRoomCode}
					reserveSpaceForErrorMessage={false}
					class="mb-4"
				/>
				<IconButtonWithLoadingSpinner
					text="Join Chat Room"
					icon={faAnglesRight}
					onClick={() => goto(`/rooms/${roomCode.toUpperCase()}`)}
					class="mb-4"
				/>
			</div>
		</div>
	</div>
</div>
