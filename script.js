/* ========================================================
   NOVADECK — JAVASCRIPT CORE ENGINE
   TechNova Hackathon 2026 Web Development Challenge
   3-Stage Journey: 1. Learn Mode -> 2. Micro Quiz -> 3. Results Analysis
   Pure Vanilla JavaScript • Zero Dependencies
   ======================================================== */

"use strict";

/* ========================================================
   1. DATA: TOPICS (Single Source of Truth)
   8 Comprehensive Topics across HTML, CSS, JavaScript, DOM.
   What is taught is EXACTLY what is tested!
   ======================================================== */
const TOPICS = [
  // --- 1. HTML: Semantic HTML ---
  {
    id: 1,
    title: "Semantic HTML",
    icon: "🌐",
    category: "HTML",
    front: "Why shouldn't you just build an entire web page using only <div> tags?",
    explanation: "Semantic HTML uses meaningful tags like <header>, <nav>, <main>, and <article> instead of generic <div> containers. This clearly defines document structure to browsers, search engines, and screen readers.",
    example: "<nav>\n  <ul>\n    <li><a href=\"#home\">Home</a></li>\n    <li><a href=\"#about\">About</a></li>\n  </ul>\n</nav>",
    tip: "Semantic tags provide native keyboard accessibility and dramatically boost SEO rankings without extra CSS.",
    quiz: {
      question: "Which of the following HTML elements conveys semantic meaning for self-contained, syndicateable content?",
      options: ["<section>", "<div>", "<article>", "<span>"],
      correctIndex: 2,
      whyCorrect: "<article> represents an independent, self-contained piece of content (like a blog post, news story, or widget)."
    }
  },

  // --- 2. HTML: Script Loading (defer vs async) ---
  {
    id: 2,
    title: "Script Loading: defer vs async",
    icon: "⚡",
    category: "HTML",
    front: "Why do external scripts sometimes freeze page rendering before the page even loads?",
    explanation: "Standard <script> tags block HTML parsing while downloading and executing. The 'async' attribute downloads asynchronously and executes immediately when ready, whereas 'defer' downloads asynchronously but waits to execute in document order after the HTML is completely parsed.",
    example: "<!-- Executes safely in order after DOM is parsed -->\n<script src=\"app.js\" defer></script>",
    tip: "Use 'defer' for scripts that interact with the DOM or depend on other scripts; use 'async' for independent scripts like analytics.",
    quiz: {
      question: "What is the key advantage of using the 'defer' attribute on an external <script> tag?",
      options: [
        "It executes immediately and halts HTML parsing",
        "It downloads in the background and executes in order only after HTML parsing completes",
        "It converts synchronous JavaScript into web workers",
        "It forces scripts to run over a WebSocket connection"
      ],
      correctIndex: 1,
      whyCorrect: "'defer' prevents parser blocking and guarantees that scripts run in document order right before DOMContentLoaded."
    }
  },

  // --- 3. CSS: The Box Model ---
  {
    id: 3,
    title: "The CSS Box Model",
    icon: "📦",
    category: "CSS",
    front: "Why does adding padding or borders to an element sometimes break your grid layout?",
    explanation: "Every rendered HTML element is a box composed of four concentric layers: Content (inner text/media), Padding (clear space inside the border), Border (line around the padding), and Margin (clear space outside the border separating elements). By default, box-sizing: content-box adds padding and borders on top of defined width.",
    example: "* {\n  box-sizing: border-box;\n}\n/* Keeps width inclusive of padding & borders! */",
    tip: "Setting 'box-sizing: border-box' universally ensures padding and borders never expand an element beyond its defined width.",
    quiz: {
      question: "In the CSS Box Model, which layer is positioned immediately between padding and margin?",
      options: ["Content", "Outline", "Border", "Viewport"],
      correctIndex: 2,
      whyCorrect: "The Border wraps around the Padding and Content, separating them from the exterior Margin."
    }
  },

  // --- 4. CSS: Flexbox vs Grid ---
  {
    id: 4,
    title: "CSS Flexbox vs Grid",
    icon: "🎨",
    category: "CSS",
    front: "How do you know when to reach for Flexbox vs. when to use CSS Grid?",
    explanation: "Flexbox is designed for one-dimensional layouts—arranging items along either a single row OR a single column (perfect for navbars, toolbars, and vertical centering). CSS Grid is built for two-dimensional layouts—aligning elements simultaneously across both rows AND columns.",
    example: ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}",
    tip: "Rule of thumb: Flexbox is content-out (flows by item size); CSS Grid is layout-in (items snap into defined tracks).",
    quiz: {
      question: "What is the primary architectural difference between CSS Flexbox and CSS Grid?",
      options: [
        "Flexbox handles 1D layout (rows or columns), while Grid handles 2D layout (rows and columns simultaneously)",
        "Flexbox only styles text, while CSS Grid only styles images",
        "CSS Grid requires JavaScript to calculate column tracks",
        "Flexbox cannot align items vertically"
      ],
      correctIndex: 0,
      whyCorrect: "Flexbox is designed for one-dimensional linear flows, whereas CSS Grid manages two-dimensional track layouts."
    }
  },

  // --- 5. JavaScript: Closures ---
  {
    id: 5,
    title: "JavaScript Closures",
    icon: "🔒",
    category: "JavaScript",
    front: "How can an inner function remember variables from an outer function that has already finished running?",
    explanation: "A closure is the combination of a function bundled together with references to its surrounding lexical environment. It allows an inner function to retain access to variables from an outer function's scope, even after that outer function has returned and exited the call stack.",
    example: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();\ncounter(); // 1\ncounter(); // 2",
    tip: "Closures are the cornerstone of data privacy, factory functions, event callbacks, and memoization in modern JavaScript.",
    quiz: {
      question: "What does a JavaScript closure preserve for an inner function?",
      options: [
        "Access to its outer function's lexical scope even after the outer function has returned",
        "Direct hardware memory pointers to CPU registers",
        "A duplicate copy of the global window object",
        "Automatic conversion of synchronous code to Promises"
      ],
      correctIndex: 0,
      whyCorrect: "A closure retains access to variables in its enclosing lexical environment across different execution contexts."
    }
  },

  // --- 6. JavaScript: The Event Loop ---
  {
    id: 6,
    title: "The Event Loop & Concurrency",
    icon: "🔄",
    category: "JavaScript",
    front: "How does JavaScript handle asynchronous tasks without freezing if it's strictly single-threaded?",
    explanation: "JavaScript has a single Call Stack. Asynchronous tasks (like fetch or timers) are delegated to browser Web APIs. When completed, their callbacks join queues. The Event Loop continuously checks if the Call Stack is empty. Once clear, it drains all Microtasks (Promises) first, followed by Macrotasks (setTimeout).",
    example: "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\n// Logs: A -> C -> B",
    tip: "Microtasks (Promises) always run before Macrotasks (setTimeout), even when setTimeout has a 0ms delay!",
    quiz: {
      question: "In the JavaScript Event Loop, which queue is prioritized once the Call Stack becomes empty?",
      options: [
        "Macrotask Queue (setTimeout, setInterval)",
        "Microtask Queue (Promises, queueMicrotask)",
        "Browser Rendering Queue",
        "Garbage Collection Queue"
      ],
      correctIndex: 1,
      whyCorrect: "The Event Loop always drains the entire Microtask Queue (like Promise resolutions) before picking the next macrotask."
    }
  },

  // --- 7. DOM: Event Delegation ---
  {
    id: 7,
    title: "DOM Event Delegation",
    icon: "🌲",
    category: "DOM",
    front: "Why attach 100 individual event listeners when a single listener can do the job better?",
    explanation: "Due to event bubbling, events triggered on child elements propagate upward through parent ancestors. Event delegation attaches a single listener to a common parent element, using 'event.target' to identify which child triggered the event. This conserves memory and automatically handles dynamically created items.",
    example: "document.querySelector('#todo-list').addEventListener('click', (e) => {\n  if (e.target.matches('button.delete')) {\n    e.target.closest('li').remove();\n  }\n});",
    tip: "Always use 'event.target.closest(selector)' in delegation to reliably handle clicks on nested icons or spans inside buttons.",
    quiz: {
      question: "Why is DOM Event Delegation more memory-efficient when handling large dynamic lists?",
      options: [
        "It turns off event bubbling in the browser",
        "It attaches a single listener to a parent rather than one per child",
        "It compiles JavaScript into WebAssembly",
        "It forces the browser to run on multiple CPU threads"
      ],
      correctIndex: 1,
      whyCorrect: "Attaching one parent listener handles clicks on all current and future children via event bubbling, saving memory."
    }
  },

  // --- 8. DOM: Web Storage ---
  {
    id: 8,
    title: "localStorage vs sessionStorage",
    icon: "💾",
    category: "DOM",
    front: "Where should you store user preferences so they don't vanish when the browser tab closes?",
    explanation: "Both localStorage and sessionStorage store string key-value pairs (~5MB). The vital difference is persistence: localStorage data persists permanently until explicitly cleared, whereas sessionStorage data is strictly isolated to the browser tab and is wiped out the moment the tab closes.",
    example: "localStorage.setItem('theme', 'dark'); // Persists forever!\nsessionStorage.setItem('tempToken', 'xyz'); // Cleared on tab close",
    tip: "Web Storage APIs are synchronous and block the main thread; never store sensitive authentication passwords or tokens in them.",
    quiz: {
      question: "What happens to data stored in 'sessionStorage' when the browser tab is closed?",
      options: [
        "It is permanently deleted for that session",
        "It is migrated automatically into localStorage",
        "It is encrypted and retained for 30 days",
        "It is sent to the server via an automated background beacon"
      ],
      correctIndex: 0,
      whyCorrect: "sessionStorage is strictly scoped to the page session and is permanently discarded as soon as the tab is closed."
    }
  }
];


