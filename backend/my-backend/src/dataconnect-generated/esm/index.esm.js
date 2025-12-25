import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'my-app',
  location: 'us-central1'
};

export const createNewGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewGoal', inputVars);
}
createNewGoalRef.operationName = 'CreateNewGoal';

export function createNewGoal(dcOrVars, vars) {
  return executeMutation(createNewGoalRef(dcOrVars, vars));
}

export const getGoalsForUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetGoalsForUser');
}
getGoalsForUserRef.operationName = 'GetGoalsForUser';

export function getGoalsForUser(dc) {
  return executeQuery(getGoalsForUserRef(dc));
}

export const updateProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProgress', inputVars);
}
updateProgressRef.operationName = 'UpdateProgress';

export function updateProgress(dcOrVars, vars) {
  return executeMutation(updateProgressRef(dcOrVars, vars));
}

export const deleteGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGoal', inputVars);
}
deleteGoalRef.operationName = 'DeleteGoal';

export function deleteGoal(dcOrVars, vars) {
  return executeMutation(deleteGoalRef(dcOrVars, vars));
}

