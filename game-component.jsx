const { useState, useRef, useEffect, useCallback } = React;


const HOLLYWOOD_PUZZLES = [
  {
    title: "Jurassic Park",
    timeLimit: 45,
    clues: [
      { emoji: "🦖", hint: "ancient reptile" },
      { emoji: "🌳🏞️", hint: "wild green place" },
    ],
  },
  {
    title: "The Godfather",
    timeLimit: 45,
    clues: [
      { emoji: "🙏", hint: "the head of a family" },
      { emoji: "👨‍👦", hint: "male parent" },
    ],
  },
  {
    title: "Finding Nemo",
    timeLimit: 40,
    clues: [
      { emoji: "🔍👀", hint: "searching, looking" },
      { emoji: "🐠", hint: "a clownfish's name" },
    ],
  },
  {
    title: "The Devil Wears Prada",
    timeLimit: 40,
    clues: [
      { emoji: "😈", hint: "a fiendish figure" },
      { emoji: "👗", hint: "puts clothing on" },
      { emoji: "👜", hint: "luxury fashion house" },
    ],
  },
  {
    title: "Inception",
    timeLimit: 35,
    clues: [
      { emoji: "🌱🕳️", hint: "the beginning, the start of something" },
    ],
  },
  {
    title: "No Country for Old Men",
    timeLimit: 30,
    clues: [
      { emoji: "🚫🗺️👴", hint: "not this place, for elderly men" },
    ],
  },
  {
    title: "There Will Be Blood",
    timeLimit: 25,
    clues: [
      { emoji: "🩸", hint: "what flows in veins" },
    ],
  },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    timeLimit: 25,
    clues: [
      { emoji: "♾️☀️", hint: "forever bright" },
      { emoji: "🧠✨", hint: "a clean, clear head" },
    ],
  },
];

const KOLLYWOOD_PUZZLES = [
  {
    title: "Panchathanthiram",
    timeLimit: 45,
    clues: [
      { emoji: "✋5️⃣", hint: "pancha = five" },
      { emoji: "🦊", hint: "thanthiram = trick, cunning" },
    ],
  },
  {
    title: "Thuppakki",
    timeLimit: 40,
    clues: [
      { emoji: "🔫", hint: "thuppakki = gun" },
    ],
  },
  {
    title: "Vikram",
    timeLimit: 40,
    clues: [
      { emoji: "🕵️‍♂️🎭", hint: "a name, and also an undercover agent" },
    ],
  },
  {
    title: "Enthiran",
    timeLimit: 40,
    clues: [
      { emoji: "🤖", hint: "enthiran = machine, robot" },
    ],
  },
  {
    title: "Kaakha Kaakha",
    timeLimit: 35,
    clues: [
      { emoji: "👮‍♂️👮‍♂️", hint: "kaakha = to guard, protect (police)" },
    ],
  },
  {
    title: "Anniyan",
    timeLimit: 30,
    clues: [
      { emoji: "🧍‍♂️❓", hint: "anniyan = stranger, outsider" },
    ],
  },
  {
    title: "Mankatha",
    timeLimit: 30,
    clues: [
      { emoji: "🃏💰", hint: "mankatha = con, deception" },
    ],
  },
  {
    title: "Ratsasan",
    timeLimit: 25,
    clues: [
      { emoji: "👹🔪", hint: "ratsasan = demon" },
    ],
  },
];

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(the|a|an)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

function useSpeech(onResult) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
  }, [onResult]);

  const start = () => {
    if (!recRef.current) return;
    try {
      recRef.current.start();
      setListening(true);
    } catch (e) {}
  };

  return { start, listening, supported };
}

const SPROCKET_COUNT = 6;

