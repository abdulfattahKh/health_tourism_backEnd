let joiValidator = require("joi");

function validator(data, types = []) {
  if (types.length == 0) {
    Object.keys(data).forEach((key, index) => {
      types[index] = key;
    });
  }
  let schema = joiValidator.object().keys({});
  types.forEach(item => {
    if (item == "id") {
      schema = schema.keys({
        id: joiValidator.number().required()
      });
    }
    if (item == "fieldName") {
      schema = schema.keys({
        fieldName: joiValidator
          .string()
          .min(3)
          .required()
      });
    }
    if (item == "tableName") {
      schema = schema.keys({
        tableName: joiValidator
          .string()
          .min(1)
          .required()
      });
    }
    if (item == "value") {
      schema = schema.keys({
        value: joiValidator.any().required()
      });
    }
    if (item == "firstName") {
      schema = schema.keys({
        firstName: joiValidator
          .string()
          .alphanum()
          .min(3)
          .required()
      });
    }
    if (item == "lastName") {
      schema = schema.keys({
        lastName: joiValidator
          .string()
          .alphanum()
          .min(3)
          .required()
      });
    }
    if (item == "email") {
      schema = schema.keys({
        email: joiValidator
          .string()
          .email()
          .required()
      });
    }
    if (item == "password") {
      schema = schema.keys({
        password: joiValidator
          .string()
          .alphanum()
          .required()
      });
    }
    if (item == "confirmPassword") {
      schema = schema.keys({
        confirmPassword: joiValidator
          .string()
          .alphanum()
          .required()
      });
    }
    if (item == "mobileNumber") {
      schema = schema.keys({
        mobileNumber: joiValidator
          .number()
          .min(7)
          .required()
      });
    }
    if (item == "birthday") {
      schema = schema.keys({
        birthday: joiValidator.date().required()
      });
    }
    if (item == "roleId") {
      schema = schema.keys({
        roleId: joiValidator.number().required()
      });
    }
    if (item == "description") {
      schema = schema.keys({
        description: joiValidator.string().required()
      });
    }
    if (item == "name") {
      schema = schema.keys({
        name: joiValidator.string().required()
      });
    }
  });

  return joiValidator.validate(data, schema);
}

module.exports = validator;
