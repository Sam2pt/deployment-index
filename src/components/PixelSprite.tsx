"use client";

// Renders a pixel-art map (array of equal-length strings) as a static grid of
// coloured cells. Tinted per call via `accent`/`dark`. Static DOM, cheap to
// paint. `idle` adds a gentle 2-step bob so the character feels alive (a
// transform on a single element — compositor-cheap).
export default function PixelSprite({
  map,
  accent,
  dark,
  px = 6,
  idle = false,
  className = "",
}: {
  map: string[];
  accent: string;
  dark: string;
  px?: number;
  idle?: boolean;
  className?: string;
}) {
  const cols = map[0]?.length ?? 0;
  const rows = map.length;
  const colorFor = (ch: string): string => {
    switch (ch) {
      case "K":
        return "#07070e";
      case "A":
        return accent;
      case "D":
        return dark;
      case "S":
        return "#f2c9a0";
      case "s":
        return "#d2a279";
      case "E":
        return "#15131f";
      case "M":
        return "#5a3220";
      case "V":
        return "#05050c";
      case "W":
        return "#ffffff";
      case "R":
        return "#ff3b3b";
      case "G":
        return "#7cf59e";
      default:
        return "transparent";
    }
  };

  return (
    <div
      className={`${idle ? "idle" : ""} ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${px}px)`,
        gridTemplateRows: `repeat(${rows}, ${px}px)`,
        width: cols * px,
        height: rows * px,
        imageRendering: "pixelated",
        filter: "drop-shadow(0 3px 0 rgba(0,0,0,0.45))",
      }}
    >
      {map.flatMap((row, y) =>
        row.split("").map((ch, x) => (
          <span
            key={`${x}-${y}`}
            style={{ background: colorFor(ch), width: px, height: px }}
          />
        )),
      )}
    </div>
  );
}
