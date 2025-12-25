# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetGoalsForUser*](#getgoalsforuser)
- [**Mutations**](#mutations)
  - [*CreateNewGoal*](#createnewgoal)
  - [*UpdateProgress*](#updateprogress)
  - [*DeleteGoal*](#deletegoal)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetGoalsForUser
You can execute the `GetGoalsForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getGoalsForUser(): QueryPromise<GetGoalsForUserData, undefined>;

interface GetGoalsForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetGoalsForUserData, undefined>;
}
export const getGoalsForUserRef: GetGoalsForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getGoalsForUser(dc: DataConnect): QueryPromise<GetGoalsForUserData, undefined>;

interface GetGoalsForUserRef {
  ...
  (dc: DataConnect): QueryRef<GetGoalsForUserData, undefined>;
}
export const getGoalsForUserRef: GetGoalsForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getGoalsForUserRef:
```typescript
const name = getGoalsForUserRef.operationName;
console.log(name);
```

### Variables
The `GetGoalsForUser` query has no variables.
### Return Type
Recall that executing the `GetGoalsForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetGoalsForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetGoalsForUserData {
  goals: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    targetValue?: number | null;
    startDate: DateString;
    targetDate: DateString;
    currentValue?: number | null;
    status?: string | null;
    category?: {
      id: UUIDString;
      name: string;
    } & Category_Key;
  } & Goal_Key)[];
}
```
### Using `GetGoalsForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getGoalsForUser } from '@dataconnect/generated';


// Call the `getGoalsForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getGoalsForUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getGoalsForUser(dataConnect);

console.log(data.goals);

// Or, you can use the `Promise` API.
getGoalsForUser().then((response) => {
  const data = response.data;
  console.log(data.goals);
});
```

### Using `GetGoalsForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getGoalsForUserRef } from '@dataconnect/generated';


// Call the `getGoalsForUserRef()` function to get a reference to the query.
const ref = getGoalsForUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getGoalsForUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.goals);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.goals);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewGoal
You can execute the `CreateNewGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewGoal(vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;

interface CreateNewGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
}
export const createNewGoalRef: CreateNewGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewGoal(dc: DataConnect, vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;

interface CreateNewGoalRef {
  ...
  (dc: DataConnect, vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
}
export const createNewGoalRef: CreateNewGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewGoalRef:
```typescript
const name = createNewGoalRef.operationName;
console.log(name);
```

### Variables
The `CreateNewGoal` mutation requires an argument of type `CreateNewGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewGoalVariables {
  title: string;
  description?: string | null;
  targetValue: number;
  startDate: DateString;
  targetDate: DateString;
  categoryId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateNewGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewGoalData {
  goal_insert: Goal_Key;
}
```
### Using `CreateNewGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewGoal, CreateNewGoalVariables } from '@dataconnect/generated';

// The `CreateNewGoal` mutation requires an argument of type `CreateNewGoalVariables`:
const createNewGoalVars: CreateNewGoalVariables = {
  title: ..., 
  description: ..., // optional
  targetValue: ..., 
  startDate: ..., 
  targetDate: ..., 
  categoryId: ..., // optional
};

