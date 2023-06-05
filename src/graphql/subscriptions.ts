/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom(
    $filter: ModelSubscriptionRoomFilterInput
    $owner: String
  ) {
    onCreateRoom(filter: $filter, owner: $owner) {
      id
      name
      participants
      requireInvite
      creator
      messages {
        items {
          id
          content
          time
          roomId
          username
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom(
    $filter: ModelSubscriptionRoomFilterInput
    $owner: String
  ) {
    onUpdateRoom(filter: $filter, owner: $owner) {
      id
      name
      participants
      requireInvite
      creator
      messages {
        items {
          id
          content
          time
          roomId
          username
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom(
    $filter: ModelSubscriptionRoomFilterInput
    $owner: String
  ) {
    onDeleteRoom(filter: $filter, owner: $owner) {
      id
      name
      participants
      requireInvite
      creator
      messages {
        items {
          id
          content
          time
          roomId
          username
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $username: String
  ) {
    onCreateMessage(filter: $filter, username: $username) {
      id
      content
      time
      room {
        id
        name
        participants
        requireInvite
        creator
        messages {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      roomId
      username
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $username: String
  ) {
    onUpdateMessage(filter: $filter, username: $username) {
      id
      content
      time
      room {
        id
        name
        participants
        requireInvite
        creator
        messages {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      roomId
      username
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $username: String
  ) {
    onDeleteMessage(filter: $filter, username: $username) {
      id
      content
      time
      room {
        id
        name
        participants
        requireInvite
        creator
        messages {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      roomId
      username
      createdAt
      updatedAt
    }
  }
`;
