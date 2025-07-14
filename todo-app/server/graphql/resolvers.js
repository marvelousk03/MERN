const User = require('../models/User');
const Todo = require('../models/Todo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createToken } = require('../utils/token');

module.exports = {
  Query: {
    getTodos: async (_, __, { req }) => {
      const token = req.cookies.token;
      if (!token) throw new Error("Unauthorized");
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      return await Todo.find({ userId });
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }, { res }) => {
      const existing = await User.findOne({ email });
      if (existing) throw new Error('User already exists');

      const user = await User.create({ username, email, password });
      const token = createToken(user._id);

      res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });
      return "Signup successful";
    },

    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = createToken(user._id);
      res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

      return "Login successful";
    },

    addTodo: async (_, { title }, { req }) => {
      const { userId } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const todo = await Todo.create({ title, userId });
      return todo;
    },

    toggleTodo: async (_, { id }, { req }) => {
      const { userId } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const todo = await Todo.findOne({ _id: id, userId });
      if (!todo) throw new Error("Not authorized");

      todo.completed = !todo.completed;
      await todo.save();
      return todo;
    },

    deleteTodo: async (_, { id }, { req }) => {
      const { userId } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const todo = await Todo.findOne({ _id: id, userId });
      if (!todo) throw new Error("Not authorized");

      await Todo.deleteOne({ _id: id });
      return "Todo deleted";
    },
  }
};
