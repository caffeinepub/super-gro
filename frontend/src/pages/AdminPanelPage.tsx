import { useIsCallerAdmin, useGetAllTasks, useApproveTaskSubmission, useCancelTaskSubmission, useAdminAllSubmissions } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, CheckCircle2, XCircle, Users, Loader2, Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { TaskSubmission } from '../backend';

function SubmissionCard({
  submission,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  submission: TaskSubmission;
  onApprove: (id: bigint) => void;
  onReject: (id: bigint) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const status = submission.cancelled ? 'rejected' : submission.completed ? 'approved' : 'pending';

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-600">
                Submission #{submission.id.toString()}
              </span>
              <Badge
                className={
                  status === 'approved'
                    ? 'bg-emerald/10 text-emerald border-emerald/20 text-xs'
                    : status === 'rejected'
                    ? 'bg-red-100 text-red-600 border-red-200 text-xs'
                    : 'bg-amber-100 text-amber-700 border-amber-200 text-xs'
                }
              >
                {status}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              Task ID: {submission.taskId.toString()} | User ID: {submission.userId.toString()}
            </div>
            {submission.submissionLink && (
              <div className="text-xs text-blue-500 mt-1 truncate">
                Proof: {submission.submissionLink}
              </div>
            )}
            {submission.submittedAt && (
              <div className="text-xs text-gray-400 mt-0.5">
                {new Date(Number(submission.submittedAt) / 1_000_000).toLocaleString('en-IN')}
              </div>
            )}
          </div>

          {status === 'pending' && (
            <div className="flex gap-1.5 shrink-0">
              <Button
                size="sm"
                onClick={() => onApprove(submission.id)}
                disabled={isApproving}
                className="bg-emerald hover:bg-emerald-dark text-white text-xs h-7 px-2"
              >
                {isApproving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(submission.id)}
                disabled={isRejecting}
                className="text-xs h-7 px-2"
              >
                {isRejecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPanelPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: allSubmissions, isLoading: submissionsLoading } = useAdminAllSubmissions();
  const approveTask = useApproveTaskSubmission();
  const rejectTask = useCancelTaskSubmission();

  if (!identity) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-700">Authentication Required</h2>
        <p className="text-sm text-gray-500 mt-1">Please log in to access the admin panel.</p>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-700">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const pendingSubmissions = (allSubmissions || []).filter(s => !s.completed && !s.cancelled);
  const allSubmissionsList = allSubmissions || [];

  const handleApprove = async (id: bigint) => {
    try {
      await approveTask.mutateAsync(id);
      toast.success('Task submission approved!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve submission');
    }
  };

  const handleReject = async (id: bigint) => {
    try {
      await rejectTask.mutateAsync(id);
      toast.success('Task submission rejected');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject submission');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500">Manage tasks and users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-0 bg-amber-50">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-amber-600">{pendingSubmissions.length}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-emerald/5">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-emerald">
              {allSubmissionsList.filter(s => s.completed).length}
            </div>
            <div className="text-xs text-gray-500">Approved</div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-red-50">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-red-500">
              {allSubmissionsList.filter(s => s.cancelled).length}
            </div>
            <div className="text-xs text-gray-500">Rejected</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="w-full grid grid-cols-2 bg-gray-100">
          <TabsTrigger value="pending" className="text-xs">
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs">
            All Submissions ({allSubmissionsList.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-3 space-y-2">
          {submissionsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : pendingSubmissions.length === 0 ? (
            <Card className="border border-dashed border-gray-200">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald mx-auto mb-2" />
                <p className="text-sm text-gray-500">No pending submissions</p>
              </CardContent>
            </Card>
          ) : (
            pendingSubmissions.map(sub => (
              <SubmissionCard
                key={sub.id.toString()}
                submission={sub}
                onApprove={handleApprove}
                onReject={handleReject}
                isApproving={approveTask.isPending}
                isRejecting={rejectTask.isPending}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-3 space-y-2">
          {submissionsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : allSubmissionsList.length === 0 ? (
            <Card className="border border-dashed border-gray-200">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No submissions yet</p>
              </CardContent>
            </Card>
          ) : (
            allSubmissionsList.map(sub => (
              <SubmissionCard
                key={sub.id.toString()}
                submission={sub}
                onApprove={handleApprove}
                onReject={handleReject}
                isApproving={approveTask.isPending}
                isRejecting={rejectTask.isPending}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
