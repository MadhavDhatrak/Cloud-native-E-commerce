import Order from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, shippingAddress } = req.body;
        
        if(!userId || !items || !totalAmount || !shippingAddress) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        if(!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }
        
        const order = await Order.create({
            userId,
            items,
            totalAmount,
            shippingAddress,
            status: 'Pending',
            paymentStatus: 'Pending'
        });
        
        return res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving orders',
            error: error.message
        });
    }
};


export const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        
        if(orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving orders',
            error: error.message
        });
    }
};


export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        
        if(!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving order',
            error: error.message
        });
    }
};


export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if(!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        if(!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if(!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        return res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;
        
        if(!paymentStatus) {
            return res.status(400).json({ message: 'Payment status is required' });
        }
        
        if(!['Pending', 'Paid', 'Failed'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status value' });
        }
        
        const order = await Order.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        );
        
        if(!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        return res.status(200).json({
            message: 'Payment status updated successfully',
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating payment status',
            error: error.message
        });
    }
};


export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await Order.findById(id);
        
        if(!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if(order.status === 'Shipped' || order.status === 'Delivered') {
            return res.status(400).json({ message: 'Cannot cancel an order that has been shipped or delivered' });
        }
        
        order.status = 'Cancelled';
        await order.save();
        
        return res.status(200).json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error cancelling order',
            error: error.message
        });
    }
};
