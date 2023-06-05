/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom($filter: ModelSubscriptionRoomFilterInput) {
    onCreateRoom(filter: $filter) {
      id
      name
      participants
      requireInvite
      creator
      creatorSub
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
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom($filter: ModelSubscriptionRoomFilterInput) {
    onUpdateRoom(filter: $filter) {
      id
      name
      participants
      requireInvite
      creator
      creatorSub
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
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom($filter: ModelSubscriptionRoomFilterInput) {
    onDeleteRoom(filter: $filter) {
      id
      name
      participants
      requireInvite
      creator
      creatorSub
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
        creatorSub
        messages {
          nextToken
        }
        createdAt
        updatedAt
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
        creatorSub
        messages {
          nextToken
        }
        createdAt
        updatedAt
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
        creatorSub
        messages {
          nextToken
        }
        createdAt
        updatedAt
      }
      roomId
      username
      createdAt
      updatedAt
    }
  }
`;
