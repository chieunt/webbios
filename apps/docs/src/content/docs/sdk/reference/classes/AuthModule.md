---
editUrl: false
next: false
prev: false
title: "AuthModule"
---

Provides authentication-related methods to interact with the API.

## Constructors

### Constructor

> **new AuthModule**(`client`): `AuthModule`

#### Parameters

##### client

[`ApiClient`](/sdk/reference/classes/apiclient/)

#### Returns

`AuthModule`

## Methods

### login()

> **login**(`email`, `password`): `Promise`\<`any`\>

Authenticates a user with email and password.

#### Parameters

##### email

`string`

The user's email address.

##### password

`string`

The user's password.

#### Returns

`Promise`\<`any`\>

A promise resolving to the authentication response containing the token.

***

### me()

> **me**(): `Promise`\<`any`\>

Retrieves the current authenticated user's profile and permissions.

#### Returns

`Promise`\<`any`\>

A promise resolving to the user profile and their associated permissions.
