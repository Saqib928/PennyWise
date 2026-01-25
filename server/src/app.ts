import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport";

import authRoutes from "./modules/auth/auth.routes";
import groupRoutes from "./modules/groups/group.routes";
import expenseRoutes from "./modules/expenses/expense.routes";
import aiRoutes from "./modules/ai/ai.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import userRoutes from "./modules/users/user.routes";

import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);
