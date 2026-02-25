import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaskSubmission {
    id: bigint;
    cancelled: boolean;
    userId: bigint;
    completed: boolean;
    submittedAt?: Time;
    taskId: bigint;
    submissionLink?: string;
    withdrawn: boolean;
}
export type Time = bigint;
export interface Reward {
    id: bigint;
    redeemedAt?: Time;
    userId: bigint;
    redeemed: boolean;
    createdAt: Time;
    type: RewardType;
    amount: bigint;
}
export interface Task {
    id: bigint;
    title: string;
    retrainingRewardPercentage: bigint;
    buyersRewardPercentage: bigint;
    type: TaskType;
    bonus: bigint;
    workforceRewardPercentage: bigint;
    price: bigint;
}
export interface Author {
    id: bigint;
    verified: boolean;
    bannedAt?: Time;
    name: string;
    banned: boolean;
    verifiedAt?: Time;
}
export interface UserProfile {
    referralCode?: string;
    name: string;
    mobile?: string;
}
export enum RewardType {
    taskCompletion = "taskCompletion",
    referral = "referral",
    bonus = "bonus",
    loyalty = "loyalty"
}
export enum TaskType {
    imageAnnotation = "imageAnnotation",
    transcription = "transcription",
    survey = "survey",
    appDownload = "appDownload",
    complexResearch = "complexResearch",
    simpleResearch = "simpleResearch"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBonus(userId: bigint, amount: bigint): Promise<void>;
    addCommission(userId: bigint, amount: bigint): Promise<void>;
    approveTaskSubmission(submissionId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    banAuthor(authorId: bigint): Promise<void>;
    cancelInvoice(invoiceId: bigint): Promise<void>;
    cancelTaskSubmission(submissionId: bigint): Promise<void>;
    claimBonus(userId: bigint): Promise<bigint>;
    claimCommission(userId: bigint): Promise<bigint>;
    createAuthor(name: string): Promise<void>;
    createReward(userId: bigint, amount: bigint, type: RewardType, redeemed: boolean): Promise<void>;
    createTask(title: string, price: bigint, taskType: TaskType, bonus: bigint, buyersRewardPercentage: bigint, workforceRewardPercentage: bigint, retrainingRewardPercentage: bigint): Promise<void>;
    deleteTask(taskId: bigint): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    getAuthor(authorId: bigint): Promise<Author>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTask(taskId: bigint): Promise<Task>;
    getTaskSubmissions(taskId: bigint): Promise<Array<TaskSubmission>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRewards(userId: bigint): Promise<Array<Reward>>;
    getUserSubmissions(userId: bigint): Promise<Array<TaskSubmission>>;
    isCallerAdmin(): Promise<boolean>;
    payInvoice(invoiceId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInvoiceReward(invoiceId: bigint, rewardId: bigint): Promise<void>;
    submitTask(taskId: bigint, submissionLink: string): Promise<void>;
    transferReferralBonus(referrerId: bigint, rewardId: bigint): Promise<void>;
    updateTask(taskId: bigint, title: string, price: bigint, taskType: TaskType, bonus: bigint, buyersRewardPercentage: bigint, workforceRewardPercentage: bigint, retrainingRewardPercentage: bigint): Promise<void>;
    verifyAuthor(authorId: bigint): Promise<void>;
}
