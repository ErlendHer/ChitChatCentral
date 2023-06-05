import { CognitoIdentityProvider, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Result } from "@shared/execution";
import { UserInfo } from "lib/shared/rooms";

const cognitoIdentityServiceProvider = new CognitoIdentityProvider({ region: 'eu-north-1' })
const userPoolId = process.env.AUTH_CCC_USERPOOLID ?? 'eu-north-1_614PLFuS7';


async function fetchUsers(participants: string[]) {

  const listUsersCommand = new ListUsersCommand({
    UserPoolId: userPoolId,
    Limit: 10,
    Filter: participants.map((participant) => `sub = "${participant}"`).join(' OR ')
  });
  return await cognitoIdentityServiceProvider.send(listUsersCommand);
}

export async function fetchUsersInfo(participants: string[]): Promise<Result<UserInfo[]>> {
  try {
    const users = await fetchUsers(participants);

    if (!users.Users) {
      return { success: true, data: [] };
    }

    const userInfo = users.Users.map(user => {
      const attributes = new Map(user.Attributes?.map(attribute => [attribute.Name, attribute.Value]));
      return {
        username: user.Username ?? `Unknown user #${new Date().getTime()}}`,
        displayName: attributes.get("custom:displayName"),
        profileUrl: attributes.get("custom:profileUrl"),
      }
    })

    return {
      success: true,
      data: userInfo
    }

  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: `Failed to fetch user info: ${(err as Error).message}`
    }
  }
}