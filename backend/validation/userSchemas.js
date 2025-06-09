const Joi = require('joi');

// Registration (and user creation) schema
exports.registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  role: Joi.string().valid('USER', 'ADMIN').optional()
});

// Login schema
exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Update user (self or admin)
exports.updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  // password not updatable here
  role: Joi.string().valid('USER', 'ADMIN').optional()
}).min(1);