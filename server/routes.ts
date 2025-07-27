import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import { loginSchema, registerVendorSchema, registerSupplierSchema, insertProductSchema } from "../shared/schema.ts";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.status !== "active") {
        return res.status(403).json({ message: "Account is not active" });
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register/vendor", async (req, res) => {
    try {
      const userData = registerVendorSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register/supplier", async (req, res) => {
    try {
      const userData = registerSupplierSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser({ ...userData, status: "pending" });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      
      // Add supplier information to products
      const productsWithSupplier = await Promise.all(
        products.map(async (product) => {
          const supplier = await storage.getUser(product.supplierId);
          return {
            ...product,
            supplierName: supplier?.companyName || supplier?.name || "Unknown Supplier",
          };
        })
      );
      
      res.json(productsWithSupplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/supplier/:supplierId", async (req, res) => {
    try {
      const { supplierId } = req.params;
      const products = await storage.getProductsBySupplierId(supplierId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      await storage.updateProduct(id, updates);
      res.json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete product" });
    }
  });

  // Cart routes
  app.get("/api/cart/:vendorId", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const cartItems = await storage.getCartItems(vendorId);
      
      // Add product information to cart items
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          const supplier = await storage.getUser(product?.supplierId || "");
          return {
            ...item,
            product,
            supplierName: supplier?.companyName || supplier?.name || "Unknown",
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { vendorId, productId, quantity } = req.body;
      const cartItem = await storage.addToCart({ vendorId, productId, quantity });
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      await storage.updateCartItem(id, quantity);
      res.json({ message: "Cart item updated" });
    } catch (error) {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(400).json({ message: "Failed to remove from cart" });
    }
  });

  // Order routes
  app.get("/api/orders/vendor/:vendorId", async (req, res) => {
    try {
      const { vendorId } = req.params;
      const orders = await storage.getOrdersByVendorId(vendorId);
      
      // Add order items to each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = await storage.getProductById(item.productId);
              return { ...item, product };
            })
          );
          return { ...order, items: itemsWithProducts };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/supplier/:supplierId", async (req, res) => {
    try {
      const { supplierId } = req.params;
      const orders = await storage.getOrdersBySupplierId(supplierId);
      
      // Add order items and vendor info
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          const vendor = await storage.getUser(order.vendorId);
          const supplierItems = [];
          
          for (const item of items) {
            const product = await storage.getProductById(item.productId);
            if (product?.supplierId === supplierId) {
              supplierItems.push({ ...item, product });
            }
          }
          
          return { 
            ...order, 
            items: supplierItems,
            vendorName: vendor?.businessName || vendor?.name || "Unknown Vendor"
          };
        })
      );
      
      res.json(ordersWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier orders" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      
      // Add vendor and order items info
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const vendor = await storage.getUser(order.vendorId);
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            vendorName: vendor?.businessName || vendor?.name || "Unknown Vendor",
            itemCount: items.length,
          };
        })
      );
      
      res.json(ordersWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { vendorId, cartItems } = req.body;
      
      // Calculate total amount
      let totalAmount = 0;
      for (const item of cartItems) {
        const product = await storage.getProductById(item.productId);
        if (product) {
          totalAmount += parseFloat(product.price) * item.quantity;
        }
      }
      
      // Create order
      const order = await storage.createOrder({
        vendorId,
        status: "pending",
        totalAmount: totalAmount.toString(),
      });
      
      // Create order items
      for (const item of cartItems) {
        const product = await storage.getProductById(item.productId);
        if (product) {
          const itemTotal = parseFloat(product.price) * item.quantity;
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            total: itemTotal.toString(),
          });
          
          // Update product stock
          await storage.updateProduct(product.id, {
            stock: product.stock - item.quantity,
          });
        }
      }
      
      // Clear cart
      await storage.clearCart(vendorId);
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateOrderStatus(id, status);
      res.json({ message: "Order status updated" });
    } catch (error) {
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  // User management routes (admin)
  app.get("/api/users/vendors", async (req, res) => {
    try {
      const vendors = await storage.getUsersByRole("vendor");
      const vendorsWithoutPasswords = vendors.map(({ password, ...vendor }) => vendor);
      res.json(vendorsWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get("/api/users/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getUsersByRole("supplier");
      const suppliersWithoutPasswords = suppliers.map(({ password, ...supplier }) => supplier);
      res.json(suppliersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.put("/api/users/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await storage.updateUserStatus(id, status);
      res.json({ message: "User status updated" });
    } catch (error) {
      res.status(400).json({ message: "Failed to update user status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
