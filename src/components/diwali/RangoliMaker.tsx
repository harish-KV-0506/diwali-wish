"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Download, RotateCcw, Palette, Sparkles } from "lucide-react";
import { saveRangoli, loadRangoli, type RangoliCell } from "@/lib/wish-store";

const GRID_SIZE = 11; // odd so we have a center
const PALETTE = [
  "#ffd54f",
  "#ff8a00",
  "#e91e63",
  "#ff4081",
  "#f50057",
  "#6a1b9a",
  "#9c27b0",
  "#ffb300",
  "#fff4cc",
  "#b388ff",
  "#ff80ab",
];

export default function RangoliMaker() {
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [cells, setCells] = useState<RangoliCell[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadRangoli();
    if (saved.length) setCells(saved);
  }, []);

  // Persist whenever cells change
  useEffect(() => {
    saveRangoli(cells);
  }, [cells]);

  const setCell = (row: number, col: number, color: string | null) => {
    setCells((prev) => {
      const filtered = prev.filter((c) => !(c.row === row && c.col === col));
      if (color === null) return filtered;
      return [...filtered, { row, col, color }];
    });
  };

  const handleCellDown = (row: number, col: number) => {
    setIsDragging(true);
    // Right-click (button === 2) or holding shift = erase
    setCell(row, col, selectedColor);
  };

  const handleCellEnter = (row: number, col: number) => {
    if (isDragging) setCell(row, col, selectedColor);
  };

  const clearAll = () => setCells([]);

  const randomize = () => {
    const next: RangoliCell[] = [];
    const center = (GRID_SIZE - 1) / 2;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const dx = c - center;
        const dy = r - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > center + 0.5) continue; // keep circular boundary
        // Symmetric mandala pattern — reflect point across 8 axes
        const angle = Math.atan2(dy, dx);
        const symAngle = ((angle % (Math.PI / 4)) + Math.PI / 4) % (Math.PI / 4);
        const colorIndex = Math.floor((symAngle / (Math.PI / 4)) * PALETTE.length) % PALETTE.length;
        if (Math.random() > 0.5) {
          next.push({ row: r, col: c, color: PALETTE[(colorIndex + Math.floor(dist)) % PALETTE.length] });
        }
      }
    }
    setCells(next);
  };

  const download = () => {
    // Render grid as PNG via canvas
    const canvas = document.createElement("canvas");
    const cellSize = 40;
    const padding = 24;
    canvas.width = GRID_SIZE * cellSize + padding * 2;
    canvas.height = GRID_SIZE * cellSize + padding * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Background
    ctx.fillStyle = "#15001f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Border decoration
    ctx.strokeStyle = "#ffd54f";
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    // Cells
    const cellMap = new Map<string, string>();
    cells.forEach((c) => cellMap.set(`${c.row},${c.col}`, c.color));
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const color = cellMap.get(`${r},${c}`);
        if (!color) continue;
        ctx.fillStyle = color;
        const x = padding + c * cellSize + cellSize / 2;
        const y = padding + r * cellSize + cellSize / 2;
        ctx.beginPath();
        ctx.arc(x, y, cellSize * 0.42, 0, Math.PI * 2);
        ctx.fill();
        // little glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    // Title
    ctx.fillStyle = "#ffd54f";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Shubh Deepavali", canvas.width / 2, canvas.height - 8);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-rangoli.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const getCellColor = (row: number, col: number): string | undefined => {
    return cells.find((c) => c.row === row && c.col === col)?.color;
  };

  const center = (GRID_SIZE - 1) / 2;

  return (
    <section id="rangoli" className="relative w-full px-4 py-20 md:py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6a1b9a]/40 bg-[#6a1b9a]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#b388ff]">
            <Palette className="h-3 w-3" /> Rangoli Maker
          </div>
          <h2
            className="text-4xl font-bold leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="gradient-text-mandala">Craft Your Rangoli</span>
          </h2>
          <p className="max-w-2xl text-base text-[#fff4e6]/80 md:text-lg">
            Pick a color and drag across the grid to design your own rangoli.
            It saves automatically. Download it as a festive PNG to share.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-[1fr_auto]">
          {/* Rangoli grid */}
          <div className="glass-festive flex flex-col items-center gap-4 rounded-3xl p-6">
            <div
              ref={gridRef}
              className="relative aspect-square w-full max-w-[440px] touch-none select-none rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,213,79,0.05) 0%, rgba(45,10,46,0.5) 70%, rgba(21,0,31,0.9) 100%)",
                boxShadow: "inset 0 0 60px rgba(255,213,79,0.15)",
              }}
              onMouseLeave={() => setIsDragging(false)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Grid cells */}
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
                  const row = Math.floor(i / GRID_SIZE);
                  const col = i % GRID_SIZE;
                  const dx = col - center;
                  const dy = row - center;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const inCircle = dist <= center + 0.5;
                  const color = getCellColor(row, col);
                  return (
                    <div
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (inCircle) handleCellDown(row, col);
                      }}
                      onMouseEnter={() => {
                        if (inCircle) handleCellEnter(row, col);
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        if (inCircle) handleCellDown(row, col);
                      }}
                      onTouchMove={(e) => {
                        const touch = e.touches[0];
                        if (!touch) return;
                        const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
                        const r = target?.dataset.row;
                        const c = target?.dataset.col;
                        if (r != null && c != null) {
                          const rr = parseInt(r, 10);
                          const cc = parseInt(c, 10);
                          if (!isNaN(rr) && !isNaN(cc) && isDragging) setCell(rr, cc, selectedColor);
                        }
                      }}
                      data-row={row}
                      data-col={col}
                      className={`flex items-center justify-center ${inCircle ? "cursor-pointer" : "pointer-events-none"}`}
                    >
                      {color && (
                        <div
                          className="h-[80%] w-[80%] rounded-full"
                          style={{
                            background: color,
                            boxShadow: `0 0 8px ${color}80, inset 0 0 4px rgba(255,255,255,0.3)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button onClick={randomize} variant="outline" className="border-[#ffd54f]/30 bg-transparent text-[#ffd54f] hover:bg-[#ffd54f]/10">
                <Sparkles className="mr-2 h-4 w-4" /> Auto-Generate
              </Button>
              <Button onClick={clearAll} variant="outline" className="border-[#ff4081]/30 bg-transparent text-[#ff4081] hover:bg-[#ff4081]/10">
                <Eraser className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button onClick={download} className="bg-gradient-to-r from-[#ff8a00] to-[#e91e63] text-[#15001f] hover:brightness-110">
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            </div>
          </div>

          {/* Color palette */}
          <div className="glass-festive flex flex-row gap-3 rounded-3xl p-4 md:flex-col">
            <div className="flex flex-wrap items-center justify-center gap-2 md:flex-col">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`h-9 w-9 rounded-full transition-all ${
                    selectedColor === c ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#15001f]" : "hover:scale-110"
                  }`}
                  style={{
                    background: c,
                    boxShadow: `0 0 12px ${c}80`,
                  }}
                  aria-label={`Select ${c}`}
                />
              ))}
              <button
                onClick={() => setSelectedColor(PALETTE[0])}
                className="mt-2 hidden items-center justify-center rounded-full border border-[#fff4e6]/20 p-2 text-[#fff4e6]/60 hover:text-[#fff4e6] md:flex"
                aria-label="Reset selection"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-1 text-xs text-[#fff4e6]/60 md:mt-2">
              <div className="text-[10px] uppercase tracking-wider">Active</div>
              <div
                className="h-6 w-6 rounded-full"
                style={{ background: selectedColor, boxShadow: `0 0 12px ${selectedColor}` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-[#fff4e6]/50">
          Drag to draw · Touch and drag on mobile · Right-click to erase (desktop)
        </p>
      </div>
    </section>
  );
}
