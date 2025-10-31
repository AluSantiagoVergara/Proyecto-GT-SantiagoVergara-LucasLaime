import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Puzzle de ordenamiento - ordenar elementos de menor a mayor
const SortingPuzzle = ({ onComplete }: { onComplete: () => void }) => {
  // Array de números desordenados
  const [numbers, setNumbers] = useState(() => {
    const nums = [1, 2, 3, 4, 5, 6];
    return nums.sort(() => Math.random() - 0.5);
  });

  // Posición actualmente seleccionada para intercambiar
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Verificar si está ordenado
  const isOrdered = numbers.every((num, i) => num === i + 1);

  // Manejar click en un número
  const handleNumberClick = (index: number) => {
    if (selectedIndex === null) {
      // Primera selección
      setSelectedIndex(index);
      toast.info("Ahora selecciona otro número para intercambiar", {
        duration: 2000,
      });
    } else if (selectedIndex === index) {
      // Click en el mismo número - deseleccionar
      setSelectedIndex(null);
      toast.info("Selección cancelada");
    } else {
      // Segunda selección - intercambiar
      const newNumbers = [...numbers];
      [newNumbers[selectedIndex], newNumbers[index]] = [
        newNumbers[index],
        newNumbers[selectedIndex],
      ];
      setNumbers(newNumbers);
      setSelectedIndex(null);

      // Verificar si está ordenado
      const ordered = newNumbers.every((num, i) => num === i + 1);
      if (ordered) {
        toast.success("¡Perfecto! Ordenamiento completado 🎯");
        setTimeout(() => onComplete(), 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="text-center">
        <p className="text-lg text-foreground mb-2">
          🔄 Ordena los números de menor a mayor
        </p>
        <p className="text-sm text-muted-foreground">
          Haz click en dos números para intercambiarlos
        </p>
      </div>

      {/* Números */}
      <div className="flex gap-3 justify-center flex-wrap">
        {numbers.map((num, index) => (
          <button
            key={index}
            onClick={() => handleNumberClick(index)}
            className={`
              w-20 h-20 rounded-xl text-3xl font-bold transition-all duration-300 transform
              ${
                selectedIndex === index
                  ? "bg-primary text-white scale-110 shadow-xl animate-pulse-glow"
                  : "bg-card text-foreground hover:bg-accent hover:scale-105 shadow-lg"
              }
            `}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Referencia visual */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-2">
          Orden correcto:
        </p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-sm font-semibold text-muted-foreground"
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortingPuzzle;
