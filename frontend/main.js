// ===== Helper =====
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
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(games => {
      games.forEach(game => {
        const div = document.createElement("div");
        div.className = "gameCard";
        div.innerHTML = `<h3>${game.name}</h3><p>${game.description}</p><img src="${game.coverImage}" width="150">`;
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
    const res = await fetch(`http://localhost:3000/rankings/global/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const scores = await res.json();
    rankingDiv.innerHTML = scores
      .map(s => `<div>${s.nickname}: ${s.points} puntos</div>`)
      .join("");
  });
}