/* ========================================================
   2. STATE: CORE APPLICATION STATE VARIABLES
   ======================================================== */
// Active topic list (Can be filtered to weak topics on retry!)
let activeTopics = [...TOPICS];

// STAGE 1: Learn Mode State
let currentLearnIndex = 0;
let isLearnFlipped = false;
let readCardIds = new Set(); // Card counts as read ONLY after being flipped!

// STAGE 2: Quiz Mode State
let quizQuestions = [];
let quizIndex = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let quizHistory = [];        // Stores per-question review details
let timerSeconds = 15;
let timerInterval = null;
let questionStartTime = 0;
let isQuestionAnswered = false;

// STAGE 3 & GLOBAL State
let currentStage = 1;        // 1 = Learn, 2 = Quiz, 3 = Results
let isMuted = false;
let isTransitioning = false;


/* ========================================================
   3. AUDIO SYNTHESIS: WEB AUDIO API
   100% synthesized sound effects — No external audio files!
   ======================================================== */
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Card flip whoosh: subtle frequency ramp
  playFlip() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }

  // Correct answer: bright cheerful major chord arpeggio
  playCorrect() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + (i * 0.065);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.23);
      });
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }

  // Wrong answer / timeout: gentle low descending thud
  playWrong() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.2);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }

  // Streak milestone fanfare: triumphant chime
  playMilestone() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [392.00, 523.25, 659.25, 1046.50]; // G4, C5, E5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + (i * 0.08);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
      });
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }

  // Quiz unlocked chime
  playUnlock() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + (i * 0.07);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      });
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }

  // Timer warning tick (in critical 3 seconds)
  playTick() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }

  // Victory fanfare
  playVictory() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const chords = [523.25, 659.25, 783.99, 1046.50];
      chords.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
      });
    } catch (e) {
      console.warn("Audio playback notice:", e);
    }
  }
}

const sfx = new SoundEffects();


/* ========================================================
   4. STAGE NAVIGATION (1. Learn -> 2. Quiz -> 3. Results)
   ======================================================== */

/**
 * Transitions smoothly between the 3 main stages with animated wipe.
 */
