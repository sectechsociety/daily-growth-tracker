# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createNewGoal, getGoalsForUser, updateProgress, deleteGoal } from '@dataconnect/generated';


// Operation CreateNewGoal:  For variables, look at type CreateNewGoalVars in ../index.d.ts
const { data } = await CreateNewGoal(dataConnect, createNewGoalVars);

// Operation GetGoalsForUser: 
const { data } = await GetGoalsForUser(dataConnect);

// Operation UpdateProgress:  For variables, look at type UpdateProgressVars in ../index.d.ts
const { data } = await UpdateProgress(dataConnect, updateProgressVars);

// Operation DeleteGoal:  For variables, look at type DeleteGoalVars in ../index.d.ts
const { data } = await DeleteGoal(dataConnect, deleteGoalVars);


```