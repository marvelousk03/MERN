import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Todo from "../models/Todo.js";

const createToken = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export default {
  Query: {
    getTodos: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Todo.find({ userId: user.id });
    },
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hashed });
      const token = createToken(user);
      return { ...user._doc, id: user.id, token };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("Invalid credentials");
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Invalid credentials");
      const token = createToken(user);
      return { ...user._doc, id: user.id, token };
    },
    addTodo: async (_, { task }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Todo.create({ task, completed: false, userId: user.id });
    },
    toggleTodo: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const todo = await Todo.findById(id);
      if (!todo || todo.userId.toString() !== user.id) throw new Error("Not found");
      todo.completed = !todo.completed;
      return todo.save();
    },
    deleteTodo: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const todo = await Todo.findById(id);
      if (!todo || todo.userId.toString() !== user.id) throw new Error("Not found");
      await todo.deleteOne();
      return true;
    },
  },
};
