const db = require("../utilites/db");
const validator = require("joi");
module.exports = class User {
  constructor(values) {
    this.firstName = values.firstName;
    this.lastName = values.lastName;
    this.email = values.email;
    this.password = values.password;
    this.mobileNumber = values.mobileNumber;
    this.gender = values.gender;
    this.birthday = values.birthday;
    this.roleId = values.roleId;
  }

  save() {
    return db.execute(
      `insert into users (first_name,last_name,email ,password,birthday,gender,role_id,mobile_number) 
    values(?,?,?,?,?,?,?,?)`,
      [
        this.firstName,
        this.lastName,
        this.email,
        this.password,
        this.birthday,
        this.gender,
        this.roleId,
        this.mobileNumber
      ]
    );
  }
  static validation(values) {
    //first name
    if (!values.firstName || values.firstName === "") {
      return "firstName is required";
    }
    if (values.firstName.length < 3) {
      return "firstName must be more than 2 character ";
    }

    //last name
    if (!values.lastName || values.lastName === "") {
      return "lastName is required";
    }
    if (values.lastName.length < 3) {
      return "lastName must be more than 2 characters ";
    }

    //email
    if (!values.email || values.email === "") {
      console.log(values.email);
      return "email is required";
    }
    //gender
    if (!values.gender || values.gender === "") {
      return "gender is required";
    }
    if (values.gender != "male" && values.gender != "famele") {
      return "gender's value must be male or famele";
    }

    //password
    if (!values.password || values.password === "") {
      return false;
    }
    if (values.password.length < 8) {
      return "lastName must be more than 7 characters ";
    }
    if (values.password !== values.confirmPassword) {
      return "Password does not match";
    }

    //role id
    if (!values.roleId || values.roleId == "") {
      return "role id is required";
    }

    //phone number
    if (!values.mobileNumber || values.mobileNumber == "") {
      return "mobile number is required";
    }
    return true;
  }

  static checkAuthorization(roleId, permissionId) {
    return db.execute(
      `select * from permissions_roles where role_id = ? and permission_id = ?`,
      [roleId, permissionId]
    );
  }

  static getAllUsers() {
    return db.execute(
      `select first_name as 'firstName' , last_name as 'lastName',email,gender,birthday,mobile_number as 'mobileNumber' ,roles.name ,users.id from users
      inner join roles on users.role_id = roles.role_id 
`
    );
  }

  static getUserByEmail(email) {
    return db.execute("select * from users where users.email = ?", [email]);
  }

  static getUserById(userId) {
    return db.execute(
      `
    select first_name as 'firstName' , last_name as 'lastName',email,gender,birthday,mobile_number as 'mobileNumber' ,roles.name as 'roleName' ,users.id from users
    inner join roles on users.role_id = roles.role_id 
    where users.id = ? `,
      [userId]
    );
  }

  static deleteUser(userId) {
    return db.execute("delete from users where id = ?", [userId]);
  }

  static validator(types = [], data) {
    let schema = validator.object().keys({});
    types.forEach(item => {
      if (item == "id") {
        schema = schema.keys({
          id: validator.number().required()
        });
      }
      if (item == "firstName") {
        schema = schema.keys({
          firstName: validator
            .string()
            .alphanum()
            .min(3)
            .required()
        });
      }
      if (item == "lastName") {
        schema = schema.keys({
          lastName: validator
            .string()
            .alphanum()
            .min(3)
            .required()
        });
      }
      if (item == "email") {
        schema = schema.keys({
          email: validator
            .string()
            .email()
            .required()
        });
      }
      if (item == "password") {
        schema = schema.keys({
          confirmPassword: validator
            .string()
            .alphanum()
            .required()
        });
      }
      if (item == "confirmPassword") {
        schema = schema.keys({
          confirmPassword: validator
            .string()
            .alphanum()
            .required()
        });
      }
      if (item == "mobileNumber") {
        schema = schema.keys({
          mobileNumber: validator
            .number()
            .min(7)
            .required()
        });
      }
      if (item == "birthday") {
        schema = schema.keys({
          firstName: validator.date().required()
        });
      }
      if (item == "roleId") {
        schema = schema.keys({
          firstName: validator.number().required()
        });
      }
    });
    return validator.validate(data, schema);
  }
};
