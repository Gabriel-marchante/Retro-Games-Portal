import jwt from "jsonwebtoken";
import { users } from "../database/memory";
import { User } from "../../domain/entities/User";
import { jwtSecret } from "./auth.middleware";

export const login = (req: any, res: any) => {
  const { name, email, nickname, age, nationality, photoUrl } = req.body;

  let user = users.find(u => u.email === email);

  if (!user) {
    user = new User(
      crypto.randomUUID(),
      name,
      email,
      nickname,
      age,
      nationality,
      photoUrl
    );
    users.push(user);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, nickname: user.nickname },
    jwtSecret,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
};
