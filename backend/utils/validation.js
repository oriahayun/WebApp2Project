const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().required(),
    location: Joi.object({
      address_components: Joi.array().items(Joi.object()),
      formatted_address: Joi.string(),
      geometry: Joi.object({
        location: Joi.object()
      }),
      place_id: Joi.string(),
      html_attributions: Joi.array().items(Joi.string())
    })
  });

  return schema.validate(data);
};

// Login Validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
