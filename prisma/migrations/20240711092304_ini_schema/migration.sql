-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ReferBy` VARCHAR(191) NOT NULL,
    `ReferTo` VARCHAR(191) NOT NULL,
    `ReferEmail` VARCHAR(191) NOT NULL,
    `Courses` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
