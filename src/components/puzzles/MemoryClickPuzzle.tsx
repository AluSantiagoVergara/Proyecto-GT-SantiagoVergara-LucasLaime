import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Puzzle de memoria - recordar qué posiciones fueron mostradas
const MemoryClickPuzzle = ({ onComplete }: { onComplete: () => void }) => {
  // Grid 4x4 = 16 posiciones
  const gridSize = 16;

  // Posiciones objetivo que deben ser clickeadas
  const [targetPositions, setTargetPositions] = useState<number[]>([]);
  
  // Posiciones que el jugador ha clickeado
  const [clickedPositions, setClickedPositions] = useState<number[]>([]);
  
  // Si está mostrando las posiciones objetivo
  const [isShowing, setIsShowing] = useState(false);
  
  // Si ya terminó de mostrar y el jugador puede clickear
  const [canClick, setCanClick] = useState(false);

  // Generar posiciones objetivo aleatorias al montar
  useEffect(() => {
    generateTargets();
  }, []);

  // Generar 5 posiciones aleatorias
  const generateTargets = () => {
    const positions: number[] = [];
    while (positions.length < 5) {
      const pos = Math.floor(Math.random() * gridSize);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    setTargetPositions(positions);
    setTimeout(() => showTargets(positions), 500);
  };

  // Mostrar las posiciones objetivo por 2 segundos
  const showTargets = async (positions: number[]) => {
    setIsShowing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsShowing(false);
    setCanClick(true);
  };

  // Manejar click en una celda
  const handleCellClick = (position: number) => {
    if (!canClick || clickedPositions.includes(position)) return;

    const newClicked = [...clickedPositions, position];
    setClickedPositions(newClicked);

    // Verificar si la posición es correcta
    if (!targetPositions.includes(position)) {
      toast.error("¡Esa no era! Intenta de nuevo");
      setTimeout(() => {
        setClickedPositions([]);
        setCanClick(false);
        generateTargets();
      }, 1000);
      return;
    }

    // Verificar si completó todas las posiciones
    if (newClicked.length === targetPositions.length) {
      toast.success("¡Excelente memoria! 🧠");
      setTimeout(() => onComplete(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="text-center">
        <p className="text-lg text-foreground mb-2">
          {isShowing
            ? "👀 Memoriza las posiciones iluminadas..."
            : canClick
            ? "🖱️ Haz click en las posiciones que viste"
            : "⏳ Preparando..."}
        </p>
        <p className="text-sm text-muted-foreground">
          Encontradas: {clickedPositions.length} / {targetPositions.length}
        </p>
      </div>

      {/* Grid 4x4 */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {Array.from({ length: gridSize }, (_, i) => {
          const isTarget = targetPositions.includes(i);
          const isClicked = clickedPositions.includes(i);
          const shouldShow = isShowing && isTarget;

          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={!canClick || isClicked}
              className={`
                aspect-square rounded-lg transition-all duration-300 transform
                ${
                  shouldShow
                    ? "bg-primary shadow-lg scale-105 animate-pulse-glow"
                    : isClicked && isTarget
                    ? "bg-secondary shadow-lg"
                    : isClicked
                    ? "bg-destructive/20"
                    : "bg-card hover:bg-accent hover:scale-105 shadow-md"
                }
                disabled:cursor-not-allowed
              `}
            >
              {isClicked && (isTarget ? "✓" : "✗")}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MemoryClickPuzzle;
