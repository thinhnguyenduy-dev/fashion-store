import { PrismaClient as InventoryClient } from '.prisma/inventory-client';
import { PrismaClient as CatalogClient } from '.prisma/catalog-client';

const inventoryPrisma = new InventoryClient();
const catalogPrisma = new CatalogClient();

async function main() {
  console.log('🌱 Starting Inventory Service Seeding...');

  // Clean up
  await inventoryPrisma.stockReservation.deleteMany();
  await inventoryPrisma.inventoryItem.deleteMany();
  console.log('🧹 Cleared existing inventory');

  // Fetch all variants from Catalog
  const variants = await catalogPrisma.productVariant.findMany({
    include: { product: true }
  });

  console.log(`Found ${variants.length} variants in Catalog. Creating inventory items...`);

  for (const variant of variants) {
    await inventoryPrisma.inventoryItem.create({
      data: {
        productId: variant.productId,
        variantId: variant.id,
        sku: variant.sku,
        productName: variant.product.name,
        quantity: variant.stockQuantity, // Use quantity from Catalog seed
        reserved: 0,
      }
    });
  }

  console.log(`✅ Inventory Service Seeding Completed (${variants.length} items)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await inventoryPrisma.$disconnect();
    await catalogPrisma.$disconnect();
  });
