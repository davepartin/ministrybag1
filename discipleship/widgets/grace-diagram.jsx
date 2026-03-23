import { useState } from "react";

const stops = [
  {
    id: "mercy",
    label: "Mercy",
    cardTitle: "God's Great Love and ",
    cardTitleBold: "Mercy",
    cardTitleAfter: "",
    color: "#5B8A72",
    borderColor: "#5B8A72",
    bgColor: "#EFF6F2",
    ref: "Ephesians 2:4-5",
  },
  {
    id: "justified",
    label: "Justified",
    cardTitle: "",
    cardTitleBold: "Justified",
    cardTitleAfter: ": \u201CJust-if-I\u2019d\u201D never sinned",
    color: "#8B4A5E",
    borderColor: "#8B4A5E",
    bgColor: "#F6EFF2",
    ref: "Romans 5:9 (ESV)",
  },
  {
    id: "righteous",
    label: "Righteous",
    cardTitle: "Clothed in ",
    cardTitleBold: "Righteousness",
    cardTitleAfter: "",
    color: "#4A6B8B",
    borderColor: "#4A6B8B",
    bgColor: "#EFF3F6",
    ref: "2 Corinthians 5:21 (NIV)",
  },
  {
    id: "overflow",
    label: "Grace",
    cardTitle: "We Get and Give ",
    cardTitleBold: "Grace",
    cardTitleAfter: "",
    color: "#9B7B2F",
    borderColor: "#9B7B2F",
    bgColor: "#FBF5E6",
    ref: "Ephesians 2:8-10",
  },
  {
    id: "cross",
    label: "The Cross",
    cardTitle: "Give ",
    cardTitleBold: "Grace",
    cardTitleAfter: ", Show Mercy, Forgive",
    color: "#6B5232",
    borderColor: "#6B5232",
    bgColor: "#F5EDE3",
    ref: "Ephesians 4:32 (ESV)",
  },
];

function VerseText({ stopId }) {
  const b = { fontWeight: "700", color: "#2C2416" };
  if (stopId === "mercy") {
    return (
      <span>But because of his <span style={b}>great love</span> for us, God, who is rich in <span style={b}>mercy</span>, made us <span style={b}>alive</span> with Christ even when we were dead in transgressions. It is by <span style={b}>grace</span> you have been <span style={b}>saved</span>.</span>
    );
  }
  if (stopId === "justified") {
    return (
      <span>Since we have now been <span style={b}>justified</span> by his <span style={b}>blood (on the cross)</span>, how much more shall we be saved from God's <span style={b}>wrath (punishment)</span> through him.</span>
    );
  }
  if (stopId === "righteous") {
    return (
      <span>God made him who had <span style={b}>no sin</span> to be sin for us, so that in him we might become the <span style={b}>righteousness</span> of God.</span>
    );
  }
  if (stopId === "overflow") {
    return (
      <span>For it is by <span style={b}>grace</span> you have been <span style={b}>saved</span>, through faith and this is not from yourselves, it is the <span style={b}>gift</span> of God, not by works, so that no one can boast. For we are God's <span style={b}>handiwork</span>, created in Christ Jesus to do <span style={b}>good works</span>.</span>
    );
  }
  if (stopId === "cross") {
    return (
      <span>Be kind to one another, tenderhearted, forgiving one another, <span style={b}>as God in Christ forgave you</span>.</span>
    );
  }
  return null;
}

