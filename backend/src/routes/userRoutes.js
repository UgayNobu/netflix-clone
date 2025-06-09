const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { registerSchema, loginSchema, updateUserSchema } = require('../validation/userSchemas');

const router = express.Router();

// Public registration and login routes with validation
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

// All routes below require authentication
router.use(authenticate);

// Only admins can view all users
router
  .route('/')
  .get(authorize('ADMIN'), userController.getAllUsers);

// Users can view, update, or delete their own profile; admins can manage anyone
router
  .route('/:id')
  .get(userController.getUser)
  .patch(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;