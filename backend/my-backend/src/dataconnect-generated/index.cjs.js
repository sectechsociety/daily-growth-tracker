const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'my-app',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createNewGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewGoal', inputVars);
}
createNewGoalRef.operationName = 'CreateNewGoal';
exports.createNewGoalRef = createNewGoalRef;

exports.createNewGoal = function createNewGoal(dcOrVars, vars) {
  return executeMutation(createNewGoalRef(dcOrVars, vars));
};

const getGoalsForUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetGoalsForUser');
}
getGoalsForUserRef.operationName = 'GetGoalsForUser';
exports.getGoalsForUserRef = getGoalsForUserRef;

exports.getGoalsForUser = function getGoalsForUser(dc) {
  return executeQuery(getGoalsForUserRef(dc));
};

const updateProgressRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateProgress', inputVars);
}
updateProgressRef.operationName = 'UpdateProgress';
exports.updateProgressRef = updateProgressRef;

exports.updateProgress = function updateProgress(dcOrVars, vars) {
  return executeMutation(updateProgressRef(dcOrVars, vars));
};

const deleteGoalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteGoal', inputVars);
}
deleteGoalRef.operationName = 'DeleteGoal';
exports.deleteGoalRef = deleteGoalRef;

exports.deleteGoal = function deleteGoal(dcOrVars, vars) {
  return executeMutation(deleteGoalRef(dcOrVars, vars));
};
