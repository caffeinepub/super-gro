import { useState, useEffect } from 'react';
import { useGetAllTasks, useSubmitTask } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle2, Play, Camera, UserPlus,
  Calendar, Star, AlertCircle, Loader2, ExternalLink
} from 'lucide-react';
import type { TaskSubmission } from '../backend';

const TASK_DEFINITIONS = [
  {
    key: 'checkin',
    title: 'Daily Check-In',
    reward: 50,
    description: 'Check in daily to earn your bonus',
    icon: Calendar,
    color: 'bg-emerald/10',
    iconColor: 'text-emerald',
    requiresProof: false,
    proofPlaceholder: '',
    videoLink: null,
  },
  {
    key: 'video',
    title: 'Watch Video Task',
    reward: 100,
    description: 'Watch the promotional video to earn',
    icon: Play,
    color: 'bg-gold/10',
    iconColor: 'text-gold-dark',
    requiresProof: true,
    proofPlaceholder: 'Paste video watch proof URL here',
    videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    key: 'screenshot',
    title: 'Submit Screenshot',
    reward: 50,
    description: 'Submit a screenshot as proof of task completion',
    icon: Camera,
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
    requiresProof: true,
    proofPlaceholder: 'Paste screenshot URL or image link',
    videoLink: null,
  },
  {
    key: 'refer',
    title: 'Refer 1 Friend',
    reward: 1000,
    description: 'Refer a friend who completes their first task',
    icon: UserPlus,
    color: 'bg-purple-50',
    iconColor: 'text-purple-500',
    requiresProof: true,
    proofPlaceholder: "Enter referred friend's mobile number",
    videoLink: null,
  },
  {
    key: 'weekly',
    title: 'Weekly Bonus',
    reward: 1000,
    description: 'Complete tasks for 7 consecutive days',
    icon: Star,
    color: 'bg-orange-50',
    iconColor: 'text-orange-500',
    requiresProof: false,
    proofPlaceholder: '',
    videoLink: null,
  },
];

function TaskCard({
  taskDef,
  backendTaskId,
  submissions,
  onSubmit,
  isSubmitting,
}: {
  taskDef: typeof TASK_DEFINITIONS[0];
  backendTaskId: bigint | null;
  submissions: TaskSubmission[];
  onSubmit: (taskId: bigint, proof: string) => void;
  isSubmitting: boolean;
}) {
  const [proof, setProof] = useState('');
  const Icon = taskDef.icon;

  const latestSubmission = submissions.length > 0
    ? submissions.sort((a, b) => Number(b.id) - Number(a.id))[0]
    : null;

  const status = latestSubmission
    ? latestSubmission.cancelled
      ? 'rejected'
      : latestSubmission.completed
        ? 'approved'
        : 'pending'
    : 'available';

  const handleSubmit = () => {
    if (!backendTaskId) {
      toast.error('Task not available yet. Please check back later.');
      return;
    }
    if (taskDef.requiresProof && !proof.trim()) {
      toast.error('Please provide proof to submit this task');
      return;
    }
    onSubmit(backendTaskId, proof || 'completed');
    setProof('');
  };

  const statusBadge = {
    available: null,
    pending: <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">⏳ Pending Approval</Badge>,
    approved: <Badge className="bg-emerald/10 text-emerald border-emerald/20 text-xs">✓ Approved</Badge>,
    rejected: <Badge variant="destructive" className="text-xs">✗ Rejected</Badge>,
  }[status];

  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 ${taskDef.color} rounded-xl flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${taskDef.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{taskDef.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{taskDef.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-gold-dark font-bold text-base">₹{taskDef.reward.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {statusBadge && <div className="mt-2">{statusBadge}</div>}

            {taskDef.videoLink && status === 'available' && (
              <a
                href={taskDef.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-2"
              >
                <ExternalLink className="w-3 h-3" />
                Watch Video
              </a>
            )}

            {taskDef.requiresProof && status === 'available' && (
              <Input
                className="mt-2 text-xs h-8"
                placeholder={taskDef.proofPlaceholder}
                value={proof}
                onChange={(e) => setProof(e.target.value)}
              />
            )}

            {status === 'available' && (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !backendTaskId}
                className="mt-2 bg-emerald hover:bg-emerald-dark text-white text-xs h-8 px-4"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Task'
                )}
              </Button>
            )}

            {status === 'rejected' && (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !backendTaskId}
                className="mt-2 bg-gray-500 hover:bg-gray-600 text-white text-xs h-8 px-4"
              >
                Resubmit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DailyTasksPage() {
  const { data: tasks, isLoading: tasksLoading } = useGetAllTasks();
  const submitTask = useSubmitTask();
  const { actor } = useActor();

  const [allSubmissions, setAllSubmissions] = useState<Record<string, TaskSubmission[]>>({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const getBackendTaskId = (taskKey: string): bigint | null => {
    if (!tasks) return null;
    const titleMap: Record<string, string> = {
      checkin: 'Daily Check-In',
      video: 'Watch Video Task',
      screenshot: 'Submit Screenshot',
      refer: 'Refer 1 Friend',
      weekly: 'Weekly Bonus',
    };
    const task = tasks.find(t => t.title === titleMap[taskKey]);
    return task ? task.id : null;
  };

  useEffect(() => {
    if (!actor || !tasks || tasks.length === 0) return;

    const loadSubmissions = async () => {
      setLoadingSubmissions(true);
      const submissionsMap: Record<string, TaskSubmission[]> = {};
      for (const task of tasks) {
        try {
          const subs = await actor.getTaskSubmissions(task.id);
          submissionsMap[task.id.toString()] = subs;
        } catch {
          submissionsMap[task.id.toString()] = [];
        }
      }
      setAllSubmissions(submissionsMap);
      setLoadingSubmissions(false);
    };

    loadSubmissions();
  }, [actor, tasks]);

  const handleSubmit = async (taskId: bigint, proof: string) => {
    try {
      await submitTask.mutateAsync({ taskId, submissionLink: proof });
      toast.success('Task submitted! Awaiting admin approval.');
      if (actor) {
        const subs = await actor.getTaskSubmissions(taskId);
        setAllSubmissions(prev => ({ ...prev, [taskId.toString()]: subs }));
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit task. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Daily Tasks</h1>
        <p className="text-sm text-gray-500 mt-0.5">Complete tasks to earn rewards</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Today's Max", value: '₹1,200' },
          { label: 'Weekly Max', value: '₹9,400' },
          { label: 'Refer Bonus', value: '₹1,000' },
        ].map((stat) => (
          <div key={stat.label} className="bg-emerald/5 border border-emerald/10 rounded-xl p-2.5 text-center">
            <div className="text-gold-dark font-bold text-sm">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {tasksLoading || loadingSubmissions ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {TASK_DEFINITIONS.map((taskDef) => {
            const backendTaskId = getBackendTaskId(taskDef.key);
            const taskSubmissions = backendTaskId
              ? (allSubmissions[backendTaskId.toString()] || [])
              : [];

            return (
              <TaskCard
                key={taskDef.key}
                taskDef={taskDef}
                backendTaskId={backendTaskId}
                submissions={taskSubmissions}
                onSubmit={handleSubmit}
                isSubmitting={submitTask.isPending}
              />
            );
          })}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          <strong>Note:</strong> Task approval is required before earnings are added to your wallet.
          All submissions are reviewed by admin within 24 hours.
        </p>
      </div>
    </div>
  );
}