function goToStage(stageNum) {
  if (isTransitioning) return;
  isTransitioning = true;

  const overlay = document.getElementById("stage-transition-overlay");
  const auroraBg = document.getElementById("aurora-bg");

  // Trigger circle wipe transition overlay
  overlay.classList.add("active");

  setTimeout(() => {
    currentStage = stageNum;

    // 1. Hide all panels, show target panel
    document.querySelectorAll(".stage-panel").forEach(p => p.classList.remove("active"));
    const stageIds = ["stage-learn", "stage-quiz", "stage-results"];
    const targetEl = document.getElementById(stageIds[stageNum - 1]);
    if (targetEl) targetEl.classList.add("active");

    // 2. Update persistent stepper
    for (let i = 1; i <= 3; i++) {
      const pill = document.getElementById(`step-pill-${i}`);
      pill.classList.remove("active", "completed");
      if (i < stageNum) {
        pill.classList.add("completed");
      } else if (i === stageNum) {
        pill.classList.add("active");
      }
    }

    // 3. Shift Aurora Background Mood
    auroraBg.className = "aurora-bg";
    if (stageNum === 1) auroraBg.classList.add("mood-learn");
    else if (stageNum === 2) auroraBg.classList.add("mood-quiz");
    else if (stageNum === 3) auroraBg.classList.add("mood-results");

    // 4. Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 5. Fade out wipe overlay
    setTimeout(() => {
      overlay.classList.remove("active");
      isTransitioning = false;
    }, 280);

  }, 320);
}


/* ========================================================
   5. LEARN LOGIC (STAGE 1: Explanatory Flashcards)
   ======================================================== */

/**
 * Initializes or resets Stage 1: Learn Mode.
 */
function initLearnStage(topicsToStudy = null) {
  activeTopics = (topicsToStudy && topicsToStudy.length > 0) ? topicsToStudy : [...TOPICS];
  currentLearnIndex = 0;
  isLearnFlipped = false;
  readCardIds.clear();

  // Update badge for filter mode
  const filterBadge = document.getElementById("deck-filter-mode-badge");
  if (activeTopics.length < TOPICS.length) {
    filterBadge.textContent = `Weak Topics Only (${activeTopics.length})`;
  } else {
    filterBadge.textContent = "Full Deck";
  }

  renderTopicDots();
  renderCurrentLearnCard();
  updateLearnProgress();
}

/**
 * Render topic dots bar below the deck.
 */
