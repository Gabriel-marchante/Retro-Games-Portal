const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "frontend");
const assetsDir = path.join(frontendDir, "assets");

// Crear carpetas
[frontendDir, assetsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// index.html
fs.writeFileSync(path.join(frontendDir, "index.html"), `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Retro Games Portal</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1>Bienvenido a Retro Games</h1>
<button id="logoutBtn">Cerrar sesión</button>

<h2>Juegos disponibles</h2>
<div id="gamesList"></div>

<h2>Ranking global (selecciona un juego)</h2>
<select id="gameSelect"></select>
<div id="ranking"></div>

<script src="main.js"></script>
</body>
</html>
`);

// login.html
fs.writeFileSync(path.join(frontendDir, "login.html"), `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Login Retro Games</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1>Retro Games Portal</h1>

<form id="loginForm">
  <input type="text" id="name" placeholder="Nombre" required>
  <input type="email" id="email" placeholder="Email" required>
  <input type="text" id="nickname" placeholder="Nickname" required>
  <input type="number" id="age" placeholder="Edad" required>
  <input type="text" id="nationality" placeholder="Nacionalidad" required>
  <input type="text" id="photoUrl" placeholder="URL de tu foto" required>
  <button type="submit">Iniciar sesión</button>
</form>

<script src="main.js"></script>
</body>
</html>
`);

// styles.css
fs.writeFileSync(path.join(frontendDir, "styles.css"), `body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
h1, h2 { color: #333; }
form { display: flex; flex-direction: column; max-width: 300px; margin-bottom: 20px; }
input { margin: 5px 0; padding: 8px; }
button { padding: 10px; margin-top: 10px; cursor: pointer; }
#gamesList, #ranking { margin-top: 15px; }
.gameCard { background: white; padding: 10px; margin-bottom: 10px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.2);}
`);

// main.js
fs.writeFileSync(path.join(frontendDir, "main.js"), `// ===== Helper =====
const token = localStorage.getItem("token");

// ===== LOGIN =====
if (document.getElementById("loginForm")) {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      nickname: document.getElementById("nickname").value,
      age: parseInt(document.getElementById("age").value),
      nationality: document.getElementById("nationality").value,
      photoUrl: document.getElementById("photoUrl").value
    };

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    localStorage.setItem("token", json.token);
    alert("¡Login exitoso!");
    window.location.href = "index.html";
  });
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

// ===== LISTAR JUEGOS =====
const gamesList = document.getElementById("gamesList");
const gameSelect = document.getElementById("gameSelect");
if (gamesList && token) {
  fetch("http://localhost:3000/games", {
    headers: { Authorization: \`Bearer \${token}\` }
  })
    .then(res => res.json())
    .then(games => {
      games.forEach(game => {
        const div = document.createElement("div");
        div.className = "gameCard";
        div.innerHTML = \`<h3>\${game.name}</h3><p>\${game.description}</p><img src="\${game.coverImage}" width="150">\`;
        gamesList.appendChild(div);

        const option = document.createElement("option");
        option.value = game.id;
        option.textContent = game.name;
        gameSelect.appendChild(option);
      });
    });
}

// ===== RANKING GLOBAL =====
const rankingDiv = document.getElementById("ranking");
if (gameSelect && rankingDiv && token) {
  gameSelect.addEventListener("change", async () => {
    const gameId = gameSelect.value;
    const res = await fetch(\`http://localhost:3000/rankings/global/\${gameId}\`, {
      headers: { Authorization: \`Bearer \${token}\` }
    });
    const scores = await res.json();
    rankingDiv.innerHTML = scores
      .map(s => \`<div>\${s.nickname}: \${s.points} puntos</div>\`)
      .join("");
  });
}
`);

console.log("✅ Frontend generado en la carpeta 'frontend'. Abre login.html para empezar.");
