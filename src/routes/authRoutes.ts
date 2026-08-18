import {Router} from 'express';
import {registerValidator, loginValidator} from '../validators/authValidators';
import {authenticate} from '../middleware/authMiddleware';
import {registerUser, loginUser, getCurrentUser} from '../controllers/authController';

const router = Router();

// Register 
router.post('/register', registerValidator, registerUser);

// Login
router.post('/login', loginValidator, loginUser);

// Get current user
router.get('/current user', authenticate);

export default router;