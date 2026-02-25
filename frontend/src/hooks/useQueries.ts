import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, TaskSubmission, Task } from '../backend';

// ---- User Profile ----

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ---- Admin Check ----

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ---- Tasks ----

export function useGetAllTasks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['allTasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, submissionLink }: { taskId: bigint; submissionLink: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitTask(taskId, submissionLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['allTasks'] });
    },
  });
}

export function useGetTaskSubmissions(taskId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TaskSubmission[]>({
    queryKey: ['taskSubmissions', taskId?.toString()],
    queryFn: async () => {
      if (!actor || taskId === null) return [];
      return actor.getTaskSubmissions(taskId);
    },
    enabled: !!actor && !actorFetching && taskId !== null,
  });
}

// ---- Admin Task Approvals ----

export function useApproveTaskSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveTaskSubmission(submissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions'] });
    },
  });
}

export function useCancelTaskSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelTaskSubmission(submissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions'] });
    },
  });
}

// ---- Admin: Get all submissions across all tasks ----

export function useAdminAllSubmissions() {
  const { actor, isFetching: actorFetching } = useActor();
  const tasksQuery = useGetAllTasks();

  return useQuery<TaskSubmission[]>({
    queryKey: ['adminAllSubmissions'],
    queryFn: async () => {
      if (!actor || !tasksQuery.data) return [];
      const allSubmissions: TaskSubmission[] = [];
      for (const task of tasksQuery.data) {
        try {
          const subs = await actor.getTaskSubmissions(task.id);
          allSubmissions.push(...subs);
        } catch {
          // skip tasks we can't access
        }
      }
      return allSubmissions;
    },
    enabled: !!actor && !actorFetching && !!tasksQuery.data,
  });
}

// ---- Create Task (Admin) ----

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      price: bigint;
      taskType: import('../backend').TaskType;
      bonus: bigint;
      buyersRewardPercentage: bigint;
      workforceRewardPercentage: bigint;
      retrainingRewardPercentage: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(
        params.title,
        params.price,
        params.taskType,
        params.bonus,
        params.buyersRewardPercentage,
        params.workforceRewardPercentage,
        params.retrainingRewardPercentage
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTasks'] });
    },
  });
}
