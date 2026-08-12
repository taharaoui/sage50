"use client";

import { useRef, useState } from "react";

// Formspree: sends an email to this address whenever she saves a suggestion.
// First submission triggers a one-time confirmation email — click it to activate.
const FORMSPREE_ENDPOINT = "https://formspree.io/raoui.taha03@gmail.com";

const CAPTIONS = [
  "nice try",
  "are you sure?",
  "really?",
  "come on now",
  "the button is shy",
  "not happening",
  "keep trying though",
  "getting warmer? no.",
  "you had one job",
  "okay this is just cardio now",
];

const CONFETTI_COLORS = ["#FF5FA2", "#7B6EF6", "#57D9A3", "#FFD166"];

export default function Home() {
  const [answered, setAnswered] = useState(false);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [caption, setCaption] = useState("");
  const [dodgeCount, setDodgeCount] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const btnRowRef = useRef(null);
  const noBtnRef = useRef(null);

  function dodge() {
    const rowRect = btnRowRef.current.getBoundingClientRect();
    const btnRect = noBtnRef.current.getBoundingClientRect();

    const maxX = Math.max(rowRect.width - btnRect.width, 40);
    const maxY = Math.max(120 - btnRect.height, 20);

    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;

    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);
    setNoOffset({ x: newX, y: newY });
    setCaption(CAPTIONS[Math.min(nextCount - 1, CAPTIONS.length - 1)]);
    setNoScale(Math.max(0.55, 1 - nextCount * 0.05));
    setYesScale(Math.min(1.35, 1 + nextCount * 0.03));
  }

  function launchConfetti() {
    const pieces = Array.from({ length: 90 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: 2.5 + Math.random() * 2,
      round: Math.random() > 0.5,
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 5000);
  }

  function handleYes() {
    setAnswered(true);
    launchConfetti();
  }

  async function handleSave() {
    const message = suggestion.trim();
    if (!message) return;

    setSending(true);
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ suggestion: message }),
      });
    } catch (err) {
      // Fails silently for her; the "Locked in" note still shows either way.
      console.error("Could not send notification email:", err);
    }
    setSending(false);
    setSaved(true);
  }

  return (
    <div className="page">
      <div className="floaty" style={{ width: 90, height: 90, background: "var(--hot-pink)", top: "8%", left: "8%" }} />
      <div className="floaty" style={{ width: 60, height: 60, background: "var(--periwinkle)", top: "70%", left: "12%", animationDelay: "2s" }} />
      <div className="floaty" style={{ width: 70, height: 70, background: "var(--mint)", top: "15%", right: "10%", animationDelay: "4s" }} />
      <div className="floaty" style={{ width: 50, height: 50, background: "var(--periwinkle)", bottom: "12%", right: "14%", animationDelay: "1s" }} />

      <div className="stage">
        {!answered ? (
          <div>
            <div className="eyebrow">💌 An important question</div>
            <h1>
              Will you go out
              <br />
              with <span className="highlight">me?</span>
            </h1>
            <p className="subtext">Take your time. There's really only one good answer.</p>

            <div className="btn-row" ref={btnRowRef}>
              <button id="yesBtn" style={{ transform: `scale(${yesScale})` }} onClick={handleYes}>
                Yes, obviously 💕
              </button>
              <button
                id="noBtn"
                ref={noBtnRef}
                style={{
                  left: noOffset.x,
                  top: noOffset.y,
                  transform: `scale(${noScale})`,
                }}
                onMouseEnter={dodge}
                onClick={(e) => {
                  e.preventDefault();
                  dodge();
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  dodge();
                }}
              >
                No
              </button>
            </div>
            <div className="no-caption">{caption || "\u00A0"}</div>
          </div>
        ) : (
          <div>
            <div className="success-emoji">🎉</div>
            <h1>Knew it.</h1>
            <p className="subtext">Here's what I'm thinking. Last stop's up to you.</p>

            <div className="plan">
              <div className="plan-item">
                <div className="plan-time">8:00 PM</div>
                <div className="plan-body">
                  <div className="plan-title">Drinks at Lovebird</div>
                  <div className="plan-desc">Cozy speakeasy, live jazz, Old Montreal.</div>
                </div>
              </div>
              <div className="plan-connector" />
              <div className="plan-item">
                <div className="plan-time">9:30 PM</div>
                <div className="plan-body">
                  <div className="plan-title">Night drive</div>
                  <div className="plan-desc">Windows down, city lights, no particular rush to get anywhere.</div>
                </div>
              </div>
              <div className="plan-connector" />
              <div className="plan-item plan-item-open">
                <div className="plan-time">???</div>
                <div className="plan-body">
                  <div className="plan-title">Your call</div>
                  <div className="plan-desc">Pick the last stop, or how the night ends.</div>
                  <input
                    type="text"
                    className="plan-input"
                    placeholder="type your idea here..."
                    maxLength={120}
                    value={suggestion}
                    disabled={saved}
                    onChange={(e) => setSuggestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                    }}
                  />
                  <button
                    className="plan-save"
                    disabled={saved || sending}
                    style={saved || sending ? { opacity: 0.5 } : undefined}
                    onClick={handleSave}
                  >
                    {sending ? "Sending..." : saved ? "Saved" : "Save it"}
                  </button>
                  {saved && <div className="plan-saved">Locked in ✓ — &quot;{suggestion.trim()}&quot;</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            borderRadius: p.round ? "50%" : "2px",
          }}
        />
      ))}

      <footer>made with a little bit of nerve</footer>
    </div>
  );
}
