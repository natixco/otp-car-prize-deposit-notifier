-- AlterTable
ALTER TABLE `Deposit` ADD COLUMN `status` ENUM('Pending', 'Won') NOT NULL DEFAULT 'Pending';
