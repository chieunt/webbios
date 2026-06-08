---
editUrl: false
next: false
prev: false
title: "ProductsModule"
---

Provides methods for managing products in the system.

## Constructors

### Constructor

> **new ProductsModule**(`client`): `ProductsModule`

#### Parameters

##### client

[`ApiClient`](/sdk/reference/classes/apiclient/)

#### Returns

`ProductsModule`

## Methods

### create()

> **create**(`data`): `Promise`\<`any`\>

Creates a new product in the system.

#### Parameters

##### data

`any`

The product data to create.

#### Returns

`Promise`\<`any`\>

A promise resolving to the created product.

***

### list()

> **list**(`params?`): `Promise`\<`any`\>

Retrieves a paginated list of products.

#### Parameters

##### params?

`any`

Optional query parameters for filtering and pagination.

#### Returns

`Promise`\<`any`\>

A promise resolving to an array of products.
