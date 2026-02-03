import express from "express";
import { users, games, scores } from "../database/memory";
import { Score } from "../../domain/entities/Score";
import { authMiddleware } from "./auth.middleware";
import { errorMiddleware } from "./error.middleware";
import { login } from "./auth.controller";

const app = express();
app.use(express.json());

app.post("/auth/login", login);

app.get("/users", authMiddleware, (_req, res) => {
  res.json(users);
});

app.get("/games", (_req, res) => {
  res.json(games);
});

app.post("/scores", authMiddleware, (req, res) => {
  const { userId, gameId, points, nationality } = req.body;

  const score = new Score(
    crypto.randomUUID(),
    userId,
    gameId,
    points,
    nationality
  );

  scores.push(score);
  res.status(201).json(score);
});

app.get("/rankings/global/:gameId", (req, res) => {
  const ranking = scores
    .filter(s => s.gameId === req.params.gameId)
    .sort((a, b) => b.points - a.points);

  res.json(ranking);
});

app.use(errorMiddleware);

export default app;