export default function GraceDiagram() {
  const [step, setStep] = useState(-1);
  const showIntro = step === -1;
  const current = step >= 0 ? stops[step] : stops[0];

  const BOX = 138;
  const BOX_H_TOP = 116;
  const BOX_H_BOT = 130;
  const GAP = 50;
  const GAP_V = 50;
  const W = BOX * 2 + GAP;
  const H = BOX_H_TOP + GAP_V + BOX_H_BOT;

  const leftR = BOX;
  const rightL = BOX + GAP;
  const topBot = BOX_H_TOP;
  const botTop = BOX_H_TOP + GAP_V;
  const leftCx = BOX / 2;
  const rightCx = BOX + GAP + BOX / 2;
  const topArrowY = BOX_H_TOP * 0.5;
  const botArrowY = botTop + BOX_H_BOT * 0.78 - 3;
  const midX = BOX + GAP / 2;
  const midY = BOX_H_TOP + GAP_V / 2;

  const ARR = "#6B6358";
  const SW = 2;
  const HEAD = 8;

  const isActive = (idx) => idx <= step || (step === 4);
  const showCross = step === 4;
  const allDim = step === -1;

  const greyBorder = "#D4CFC4";
  const greyBg = "#F5F3EF";
  const greyText = "#B8B1A4";

  const crossColor = "#D9CEBF";
  const BEAM = 45;

  const boxStyle = (idx) => {
    if (idx > 3) return {};
    const active = allDim ? false : isActive(idx);
    const s = stops[idx];
    const viewing = step === idx;
    return {
      position: "absolute",
      width: BOX,
      background: active ? (viewing ? s.bgColor : "#FFFFFF") : greyBg,
      border: `2.5px solid ${active ? s.borderColor : greyBorder}`,
      borderRadius: 8,
      cursor: active ? "pointer" : "default",
      transition: "all 0.4s ease",
      fontFamily: "'Trebuchet MS', sans-serif",
      textAlign: "center",
      boxShadow: viewing
        ? `0 4px 16px ${s.color}40`
        : active
          ? "0 1px 6px rgba(44,36,22,0.05)"
          : "none",
      transform: viewing ? "scale(1.03)" : "scale(1)",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      opacity: active ? 1 : 0.45,
      WebkitTapHighlightColor: "transparent",
    };
  };

  const arrowOpacity = (minStep) => ({
    transition: "opacity 0.5s ease",
    opacity: step >= minStep ? 1 : 0,
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF8F3",
      fontFamily: "'Georgia', 'Cambria', serif",
      color: "#2C2416",
    }}>

      {/* Title */}
      <div style={{
        background: "#2C2416",
        padding: "14px 20px 12px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontSize: "20px", fontWeight: "400",
          color: "#FAF8F3", margin: 0, lineHeight: "1.2",
          fontFamily: "'Georgia', 'Cambria', serif",
        }}>The Cycle of Grace</h1>
        <p style={{
          fontSize: "12px", color: "#FFFFFF",
          margin: "5px 0 0 0",
          fontFamily: "'Georgia', 'Cambria', serif",
        }}>"For it is by grace you have been saved, through faith."</p>
      </div>

      {/* Diagram */}
      <div style={{ padding: "18px 0 0", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: W, height: H, overflow: "visible" }}>

          {/* CROSS — solid fill, behind boxes (zIndex 1) */}
          {/* Vertical beam */}
          {(() => {
            const vTop = midY - BEAM / 2 - GAP_V / 2 - 40;
            const vHeight = botArrowY - vTop;
            const vTrimmed = vHeight * 0.95;
            const vOffset = (vHeight - vTrimmed) / 2;
            return <div style={{
              position: "absolute",
              left: midX - BEAM / 2,
              top: vTop + vOffset + 6 + 5 + 2.5 + 3 - 2 - 10 - 6,
              width: BEAM,
              height: vTrimmed - 10 - 5 + 3 + 20,
              backgroundColor: crossColor,
              borderRadius: 4,
              zIndex: 1,
              pointerEvents: "none",
              opacity: showCross ? 1 : 0,
              transition: "opacity 0.8s ease",
            }} />;
          })()}
          {/* Horizontal beam — 5px lower */}
          {(() => {
            const hLeft = midX - BEAM / 2 - GAP / 2 - 40;
            const hWidth = BEAM + GAP + 80;
            const hTrimmed = hWidth * 0.95;
            const hOffset = (hWidth - hTrimmed) / 2;
            return <div style={{
              position: "absolute",
              left: hLeft + hOffset + 5 + 2.5 - 10 - 5,
              top: midY - BEAM / 2,
              width: hTrimmed - 10 - 5 + 20 + 10,
              height: BEAM,
              backgroundColor: crossColor,
              borderRadius: 4,
              zIndex: 1,
              pointerEvents: "none",
              opacity: showCross ? 1 : 0,
              transition: "opacity 0.8s ease",
            }} />;
          })()}

          {/* SVG Arrows */}
          <svg
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            width={W} height={H}
            viewBox={`0 0 ${W} ${H}`}
          >
            <g style={{ opacity: 1, transition: "opacity 0.5s ease" }}>
              {/* Arrow 1: Mercy → Justified DOWN */}
              <g style={arrowOpacity(1)}>
                <line x1={rightCx} y1={topBot} x2={rightCx} y2={botTop - HEAD - 1} stroke={ARR} strokeWidth={SW} />
                <polygon points={`${rightCx},${botTop} ${rightCx - HEAD * 0.55},${botTop - HEAD} ${rightCx + HEAD * 0.55},${botTop - HEAD}`} fill={ARR} />
              </g>

              {/* Arrow 2: Justified → Righteous LEFT */}
              <g style={arrowOpacity(2)}>
                <line x1={rightL} y1={botArrowY} x2={leftR + HEAD + 1} y2={botArrowY} stroke={ARR} strokeWidth={SW} />
                <polygon points={`${leftR},${botArrowY} ${leftR + HEAD},${botArrowY - HEAD * 0.55} ${leftR + HEAD},${botArrowY + HEAD * 0.55}`} fill={ARR} />
              </g>

              {/* Arrow 3: Righteous → Grace UP */}
              <g style={arrowOpacity(3)}>
                <line x1={leftCx} y1={botTop} x2={leftCx} y2={topBot + HEAD + 1} stroke={ARR} strokeWidth={SW} />
                <polygon points={`${leftCx},${topBot} ${leftCx - HEAD * 0.55},${topBot + HEAD} ${leftCx + HEAD * 0.55},${topBot + HEAD}`} fill={ARR} />
              </g>

              {/* Arrow 4: Grace → Mercy RIGHT (cycle complete) */}
              <g style={arrowOpacity(3)}>
                <line x1={leftR} y1={topArrowY} x2={rightL - HEAD - 1} y2={topArrowY} stroke={ARR} strokeWidth={SW} />
                <polygon points={`${rightL},${topArrowY} ${rightL - HEAD},${topArrowY - HEAD * 0.55} ${rightL - HEAD},${topArrowY + HEAD * 0.55}`} fill={ARR} />
              </g>
            </g>
          </svg>

          {/* Top Left — Grace (index 3) */}
          <div
            onClick={() => isActive(3) && setStep(3)}
            style={{ ...boxStyle(3), top: 0, left: 0, height: BOX_H_TOP }}
          >
            <div style={{ fontSize: "19px", fontWeight: "700", color: isActive(3) ? stops[3].color : greyText, marginBottom: "4px" }}>Grace</div>
            <div style={{ fontSize: "13px", lineHeight: "1.4", color: isActive(3) ? "#3D3426" : greyText, padding: "0 6px" }}>
              getting a<br /><span style={{ fontSize: "16px", fontWeight: "800", color: isActive(3) ? "#2C2416" : greyText }}>GIFT</span><br />you don't deserve
            </div>
          </div>

          {/* Top Right — Mercy (index 0) */}
          <div
            onClick={() => isActive(0) && setStep(0)}
            style={{ ...boxStyle(0), top: 0, left: BOX + GAP, height: BOX_H_TOP }}
          >
            <div style={{ fontSize: "19px", fontWeight: "700", color: isActive(0) ? stops[0].color : greyText, marginBottom: "4px" }}>Mercy</div>
            <div style={{ fontSize: "13px", lineHeight: "1.4", color: isActive(0) ? "#3D3426" : greyText, padding: "0 4px" }}>
              not getting the<br /><span style={{ fontSize: "15px", fontWeight: "800", color: isActive(0) ? "#2C2416" : greyText }}>PUNISHMENT</span><br />you do deserve
            </div>
          </div>

          {/* Bottom Right — Justified (index 1) */}
          <div
            onClick={() => isActive(1) && setStep(1)}
            style={{ ...boxStyle(1), top: botTop, left: BOX + GAP, height: BOX_H_BOT }}
          >
            <div style={{ fontSize: "19px", fontWeight: "700", color: isActive(1) ? stops[1].color : greyText, marginBottom: "4px" }}>Justified</div>
            <div style={{ fontSize: "13px", lineHeight: "1.4", color: isActive(1) ? "#3D3426" : greyText }}>
              your punishment<br />has been<br /><span style={{ fontSize: "16px", fontWeight: "800", color: isActive(1) ? "#2C2416" : greyText }}>PAID</span>
            </div>
          </div>

          {/* Bottom Left — Righteous (index 2) */}
          <div
            onClick={() => isActive(2) && setStep(2)}
            style={{ ...boxStyle(2), top: botTop, left: 0, height: BOX_H_BOT }}
          >
            <div style={{ fontSize: "19px", fontWeight: "700", color: isActive(2) ? stops[2].color : greyText, marginBottom: "4px" }}>Righteous</div>
            <div style={{ fontSize: "13px", lineHeight: "1.4", color: isActive(2) ? "#3D3426" : greyText }}>
              you are<br />seen as<br /><span style={{ fontSize: "16px", fontWeight: "800", color: isActive(2) ? "#2C2416" : greyText }}>PERFECT</span>
            </div>
          </div>

          {/* Step 0 intro overlay */}
          {showIntro && (
            <div style={{
              position: "absolute",
              top: 0, left: 0,
              width: W, height: H,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "20px",
              pointerEvents: "none",
            }}>
              <div>
                <p style={{
                  fontSize: "22px",
                  lineHeight: "1.5",
                  color: "#2C2416",
                  fontFamily: "'Georgia', 'Cambria', serif",
                  fontStyle: "italic",
                  margin: "0 0 8px 0",
                  fontWeight: "400",
                  textShadow: "0 1px 4px rgba(250,248,243,0.9)",
                }}>"For it is by grace you have been saved, through faith."</p>
                <p style={{
                  fontSize: "13px",
                  color: "#9B917F",
                  fontFamily: "'Trebuchet MS', sans-serif",
                  fontWeight: "600",
                  margin: 0,
                }}>Ephesians 2:8</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verse Card */}
      {!showIntro && (
      <div style={{ maxWidth: "640px", margin: "14px auto 0", padding: "0 16px 28px" }}>
        <div
          key={step}
          style={{
            background: "#FFFFFF", borderRadius: "12px", overflow: "hidden",
            boxShadow: "0 2px 14px rgba(44,36,22,0.06)",
            border: `1px solid ${current.borderColor}33`,
            animation: "fadeSlide 0.35s ease",
          }}
        >
          <div style={{ height: "4px", background: current.color }} />

          <div style={{ padding: "16px 20px 18px" }}>
            <h2 style={{
              fontSize: "17px", fontWeight: "400", color: "#5A4E3C",
              margin: "0 0 10px 0", lineHeight: "1.2",
              fontFamily: "'Georgia', 'Cambria', serif",
            }}>
              {current.id === "cross" ? (
                <>Give <span style={{ fontWeight: "700", color: "#9B7B2F" }}>Grace</span>, Show <span style={{ fontWeight: "700", color: "#5B8A72" }}>Mercy</span>, & <span style={{ fontWeight: "700", color: "#8B4A5E" }}>Forgive</span></>
              ) : (
                <>{current.cardTitle}<span style={{ fontWeight: "700", color: current.color }}>{current.cardTitleBold}</span>{current.cardTitleAfter || ""}</>
              )}
            </h2>

            <p style={{
              fontSize: "14px", lineHeight: "1.65", color: "#3D3426",
              margin: "0 0 8px 0", fontStyle: "normal",
            }}>
              <VerseText stopId={current.id} />
            </p>
            <p style={{
              fontSize: "11px", color: "#9B917F",
              margin: 0, fontWeight: "600",
              fontFamily: "'Trebuchet MS', sans-serif",
            }}>{current.ref}</p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: "12px", padding: "0 2px",
        }}>
          <button
            onClick={() => setStep(Math.max(-1, step - 1))}
            disabled={step === -1}
            style={{
              background: "transparent", border: "1.5px solid #D4CFC4",
              borderRadius: "10px", padding: "8px 14px", fontSize: "12px",
              fontFamily: "'Trebuchet MS', sans-serif",
              color: step === -1 ? "#CCC5B8" : "#5A4E3C",
              cursor: step === -1 ? "default" : "pointer", fontWeight: "600",
            }}
          >← Back</button>

          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {stops.map((s, i) => (
              <div
                key={i}
                onClick={() => isActive(i) && setStep(i)}
                style={{
                  width: step === i ? "20px" : "8px",
                  height: "8px", borderRadius: "4px",
                  background: step === i ? stops[i].color : isActive(i) ? stops[i].color + "66" : "#D4CFC4",
                  cursor: isActive(i) ? "pointer" : "default",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => step === stops.length - 1 ? setStep(0) : setStep(Math.min(stops.length - 1, step + 1))}
            style={{
              background: showIntro ? "#2C2416" : current.color,
              border: `1.5px solid ${showIntro ? "#2C2416" : current.color}`,
              borderRadius: "10px", padding: "8px 14px", fontSize: "12px",
              fontFamily: "'Trebuchet MS', sans-serif",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: `0 2px 8px ${showIntro ? "#2C2416" : current.color}33`,
            }}
          >{step === stops.length - 1 ? "↻ Restart" : "Next →"}</button>
        </div>
      </div>
      )}

      {/* Intro Begin button */}
      {showIntro && (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 16px 28px" }}>
          <button
            onClick={() => setStep(0)}
            style={{
              background: "#2C2416",
              border: "1.5px solid #2C2416",
              borderRadius: "10px", padding: "10px 28px", fontSize: "14px",
              fontFamily: "'Trebuchet MS', sans-serif",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(44,36,22,0.2)",
            }}
          >Begin →</button>
        </div>
      )}

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
