import app from "./infrastructure/server/express";

app.listen(3000, () => {
  console.log("🕹️  Prisma corriendo en http://localhost:3000");
});
