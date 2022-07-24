const Joi = require('joi');

const phoneDetails = Joi.object().keys({
    type: Joi.string().valid('home', 'work', 'mobile').required(),
    number: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required()
  })

const phoneSchema = Joi.array().items(phoneDetails);

const nameSchema = Joi.object().keys({
    first: Joi.string().required(),
    middle: Joi.string().required(),
    last: Joi.string().required()
});

const addressSchema = Joi.object().keys({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required()
});

const bodyValidation = Joi.object().keys({
    email: Joi.string().email().required(),
    phone: phoneSchema,
    address: addressSchema,
    name: nameSchema
  });

const parameterIdValidation = Joi.string().regex(/^\d+/).required();

const validateInput = (schema, input) => {
    if(schema === 'body') {
        return bodyValidation.validate(input);
    } else {
        return parameterIdValidation.validate(input);
    }

}

module.exports = validateInput;