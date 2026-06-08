---
editUrl: false
next: false
prev: false
title: "ApiClient"
---

Core API Client for handling HTTP requests to the WebbiOS API.
This class wraps the native `fetch` API, injects authentication headers,
and handles global 401 Unauthorized responses.

## Constructors

### Constructor

> **new ApiClient**(`options?`): `ApiClient`

Initializes a new ApiClient instance.

#### Parameters

##### options?

[`WebbiSDKOptions`](/sdk/reference/interfaces/webbisdkoptions/) = `{}`

Initialization configuration.

#### Returns

`ApiClient`

## Methods

### delete()

> **delete**(`path`, `options?`): `Promise`\<`any`\>

Performs an HTTP DELETE request.

#### Parameters

##### path

`string`

The relative API path.

##### options?

`RequestInit`

Additional Fetch options.

#### Returns

`Promise`\<`any`\>

The parsed JSON response.

***

### fetch()

> **fetch**(`path`, `options?`): `Promise`\<`any`\>

Performs a raw HTTP request to the configured API endpoint.

#### Parameters

##### path

`string`

The relative API path (e.g., `/auth/me`).

##### options?

`RequestInit` = `{}`

Standard Fetch API RequestInit options.

#### Returns

`Promise`\<`any`\>

A promise resolving to the parsed JSON response.

#### Throws

Will throw an Error if the response status is not OK (2xx).

***

### get()

> **get**(`path`, `options?`): `Promise`\<`any`\>

Performs an HTTP GET request.

#### Parameters

##### path

`string`

The relative API path.

##### options?

`RequestInit`

Additional Fetch options.

#### Returns

`Promise`\<`any`\>

The parsed JSON response.

***

### post()

> **post**(`path`, `body`, `options?`): `Promise`\<`any`\>

Performs an HTTP POST request.

#### Parameters

##### path

`string`

The relative API path.

##### body

`any`

The request payload (will be stringified as JSON).

##### options?

`RequestInit`

Additional Fetch options.

#### Returns

`Promise`\<`any`\>

The parsed JSON response.

***

### put()

> **put**(`path`, `body`, `options?`): `Promise`\<`any`\>

Performs an HTTP PUT request.

#### Parameters

##### path

`string`

The relative API path.

##### body

`any`

The request payload (will be stringified as JSON).

##### options?

`RequestInit`

Additional Fetch options.

#### Returns

`Promise`\<`any`\>

The parsed JSON response.

***

### setRefreshCallback()

> **setRefreshCallback**(`cb`): `void`

Registers a callback that will be triggered when an API request
fails with a 401 Unauthorized status code.

#### Parameters

##### cb

() => `void`

The callback function.

#### Returns

`void`

***

### setToken()

> **setToken**(`token`): `void`

Sets or updates the JWT access token for subsequent requests.

#### Parameters

##### token

`string`

The JWT string.

#### Returns

`void`
