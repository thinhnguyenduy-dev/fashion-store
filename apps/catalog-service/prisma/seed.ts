import { PrismaClient } from '.prisma/catalog-client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Catalog Service Seeding...');

  // Clean up existing data
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create Categories
  const categoriesMap = new Map<string, string>(); // name -> id

  const mainCategories = ['Men', 'Women', 'Kids'];
  const subCategories = ['Clothing', 'Shoes', 'Accessories', 'New Arrivals'];

  for (const mainCat of mainCategories) {
    const createdMain = await prisma.category.create({
      data: {
        name: mainCat,
        slug: faker.helpers.slugify(mainCat).toLowerCase(),
        description: `All ${mainCat} fashion`,
        imageUrl: faker.image.urlLoremFlickr({ category: 'fashion' }),
        sortOrder: 1,
      },
    });
    categoriesMap.set(mainCat, createdMain.id);

    // Create Subcategories
    for (const subCat of subCategories) {
      const name = `${mainCat} ${subCat}`;
      const slug = faker.helpers.slugify(name).toLowerCase();
      
      const createdSub = await prisma.category.create({
        data: {
          name: name,
          slug: slug,
          description: `${subCat} for ${mainCat}`,
          parentId: createdMain.id,
          imageUrl: faker.image.urlLoremFlickr({ category: 'fashion' }),
        },
      });
      categoriesMap.set(name, createdSub.id);

      // Create Products for this subcategory
      const productCount = 10 + Math.floor(Math.random() * 10); // 10-20 products per subcat
      console.log(`Creating ${productCount} products for ${name}...`);

      for (let i = 0; i < productCount; i++) {
        const productName = faker.commerce.productName();
        const productSlug = faker.helpers.slugify(`${productName} ${faker.string.alphanumeric(4)}`).toLowerCase();
        
        const product = await prisma.product.create({
          data: {
            name: productName,
            slug: productSlug,
            description: faker.commerce.productDescription(),
            basePrice: parseFloat(faker.commerce.price()),
            categoryId: createdSub.id,
            isActive: true,
            isFeatured: faker.datatype.boolean(),
            tags: [mainCat, subCat, faker.commerce.productAdjective()],
            metaTitle: productName,
            metaDescription: faker.lorem.sentence(),
          },
        });

        // Add Images
        await prisma.productImage.createMany({
          data: [
            {
              productId: product.id,
              url: faker.image.urlLoremFlickr({ category: 'clothes' }),
              isPrimary: true,
              sortOrder: 0,
            },
            {
              productId: product.id,
              url: faker.image.urlLoremFlickr({ category: 'fashion' }),
              isPrimary: false,
              sortOrder: 1,
            },
          ],
        });

        // Add Variants
        const sizes = ['S', 'M', 'L', 'XL'];
        const colors = [
          { name: 'Black', hex: '#000000' },
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Red', hex: '#FF0000' },
          { name: 'Blue', hex: '#0000FF' },
        ];

        // Pick random sizes and colors
        const selectedSizes = faker.helpers.arrayElements(sizes, { min: 2, max: 4 });
        const selectedColors = faker.helpers.arrayElements(colors, { min: 1, max: 3 });

        for (const size of selectedSizes) {
          for (const color of selectedColors) {
            await prisma.productVariant.create({
              data: {
                productId: product.id,
                sku: `${faker.string.alphanumeric(6).toUpperCase()}-${size}-${color.name.substring(0, 3).toUpperCase()}`,
                size: size,
                color: color.name,
                colorHex: color.hex,
                stockQuantity: faker.number.int({ min: 0, max: 100 }),
                priceModifier: faker.number.float({ min: 0, max: 20 }),
              },
            });
          }
        }
      }
    }
  }

  console.log('✅ Catalog Service Seeding Completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
