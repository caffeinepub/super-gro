import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  type Task = {
    id : Nat;
    title : Text;
    price : Nat;
    type_ : TaskType;
    bonus : Nat;
    buyersRewardPercentage : Nat;
    workforceRewardPercentage : Nat;
    retrainingRewardPercentage : Nat;
  };

  type Author = {
    id : Nat;
    name : Text;
    verified : Bool;
    banned : Bool;
    verifiedAt : ?Time.Time;
    bannedAt : ?Time.Time;
  };

  type TaskType = {
    #simpleResearch;
    #complexResearch;
    #survey;
    #transcription;
    #imageAnnotation;
    #appDownload;
  };

  type TaskSubmission = {
    id : Nat;
    taskId : Nat;
    userId : Nat;
    cancelled : Bool;
    completed : Bool;
    withdrawn : Bool;
    submissionLink : ?Text;
    submittedAt : ?Time.Time;
  };

  type Invoice = {
    id : Nat;
    userId : Nat;
    amount : Nat;
    paymentLink : Text;
    paid : Bool;
    cancelled : Bool;
    createdAt : Time.Time;
    paidAt : ?Time.Time;
    cancelledAt : ?Time.Time;
  };

  type Reward = {
    id : Nat;
    userId : Nat;
    amount : Nat;
    type_ : RewardType;
    createdAt : Time.Time;
    redeemed : Bool;
    redeemedAt : ?Time.Time;
  };

  type RewardType = {
    #taskCompletion;
    #referral;
    #loyalty;
    #bonus;
  };

  // User profile type required by frontend
  type UserProfile = {
    name : Text;
    mobile : ?Text;
    referralCode : ?Text;
  };

  // Comparison module for Task
  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Nat.compare(task1.id, task2.id);
    };
  };

  // Comparison module for Author
  module Author {
    public func compare(author1 : Author, author2 : Author) : Order.Order {
      Nat.compare(author1.id, author2.id);
    };
  };

  // Comparison module for TaskSubmission
  module TaskSubmission {
    public func compare(submission1 : TaskSubmission, submission2 : TaskSubmission) : Order.Order {
      Nat.compare(submission1.id, submission2.id);
    };
  };

  // Comparison module for Invoice
  module Invoice {
    public func compare(invoice1 : Invoice, invoice2 : Invoice) : Order.Order {
      Nat.compare(invoice1.id, invoice2.id);
    };
  };

  // Comparison module for Reward
  module Reward {
    public func compare(reward1 : Reward, reward2 : Reward) : Order.Order {
      Nat.compare(reward1.id, reward2.id);
    };
  };

  // State
  var authorIdCounter = 1;
  var taskIdCounter = 1;
  var taskSubmissionIdCounter = 1;
  var invoiceIdCounter = 1;
  var rewardIdCounter = 1;

  let tasks = Map.empty<Nat, Task>();
  let authors = Map.empty<Nat, Author>();
  let taskSubmissions = Map.empty<Nat, TaskSubmission>();
  let invoices = Map.empty<Nat, Invoice>();
  let rewards = Map.empty<Nat, Reward>();

  // User profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Map from Principal to numeric userId for submissions/rewards
  let principalToUserId = Map.empty<Principal, Nat>();
  var userIdCounter = 1;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper: get or create numeric userId for a principal
  func getOrCreateUserId(principal : Principal) : Nat {
    switch (principalToUserId.get(principal)) {
      case (?id) { id };
      case (null) {
        let id = userIdCounter;
        principalToUserId.add(principal, id);
        userIdCounter += 1;
        id;
      };
    };
  };

  // ---- User Profile Functions (required by frontend) ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ---- Task Management ----

  public query ({ caller }) func getAllTasks() : async [Task] {
    // Public read - no auth required
    tasks.values().toArray().sort();
  };

  public shared ({ caller }) func createTask(title : Text, price : Nat, taskType : TaskType, bonus : Nat, buyersRewardPercentage : Nat, workforceRewardPercentage : Nat, retrainingRewardPercentage : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let task : Task = {
      id = taskIdCounter;
      title;
      type_ = taskType;
      price;
      bonus;
      buyersRewardPercentage;
      workforceRewardPercentage;
      retrainingRewardPercentage;
    };
    tasks.add(taskIdCounter, task);
    taskIdCounter += 1;
  };

  public shared ({ caller }) func updateTask(taskId : Nat, title : Text, price : Nat, taskType : TaskType, bonus : Nat, buyersRewardPercentage : Nat, workforceRewardPercentage : Nat, retrainingRewardPercentage : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?_) {
        let task : Task = {
          id = taskId;
          title;
          type_ = taskType;
          price;
          bonus;
          buyersRewardPercentage;
          workforceRewardPercentage;
          retrainingRewardPercentage;
        };
        tasks.add(taskId, task);
      };
    };
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not tasks.containsKey(taskId)) {
      Runtime.trap("Task not found");
    };
    tasks.remove(taskId);
  };

  public query ({ caller }) func getTask(taskId : Nat) : async Task {
    // Public read - no auth required
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };
  };

  // ---- Author Management ----

  public shared ({ caller }) func verifyAuthor(authorId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (authors.get(authorId)) {
      case (null) { Runtime.trap("Author not found") };
      case (?author) {
        let updatedAuthor = {
          author with
          verified = true;
          verifiedAt = ?Time.now();
        };
        authors.add(authorId, updatedAuthor);
      };
    };
  };

  public shared ({ caller }) func banAuthor(authorId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (authors.get(authorId)) {
      case (null) { Runtime.trap("Author not found") };
      case (?author) {
        let updatedAuthor = {
          author with
          banned = true;
          bannedAt = ?Time.now();
        };
        authors.add(authorId, updatedAuthor);
      };
    };
  };

  public shared ({ caller }) func createAuthor(name : Text) : async () {
    // Only admins can create authors
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let author : Author = {
      id = authorIdCounter;
      name;
      verified = false;
      banned = false;
      verifiedAt = null;
      bannedAt = null;
    };
    authors.add(authorIdCounter, author);
    authorIdCounter += 1;
  };

  public query ({ caller }) func getAuthor(authorId : Nat) : async Author {
    // Public read - no auth required
    switch (authors.get(authorId)) {
      case (null) { Runtime.trap("Author not found") };
      case (?author) { author };
    };
  };

  // ---- Task Submissions ----

  public shared ({ caller }) func submitTask(taskId : Nat, submissionLink : Text) : async () {
    // Only authenticated users can submit tasks
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit tasks");
    };
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let userId = getOrCreateUserId(caller);
        let submission : TaskSubmission = {
          id = taskSubmissionIdCounter;
          taskId;
          userId;
          cancelled = false;
          completed = false;
          withdrawn = false;
          submissionLink = ?submissionLink;
          submittedAt = ?Time.now();
        };
        taskSubmissions.add(taskSubmissionIdCounter, submission);
        taskSubmissionIdCounter += 1;
      };
    };
  };

  public shared ({ caller }) func approveTaskSubmission(submissionId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (taskSubmissions.get(submissionId)) {
      case (null) { Runtime.trap("Task submission not found") };
      case (?submission) {
        if (submission.completed) {
          Runtime.trap("Task already approved");
        };
        let updatedSubmission = {
          submission with completed = true
        };
        taskSubmissions.add(submissionId, updatedSubmission);
      };
    };
  };

  public shared ({ caller }) func cancelTaskSubmission(submissionId : Nat) : async () {
    // Only the owner of the submission or an admin can cancel it
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can cancel task submissions");
    };
    switch (taskSubmissions.get(submissionId)) {
      case (null) { Runtime.trap("Task submission not found") };
      case (?submission) {
        // Verify ownership unless admin
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          let callerId = getOrCreateUserId(caller);
          if (submission.userId != callerId) {
            Runtime.trap("Unauthorized: You can only cancel your own submissions");
          };
        };
        if (submission.cancelled) {
          Runtime.trap("Task already cancelled");
        };
        let updatedSubmission = {
          submission with cancelled = true;
          submittedAt = ?Time.now();
        };
        taskSubmissions.add(submissionId, updatedSubmission);
      };
    };
  };

  public query ({ caller }) func getTaskSubmissions(taskId : Nat) : async [TaskSubmission] {
    // Only admins can view all submissions for a task
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all task submissions");
    };
    taskSubmissions.values().filter(
      func(submission) {
        submission.taskId == taskId;
      }
    ).toArray();
  };

  public query ({ caller }) func getUserSubmissions(userId : Nat) : async [TaskSubmission] {
    // Users can only view their own submissions; admins can view any
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
        Runtime.trap("Unauthorized: Only users can view submissions");
      };
      let callerId = switch (principalToUserId.get(caller)) {
        case (?id) { id };
        case (null) { Runtime.trap("Unauthorized: You can only view your own submissions") };
      };
      if (callerId != userId) {
        Runtime.trap("Unauthorized: You can only view your own submissions");
      };
    };
    taskSubmissions.values().filter(
      func(submission) {
        submission.userId == userId;
      }
    ).toArray();
  };

  // ---- Referral Management ----

  let userRewards = Map.empty<Nat, Set.Set<Nat>>();

  public shared ({ caller }) func transferReferralBonus(referrerId : Nat, rewardId : Nat) : async () {
    // Only admins can transfer referral bonuses
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (rewards.get(rewardId)) {
      case (null) { Runtime.trap("Reward not found") };
      case (?reward) {
        if (reward.redeemed) {
          Runtime.trap("Reward already redeemed");
        };
        let updatedReward = {
          reward with redeemed = true
        };
        rewards.add(rewardId, updatedReward);

        switch (userRewards.get(referrerId)) {
          case (null) {
            let newSet = Set.singleton<Nat>(rewardId);
            userRewards.add(referrerId, newSet);
          };
          case (?rewardSet) {
            let clonedSet = Set.empty<Nat>();
            rewardSet.values().forEach(
              func(entry) {
                clonedSet.add(entry);
              }
            );
            clonedSet.add(rewardId);
            userRewards.add(referrerId, clonedSet);
          };
        };
      };
    };
  };

  public query ({ caller }) func getUserRewards(userId : Nat) : async [Reward] {
    // Users can only view their own rewards; admins can view any
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
        Runtime.trap("Unauthorized: Only users can view rewards");
      };
      let callerId = switch (principalToUserId.get(caller)) {
        case (?id) { id };
        case (null) { Runtime.trap("Unauthorized: You can only view your own rewards") };
      };
      if (callerId != userId) {
        Runtime.trap("Unauthorized: You can only view your own rewards");
      };
    };
    switch (userRewards.get(userId)) {
      case (null) {
        [];
      };
      case (?rewardSet) {
        let rewardsList = List.empty<Reward>();
        rewardSet.values().forEach(
          func(rewardId) {
            switch (rewards.get(rewardId)) {
              case (?reward) { rewardsList.add(reward) };
              case (null) {};
            };
          }
        );
        rewardsList.toArray();
      };
    };
  };

  // ---- Invoice Management ----

  public shared ({ caller }) func cancelInvoice(invoiceId : Nat) : async () {
    // Only admins can cancel invoices
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can cancel invoices");
    };
    switch (invoices.get(invoiceId)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?invoice) {
        if (invoice.cancelled) {
          Runtime.trap("Invoice already cancelled");
        };
        let updatedInvoice = {
          invoice with cancelled = true;
          cancelledAt = ?Time.now();
        };
        invoices.add(invoiceId, updatedInvoice);
      };
    };
  };

  public shared ({ caller }) func payInvoice(invoiceId : Nat) : async () {
    // Only admins can mark invoices as paid
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can mark invoices as paid");
    };
    switch (invoices.get(invoiceId)) {
      case (null) { Runtime.trap("Invoice not found") };
      case (?invoice) {
        if (invoice.paid) {
          Runtime.trap("Invoice already paid");
        };
        let updatedInvoice = {
          invoice with paid = true;
          paidAt = ?Time.now();
        };
        invoices.add(invoiceId, updatedInvoice);
      };
    };
  };

  public shared ({ caller }) func submitInvoiceReward(invoiceId : Nat, rewardId : Nat) : async () {
    // Only admins can submit invoice rewards
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (invoices.get(invoiceId), rewards.get(rewardId)) {
      case (null, _) { Runtime.trap("Invoice not found") };
      case (_, null) { Runtime.trap("Reward not found") };
      case (?invoice, ?reward) {
        if (invoice.cancelled) {
          Runtime.trap("Cancelled rewards not allowed");
        };
        if (not invoice.paid) {
          Runtime.trap("Unpaid rewards not allowed");
        };
        if (reward.amount != invoice.amount) {
          Runtime.trap("Reward amount does not match");
        };
      };
    };
  };

  // ---- Reward Management ----

  public shared ({ caller }) func createReward(userId : Nat, amount : Nat, type_ : RewardType, redeemed : Bool) : async () {
    // Only admins can create rewards
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let reward : Reward = {
      id = rewardIdCounter;
      userId;
      amount;
      type_;
      createdAt = Time.now();
      redeemed;
      redeemedAt = null;
    };
    rewards.add(rewardIdCounter, reward);
    rewardIdCounter += 1;
  };

  // ---- Commission and Bonus Tracking ----

  let commissions = Map.empty<Nat, Nat>();
  let bonuses = Map.empty<Nat, Nat>();

  public shared ({ caller }) func addCommission(userId : Nat, amount : Nat) : async () {
    // Only admins can add commissions
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let currentCommission = switch (commissions.get(userId)) {
      case (null) { 0 };
      case (?commission) { commission };
    };
    commissions.add(userId, currentCommission + amount);
  };

  public shared ({ caller }) func addBonus(userId : Nat, amount : Nat) : async () {
    // Only admins can add bonuses
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let currentBonus = switch (bonuses.get(userId)) {
      case (null) { 0 };
      case (?bonus) { bonus };
    };
    bonuses.add(userId, currentBonus + amount);
  };

  public query ({ caller }) func claimCommission(userId : Nat) : async Nat {
    // Users can only view their own commission; admins can view any
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
        Runtime.trap("Unauthorized: Only users can view commissions");
      };
      let callerId = switch (principalToUserId.get(caller)) {
        case (?id) { id };
        case (null) { Runtime.trap("Unauthorized: You can only view your own commission") };
      };
      if (callerId != userId) {
        Runtime.trap("Unauthorized: You can only view your own commission");
      };
    };
    switch (commissions.get(userId)) {
      case (null) { 0 };
      case (?commission) { commission };
    };
  };

  public query ({ caller }) func claimBonus(userId : Nat) : async Nat {
    // Users can only view their own bonus; admins can view any
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
        Runtime.trap("Unauthorized: Only users can view bonuses");
      };
      let callerId = switch (principalToUserId.get(caller)) {
        case (?id) { id };
        case (null) { Runtime.trap("Unauthorized: You can only view your own bonus") };
      };
      if (callerId != userId) {
        Runtime.trap("Unauthorized: You can only view your own bonus");
      };
    };
    switch (bonuses.get(userId)) {
      case (null) { 0 };
      case (?bonus) { bonus };
    };
  };
};
