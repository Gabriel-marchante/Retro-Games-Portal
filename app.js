// Variables globales
let selectedGame = null;
let emulatorInstance = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeGames();
    setupEventListeners();
    createStarfield();
});

// Crear campo de estrellas dinámico
function createStarfield() {
    const starsContainer = document.querySelector('.stars');
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            animation: star-pulse ${2 + Math.random() * 3}s infinite ease-in-out;
        `;
        starsContainer.appendChild(star);
    }
}

// Inicializar grid de juegos
function initializeGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    const emptyState = document.getElementById('emptyState');
    
    gamesGrid.innerHTML = '';
    
    if (gamesDatabase.length === 0) {
        // Mostrar estado vacío si no hay juegos
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        // Ocultar estado vacío y mostrar juegos
        if (emptyState) emptyState.style.display = 'none';
        
        gamesDatabase.forEach(game => {
            const gameCard = createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });
    }
}

// Crear tarjeta de juego
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.gameId = game.id;
    
    const systemColor = systemColors[game.system] || '#00f0ff';
    
    card.innerHTML = `
        <div class="game-icon" style="background: linear-gradient(135deg, ${systemColor}, #0a0a0f);">
            ${game.icon}
        </div>
        <h3 class="game-title">${game.title}</h3>
        <p class="game-system">[${game.system}]</p>
        <p class="game-year">© ${game.year}</p>
    `;
    
    // Evento hover
    card.addEventListener('mouseenter', () => {
        showGameInfo(game);
        playHoverSound();
    });
    
    // Evento click
    card.addEventListener('click', () => {
        selectGame(game);
        playSelectSound();
    });
    
    return card;
}

// Mostrar información del juego en el panel lateral
function showGameInfo(game) {
    const gameDetails = document.getElementById('gameDetails');
    const systemColor = systemColors[game.system] || '#00f0ff';
    
    gameDetails.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">▶ TÍTULO:</span>
            <span class="detail-value">${game.title}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">▶ SISTEMA:</span>
            <span class="detail-value">${game.system}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">▶ AÑO:</span>
            <span class="detail-value">${game.year}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">▶ GÉNERO:</span>
            <span class="detail-value">${game.genre}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">▶ JUGADORES:</span>
            <span class="detail-value">${game.players}</span>
        </div>
        <div class="detail-item" style="border-left-color: ${systemColor};">
            <span class="detail-label">▶ DESCRIPCIÓN:</span>
            <span class="detail-value" style="line-height: 1.6; margin-top: 10px; display: block;">
                ${game.description}
            </span>
        </div>
        <button class="play-button" onclick="launchGame(${game.id})">
            ▶ PRESS START ◀
        </button>
    `;
}

// Seleccionar juego
function selectGame(game) {
    selectedGame = game;
    
    // Resaltar tarjeta seleccionada
    document.querySelectorAll('.game-card').forEach(card => {
        card.style.borderColor = systemColors[gamesDatabase.find(g => g.id == card.dataset.gameId).system];
        card.style.transform = '';
    });
    
    const selectedCard = document.querySelector(`[data-game-id="${game.id}"]`);
    selectedCard.style.borderColor = '#ffff00';
    selectedCard.style.transform = 'scale(1.05)';
}

// Lanzar juego en el emulador
function launchGame(gameId) {
    const game = gamesDatabase.find(g => g.id === gameId);
    if (!game) return;
    
    // Verificar si hay ROM disponible
    if (!game.romUrl || game.romUrl === '' || game.romUrl.includes('placeholder')) {
        showRomInstructions(game);
        return;
    }
    
    openModal(game);
    initializeEmulator(game);
}

// Mostrar instrucciones para añadir ROMs
function showRomInstructions(game) {
    const instructionModal = document.createElement('div');
    instructionModal.className = 'instruction-modal';
    instructionModal.innerHTML = `
        <div class="instruction-content">
            <div class="instruction-header">
                <h2>🎮 CÓMO JUGAR A ${game.title}</h2>
                <button class="instruction-close" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
            </div>
            <div class="instruction-body">
                <div class="step">
                    <span class="step-number">1</span>
                    <div class="step-content">
                        <h3>Consigue la ROM</h3>
                        <p>Descarga juegos LEGALES desde:</p>
                        <ul>
                            <li><a href="https://pdroms.de/" target="_blank">PDRoms.de</a> - Homebrew gratuito</li>
                            <li><a href="https://hbhub.io/" target="_blank">Homebrew Hub</a> - Juegos caseros</li>
                        </ul>
                    </div>
                </div>
                <div class="step">
                    <span class="step-number">2</span>
                    <div class="step-content">
                        <h3>Coloca la ROM</h3>
                        <p>Guarda el archivo en: <code>games/${game.core}/</code></p>
                    </div>
                </div>
                <div class="step">
                    <span class="step-number">3</span>
                    <div class="step-content">
                        <h3>Actualiza la configuración</h3>
                        <p>En <code>js/games-data.js</code>, busca el juego ID ${game.id} y cambia:</p>
                        <code>romUrl: "games/${game.core}/nombre-de-tu-rom.${game.core}"</code>
                    </div>
                </div>
                <div class="step">
                    <span class="step-number">4</span>
                    <div class="step-content">
                        <h3>Instala EmulatorJS</h3>
                        <p>Sigue las instrucciones en <code>emulators/README.md</code></p>
                    </div>
                </div>
            </div>
            <div class="instruction-footer">
                <p class="warning-text">⚠️ Solo usa ROMs legales - Respeta los derechos de autor</p>
                <button class="instruction-button" onclick="this.parentElement.parentElement.parentElement.remove()">ENTENDIDO</button>
            </div>
        </div>
    `;
    document.body.appendChild(instructionModal);
    playSelectSound();
}