function FilmFrame({ children, revealed, delay }) {
  return (
    <div
      style={{
        position: "relative",
        background: "#1B1930",
        border: "3px solid #E8A33D",
        borderRadius: 6,
        padding: "28px 20px",
        minWidth: 140,
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0) scale(1)" : "translateY(16px) scale(0.9)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 4,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          padding: "0 6px",
        }}
      >
        {Array.from({ length: SPROCKET_COUNT }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 2,
              background: "#0F0E17",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-around",
          padding: "0 6px",
        }}
      >
        {Array.from({ length: SPROCKET_COUNT }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 2,
              background: "#0F0E17",
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

function ConnectionsGame() {
  const [language, setLanguage] = useState(null); // null | "hollywood" | "kollywood"
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("playing"); // playing | correct | wrong | revealed
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shake, setShake] = useState(false);
  const [micError, setMicError] = useState("");
  const [timeLeft, setTimeLeft] = useState(45);

  const PUZZLES = language === "kollywood" ? KOLLYWOOD_PUZZLES : HOLLYWOOD_PUZZLES;
  const puzzle = PUZZLES[round];

  useEffect(() => {
    if (!language) return;
    setTimeLeft(PUZZLES[0].timeLimit);
  }, [language]);

  useEffect(() => {
    if (!language) return;
    setTimeLeft(puzzle.timeLimit);
  }, [round]);

  useEffect(() => {
    if (!language) return;
    if (status !== "playing" && status !== "wrong") return;
    if (timeLeft <= 0) {
      setStatus("revealed");
      setStreak(0);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status]);

  const handleSpeechResult = useCallback((text) => {
    setInput(text);
    setTimeout(() => checkAnswer(text), 100);
  }, []);

  const { start: startListening, listening, supported: speechSupported } =
    useSpeech(handleSpeechResult);

  function checkAnswer(raw) {
    const guess = norm(raw);
    const answer = norm(puzzle.title);
    if (!guess) return;
    if (guess === answer) {
      const base = Math.max(10, 30 - attempts * 10);
      const timeBonus = Math.round((timeLeft / puzzle.timeLimit) * 10);
      setScore((s) => s + base + timeBonus);
      setStreak((s) => s + 1);
      setStatus("correct");
    } else {
      setAttempts((a) => a + 1);
      setStreak(0);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      if (attempts + 1 >= 3) {
        setStatus("revealed");
      } else {
        setStatus("wrong");
      }
    }
  }

  function nextRound() {
    if (round + 1 >= PUZZLES.length) {
      setGameOver(true);
      return;
    }
    setRound((r) => r + 1);
    setInput("");
    setStatus("playing");
    setAttempts(0);
  }

  function restart() {
    setLanguage(null);
    setRound(0);
    setScore(0);
    setStreak(0);
    setInput("");
    setStatus("playing");
    setAttempts(0);
    setGameOver(false);
  }

  function playAgainSameLanguage() {
    setRound(0);
    setScore(0);
    setStreak(0);
    setInput("");
    setStatus("playing");
    setAttempts(0);
    setGameOver(false);
    setTimeLeft(PUZZLES[0].timeLimit);
  }

  const marqueeFont = { fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif" };

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#0F0E17",
        minHeight: 500,
        color: "#FFFAEB",
        padding: "28px 20px 36px",
        borderRadius: 16,
        maxWidth: 640,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;800&display=swap');
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bulbGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .cg-input:focus { outline: 2px solid #E8A33D; }
        .cg-btn { cursor: pointer; transition: transform 0.15s ease, background 0.15s ease; }
        .cg-btn:active { transform: scale(0.96); }
        .cg-btn:hover { filter: brightness(1.08); }
      `}</style>

      {/* Marquee header */}
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div
          style={{
            display: "inline-flex",
            gap: 6,
            marginBottom: 6,
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#E8A33D",
                animation: `bulbGlow 1.4s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
        <h1
          style={{
            ...marqueeFont,
            fontSize: 42,
            letterSpacing: 3,
            margin: 0,
            color: "#E8A33D",
            lineHeight: 1,
          }}
        >
          CONNECTIONS
        </h1>
        <p style={{ fontSize: 12, letterSpacing: 2, color: "#9A94B5", margin: "4px 0 0", textTransform: "uppercase" }}>
          Guess the movie from the clues
        </p>
      </div>

      {!language ? (
        <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
          <p style={{ fontSize: 14, color: "#C9C4DC", marginBottom: 24 }}>
            Choose which movie world to play
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="cg-btn"
              onClick={() => setLanguage("hollywood")}
              style={{
                background: "#1B1930",
                border: "2px solid #E8A33D",
                borderRadius: 12,
                padding: "22px 28px",
                color: "#FFFAEB",
                minWidth: 150,
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>🎬</div>
              <div style={{ ...marqueeFont, fontSize: 22, letterSpacing: 1, color: "#E8A33D" }}>HOLLYWOOD</div>
              <div style={{ fontSize: 11, color: "#9A94B5", marginTop: 4 }}>English titles</div>
            </button>
            <button
              className="cg-btn"
              onClick={() => setLanguage("kollywood")}
              style={{
                background: "#1B1930",
                border: "2px solid #E8A33D",
                borderRadius: 12,
                padding: "22px 28px",
                color: "#FFFAEB",
                minWidth: 150,
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>🎥</div>
              <div style={{ ...marqueeFont, fontSize: 22, letterSpacing: 1, color: "#E8A33D" }}>KOLLYWOOD</div>
              <div style={{ fontSize: 11, color: "#9A94B5", marginTop: 4 }}>Tamil titles</div>
            </button>
          </div>
        </div>
      ) : gameOver ? (
        <div style={{ textAlign: "center", padding: "40px 0", animation: "popIn 0.5s ease" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎬</div>
          <h2 style={{ ...marqueeFont, fontSize: 32, color: "#E8A33D", margin: "0 0 6px", letterSpacing: 2 }}>
            THAT'S A WRAP
          </h2>
          <p style={{ color: "#C9C4DC", fontSize: 15, marginBottom: 20 }}>
            Final score: <strong style={{ color: "#FFFAEB" }}>{score}</strong> pts across {PUZZLES.length} puzzles
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="cg-btn"
              onClick={playAgainSameLanguage}
              style={{
                background: "#E8A33D",
                color: "#0F0E17",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              Play again
            </button>
            <button
              className="cg-btn"
              onClick={restart}
              style={{
                background: "transparent",
                color: "#FFFAEB",
                border: "1px solid #3D3856",
                borderRadius: 8,
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Switch language
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Scoreboard */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
              background: "#1B1930",
              borderRadius: 10,
              padding: "10px 16px",
            }}
          >
            <div style={{ fontSize: 13, color: "#9A94B5" }}>
              Puzzle <strong style={{ color: "#FFFAEB" }}>{round + 1}</strong> / {PUZZLES.length}
            </div>
            <div style={{ fontSize: 13, color: "#9A94B5" }}>
              Streak <strong style={{ color: streak > 0 ? "#5FB49C" : "#FFFAEB" }}>{streak}🔥</strong>
            </div>
            <div style={{ fontSize: 13, color: "#9A94B5" }}>
              Score <strong style={{ color: "#E8A33D" }}>{score}</strong>
            </div>
          </div>

          {(status === "playing" || status === "wrong") && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ height: 6, background: "#1B1930", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(timeLeft / puzzle.timeLimit) * 100}%`,
                    background: timeLeft <= 10 ? "#E85D4C" : "#E8A33D",
                    transition: "width 1s linear, background 0.3s ease",
                  }}
                />
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#6B6580", marginTop: 3 }}>{timeLeft}s</div>
            </div>
          )}

          {/* Clue frames */}
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 26,
              animation: shake ? "shakeX 0.4s ease" : "none",
            }}
          >
            {puzzle.clues.map((clue, i) => (
              <FilmFrame key={round + "-" + i} revealed={true} delay={i * 120}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 44, lineHeight: 1 }}>{clue.emoji}</div>
                  {status === "revealed" && (
                    <div style={{ fontSize: 11, color: "#9A94B5", marginTop: 8 }}>{clue.hint}</div>
                  )}
                </div>
              </FilmFrame>
            ))}
          </div>

          {/* Feedback */}
          {status === "correct" && (
            <div
              style={{
                textAlign: "center",
                marginBottom: 16,
                animation: "popIn 0.35s ease",
              }}
            >
              <div style={{ fontSize: 15, color: "#5FB49C", fontWeight: 800 }}>
                ✓ Correct! It's "{puzzle.title}"
              </div>
            </div>
          )}
          {status === "wrong" && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: "#E85D4C", fontWeight: 600 }}>
                Not quite — {3 - attempts} guess{3 - attempts === 1 ? "" : "es"} left
              </div>
            </div>
          )}
          {status === "revealed" && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#9A94B5", marginBottom: 4 }}>
                {timeLeft <= 0 ? "Time's up!" : "Out of guesses"}
              </div>
              <div style={{ fontSize: 15, color: "#E8A33D", fontWeight: 800 }}>
                The answer was "{puzzle.title}"
              </div>
            </div>
          )}

          {/* Input area */}
          {status === "playing" || status === "wrong" ? (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <input
                className="cg-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkAnswer(input)}
                placeholder="Type the movie title..."
                style={{
                  flex: "1 1 240px",
                  maxWidth: 320,
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: "1px solid #3D3856",
                  background: "#1B1930",
                  color: "#FFFAEB",
                  fontSize: 15,
                }}
              />
              <button
                className="cg-btn"
                onClick={() => checkAnswer(input)}
                style={{
                  background: "#5FB49C",
                  color: "#0F0E17",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 18px",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                Guess
              </button>
              {speechSupported && (
                <button
                  className="cg-btn"
                  onClick={startListening}
                  aria-label="Speak your answer"
                  style={{
                    background: listening ? "#E85D4C" : "#2E2A3D",
                    color: "#FFFAEB",
                    border: "1px solid #3D3856",
                    borderRadius: 8,
                    padding: "12px 16px",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {listening ? "● Listening..." : "🎤 Speak"}
                </button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <button
                className="cg-btn"
                onClick={nextRound}
                style={{
                  background: "#E8A33D",
                  color: "#0F0E17",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 28px",
                  fontWeight: 800,
                  fontSize: 15,
                }}
              >
                {round + 1 >= PUZZLES.length ? "See final score" : "Next puzzle →"}
              </button>
            </div>
          )}

          {!speechSupported && (
            <p style={{ textAlign: "center", fontSize: 11, color: "#6B6580", marginTop: 14 }}>
              Voice input isn't supported in this browser — try Chrome on desktop or Android.
            </p>
          )}
        </>
      )}
    </div>
  );
}
