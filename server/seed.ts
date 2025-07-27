import { db } from "./db.ts";
import { users, products } from "../shared/schema.ts";
import { randomUUID } from "crypto";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data
    await db.delete(products);
    await db.delete(users);

    // Create admin user
    const adminId = randomUUID();
    await db.insert(users).values({
      id: adminId,
      username: "admin",
      email: "admin@streetmarket.com",
      password: "admin123",
      role: "admin",
      name: "System Administrator",
      status: "active",
    });

    // Create sample suppliers
    const supplier1Id = randomUUID();
    await db.insert(users).values({
      id: supplier1Id,
      username: "supplier1",
      email: "supplier1@streetmarket.com",
      password: "supplier123",
      role: "supplier",
      name: "Rajesh Kumar",
      companyName: "Kumar Wholesale Mart",
      contactPerson: "Rajesh Kumar",
      businessLicense: "WHL2023001",
      status: "active",
    });

    const supplier2Id = randomUUID();
    await db.insert(users).values({
      id: supplier2Id,
      username: "supplier2",
      email: "supplier2@streetmarket.com",
      password: "supplier123",
      role: "supplier",
      name: "Priya Sharma",
      companyName: "Sharma Spices & More",
      contactPerson: "Priya Sharma",
      businessLicense: "WHL2023002",
      status: "active",
    });

    // Create sample vendors
    const vendor1Id = randomUUID();
    await db.insert(users).values({
      id: vendor1Id,
      username: "vendor1",
      email: "vendor1@streetmarket.com",
      password: "vendor123",
      role: "vendor",
      name: "Arjun Singh",
      businessName: "Singh Street Food Corner",
      phone: "+91-9876543210",
      status: "active",
    });

    const vendor2Id = randomUUID();
    await db.insert(users).values({
      id: vendor2Id,
      username: "vendor2",
      email: "vendor2@streetmarket.com",
      password: "vendor123",
      role: "vendor",
      name: "Meera Patel",
      businessName: "Patel Chaat House",
      phone: "+91-9876543211",
      status: "active",
    });

    // Create sample products
    const sampleProducts = [
      {
        name: "Premium Basmati Rice",
        category: "grains",
        description: "High-quality aged basmati rice with long grains and authentic aroma. Perfect for biryanis and pulavs.",
        price: "85.00",
        stock: 500,
        minOrder: 10,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier1Id,
      },
      {
        name: "Fresh Onions",
        category: "vegetables",
        description: "Farm-fresh onions, carefully selected for quality and taste. Essential for all Indian cooking.",
        price: "25.00",
        stock: 1000,
        minOrder: 5,
        imageUrl: "https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier1Id,
      },
      {
        name: "Red Chili Powder",
        category: "spices",
        description: "Pure red chili powder with perfect heat and color. Made from premium Kashmiri chilies.",
        price: "180.00",
        stock: 200,
        minOrder: 2,
        imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier2Id,
      },
      {
        name: "Sunflower Cooking Oil",
        category: "oils",
        description: "Pure sunflower oil, ideal for deep frying and all cooking needs. Heart-healthy and light.",
        price: "120.00",
        stock: 300,
        minOrder: 5,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier1Id,
      },
      {
        name: "Green Chilies",
        category: "vegetables",
        description: "Fresh, crisp green chilies with the perfect heat level. Essential for authentic street food.",
        price: "40.00",
        stock: 150,
        minOrder: 2,
        imageUrl: "https://images.unsplash.com/photo-1583486921463-ad1c3c4a3a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier2Id,
      },
      {
        name: "Turmeric Powder",
        category: "spices",
        description: "Pure turmeric powder with vibrant color and medicinal properties. No artificial additives.",
        price: "150.00",
        stock: 100,
        minOrder: 1,
        imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier2Id,
      },
      {
        name: "Wheat Flour",
        category: "grains",
        description: "Fine quality wheat flour, perfect for making rotis, naans, and other Indian breads.",
        price: "35.00",
        stock: 800,
        minOrder: 10,
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier1Id,
      },
      {
        name: "Garam Masala",
        category: "spices",
        description: "Authentic garam masala blend with traditional spices. Adds rich flavor to all dishes.",
        price: "200.00",
        stock: 80,
        minOrder: 1,
        imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        supplierId: supplier2Id,
      },
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values({
        id: randomUUID(),
        ...product,
      });
    }

    console.log("✅ Database seeded successfully!");
    console.log(`Created:
    - 1 Admin user (admin@streetmarket.com / admin123)
    - 2 Supplier users
    - 2 Vendor users
    - ${sampleProducts.length} Sample products`);

  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}