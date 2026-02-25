# Specification

## Summary
**Goal:** Build "Super Gro – Daily Task Earn Pro," a mobile-first web app where users register via OTP, complete daily tasks to earn rupee rewards, grow a referral team for level bonuses, and withdraw earnings via UPI — all managed through an admin approval workflow.

**Planned changes:**

**Authentication**
- Login/Registration page with mobile number input, OTP request, OTP verification (simulated — any 6-digit code accepted), optional referral code, and Terms & Conditions notice
- On success, navigate to Home dashboard

**Home Dashboard**
- Welcome message, Wallet Balance card, Direct Income and Team Income stats
- Quick-action buttons: Daily Tasks, Withdraw, Copy Referral Link, Share on WhatsApp (wa.me), Share on Telegram (t.me)

**Daily Tasks Page**
- Five task cards: Daily Check-In (₹50), Watch Video (₹100), Submit Screenshot (₹50), Refer 1 Friend (₹1000), Weekly Bonus (₹1000)
- Each card shows reward, submission status (available/pending/approved/rejected)
- Check-In is one-tap; Screenshot task has a proof URL input; Watch Video shows a placeholder link
- Notice: "Task approval is required before earnings are added to your wallet"

**Referral / Team Page**
- Display direct referral count, team size, and current level reached
- 10-level progress table with required members, bonus amount, and claimed/unclaimed status
- Claim button for eligible unclaimed levels
- Note about referral income requiring the referred user to complete at least one task

**Wallet Page**
- Available Balance, Total Earnings, Total Withdrawn cards
- Withdrawal form with UPI ID and amount inputs (minimum ₹500 validation)
- Confirmation message with 12–48 hour processing time notice
- Past withdrawal requests list with status

**Admin Panel** (admin-only)
- Task Approvals tab: list pending submissions with user mobile, task type, proof URL, Approve/Reject buttons
- Withdrawal Approvals tab: list pending requests with user mobile, UPI ID, amount, Approve/Reject buttons
- Users tab: list all users with a Block button per user

**Static Pages**
- Terms & Conditions, Disclaimer, Important Rules pages with their respective content
- Support page with mailto (s10361781@gmail.com), Telegram (t.me/supergroearn), and WhatsApp (+91-63710-78941) links

**Backend**
- User records: mobile number, hashed OTP, referral code, referrer ID, registration timestamp, account status
- `requestOTP`, `verifyOTP` (returns session token), `registerUser` (links referrer), `getMyProfile`
- Task submissions per user per day with status; one submission per task type per day (except Refer Friend); 7-day streak for Weekly Bonus; `submitTask`, `getMyTaskSubmissions`, `adminApproveTask`, `adminRejectTask`
- 10-level referral tree; ₹1000 direct referral bonus credited after referred user completes first task; level bonuses (L1=₹1000 to L10=₹500,000) unlocked at multiples of 5 cumulative members; `getMyReferralStats`, `claimLevelBonus`
- Wallet tracking: availableBalance, totalEarnings, totalWithdrawn; `getWallet`, `submitWithdrawal` (min ₹500), `adminApproveWithdrawal`, `adminRejectWithdrawal`
- Admin-only functions: `listPendingTaskSubmissions`, `listPendingWithdrawals`, `listAllUsers`, `blockUser`; admin = canister deployer principal

**Visual Theme**
- Deep emerald green and gold color palette; card-based mobile-first layout (320px–430px); bold gold rupee amounts; subtle gradient backgrounds; professional sans-serif typeface; consistent icons for tasks, wallet, referral

**User-visible outcome:** Users can register with a mobile number, complete daily tasks, build a referral team, track earnings, and request UPI withdrawals — all with an admin approval flow for task rewards and withdrawals. Admins can approve/reject tasks and withdrawals and manage users via a protected panel.
