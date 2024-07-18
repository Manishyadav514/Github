import cors from "cors";
import express, { Express } from "express";
import mongoose from "mongoose";
import routes from "./routes";
import dotenv from "dotenv";
import requireAuth from "./middleware/requireAuth";
dotenv.config();

const app: Express = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.options("*", cors());

// requireAuth middleware is applied to all routes except /login and /register 
// to prevent unauthenticated users from accessing protected routes
app.use(requireAuth);

app.use(express.json());

// routes
app.use(routes);

const port: string | number = process.env.PORT || 3000;
const uri: string = process.env.MONGO_URI || "";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions;

// connect to MongoDB
mongoose
  .connect(uri, options)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    throw error;
  });
