import { CognitoIdentityProvider, ListUsersCommand, ListUsersCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { Result } from "@shared/execution";
import { UserInfo } from "lib/shared/rooms";

const cognitoIdentityServiceProvider = new CognitoIdentityProvider({ region: 'eu-north-1' })
const userPoolId = process.env.AUTH_CCC_USERPOOLID ?? 'eu-north-1_614PLFuS7';


export async function getUserSub(username: string): Promise<Result<string>> {
  try {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: userPoolId,
      Limit: 1,
      Filter: `username = "${username}"`
    });
    const users = await cognitoIdentityServiceProvider.send(listUsersCommand);

    if (!users.Users || users.Users.length === 0) {
      return {
        success: false,
        error: `User ${username} not found`
      }
    }

    const sub = users.Users[0].Attributes?.find(attribute => attribute.Name === 'sub')?.Value;

    if (!sub) {
      return {
        success: false,
        error: `User ${username} sub not found`
      }
    }
    return {
      success: true,
      data: sub
    }
  }
  catch (err) {
    console.error(err);
    return {
      success: false,
      error: `Failed to fetch user info: ${(err as Error).message}`
    }
  }
}

// async function fetchUsers(participants: string[]) {

//   console.log(participants.map((participant) => `sub = "${participant}"`).join(' OR '));
//   const listUsersCommand = new ListUsersCommand({
//     UserPoolId: userPoolId,
//     Limit: 10,
//     Filter: participants.map((participant) => `sub = "${participant}"`).join(' OR ')
//   });
//   return await cognitoIdentityServiceProvider.send(listUsersCommand);
// }

// export async function fetchUsersInfo(participants: string[]): Promise<Result<UserInfo[]>> {
//   try {
//     console.log("1", JSON.stringify(participants));
//     const users = await fetchUsers(participants);
//     console.log("2", JSON.stringify(users));

//     if (!users.Users) {
//       return { success: true, data: [] };
//     }

//     const userInfo = users.Users.map(user => {
//       const attributes = new Map(user.Attributes?.map(attribute => [attribute.Name, attribute.Value]));
//       return {
//         username: user.Username ?? `Unknown user #${new Date().getTime()}}`,
//         displayName: attributes.get("custom:displayName"),
//         profileUrl: attributes.get("custom:profileUrl"),
//       }
//     })

//     return {
//       success: true,
//       data: userInfo
//     }

//   } catch (err) {
//     console.error(err);
//     return {
//       success: false,
//       error: `Failed to fetch user info: ${(err as Error).message}`
//     }
//   }
// }

async function fetchUser(participant: string) {
  try {
    console.log(`Fetching user with sub = "${participant}"`);
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: userPoolId,
      Limit: 1,
      Filter: `sub = "${participant}"`
    });
    return await cognitoIdentityServiceProvider.send(listUsersCommand);
  } catch (error) {
    console.error(`Failed to fetch user with sub = "${participant}"`, error);
    return null;
  }
}


export async function fetchUsersInfo(participants: string[]): Promise<Result<UserInfo[]>> {
  try {
    console.log("1", JSON.stringify(participants));
    const usersListPromises = participants.map(fetchUser);
    const usersList = await Promise.all(usersListPromises);
    console.log("2", JSON.stringify(usersList));

    const userInfo = usersList
      .filter((userList): userList is ListUsersCommandOutput => Boolean(userList && userList.Users && userList.Users.length > 0))
      .map(userList => userList.Users![0])
      .map(user => {
        const attributes = new Map(user.Attributes?.map(attribute => [attribute.Name, attribute.Value]));
        return {
          username: user.Username ?? `Unknown user #${new Date().getTime()}}`,
          displayName: attributes.get("custom:displayName"),
          profileUrl: attributes.get("custom:profileUrl"),
        }
      });

    console.log("3", JSON.stringify(userInfo))

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