function renderTopicDots() {
  const container = document.getElementById("topic-dots-container");
  container.innerHTML = "";

  activeTopics.forEach((topic, idx) => {
    const dot = document.createElement("button");
    dot.className = "topic-dot-btn";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Jump to Card ${idx + 1}: ${topic.title}`);
    dot.title = `Card ${idx + 1}: ${topic.title}`;

    if (idx === currentLearnIndex) dot.classList.add("active");
    if (readCardIds.has(topic.id)) dot.classList.add("read");

    dot.addEventListener("click", () => {
      if (idx !== currentLearnIndex) {
        currentLearnIndex = idx;
        isLearnFlipped = false;
        renderCurrentLearnCard("next");
        updateLearnProgress();
      }
    });

    container.appendChild(dot);
  });
}

/**
 * Render the active flashcard content for currentLearnIndex.
 */
function renderCurrentLearnCard(direction = null) {
  const topic = activeTopics[currentLearnIndex];
  if (!topic) return;

  const cardEl = document.getElementById("learn-card");
  
  // Reset flipped state
  cardEl.classList.remove("flipped", "card-slide-next", "card-slide-prev");
  isLearnFlipped = false;
  cardEl.setAttribute("aria-expanded", "false");
  document.getElementById("learn-flip-btn-text").textContent = "Flip Card";

  // Apply direction slide animation cleanly
  if (direction === "next" || direction === "prev") {
    void cardEl.offsetWidth; // Force reflow so animation restarts reliably
    const animClass = (direction === "next") ? "card-slide-next" : "card-slide-prev";
    cardEl.classList.add(animClass);
    cardEl.addEventListener("animationend", () => {
      cardEl.classList.remove(animClass);
    }, { once: true });
  }

  // FRONT face
  document.getElementById("front-cat-badge").textContent = topic.category;
  document.getElementById("front-emoji").textContent = topic.icon;
  document.getElementById("front-title").textContent = topic.title;
  document.getElementById("front-hook").textContent = topic.front;

  const isRead = readCardIds.has(topic.id);
  const frontReadStatus = document.getElementById("front-read-status");
  if (isRead) {
    frontReadStatus.className = "card-read-indicator read-done";
    frontReadStatus.innerHTML = `<span class="read-icon">✓</span><span class="read-label">Explored</span>`;
  } else {
    frontReadStatus.className = "card-read-indicator";
    frontReadStatus.innerHTML = `<span class="read-icon">○</span><span class="read-label">Unread</span>`;
  }

  // BACK face
  document.getElementById("back-cat-badge").textContent = topic.category;
  document.getElementById("back-title").textContent = topic.title;
  document.getElementById("back-explanation").textContent = topic.explanation;
  document.getElementById("back-code").textContent = topic.example;
  document.getElementById("back-tip").textContent = topic.tip;

  // Deck HUD counter
  document.getElementById("learn-card-counter").textContent = `${currentLearnIndex + 1} of ${activeTopics.length}`;

  // Next / Prev button disabled states
  document.getElementById("btn-prev-card").disabled = (currentLearnIndex === 0);
  document.getElementById("btn-next-card").disabled = (currentLearnIndex === activeTopics.length - 1);
}

/**
 * Flips the learn card to reveal explanation, code, and tip.
 */
function toggleLearnCardFlip() {
  const cardEl = document.getElementById("learn-card");
  cardEl.classList.remove("card-slide-next", "card-slide-prev");

  isLearnFlipped = !isLearnFlipped;
  sfx.playFlip();

  if (isLearnFlipped) {
    cardEl.classList.add("flipped");
    cardEl.setAttribute("aria-expanded", "true");
    document.getElementById("learn-flip-btn-text").textContent = "Show Front";

    // Mark current card as read!
    const topic = activeTopics[currentLearnIndex];
    if (topic) {
      readCardIds.add(topic.id);
      updateLearnProgress();

      // Immediately mark front indicator as explored
      const frontReadStatus = document.getElementById("front-read-status");
      if (frontReadStatus) {
        frontReadStatus.className = "card-read-indicator read-done";
        frontReadStatus.innerHTML = `<span class="read-icon">✓</span><span class="read-label">Explored</span>`;
      }
    }
  } else {
    cardEl.classList.remove("flipped");
    cardEl.setAttribute("aria-expanded", "false");
    document.getElementById("learn-flip-btn-text").textContent = "Flip Card";
  }

  resetCardTilt();
}

/**
 * Updates dots, explored counts, and unlocked status of "Take the Quiz" button.
 */
function updateLearnProgress() {
  const total = activeTopics.length;
  const count = readCardIds.size;

  document.getElementById("read-cards-count").textContent = count;
  document.getElementById("total-cards-count").textContent = total;

  // Update dots
  const dots = document.querySelectorAll(".topic-dot-btn");
  dots.forEach((dot, idx) => {
    dot.classList.remove("active");
    if (idx === currentLearnIndex) dot.classList.add("active");
    if (activeTopics[idx] && readCardIds.has(activeTopics[idx].id)) {
      dot.classList.add("read");
    }
  });

  // QUIZ BUTTON LOCK/UNLOCK STATE
  const launchBtn = document.getElementById("btn-launch-quiz");
  const launchLabel = document.getElementById("launch-quiz-label");
  const remaining = total - count;

  if (count >= total) {
    // UNLOCKED!
    if (launchBtn.classList.contains("locked")) {
      sfx.playUnlock();
      particles.burst(window.innerWidth / 2, window.innerHeight - 100, 35);
      showToast("Quiz Unlocked! All cards explored! ⚡");
    }
    launchBtn.classList.remove("locked");
    launchBtn.classList.add("unlocked");
    launchLabel.textContent = "Take the Micro-Quiz";
    document.getElementById("locked-tooltip").style.display = "none";
  } else {
    // LOCKED
    launchBtn.classList.add("locked");
    launchBtn.classList.remove("unlocked");
    launchLabel.textContent = `Take the Micro-Quiz (Flip all ${total} cards to unlock)`;
    document.getElementById("locked-cards-remaining").textContent = remaining;
  }
}

/**
 * Handles early click on locked Take Quiz button: shakes and shows tooltip.
 */
function handleLockedQuizClick() {
  const launchBtn = document.getElementById("btn-launch-quiz");
  const tooltip = document.getElementById("locked-tooltip");

  sfx.playWrong();
  launchBtn.classList.add("shake-locked");
  tooltip.style.display = "block";

  setTimeout(() => {
    launchBtn.classList.remove("shake-locked");
  }, 450);

  setTimeout(() => {
    tooltip.style.display = "none";
  }, 3200);
}

/**
 * Advance to next card in deck (index++).
 */
function nextLearnCard() {
  if (currentLearnIndex < activeTopics.length - 1) {
    currentLearnIndex++;
    renderCurrentLearnCard("next");
    updateLearnProgress();
  }
}

/**
 * Return to previous card in deck (index--).
 */
function prevLearnCard() {
  if (currentLearnIndex > 0) {
    currentLearnIndex--;
    renderCurrentLearnCard("prev");
    updateLearnProgress();
  }
}


/* ========================================================
   6. QUIZ LOGIC (STAGE 2: Micro-Quiz Built from Studied Topics)
   ======================================================== */

/**
 * Prepares and launches the micro-quiz built from studied topics.
 */
function launchMicroQuiz() {
  // Fisher-Yates array shuffle
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Build question set from the active topics
  quizQuestions = activeTopics.map(topic => {
    const qObj = topic.quiz;
    const originalCorrectText = qObj.options[qObj.correctIndex];
    // Shuffle the 4 options
    const shuffledOptions = shuffle(qObj.options);
    const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      category: topic.category,
      question: qObj.question,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
      whyCorrect: qObj.whyCorrect
    };
  });

  // Shuffle the questions order
  quizQuestions = shuffle(quizQuestions);

  // Reset quiz state
  quizIndex = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  quizHistory = [];
  isQuestionAnswered = false;

  goToStage(2);
  renderQuizQuestion();
}

/**
 * Render current quiz question at quizIndex.
 */
function renderQuizQuestion() {
  if (quizIndex >= quizQuestions.length) {
    finishQuizAndShowResults();
    return;
  }

  const q = quizQuestions[quizIndex];
  isQuestionAnswered = false;

  // Update HUD
  document.getElementById("quiz-cat-badge").textContent = q.category;
  document.getElementById("quiz-question-counter").textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
  document.getElementById("quiz-topic-title").textContent = `Topic: ${q.topicTitle}`;
  document.getElementById("quiz-question-text").textContent = q.question;
  
  // Linear Progress Bar
  const progressPct = ((quizIndex) / quizQuestions.length) * 100;
  document.getElementById("quiz-progress-bar").style.width = `${progressPct}%`;

  // Live Score count-up
  document.getElementById("quiz-score-val").textContent = score;

  // Streak flame
  updateStreakFlame();

  // Render 4 option buttons with staggered entrance animation
  const container = document.getElementById("quiz-options-container");
  container.innerHTML = "";

  const letters = ["A", "B", "C", "D"];
  q.options.forEach((optText, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt-btn stagger-in ripple-btn";
    btn.style.animationDelay = `${i * 0.06}s`;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");

    btn.innerHTML = `
      <span class="opt-badge">${letters[i]}</span>
      <span class="opt-label-text">${formatCode(optText)}</span>
    `;

    btn.addEventListener("click", () => {
      if (!isQuestionAnswered) {
        handleQuizAnswer(i);
      }
    });

    container.appendChild(btn);
  });

  // Hide explanation and next button
  document.getElementById("quiz-explanation-box").style.display = "none";
  document.getElementById("btn-next-question").style.display = "none";

  // Start 15-second countdown timer
  startQuestionTimer();
}

/**
 * 15-second SVG countdown timer per question.
 */
function startQuestionTimer() {
  clearInterval(timerInterval);
  timerSeconds = 15;
  questionStartTime = performance.now();

  const timerBar = document.getElementById("timer-bar");
  const secondsText = document.getElementById("timer-seconds-text");
  
  // Circumference = 2 * PI * 23 = 144.51
  const circumference = 2 * Math.PI * 23;
  timerBar.style.strokeDashoffset = 0;
  timerBar.className = "timer-fill";
  secondsText.textContent = timerSeconds;

  timerInterval = setInterval(() => {
    timerSeconds--;
    secondsText.textContent = Math.max(0, timerSeconds);

    const offset = circumference * (1 - (timerSeconds / 15));
    timerBar.style.strokeDashoffset = offset;

    // Color shifting
    if (timerSeconds <= 4 && timerSeconds > 0) {
      timerBar.className = "timer-fill critical";
      sfx.playTick();
    } else if (timerSeconds <= 8) {
      timerBar.className = "timer-fill warning";
    }

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      handleQuestionTimeout();
    }
  }, 1000);
}

/**
 * Handles answer selection.
 */
function handleQuizAnswer(selectedIndex) {
  if (isQuestionAnswered) return;
  isQuestionAnswered = true;
  clearInterval(timerInterval);

  const q = quizQuestions[quizIndex];
  const timeTaken = Math.min(15, Math.round((performance.now() - questionStartTime) / 100) / 10);
  const isCorrect = (selectedIndex === q.correctIndex);

  const optionButtons = document.querySelectorAll(".quiz-opt-btn");
  optionButtons.forEach(btn => btn.disabled = true);

  // Time bonus calculation: Base 10 pts + up to 5 speed bonus points
  const speedBonus = isCorrect ? Math.floor(timerSeconds / 3) : 0;
  const pointsAwarded = isCorrect ? (10 + speedBonus) : 0;

  if (isCorrect) {
    score += pointsAwarded;
    streak++;
    if (streak > bestStreak) bestStreak = streak;

    // Audio & visuals
    sfx.playCorrect();
    optionButtons[selectedIndex].classList.add("correct-choice");

    // Floating "+10" score bubble
    spawnScoreBubble(`+${pointsAwarded}`);

    // Mini confetti burst from button
    const rect = optionButtons[selectedIndex].getBoundingClientRect();
    particles.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24, ["#10b981", "#34d399", "#06b6d4"]);

    // Check streak milestones (3, 5)
    checkStreakMilestones(streak);
  } else {
    streak = 0;
    sfx.playWrong();
    if (selectedIndex !== null && optionButtons[selectedIndex]) {
      optionButtons[selectedIndex].classList.add("wrong-choice");
    }
    // Highlight correct answer
    optionButtons[q.correctIndex].classList.add("correct-choice");
  }

  // Update streak flame
  updateStreakFlame();

  // Slide in explanation
  showQuizExplanation(q.whyCorrect);

  // Record into history
  quizHistory.push({
    topicId: q.topicId,
    title: q.topicTitle,
    category: q.category,
    question: q.question,
    options: q.options,
    selectedIndex: selectedIndex,
    correctIndex: q.correctIndex,
    isCorrect: isCorrect,
    isTimeout: false,
    timeTaken: timeTaken,
    pointsAwarded: pointsAwarded,
    whyCorrect: q.whyCorrect
  });

  // Reveal Next Question button
  const nextBtn = document.getElementById("btn-next-question");
  nextBtn.style.display = "inline-flex";
}

/**
 * Handles timer timeout (counts as wrong).
 */
function handleQuestionTimeout() {
  if (isQuestionAnswered) return;
  isQuestionAnswered = true;

  const q = quizQuestions[quizIndex];
  streak = 0;
  sfx.playWrong();

  const optionButtons = document.querySelectorAll(".quiz-opt-btn");
  optionButtons.forEach(btn => btn.disabled = true);

  // Highlight correct answer
  optionButtons[q.correctIndex].classList.add("correct-choice");

  updateStreakFlame();
  showQuizExplanation(`⏳ Time ran out! ${q.whyCorrect}`);

  quizHistory.push({
    topicId: q.topicId,
    title: q.topicTitle,
    category: q.category,
    question: q.question,
    options: q.options,
    selectedIndex: null,
    correctIndex: q.correctIndex,
    isCorrect: false,
    isTimeout: true,
    timeTaken: 15,
    pointsAwarded: 0,
    whyCorrect: q.whyCorrect
  });

  const nextBtn = document.getElementById("btn-next-question");
  nextBtn.style.display = "inline-flex";
}

/**
 * Displays the whyCorrect explanation box.
 */
function showQuizExplanation(text) {
  const box = document.getElementById("quiz-explanation-box");
  const whyText = document.getElementById("quiz-why-text");
  whyText.textContent = text;
  box.style.display = "block";
}

/**
 * Advance to next quiz question (index++).
 */
function nextQuizQuestion() {
  quizIndex++;
  renderQuizQuestion();
}

/**
 * Updates streak flame scale and animation.
 */
function updateStreakFlame() {
  const flameEl = document.getElementById("quiz-streak-flame");
  const streakVal = document.getElementById("quiz-streak-val");
  streakVal.textContent = streak;

  if (streak > 0) {
    const scale = Math.min(1 + (streak * 0.12), 1.9);
    flameEl.style.setProperty("--flame-scale", scale);
    flameEl.style.transform = `scale(${scale})`;
    flameEl.classList.add("active-streak");
    flameEl.style.filter = `drop-shadow(0 0 ${4 + streak * 3}px rgba(245, 158, 11, 0.8))`;
  } else {
    flameEl.style.transform = "scale(1)";
    flameEl.classList.remove("active-streak");
    flameEl.style.filter = "none";
  }
}

/**
 * Spawns a floating score bubble (+10, +13, etc).
 */
function spawnScoreBubble(text) {
  const anchor = document.getElementById("floating-score-anchor");
  const bubble = document.createElement("div");
  bubble.className = "floating-points-bubble";
  bubble.textContent = text;
  anchor.appendChild(bubble);

  setTimeout(() => bubble.remove(), 950);
}

/**
 * Streak milestone popups at 3 and 5.
 */
function checkStreakMilestones(currentStreak) {
  if (currentStreak === 3) {
    sfx.playMilestone();
    showToast("🔥 On Fire! 3 in a row!");
  } else if (currentStreak === 5) {
    sfx.playMilestone();
    showToast("⚡ Unstoppable! 5 in a row!");
  }
}


/* ========================================================
   7. RESULTS LOGIC (STAGE 3: Deep Performance Analysis)
   ======================================================== */

/**
 * Evaluates performance and populates Stage 3: Results Page.
 */
function finishQuizAndShowResults() {
  clearInterval(timerInterval);
  goToStage(3);

  const total = quizQuestions.length;
  const correctCount = quizHistory.filter(h => h.isCorrect).length;
  const accuracyPct = Math.round((correctCount / total) * 100) || 0;

  // Sound & Canvas Celebration
  if (accuracyPct >= 60) {
    sfx.playVictory();
    particles.startShower(4000);
  } else {
    sfx.playCorrect();
  }

  // 1. Rank Title, Icon & Description
  const rank = getRankDetails(accuracyPct);
  document.getElementById("results-trophy-avatar").textContent = rank.icon;
  document.getElementById("results-rank-heading").textContent = rank.title;
  document.getElementById("results-rank-motto").textContent = rank.desc;

  // 2. Circular Accuracy Gauge
  animateNumberCount("results-accuracy-pct", 0, accuracyPct, "%", 1200);
  const gaugeFill = document.getElementById("results-gauge-fill");
  const circumference = 2 * Math.PI * 62; // 389.56
  const offset = circumference - ((accuracyPct / 100) * circumference);
  gaugeFill.style.strokeDashoffset = offset;

  if (accuracyPct >= 75) gaugeFill.style.stroke = "var(--color-success)";
  else if (accuracyPct >= 50) gaugeFill.style.stroke = "var(--color-warning)";
  else gaugeFill.style.stroke = "var(--color-danger)";

  // 3. Stat Matrix Cards
  document.getElementById("stat-total-points").textContent = score;
  document.getElementById("stat-correct-ratio").textContent = `${correctCount} / ${total}`;
  document.getElementById("stat-accuracy-text").textContent = `${accuracyPct}% accuracy`;
  document.getElementById("stat-best-streak").textContent = `${bestStreak} 🔥`;

  // Average time taken
  const totalTime = quizHistory.reduce((acc, h) => acc + h.timeTaken, 0);
  const avgTime = (totalTime / total).toFixed(1);
  document.getElementById("stat-avg-speed").textContent = `${avgTime}s`;

  // 4. Category Performance Breakdown (Horizontal Bars)
  renderCategoryBreakdown();

  // 5. Plain English Written Diagnostic Analysis
  generateDiagnosticAnalysis(accuracyPct, avgTime);

  // 6. Review Your Mistakes Accordion
  renderMistakesAccordion();

  // 7. Configure "Review Weak Topics" Button
  const weakTopics = getMissedTopics();
  const reviewWeakBtn = document.getElementById("btn-review-weak-topics");
  const reviewWeakText = document.getElementById("review-weak-btn-text");

  if (weakTopics.length > 0) {
    reviewWeakBtn.style.display = "inline-flex";
    reviewWeakText.textContent = `Review Weak Topics in Learn Mode (${weakTopics.length})`;
  } else {
    reviewWeakBtn.style.display = "none";
  }
}

/**
 * Calculates rank icon, title, and motto based on percentage.
 */
function getRankDetails(pct) {
  if (pct === 100) {
    return {
      icon: "👑",
      title: "Grandmaster Web Architect",
      desc: "Flawless perfection! You have absolute command over HTML, CSS, JavaScript, and DOM fundamentals."
    };
  } else if (pct >= 80) {
    return {
      icon: "🚀",
      title: "Web Wizard",
      desc: "Outstanding mastery! You breezed through complex browser execution models and architectural questions."
    };
  } else if (pct >= 60) {
    return {
      icon: "⚡",
      title: "Rising Developer",
      desc: "Solid foundational knowledge! Review your missed questions below to solidify your technical core."
    };
  } else if (pct >= 40) {
    return {
      icon: "🛠️",
      title: "Junior Coder",
      desc: "Good effort! A few key browser concepts tripped you up. Review your weak topics to bridge the gaps."
    };
  } else {
    return {
      icon: "📚",
      title: "Rookie Coder",
      desc: "Great starting point. Active recall is a journey—review each concept card carefully and test yourself again!"
    };
  }
}

/**
 * Renders animated horizontal category breakdown bars.
 */
function renderCategoryBreakdown() {
  const container = document.getElementById("category-bars-container");
  container.innerHTML = "";

  const categories = ["HTML", "CSS", "JavaScript", "DOM"];
  const catStats = {};

  categories.forEach(cat => {
    const questions = quizHistory.filter(h => h.category === cat);
    if (questions.length > 0) {
      const correct = questions.filter(h => h.isCorrect).length;
      catStats[cat] = {
        total: questions.length,
        correct: correct,
        pct: Math.round((correct / questions.length) * 100)
      };
    }
  });

  categories.forEach(cat => {
    const data = catStats[cat];
    if (!data) return;

    let colorClass = "fill-green";
    if (data.pct < 50) colorClass = "fill-red";
    else if (data.pct < 75) colorClass = "fill-amber";

    const item = document.createElement("div");
    item.className = "cat-bar-item";
    item.innerHTML = `
      <div class="cat-bar-header">
        <div class="cat-name-box">
          <span>${cat}</span>
        </div>
        <span class="cat-ratio-tag">${data.pct}% (${data.correct}/${data.total})</span>
      </div>
      <div class="cat-bar-track">
        <div class="cat-bar-fill ${colorClass}" style="width: 0%;"></div>
      </div>
    `;

    container.appendChild(item);

    // Animate bar fill width
    setTimeout(() => {
      item.querySelector(".cat-bar-fill").style.width = `${data.pct}%`;
    }, 100);
  });
}

/**
 * Generates plain English diagnostic analysis.
 */
function generateDiagnosticAnalysis(accuracyPct, avgTime) {
  const analysisEl = document.getElementById("results-analysis-text");

  // Determine strongest category
  const categories = ["HTML", "CSS", "JavaScript", "DOM"];
  let strongestCat = null;
  let highestPct = -1;
  let weakCats = [];

  categories.forEach(cat => {
    const qList = quizHistory.filter(h => h.category === cat);
    if (qList.length > 0) {
      const pct = Math.round((qList.filter(h => h.isCorrect).length / qList.length) * 100);
      if (pct > highestPct) {
        highestPct = pct;
        strongestCat = cat;
      }
      if (pct < 60) {
        weakCats.push(cat);
      }
    }
  });

  // Find fastest answer
  const correctAnswers = quizHistory.filter(h => h.isCorrect);
  let fastestRecord = null;
  if (correctAnswers.length > 0) {
    fastestRecord = correctAnswers.reduce((min, curr) => (curr.timeTaken < min.timeTaken ? curr : min));
  }

  let prose = "";
  if (accuracyPct === 100) {
    prose = `Incredible performance! You achieved a perfect 100% score across all 4 Web Development domains. Your rapid recall (averaging ${avgTime}s per question) demonstrates senior-level conceptual clarity.`;
  } else {
    prose = `You demonstrated strong proficiency in <strong>${strongestCat}</strong> (${highestPct}% accuracy). `;
    if (weakCats.length > 0) {
      prose += `Areas recommended for targeted review: <strong>${weakCats.join(", ")}</strong>. `;
    } else {
      prose += `You maintained balanced performance across all domains. `;
    }
    if (fastestRecord) {
      prose += `Your fastest correct answer was <strong>${fastestRecord.timeTaken}s</strong> on "${fastestRecord.title}".`;
    }
  }

  analysisEl.innerHTML = prose;
}

/**
 * Returns array of topics that were answered incorrectly.
 */
function getMissedTopics() {
  const missedTopicIds = new Set(quizHistory.filter(h => !h.isCorrect).map(h => h.topicId));
  return TOPICS.filter(t => missedTopicIds.has(t.id));
}

/**
 * Renders expandable "Review Your Mistakes" cards.
 */
function renderMistakesAccordion() {
  const container = document.getElementById("mistakes-accordion-container");
  const countBadge = document.getElementById("mistakes-count-badge");
  container.innerHTML = "";

  const missedItems = quizHistory.filter(h => !h.isCorrect);
  countBadge.textContent = `${missedItems.length} Mistakes`;

  if (missedItems.length === 0) {
    container.innerHTML = `
      <div style="padding: 14px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); color: var(--color-success); font-weight: 600;">
        ✨ Flawless Run! You didn't miss a single question.
      </div>
    `;
    return;
  }

  missedItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "mistake-card-item";

    const userChoiceText = item.isTimeout 
      ? "Timed out (No answer selected)"
      : (item.selectedIndex !== null ? item.options[item.selectedIndex] : "None");
    const correctChoiceText = item.options[item.correctIndex];

    card.innerHTML = `
      <div class="mistake-summary-row" role="button" aria-expanded="false">
        <div class="mistake-summary-left">
          <span class="mistake-cat-tag">${item.category}</span>
          <span class="mistake-q-title">${item.title}</span>
        </div>
        <span class="mistake-chevron">▼</span>
      </div>
      <div class="mistake-details-body">
        <p style="margin-top: 8px; font-weight: 600; color: var(--text-main);">${item.question}</p>
        <div class="mistake-choice-line user-wrong">
          <strong>Your Answer:</strong> ❌ ${formatCode(userChoiceText)}
        </div>
        <div class="mistake-choice-line actual-correct">
          <strong>Correct Answer:</strong> ✅ ${formatCode(correctChoiceText)}
        </div>
        <div class="mistake-why-box">
          <strong>Why:</strong> ${item.whyCorrect}
        </div>
      </div>
    `;

    // Accordion toggle
    const summaryRow = card.querySelector(".mistake-summary-row");
    summaryRow.addEventListener("click", () => {
      const isOpen = card.classList.toggle("open");
      summaryRow.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    container.appendChild(card);
  });
}


/* ========================================================
   8. ANIMATIONS & EFFECTS (3D Tilt, Canvas Confetti, Typewriter)
   ======================================================== */

// --- 3D MOUSE PARALLAX TILT & SPECULAR GLARE ---
const learnTiltBox = document.getElementById("learn-tilt-box");
const learnCard = document.getElementById("learn-card");
const cardGlare = document.querySelector(".card-glare-effect");
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!isTouchDevice && learnTiltBox && learnCard) {
  learnTiltBox.addEventListener("mousemove", (e) => {
    const rect = learnTiltBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    learnTiltBox.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

    if (cardGlare) {
      cardGlare.style.opacity = "0.7";
      cardGlare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`;
    }
  });

  learnTiltBox.addEventListener("mouseleave", () => {
    resetCardTilt();
  });
}

