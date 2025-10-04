import express from 'express';
const router = express.Router();
import { 
    createOrder, 
    getAllOrders, 
    getOrdersByUserId, 
    getOrderById, 
    updateOrderStatus, 
    updatePaymentStatus, 
    cancelOrder 
} from '../controllers/orderController.js';


router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/user/:userId', getOrdersByUserId);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/payment', updatePaymentStatus);

router.patch('/:id/cancel', cancelOrder);

export default router;
