-- 失敗したマイグレーションを成功に更新
UPDATE "_prisma_migrations"
SET success = true,
    finished_at = NOW()
WHERE migration_name = '20250309063339_add_hourly_prices'
  AND success = false; 