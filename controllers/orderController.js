const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Inventory = require("../models/Inventory");

// Place an order
const createOrder = async (req, res) => {
  try {
    const { customerName, table, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // 1 & 2. Validate menu item IDs + confirm availability, 3. get current prices
    const orderItems = [];
    let totalAmount = 0;

    for (const requestedItem of items) {
      const menuItem = await MenuItem.findById(requestedItem.menuItem);

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${requestedItem.menuItem}`,
        });
      }

      if (!menuItem.available) {
        return res.status(400).json({
          success: false,
          message: `Menu item unavailable: ${menuItem.name}`,
        });
      }

      const quantity = requestedItem.quantity;

      // 5. Check inventory according to 1:1 mapping (only if linked)
      if (menuItem.linkedInventoryItem) {
        const inventoryItem = await Inventory.findById(menuItem.linkedInventoryItem);

        if (!inventoryItem) {
          return res.status(400).json({
            success: false,
            message: `Linked inventory item missing for: ${menuItem.name}`,
          });
        }

        const requiredQty = menuItem.consumptionQty * quantity;

        if (inventoryItem.quantity < requiredQty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient inventory for ${menuItem.name}. Available: ${inventoryItem.quantity} ${inventoryItem.unit}, required: ${requiredQty} ${inventoryItem.unit}`,
          });
        }
      }

      // 4. Calculate total server-side using current DB price, not client input
      totalAmount += menuItem.price * quantity;

      orderItems.push({
        menuItem: menuItem._id,
        quantity,
        price: menuItem.price,
      });
    }

    // 6. Deduct inventory (only after all validation passes, to avoid partial deduction)
    for (const requestedItem of items) {
      const menuItem = await MenuItem.findById(requestedItem.menuItem);

      if (menuItem.linkedInventoryItem) {
        const requiredQty = menuItem.consumptionQty * requestedItem.quantity;

        await Inventory.findByIdAndUpdate(menuItem.linkedInventoryItem, {
          $inc: { quantity: -requiredQty },
        });
      }
    }

    // 7. Create order
    const order = await Order.create({
      customerName,
      table,
      items: orderItems,
      totalAmount,
    });

    // 8. Return order details
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem")
      .populate("table")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.menuItem")
      .populate("table");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
};