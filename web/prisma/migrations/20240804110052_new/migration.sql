-- CreateTable
CREATE TABLE `Shop` (
    `id` VARCHAR(191) NOT NULL,
    `shop_name` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `scope` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `shop_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `shopify_shop` JSON NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Shop_shop_name_key`(`shop_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
