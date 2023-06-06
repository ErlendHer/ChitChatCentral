<script lang="ts">
	import { openErrorToast } from '$lib/client/toast';
	import { cccApiPOST } from '$lib/client/utils/apiUtils';
	import type { Request_SendMessage, RoomsResponses } from '@cccApi/rooms';
	import { faPaperPlane, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
	import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
	import IconButtonWithLoadingSpinner from '../../common/IconButtonWithLoadingSpinner.svelte';
	import IconFa from '../../common/IconFa.svelte';
	import SimpleLoadingSpinner from '../../common/SimpleLoadingSpinner.svelte';
	import ChatBubble from './ChatBubble.svelte';
	import {
		createMessageSync,
		getMessages,
		listenForNewMessages,
		type MessageSync
	} from './messages/messageSync';
	import type { ProfileInfo, RoomMessage } from './rooms.types';
	import { roomMessage } from './messages/roomMessages.store';

	export let roomId: string;
	export let username: string;
	export let profileMap: Map<string, ProfileInfo>;

	const messageSync = createMessageSync(username);

	let messageSubscription: { unsubscribe: () => void } | undefined = undefined;

	$: {
		$messageSync;
		scrollToBottom();
	}

	$: if ($roomMessage) {
		const msg = $roomMessage;
	}

	let messageToSend = '';

	let syncingMessages = false;
	let syncMessagesError: string | undefined = undefined;

	let chatContainer: HTMLDivElement | undefined = undefined;

	const autoExpand = (node: HTMLTextAreaElement) => {
		function resize() {
			node.style.height = 'inherit';
			node.style.height = `${node.scrollHeight - 12}px`;
		}

		onMount(resize);
		afterUpdate(resize);

		node.addEventListener('input', resize);

		return {
			destroy() {
				node.removeEventListener('input', resize);
			}
		};
	};

	const sendMessage = async () => {
		if (messageToSend === '') {
			return;
		}

		messageSync.addLocalMessage(messageToSend);

		const messageCopy = messageToSend;
		messageToSend = '';
		try {
			const sendResult = await cccApiPOST<RoomsResponses['[id]/send'], Request_SendMessage>(
				`/rooms/${roomId}/send`,
				{
					message: messageCopy,
					timestamp: new Date().toISOString()
				}
			);

			if (!sendResult.success) {
				throw new Error(sendResult.error.messageWithCode);
			}
		} catch (error) {
			console.error(error);
			openErrorToast(`Failed to send message, are you logged in?`);
			// Restore message if failed
			if (messageToSend === '') {
				messageToSend = messageCopy;
			}
		}
	};

	const syncMessages = async () => {
		try {
			syncingMessages = true;
			syncMessagesError = undefined;

			const syncResult = await getMessages(roomId);

			if (!syncResult.success) {
				throw new Error(syncResult.error.messageWithCode);
			}

			messageSync.addMessages(syncResult.data.data);
		} catch (error) {
			syncMessagesError = (error as Error).message;
		} finally {
			syncingMessages = false;
		}
	};

	const scrollToBottom = async () => {
		await tick();
		if (chatContainer === undefined) {
			return;
		}
		chatContainer.scroll({ top: chatContainer.scrollHeight, behavior: 'smooth' });
	};

	onMount(async () => {
		await syncMessages();
		messageSubscription = listenForNewMessages(roomId, messageSync as MessageSync);
	});

	onDestroy(() => {
		messageSubscription?.unsubscribe();
	});
</script>

<div
	class="max-w-[600px] w-full max-h-[80vh] 2xl:max-h-[75vh] bg-secondary rounded-lg shadow-lg flex flex-col"
>
	<div
		class="flex-grow rounded-t-lg overflow-y-auto overflow-x-hidden flex flex-col px-2 py-4"
		id="chatContainer"
		bind:this={chatContainer}
	>
		{#if syncingMessages}
			<div class="flex flex-col w-ful items-center">
				<SimpleLoadingSpinner size="medium" />
			</div>
		{:else if syncMessagesError !== undefined}
			<div class="flex flex-col gap-4 items-center w-full">
				<div class="text text-xl text-warning">Failed to get messages</div>
				<div class="text-center text-base-content italic">{syncMessagesError}</div>
				<IconButtonWithLoadingSpinner text="Try Again" icon={faRotateLeft} onClick={syncMessages} />
			</div>
		{:else}
			{#each $messageSync as message (message.id)}
				<ChatBubble {message} {profileMap} />
			{/each}
		{/if}
	</div>
	<div class="flex items-center rounded-b-lg px-3 py-2 border-t-2">
		<textarea
			class="flex-grow resize-none overflow-hidden rounded-lg py-1 px-2 focus:outline-none font-BubbleGumSans text-lg h-4"
			use:autoExpand
			bind:value={messageToSend}
			on:keydown={(e) => {
				if (e.key === 'Enter' && !e.shiftKey) {
					e.preventDefault();
					sendMessage();
				}
			}}
		/>
		<button class="ml-2 rounded-full p-2" on:click={sendMessage}>
			<IconFa icon={faPaperPlane} class="text-white h-6 w-6 md:w-7 md:h-7" />
		</button>
	</div>
</div>

<style>
	#chatContainer::-webkit-scrollbar {
		width: 12px;
	}

	#chatContainer::-webkit-scrollbar-track {
		background: #f1f1f1;
		/* border-radius: 10px; */
	}

	#chatContainer::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 10px;
	}

	#chatContainer::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
