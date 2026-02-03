import { User } from "../../domain/entities/User";
import { Game } from "../../domain/entities/Game";
import { Score } from "../../domain/entities/Score";

export const users: User[] = [];
export const games: Game[] = [
  new Game("1", "Pac-Man", "Clásico arcade", "Namco", "pacman.png"),
  new Game("2", "Super Mario Bros", "Plataformas", "Nintendo", "mario.png")
];
export const scores: Score[] = [];
