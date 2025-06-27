import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'process.env.CLIENT_URI',
  credentials: true
}));
app.use("/api", authRoutes)


export default app;
