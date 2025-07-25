-- CreateIndex
CREATE INDEX "subscriptions_userId_status_currentPeriodEnd_idx" ON "subscriptions"("userId", "status", "currentPeriodEnd");

-- CreateIndex
CREATE INDEX "subscriptions_status_currentPeriodEnd_idx" ON "subscriptions"("status", "currentPeriodEnd");

-- CreateIndex
CREATE INDEX "users_membershipLevel_idx" ON "users"("membershipLevel");

-- CreateIndex
CREATE INDEX "users_email_membershipLevel_idx" ON "users"("email", "membershipLevel");
