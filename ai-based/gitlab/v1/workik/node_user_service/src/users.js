const { v4: uuidv4 } = require("uuid");

const users = [
  { id: uuidv4(), first_name: "John", last_name: "Doe", age: 25 },
  { id: uuidv4(), first_name: "Jane", last_name: "Doe", age: 30 },
  { id: uuidv4(), first_name: "Jim", last_name: "Beam", age: 35 },
];

module.exports = users;