function resetCardTilt() {
  if (learnTiltBox) {
    learnTiltBox.style.transform = "rotateX(0deg) rotateY(0deg)";
  }
  if (cardGlare) {
    cardGlare.style.opacity = "0";
  }
}

// --- FULLSCREEN CANVAS PARTICLE & CONFETTI ENGINE ---
class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.animationId = null;
    this.isShowerActive = false;
    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, count = 28, colors = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]) {
    if (!this.ctx) return;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 3;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        gravity: 0.18,
        shape: Math.random() > 0.4 ? "rect" : "circle"
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  startShower(duration = 4000) {
    if (!this.ctx) return;
    this.isShowerActive = true;
    const colors = ["#8b5cf6", "#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#ffffff"];

    const interval = setInterval(() => {
      if (!this.isShowerActive) {
        clearInterval(interval);
        return;
      }
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 4 + 2,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 8,
          gravity: 0.05,
          shape: Math.random() > 0.3 ? "rect" : "circle"
        });
      }
    }, 60);

    setTimeout(() => {
      this.isShowerActive = false;
      clearInterval(interval);
    }, duration);

    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0 || this.isShowerActive) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      this.animationId = null;
    }
  }
}

const particles = new ParticleEngine("particle-canvas");

// --- TYPEWRITER HEADLINE ANIMATION ---
function startTypewriter(text, elementId, speed = 36) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = "";

  let i = 0;
  function typeChar() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
    }
  }
  typeChar();
}

