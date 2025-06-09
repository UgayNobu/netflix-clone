const Joi = require('joi');
const { sendError } = require('../utils/errors');

/**
 * Request validation middleware generator
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - req property to validate (body, query, params)
 */
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
  if (error) {
    return sendError(res, 400, 'Validation failed', {
      details: error.details.map((d) => d.message)
    });
  }
  req[property] = value;
  next();
};

module.exports = validate;