import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Puzzle de patrón numérico - clickear números en orden correcto
const NumberPatternPuzzle = ({ onComplete }: { onComplete: () => void }) => {
  // Números del 1 al 9 en posiciones aleatorias
  const [numbers] = useState(() => {
    const nums = Array.from({ length: 9 }, (_, i) => i + 1);
    return nums.sort(() => Math.random() - 0.5);
  });

  // Números que el jugador ha clickeado
  const [clickedNumbers, setClickedNumbers] = useState<number[]>([]);

  // Siguiente número que debe clickear
  const nextNumber = clickedNumbers.length + 1;

  // Manejar click en un número
  const handleNumberClick = (num: number) => {
    // Verificar si es el número correcto
    if (num === nextNumber) {
      const newClicked = [...clickedNumbers, num];
      setClickedNumbers(newClicked);

      // Si completó todos los números
      if (newClicked.length === 9) {
        toast.success("¡Perfecto! Todos los números en orden 🎯");
        setTimeout(() => onComplete(), 1000);
      } else {
        toast.success(`¡Correcto! Ahora busca el ${nextNumber + 1}`, {
          duration: 1000,
        });
      }
    } else {
      toast.error(`¡No! Debes clickear el ${nextNumber}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="text-center">
        <p className="text-lg text-foreground mb-2">
          🔢 Haz click en los números del 1 al 9 en orden
        </p>
        <p className="text-sm text-muted-foreground">
          Siguiente número: <span className="font-bold text-primary text-xl">{nextNumber}</span>
        </p>
      </div>

      {/* Grid de números */}
      <div className="grid grid-cols-3 gap-3">
        {numbers.map((num) => {
          const isClicked = clickedNumbers.includes(num);
          const isNext = num === nextNumber;

          return (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={isClicked}
              className={`
                aspect-square rounded-xl text-3xl font-bold transition-all duration-300 transform
                ${
                  isClicked
                    ? "bg-secondary text-white scale-90 opacity-50"
                    : isNext
                    ? "bg-primary text-white shadow-lg hover:shadow-xl animate-pulse-glow hover:scale-110"
                    : "bg-card text-foreground hover:bg-accent hover:scale-105 shadow-md"
                }
                disabled:cursor-not-allowed
              `}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Progreso */}
      <div className="mt-4">
        <div className="flex gap-1 justify-center">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                i < clickedNumbers.length ? "bg-secondary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberPatternPuzzle;
