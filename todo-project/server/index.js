import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import authMiddleware from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(authMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ user: req.user }),
});

await server.start();
server.applyMiddleware({ app });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(4000, () => console.log("🚀 Server at http://localhost:4000/graphql")))
  .catch(console.error);
