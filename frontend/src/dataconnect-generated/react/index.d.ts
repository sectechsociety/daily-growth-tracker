import { CreateNewGoalData, CreateNewGoalVariables, GetGoalsForUserData, UpdateProgressData, UpdateProgressVariables, DeleteGoalData, DeleteGoalVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewGoal(options?: useDataConnectMutationOptions<CreateNewGoalData, FirebaseError, CreateNewGoalVariables>): UseDataConnectMutationResult<CreateNewGoalData, CreateNewGoalVariables>;
export function useCreateNewGoal(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewGoalData, FirebaseError, CreateNewGoalVariables>): UseDataConnectMutationResult<CreateNewGoalData, CreateNewGoalVariables>;

export function useGetGoalsForUser(options?: useDataConnectQueryOptions<GetGoalsForUserData>): UseDataConnectQueryResult<GetGoalsForUserData, undefined>;
export function useGetGoalsForUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetGoalsForUserData>): UseDataConnectQueryResult<GetGoalsForUserData, undefined>;

export function useUpdateProgress(options?: useDataConnectMutationOptions<UpdateProgressData, FirebaseError, UpdateProgressVariables>): UseDataConnectMutationResult<UpdateProgressData, UpdateProgressVariables>;
export function useUpdateProgress(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProgressData, FirebaseError, UpdateProgressVariables>): UseDataConnectMutationResult<UpdateProgressData, UpdateProgressVariables>;

export function useDeleteGoal(options?: useDataConnectMutationOptions<DeleteGoalData, FirebaseError, DeleteGoalVariables>): UseDataConnectMutationResult<DeleteGoalData, DeleteGoalVariables>;
export function useDeleteGoal(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteGoalData, FirebaseError, DeleteGoalVariables>): UseDataConnectMutationResult<DeleteGoalData, DeleteGoalVariables>;
