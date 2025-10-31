import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Puzzle tipo "Simon dice" - repetir secuencia de colores
const ColorSequencePuzzle = ({ onComplete }: { onComplete: () => void }) => {
  // Colores disponibles con sus nombres en HSL
  const colors = [
    { id: 1, name: "Azul", color: "hsl(217, 91%, 60%)" },
    { id: 2, name: "Verde", color: "hsl(160, 84%, 39%)" },
    { id: 3, name: "Naranja", color: "hsl(25, 95%, 53%)" },
    { id: 4, name: "Rosa", color: "hsl(330, 81%, 60%)" },
  ];

  // Secuencia que el jugador debe repetir
  const [sequence, setSequence] = useState<number[]>([]);
  
  // Secuencia que el jugador ha clickeado hasta ahora
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  
  // Si está mostrando la secuencia (bloqueado para clicks)
  const [isShowing, setIsShowing] = useState(false);
  
  // Color que está "iluminado" actualmente
  const [activeColor, setActiveColor] = useState<number | null>(null);

  // Generar secuencia inicial al montar el componente
  useEffect(() => {
    generateSequence();
  }, []);

  // Generar una secuencia aleatoria de 4 colores
  const generateSequence = () => {
    const newSequence = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 4) + 1
    );
    setSequence(newSequence);
    setTimeout(() => showSequence(newSequence), 500);
  };

  // Mostrar la secuencia al jugador (iluminando cada color)
  const showSequence = async (seq: number[]) => {
    setIsShowing(true);
    setPlayerSequence([]);

    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActiveColor(seq[i]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setActiveColor(null);
    }

    setIsShowing(false);
  };

  // Manejar click en un color
  const handleColorClick = (colorId: number) => {
    if (isShowing) return; // No permitir clicks mientras muestra la secuencia

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Efecto visual de click
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 200);

    // Verificar si el click es correcto
    const currentIndex = playerSequence.length;
    if (sequence[currentIndex] !== colorId) {
      // Error - reiniciar
      toast.error("¡Incorrecto! Intenta de nuevo");
      setTimeout(() => generateSequence(), 1000);
      return;
    }

    // Si completó toda la secuencia correctamente
    if (newPlayerSequence.length === sequence.length) {
      toast.success("¡Perfecto! Secuencia completada 🎉");
      setTimeout(() => onComplete(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="text-center">
        <p className="text-lg text-foreground mb-2">
          {isShowing
            ? "🧠 Memoriza la secuencia..."
            : "🎯 Repite la secuencia haciendo click"}
        </p>
        <p className="text-sm text-muted-foreground">
          Progreso: {playerSequence.length} / {sequence.length}
        </p>
      </div>

      {/* Grid de colores */}
      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            disabled={isShowing}
            className="aspect-square rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: color.color,
              opacity: activeColor === color.id ? 1 : isShowing ? 0.5 : 0.8,
              transform:
                activeColor === color.id ? "scale(0.95)" : "scale(1)",
              boxShadow:
                activeColor === color.id
                  ? `0 0 30px ${color.color}`
                  : undefined,
            }}
          >
            <span className="text-white font-bold text-xl drop-shadow-lg">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSequencePuzzle;
