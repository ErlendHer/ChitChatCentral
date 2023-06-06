<script lang="ts" context="module">
	import { openErrorToast } from '$lib/client/toast';
	import { cccApiGET } from '$lib/client/utils/apiUtils';
	import type { CognitoUser } from '@aws-amplify/auth';
	import type { Response_GetRoom, Response_Participants, RoomsResponses } from '@cccApi/rooms';
	import { onMount, onDestroy } from 'svelte';
	import ChatViewWithProfiles from './ChatViewWithProfiles.svelte';
	import { PubSub } from 'aws-amplify';
	import { roomMessage, triggerUpdate } from './messages/roomMessages.store';
	import type { RoomMessage } from './rooms.types';

	export type RoomInfo = Response_GetRoom;
	export type ParticipantInfo = Response_Participants;
</script>

<script lang="ts">
	import IconButton from '../../common/IconButton.svelte';
	import { faCog } from '@fortawesome/free-solid-svg-icons';
	import ConfigurationModal from './roomConfiguration/ConfigurationModal.svelte';

	export let roomInfo: RoomInfo;
	export let user: CognitoUser;

	let participantInfo: ParticipantInfo | undefined = undefined;
	let participantsLoading = false;

	let messagesSubscription: { unsubscribe: () => void } | undefined = undefined;

	let configureModalOpen = false;

	async function fetchRoomInfo() {
		try {
			participantsLoading = true;
			const roomInfoResult = await cccApiGET<RoomsResponses['[id]/participants']>(
				`/rooms/${roomInfo.roomId}/participants`
			);

			if (!roomInfoResult.success) throw new Error(roomInfoResult.error.messageWithCode);

			participantInfo = roomInfoResult.data.data;
		} catch (err) {
			console.error(err);
			openErrorToast(`${(err as Error).message}`);
		} finally {
			participantsLoading = false;
		}
	}

	async function listenForMessage() {
		messagesSubscription = PubSub.subscribe(roomInfo.secret).subscribe({
			next: async (data) => {
				console.log('Received message', data);
				const msg = data.value as RoomMessage;
				$roomMessage = msg;

				if (msg.command.type === 'update') {
					await fetchRoomInfo();
				}
			},
			error: (error) => {
				console.warn(error);
			},
			complete: () => console.log('Done')
		});
		console.log('Listening on', roomInfo.secret);
	}

	onDestroy(() => {
		messagesSubscription?.unsubscribe();
	});

	onMount(async () => {
		// When a user joins a room, trigger an update so other users are notified
		triggerUpdate(roomInfo.secret, roomInfo.roomId);
		await fetchRoomInfo();
		listenForMessage();
		setTimeout(() => {
			triggerUpdate(roomInfo.secret, roomInfo.roomId);
		}, 5000);
	});
</script>

<div class="flex flex-col items-center w-full h-full">
	<h2 class="font-BubbleGumSans text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl text-secondary">
		{roomInfo.name}
	</h2>
	<ChatViewWithProfiles
		profiles={participantInfo?.participants ?? []}
		{participantsLoading}
		roomId={roomInfo.roomId}
		username={user.getUsername()}
	/>
	{#if roomInfo.creator === user.getUsername()}
		<div class="block sm:absolute right-0 bottom-0 m-2">
			<button
				class="flex flex-col items-center font-BubbleGumSans font-bold text-accent hover:brightness-110"
				on:click={() => (configureModalOpen = true)}
			>
				Configure Room
				<IconButton icon={faCog} onClick={() => (configureModalOpen = true)} />
			</button>
		</div>
	{/if}

	<ConfigurationModal
		bind:open={configureModalOpen}
		{roomInfo}
		participants={participantInfo?.participants ?? []}
	/>
</div>