// Call the `createNewGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewGoal(createNewGoalVars);
// Variables can be defined inline as well.
const { data } = await createNewGoal({ title: ..., description: ..., targetValue: ..., startDate: ..., targetDate: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewGoal(dataConnect, createNewGoalVars);

console.log(data.goal_insert);

// Or, you can use the `Promise` API.
createNewGoal(createNewGoalVars).then((response) => {
  const data = response.data;
  console.log(data.goal_insert);
});
```

### Using `CreateNewGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewGoalRef, CreateNewGoalVariables } from '@dataconnect/generated';

// The `CreateNewGoal` mutation requires an argument of type `CreateNewGoalVariables`:
const createNewGoalVars: CreateNewGoalVariables = {
  title: ..., 
  description: ..., // optional
  targetValue: ..., 
  startDate: ..., 
  targetDate: ..., 
  categoryId: ..., // optional
};

// Call the `createNewGoalRef()` function to get a reference to the mutation.
const ref = createNewGoalRef(createNewGoalVars);
// Variables can be defined inline as well.
const ref = createNewGoalRef({ title: ..., description: ..., targetValue: ..., startDate: ..., targetDate: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewGoalRef(dataConnect, createNewGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goal_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goal_insert);
});
```

## UpdateProgress
You can execute the `UpdateProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateProgress(vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface UpdateProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
}
export const updateProgressRef: UpdateProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateProgress(dc: DataConnect, vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface UpdateProgressRef {
  ...
  (dc: DataConnect, vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
}
export const updateProgressRef: UpdateProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateProgressRef:
```typescript
const name = updateProgressRef.operationName;
console.log(name);
```

### Variables
The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateProgressVariables {
  goalId: UUIDString;
  value: number;
  isCompleted?: boolean | null;
  notes?: string | null;
  entryDate: DateString;
}
```
### Return Type
Recall that executing the `UpdateProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateProgressData {
  progressEntry_insert: ProgressEntry_Key;
}
```
### Using `UpdateProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateProgress, UpdateProgressVariables } from '@dataconnect/generated';

// The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`:
const updateProgressVars: UpdateProgressVariables = {
  goalId: ..., 
  value: ..., 
  isCompleted: ..., // optional
  notes: ..., // optional
  entryDate: ..., 
};

// Call the `updateProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateProgress(updateProgressVars);
// Variables can be defined inline as well.
const { data } = await updateProgress({ goalId: ..., value: ..., isCompleted: ..., notes: ..., entryDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateProgress(dataConnect, updateProgressVars);

console.log(data.progressEntry_insert);

// Or, you can use the `Promise` API.
updateProgress(updateProgressVars).then((response) => {
  const data = response.data;
  console.log(data.progressEntry_insert);
});
```

### Using `UpdateProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateProgressRef, UpdateProgressVariables } from '@dataconnect/generated';

// The `UpdateProgress` mutation requires an argument of type `UpdateProgressVariables`:
const updateProgressVars: UpdateProgressVariables = {
  goalId: ..., 
  value: ..., 
  isCompleted: ..., // optional
  notes: ..., // optional
  entryDate: ..., 
};

// Call the `updateProgressRef()` function to get a reference to the mutation.
const ref = updateProgressRef(updateProgressVars);
// Variables can be defined inline as well.
const ref = updateProgressRef({ goalId: ..., value: ..., isCompleted: ..., notes: ..., entryDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateProgressRef(dataConnect, updateProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.progressEntry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.progressEntry_insert);
});
```

## DeleteGoal
You can execute the `DeleteGoal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteGoal(vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;

interface DeleteGoalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
}
export const deleteGoalRef: DeleteGoalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteGoal(dc: DataConnect, vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;

interface DeleteGoalRef {
  ...
  (dc: DataConnect, vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
}
export const deleteGoalRef: DeleteGoalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteGoalRef:
```typescript
const name = deleteGoalRef.operationName;
console.log(name);
```

### Variables
The `DeleteGoal` mutation requires an argument of type `DeleteGoalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteGoalVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteGoal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteGoalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteGoalData {
  goal_delete?: Goal_Key | null;
}
```
### Using `DeleteGoal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteGoal, DeleteGoalVariables } from '@dataconnect/generated';

// The `DeleteGoal` mutation requires an argument of type `DeleteGoalVariables`:
const deleteGoalVars: DeleteGoalVariables = {
  id: ..., 
};

// Call the `deleteGoal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteGoal(deleteGoalVars);
// Variables can be defined inline as well.
const { data } = await deleteGoal({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteGoal(dataConnect, deleteGoalVars);

console.log(data.goal_delete);

// Or, you can use the `Promise` API.
deleteGoal(deleteGoalVars).then((response) => {
  const data = response.data;
  console.log(data.goal_delete);
});
```

### Using `DeleteGoal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteGoalRef, DeleteGoalVariables } from '@dataconnect/generated';

// The `DeleteGoal` mutation requires an argument of type `DeleteGoalVariables`:
const deleteGoalVars: DeleteGoalVariables = {
  id: ..., 
};

// Call the `deleteGoalRef()` function to get a reference to the mutation.
const ref = deleteGoalRef(deleteGoalVars);
// Variables can be defined inline as well.
const ref = deleteGoalRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteGoalRef(dataConnect, deleteGoalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.goal_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.goal_delete);
});
```