// Abrir modal del emulador
function openModal(game) {
    const modal = document.getElementById('gameModal');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = `PLAYING: ${game.title}`;
    modal.classList.add('active');
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('gameModal');
    modal.classList.remove('active');
    
    // Restaurar scroll
    document.body.style.overflow = 'auto';
    
    // Detener emulador si está corriendo
    if (emulatorInstance) {
        // Aquí iría la lógica para detener EmulatorJS
        // emulatorInstance.stop();
        emulatorInstance = null;
    }
    
    // Limpiar container
    document.getElementById('emulatorContainer').innerHTML = '<div id="game" style="width: 100%; height: 100%;"></div>';
}

// Inicializar EmulatorJS
function initializeEmulator(game) {
    const container = document.getElementById('game');
    
    // Mostrar mensaje de cómo integrar EmulatorJS
    container.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #39ff14;
            text-align: center;
            padding: 40px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            line-height: 2;
        ">
            <div style="font-size: 3rem; margin-bottom: 30px;">🎮</div>
            <p style="margin-bottom: 20px;">PARA ACTIVAR EL EMULADOR:</p>
            <ol style="text-align: left; font-size: 0.6rem; line-height: 2.5; color: #00f0ff;">
                <li>Descarga EmulatorJS de:<br>github.com/EmulatorJS/EmulatorJS</li>
                <li>Coloca los archivos en /emulators/</li>
                <li>Añade tus ROMs legales en /games/</li>
                <li>Descomentar código de inicialización</li>
            </ol>
            <p style="margin-top: 30px; color: #ff006e;">Sistema: ${game.system} | Core: ${game.core}</p>
        </div>
    `;
    
    /* CÓDIGO PARA CUANDO INSTALES EMULATORJS:
    
    emulatorInstance = new EJS_player('#game', {
        gameUrl: game.romUrl,
        core: game.core,
        gameName: game.title,
        color: '#00f0ff',
        volume: 0.5,
        loadingLogo: 'path/to/logo.png',
        loadingBackground: '#0a0a0f'
    });
    
    */
}

// Configurar event listeners
function setupEventListeners() {
    // Cerrar modal
    const closeBtn = document.getElementById('closeModal');
    closeBtn.addEventListener('click', closeModal);
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('gameModal').classList.contains('active')) {
            closeModal();
        }
    });
    
    // Cerrar al hacer click fuera del modal
    const modal = document.getElementById('gameModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Animación de créditos
    animateCredits();
    
    // Interactividad de botones arcade
    setupArcadeButtons();
}

// Configurar botones de la máquina arcade
function setupArcadeButtons() {
    const buttons = document.querySelectorAll('.button');
    const joystickBall = document.querySelector('.joystick-ball');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            playButtonSound();
            this.style.transform = 'translateY(4px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    if (joystickBall) {
        joystickBall.addEventListener('mousedown', () => {
            playSelectSound();
        });
    }
}

// Sonido de botón arcade
function playButtonSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

// Animación del contador de créditos
function animateCredits() {
    const creditsElement = document.getElementById('credits');
    let credits = 99;
    
    setInterval(() => {
        credits = credits > 0 ? credits - 1 : 99;
        creditsElement.textContent = credits.toString().padStart(2, '0');
    }, 5000);
}

// Efectos de sonido (Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playHoverSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playSelectSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1200;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Función para agregar más juegos dinámicamente
function addGame(gameData) {
    gamesDatabase.push(gameData);
    initializeGames();
}

// Función para filtrar juegos por sistema
function filterBySystem(system) {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';
    
    const filteredGames = system === 'ALL' 
        ? gamesDatabase 
        : gamesDatabase.filter(game => game.system === system);
    
    filteredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Exportar funciones para uso global
window.launchGame = launchGame;
window.filterBySystem = filterBySystem;
window.addGame = addGame;
