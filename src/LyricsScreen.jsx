import React, { useEffect, useRef } from "react";

// ============================================================
//  LyricsScreen
//  Full-screen overlay showing all stanzas of a song, with
//  the quote's source stanza highlighted and scrolled into view.
//
//  Props:
//    entry        — lyrics object from LYRICS (title, version,
//                   childNumber or collectionLabel, stanzas[])
//    stanzaIndex  — index of the stanza to highlight
//    onClose      — fn() called when the overlay is dismissed
// ============================================================
export default function LyricsScreen({ entry, stanzaIndex, onClose }) {
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, []);

  // childNumber for Child Ballads; collectionLabel for all other collections
  const metaLabel = entry.childNumber || entry.collectionLabel || "";

  return (
    <div className="lyrics-overlay">
      <button className="lyrics-close" onClick={onClose}>X</button>
      <div className="lyrics-title-block">
        <div className="lyrics-title">{entry.title}</div>
        <div className="lyrics-meta">
          {metaLabel && <>{metaLabel} · </>}{entry.version}
        </div>
      </div>
      <div className="lyrics-rule">
        <div className="rule-line" />
        <div className="rule-diamond" />
        <div className="rule-line" />
      </div>
      <div className="lyrics-body">
        {entry.stanzas.map((stanza, i) => {
          const isHighlight = i === stanzaIndex;
          return (
            <p
              key={i}
              ref={isHighlight ? highlightRef : null}
              className={isHighlight ? "lyrics-stanza lyrics-stanza--highlight" : "lyrics-stanza"}
            >
              {stanza.split("\n").map((line, j) => (
                <span key={j}>
                  {line}
                  {j < stanza.split("\n").length - 1 && <br />}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}
