<script lang="ts">
	import {
		signOut,
		updateUserDisplayName,
		updateUserProfileUrl,
		type UserInfo
	} from '$lib/client/auth/auth';
	import { openErrorToast, openSuccessToast } from '$lib/client/toast';
	import { eventHasFiles } from '$lib/client/utils/fileUtils';
	import type { CognitoUser } from '@aws-amplify/auth';
	import { Storage } from '@aws-amplify/storage';
	import { faImage, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
	import IconButtonWithLoadingSpinner from '../../common/IconButtonWithLoadingSpinner.svelte';
	import SimpleLoadingSpinner from '../../common/SimpleLoadingSpinner.svelte';
	import ProfileProperty from './components/ProfileProperty.svelte';
	import EditValueModal from './components/EditValueModal.svelte';

	export let user: CognitoUser;
	export let userInfo: UserInfo;

	let imageFileInput: HTMLInputElement | undefined;
	let uploadLoading = false;
	let waitingForImageUpdate = false;

	let previousProfileImageUrl: string | undefined;

	let editInfo: { name: string; value: string; onSave: (newValue: string) => void } | undefined =
		undefined;
	let userPropertyUpdating = false;

	// The code below ensures waitingForUpdate is set to true while we're waiting for the image url to update
	// An update should happen only when the user profile url is updated, therefore we need to make sure that
	// we cache the previous value and wait for the new value to be different from the previous value.
	$: {
		user;
		if (waitingForImageUpdate) {
			if (previousProfileImageUrl && previousProfileImageUrl != userInfo.profileUrl) {
				previousProfileImageUrl = undefined;
				waitingForImageUpdate = false;
			} else {
				previousProfileImageUrl = userInfo.profileUrl;
			}
		}
	}

	function stopWaitingForUpdateAfterTimeout(timeout: number) {
		setTimeout(() => {
			if (waitingForImageUpdate) {
				waitingForImageUpdate = false;
				openErrorToast('Failed to fetch new profile image, please refresh the page');
			}
		}, timeout);
	}

	async function setProfilePicture(file: File) {
		try {
			uploadLoading = true;
			waitingForImageUpdate = true;

			const filename = `images/profile/${Date.now()}-${file.name}`;
			const uploadResult = await Storage.put(filename, file, {
				contentType: file.type,
				level: 'public'
			});

			if (!uploadResult) {
				throw new Error('Failed to upload image');
			}

			const updateProfileResult = await updateUserProfileUrl(
				user,
				`https://ccc202245-dev.s3.eu-north-1.amazonaws.com/public/${uploadResult.key}`
			);

			if (!updateProfileResult.success) {
				throw new Error(updateProfileResult.error);
			}

			openSuccessToast('Successfully updated profile image!');
		} catch (err) {
			console.error(err);
			openErrorToast(`Failed to upload image with error: ${(err as Error).message}`);
			waitingForImageUpdate = false;
		} finally {
			// Fail-safe in case there is an implementation error and the userInfo doesn't update with the new URL as it should after 10 seconds
			// This may also trigger due to slow internet or if an uncaught upload error occurred (shouldn't happen)
			stopWaitingForUpdateAfterTimeout(20_000);
			uploadLoading = false;
		}
	}

	async function onFileChange(event: Event) {
		if (eventHasFiles(event)) {
			if (event.target.files.length < 1) {
				openErrorToast('No target file selected');
				return;
			}
			const file = event.target.files[0];

			if (!file) {
				openErrorToast('You have not selected a file');
				return;
			}

			setProfilePicture(file);
		} else {
			openErrorToast('No file selected');
		}
	}

	async function editDisplayName() {
		editInfo = {
			name: 'Display Name',
			value: userInfo.displayName,
			onSave: async (newValue) => {
				try {
					userPropertyUpdating = true;
					const updateResult = await updateUserDisplayName(user, newValue);
					if (updateResult.success) {
						openSuccessToast('Successfully updated display name!');
						userInfo.displayName = newValue;
					} else {
						openErrorToast(`${updateResult.error}`);
					}
				} catch (error) {
					console.error(error);
					openErrorToast(`Failed to update display name`);
				} finally {
					userPropertyUpdating = false;
				}
			}
		};
	}
</script>

<div class="flex flex-col items-center w-full">
	<div
		class="flex flex-col gap-2 items-center w-full max-w-xl border-2 rounded-md border-base-200 shadow-md drop-shadow-sm p-2"
	>
		<div class="text-base-content font-bold text-3xl text-center mb-2">
			{userInfo.displayName}'s Profile
		</div>
		{#if waitingForImageUpdate}
			<div class="flex flex-col gap-2 items-center">
				<SimpleLoadingSpinner size="medium" />
				<div class="text-info font-bold text-lg text-center mb-2">Updating profile picture...</div>
			</div>
		{:else}
			<img
				src={userInfo.profileUrl}
				alt="profile"
				class="rounded-full object-cover h-48 w-48 sm:h-64 sm:w-64 xl:w-72 xl:h-72 mb-2"
			/>
		{/if}

		{#if userPropertyUpdating}
			<div class="flex flex-col gap-2 items-center">
				<SimpleLoadingSpinner size="medium" />
				<div class="text-info font-bold text-lg text-center mb-2">Updating display name...</div>
			</div>
		{:else}
			<table class="sm:table flex flex-col flex-warp" style="width: min-content">
				<ProfileProperty name="Email" value={userInfo.email} />
				<ProfileProperty name="Username" value={userInfo.username} />
				<ProfileProperty
					name="Display name"
					value={userInfo.displayName}
					editable={true}
					onEditClick={editDisplayName}
				/>
			</table>
		{/if}
		<input
			type="file"
			class="hidden"
			accept=".jpg, .jpeg, .png"
			on:change={onFileChange}
			bind:this={imageFileInput}
		/>
		<IconButtonWithLoadingSpinner
			text="Change Picture"
			icon={faImage}
			class="mt-2"
			onClick={() => imageFileInput?.click()}
			loading={uploadLoading}
			disabled={uploadLoading}
		/>

		<IconButtonWithLoadingSpinner
			text="Sign Out"
			onClick={signOut}
			icon={faRightFromBracket}
			class="btn-warning hover:brightness-110 mt-4 mb-4"
		/>
	</div>
</div>

{#if editInfo}
	<EditValueModal
		name={editInfo.name}
		value={editInfo.value}
		onSave={editInfo.onSave}
		onExit={() => (editInfo = undefined)}
	/>
{/if}
