import { goto } from '$app/navigation';
import type { CognitoUser } from '@aws-amplify/auth';
import { Auth, Hub } from 'aws-amplify';
import { writable, type Writable } from 'svelte/store';
import defaultProfileImage from '$lib/assets/images/profile-blank.png';
import { openErrorToast } from '../toast';
import type { Result } from "@shared/execution";

export const user: Writable<CognitoUser | null> = writable(null);
export const userInfo: Writable<UserInfo | null> = writable(null);

export type UserInfo = {
  username: string;
  email: string;
  displayName: string;
  profileUrl: string;
}

export async function getUserInfo(user: CognitoUser): Promise<Result<UserInfo>> {
  try {
    // Create a new map, mapping the user attributes to their values
    const attributes = new Map<string, string>();

    (await Auth.userAttributes(user)).forEach((attr) => {
      attributes.set(attr.Name, attr.Value);
    });


    if (!attributes) {
      throw new Error('No username attributes found');
    }

    const username = user.getUsername();

    return {
      success: true,
      data: {
        username: username,
        email: attributes.get('email') ?? '',
        displayName: attributes.get('custom:displayName') ?? username,
        profileUrl: attributes.get('custom:profileUrl') ?? defaultProfileImage,
      }
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Failed to get user info'
    }
  }
}


export async function signUp(username: string, email: string, password: string): Promise<Result<void>> {
  try {
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email,
        "custom:displayName": username
      },

      autoSignIn: { // optional - enables auto sign in after user is confirmed
        enabled: true,
      }
    });

    if (!user) {
      return {
        success: false,
        error: 'Failed to sign up with unknown error'
      }
    }
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      error: `Failed to sign up: ${err}`
    }
  }
}

export async function verifyEmail(username: string, code: string): Promise<Result<void>> {
  try {
    await Auth.confirmSignUp(username, code);
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      error: `Failed to verify email: ${(err as Error).message}`
    }
  }
}

export async function resendVerificationCode(username: string): Promise<Result<void>> {
  try {
    await Auth.resendSignUp(username);
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      error: `Failed to resend verification code: ${(err as Error).message}`
    }
  }
}

export async function listenForAuthChanges(): Promise<void> {
  Hub.listen('auth', ({ payload }) => {
    const { event } = payload;

    if (event === 'autoSignIn' || event === 'signIn') {
      user.set(payload.data as CognitoUser);
      goto('/')
      // assign user
    } else if (event === 'autoSignIn_failure' || event === 'signIn_failure' || event === 'signOut') {
      user.set(null);
    }
  })
}

export async function signIn(username: string, password: string): Promise<Result<void>> {
  try {
    await Auth.signIn(username, password);
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      error: `Failed to sign in: ${(err as Error).message}`
    }
  }
}

export async function signOut(): Promise<Result<void>> {
  try {
    await Auth.signOut();
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      error: `Failed to sign out: ${(err as Error).message}`
    }
  }
}

async function updateUserAttribute(user: CognitoUser, attribute: string, attributeName: string, value: string): Promise<Result<void>> {
  try {
    await Auth.updateUserAttributes(user, {
      [attribute]: value
    })
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to update user ${attributeName}: ${(error as Error).message}`
    }
  }
}

export async function updateUserProfileUrl(user: CognitoUser, url: string): Promise<Result<void>> {
  return await updateUserAttribute(user, 'custom:profileUrl', 'profile url', url);
}

export async function updateUserDisplayName(user: CognitoUser, displayName: string): Promise<Result<void>> {
  return await updateUserAttribute(user, 'custom:displayName', 'display name', displayName);
}

export async function updateUserInfo(user: CognitoUser) {
  try {
    const getUserInfoResult = await getUserInfo(user);
    if (getUserInfoResult.success) {
      userInfo.set(getUserInfoResult.data);
    }
    if (!getUserInfoResult.success) {
      throw new Error(getUserInfoResult.error);
    }
  } catch (error) {
    console.error(error);
    openErrorToast('Failed to fetch user info');
  }
}

export async function getIdToken() {
  try {
    const session = await Auth.currentSession();
    return session.getIdToken().getJwtToken();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get access token');
  }
}