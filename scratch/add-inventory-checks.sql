-- Add CHECK constraints to prevent negative inventory
ALTER TABLE "SiteInventory" ADD CONSTRAINT "SiteInventory_quantity_check" CHECK (quantity >= 0);
ALTER TABLE "SiteInventory" ADD CONSTRAINT "SiteInventory_reservedQty_check" CHECK ("reservedQty" >= 0);

ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_quantity_check" CHECK (quantity >= 0);
ALTER TABLE "WarehouseStock" ADD CONSTRAINT "WarehouseStock_reservedQty_check" CHECK ("reservedQty" >= 0);
