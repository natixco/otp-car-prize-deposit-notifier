-- AlterTable
ALTER TABLE `Deposit` ADD COLUMN `notificationStatus` ENUM('None', 'Queued', 'Sent') NOT NULL DEFAULT 'None';
