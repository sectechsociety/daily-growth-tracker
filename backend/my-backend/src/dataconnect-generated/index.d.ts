import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Achievement_Key {
  id: UUIDString;
  __typename?: 'Achievement_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateNewGoalData {
  goal_insert: Goal_Key;
}

export interface CreateNewGoalVariables {
  title: string;
  description?: string | null;
  targetValue: number;
  startDate: DateString;
  targetDate: DateString;
  categoryId?: UUIDString | null;
}

export interface DeleteGoalData {
  goal_delete?: Goal_Key | null;
}

export interface DeleteGoalVariables {
  id: UUIDString;
}

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

export interface Goal_Key {
  id: UUIDString;
  __typename?: 'Goal_Key';
}

export interface Habit_Key {
  id: UUIDString;
  __typename?: 'Habit_Key';
}

export interface ProgressEntry_Key {
  id: UUIDString;
  __typename?: 'ProgressEntry_Key';
}

export interface UpdateProgressData {
  progressEntry_insert: ProgressEntry_Key;
}

export interface UpdateProgressVariables {
  goalId: UUIDString;
  value: number;
  isCompleted?: boolean | null;
  notes?: string | null;
  entryDate: DateString;
}

export interface UserAchievement_Key {
  userId: UUIDString;
  achievementId: UUIDString;
  __typename?: 'UserAchievement_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewGoalVariables): MutationRef<CreateNewGoalData, CreateNewGoalVariables>;
  operationName: string;
}
export const createNewGoalRef: CreateNewGoalRef;

export function createNewGoal(vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;
export function createNewGoal(dc: DataConnect, vars: CreateNewGoalVariables): MutationPromise<CreateNewGoalData, CreateNewGoalVariables>;

interface GetGoalsForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetGoalsForUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetGoalsForUserData, undefined>;
  operationName: string;
}
export const getGoalsForUserRef: GetGoalsForUserRef;

export function getGoalsForUser(): QueryPromise<GetGoalsForUserData, undefined>;
export function getGoalsForUser(dc: DataConnect): QueryPromise<GetGoalsForUserData, undefined>;

interface UpdateProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProgressVariables): MutationRef<UpdateProgressData, UpdateProgressVariables>;
  operationName: string;
}
export const updateProgressRef: UpdateProgressRef;

export function updateProgress(vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;
export function updateProgress(dc: DataConnect, vars: UpdateProgressVariables): MutationPromise<UpdateProgressData, UpdateProgressVariables>;

interface DeleteGoalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteGoalVariables): MutationRef<DeleteGoalData, DeleteGoalVariables>;
  operationName: string;
}
export const deleteGoalRef: DeleteGoalRef;

export function deleteGoal(vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;
export function deleteGoal(dc: DataConnect, vars: DeleteGoalVariables): MutationPromise<DeleteGoalData, DeleteGoalVariables>;