// --- BUTTON RIPPLE EFFECT ---
function createRipple(e) {
  const button = e.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top = `${e.clientY - rect.top - radius}px`;
  circle.classList.add("ripple-wave");

  const ripple = button.getElementsByClassName("ripple-wave")[0];
  if (ripple) ripple.remove();

  button.appendChild(circle);
}

// --- SMOOTH SCORE COUNT-UP ---
function animateNumberCount(elementId, start, end, suffix = "", duration = 800) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - (1 - progress) * (1 - progress);
    const val = Math.round(start + (end - start) * ease);

    el.textContent = `${val}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "streak-toast";
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 2600);
}

// --- FORMAT CODE HELPER ---
function formatCode(text) {
  if (!text) return "";
  return text.replace(/<([a-zA-Z0-9_\-]+)>/g, "&lt;$1&gt;");
}


/* ========================================================
   9. EVENT LISTENERS & INITIALIZATION
   ======================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Typewriter Headline
  startTypewriter("Master Web Development with NovaDeck", "hero-typed-text", 32);

  // 2. Initialize Stage 1
  initLearnStage();

  // 3. Button Ripple Micro-Interactions
  document.querySelectorAll(".ripple-btn").forEach(btn => {
    btn.addEventListener("click", createRipple);
  });

  // 4. LEARN MODE CONTROLS
  const learnCardEl = document.getElementById("learn-card");
  learnCardEl.addEventListener("click", (e) => {
    // If clicking a button, ignore
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;

    // When card is flipped, allow scrolling and text selection inside .side-scrollable without flipping
    if (isLearnFlipped && e.target.closest(".side-scrollable")) {
      return;
    }

    toggleLearnCardFlip();
  });

  document.getElementById("btn-flip-card").addEventListener("click", toggleLearnCardFlip);
  document.getElementById("btn-next-card").addEventListener("click", nextLearnCard);
  document.getElementById("btn-prev-card").addEventListener("click", prevLearnCard);

  // 5. TAKE THE QUIZ BUTTON
  document.getElementById("btn-launch-quiz").addEventListener("click", () => {
    if (readCardIds.size >= activeTopics.length) {
      launchMicroQuiz();
    } else {
      handleLockedQuizClick();
    }
  });

  // 6. QUIZ MODE CONTROLS
  document.getElementById("btn-next-question").addEventListener("click", nextQuizQuestion);

  // 7. RESULTS MODE ACTIONS
  document.getElementById("btn-review-weak-topics").addEventListener("click", () => {
    const weakTopics = getMissedTopics();
    if (weakTopics.length > 0) {
      initLearnStage(weakTopics);
      goToStage(1);
    }
  });

  document.getElementById("btn-retake-quiz").addEventListener("click", () => {
    launchMicroQuiz();
  });

  document.getElementById("btn-start-over").addEventListener("click", () => {
    initLearnStage(TOPICS);
    goToStage(1);
  });

  // 8. THEME & MUTE TOGGLES
  document.getElementById("theme-btn").addEventListener("click", toggleTheme);
  document.getElementById("mute-btn").addEventListener("click", toggleMute);

  // 9. TOUCH SWIPE SUPPORT FOR LEARN CARDS
  setupTouchSwipe();

  // 10. GLOBAL ACCESSIBLE KEYBOARD NAVIGATION
  window.addEventListener("keydown", handleGlobalKeydown);
});

/**
 * Dark / Light Theme Toggle
 */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
}

/**
 * Audio Mute Toggle
 */
function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById("mute-btn");
  if (isMuted) {
    muteBtn.classList.add("muted");
    muteBtn.setAttribute("aria-label", "Unmute Sound");
  } else {
    muteBtn.classList.remove("muted");
    muteBtn.setAttribute("aria-label", "Mute Sound");
    sfx.playFlip();
  }
}

/**
 * Mobile Touch Swipe Handling on Learn Card
 */
function setupTouchSwipe() {
  let touchStartX = 0;
  let touchEndX = 0;
  const cardArena = document.getElementById("learn-arena");

  if (!cardArena) return;

  cardArena.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  cardArena.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextLearnCard(); // Swiped left -> next
      else prevLearnCard();          // Swiped right -> prev
    }
  }, { passive: true });
}

/**
 * Keyboard Navigation Shortcuts
 */
function handleGlobalKeydown(e) {
  // Theme Toggle (T)
  if (e.key === "t" || e.key === "T") {
    toggleTheme();
    return;
  }

  // Mute Toggle (M)
  if (e.key === "m" || e.key === "M") {
    toggleMute();
    return;
  }

  // STAGE 1: LEARN MODE
  if (currentStage === 1) {
    if (e.code === "Space") {
      e.preventDefault();
      toggleLearnCardFlip();
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextLearnCard();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevLearnCard();
      return;
    }
  }

  // STAGE 2: QUIZ MODE
  if (currentStage === 2) {
    // 1-4 or A-D option selection
    if (!isQuestionAnswered) {
      const keyMap = { "1": 0, "a": 0, "A": 0, "2": 1, "b": 1, "B": 1, "3": 2, "c": 2, "C": 2, "4": 3, "d": 3, "D": 3 };
      if (keyMap[e.key] !== undefined) {
        e.preventDefault();
        handleQuizAnswer(keyMap[e.key]);
        return;
      }
    } else {
      // If question is answered, Space or Enter advances to next question
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        nextQuizQuestion();
        return;
      }
    }
  }

  // STAGE 3: RESULTS MODE
  if (currentStage === 3) {
    if (e.key === "Enter") {
      e.preventDefault();
      launchMicroQuiz();
      return;
    }
  }
}
