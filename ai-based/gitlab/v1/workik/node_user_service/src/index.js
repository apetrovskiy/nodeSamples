const express = require("express");
const users = require("./users");

const app = express();
const PORT = 3000;

app.get("/user/:id", (req, res) => {
  const user = users.find((user) => user.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
