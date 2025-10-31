import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Puzzle de código de colores - descifrar la combinación correcta
const ColorCodePuzzle = ({ onComplete }: { onComplete: () => void }) => {
  // Colores disponibles
  const availableColors = [
    { id: "red", name: "Rojo", color: "hsl(0, 84%, 60%)" },
    { id: "blue", name: "Azul", color: "hsl(217, 91%, 60%)" },
    { id: "green", name: "Verde", color: "hsl(160, 84%, 39%)" },
    { id: "yellow", name: "Amarillo", color: "hsl(45, 93%, 58%)" },
    { id: "purple", name: "Morado", color: "hsl(270, 70%, 65%)" },
    { id: "orange", name: "Naranja", color: "hsl(25, 95%, 53%)" },
  ];

  // Código secreto (4 colores)
  const [secretCode] = useState(() => {
    const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).map((c) => c.id);
  });

  // Intentos del jugador
  const [attempts, setAttempts] = useState<string[][]>([]);
  
  // Intento actual
  const [currentAttempt, setCurrentAttempt] = useState<string[]>([]);

  // Agregar color al intento actual
  const addColor = (colorId: string) => {
    if (currentAttempt.length < 4) {
      setCurrentAttempt([...currentAttempt, colorId]);
    }
  };

  // Quitar último color del intento actual
  const removeLastColor = () => {
    setCurrentAttempt(currentAttempt.slice(0, -1));
  };

  // Verificar el código
  const checkCode = () => {
    if (currentAttempt.length !== 4) {
      toast.error("Debes seleccionar 4 colores");
      return;
    }

    // Contar coincidencias exactas (posición y color correctos)
    let exactMatches = 0;
    let colorMatches = 0;

    const secretCopy = [...secretCode];
    const attemptCopy = [...currentAttempt];

    // Primera pasada: coincidencias exactas
    for (let i = 0; i < 4; i++) {
      if (attemptCopy[i] === secretCopy[i]) {
        exactMatches++;
        secretCopy[i] = "used";
        attemptCopy[i] = "used";
      }
    }

    // Segunda pasada: colores correctos en posición incorrecta
    for (let i = 0; i < 4; i++) {
      if (attemptCopy[i] !== "used") {
        const index = secretCopy.indexOf(attemptCopy[i]);
        if (index !== -1) {
          colorMatches++;
          secretCopy[index] = "used";
        }
      }
    }

    // Guardar intento
    setAttempts([...attempts, currentAttempt]);
    setCurrentAttempt([]);

    // Verificar si ganó
    if (exactMatches === 4) {
      toast.success("¡Código descifrado! 🎉");
      setTimeout(() => onComplete(), 1000);
    } else {
      const feedback = `${exactMatches} exacto${exactMatches !== 1 ? "s" : ""}, ${colorMatches} color${colorMatches !== 1 ? "es" : ""} correcto${colorMatches !== 1 ? "s" : ""}`;
      toast.info(feedback, { duration: 3000 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="text-center">
        <p className="text-lg text-foreground mb-2">
          🔐 Descifra el código secreto de 4 colores
        </p>
        <p className="text-sm text-muted-foreground">
          Selecciona 4 colores y verifica tu intento
        </p>
      </div>

      {/* Intentos anteriores */}
      {attempts.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">
            Intentos anteriores:
          </p>
          {attempts.map((attempt, i) => (
            <div key={i} className="flex gap-2">
              {attempt.map((colorId, j) => {
                const color = availableColors.find((c) => c.id === colorId);
                return (
                  <div
                    key={j}
                    className="w-10 h-10 rounded-lg shadow-md"
                    style={{ backgroundColor: color?.color }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Intento actual */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground">
          Tu intento:
        </p>
        <div className="flex gap-2 justify-center mb-4">
          {[0, 1, 2, 3].map((i) => {
            const colorId = currentAttempt[i];
            const color = availableColors.find((c) => c.id === colorId);
            return (
              <div
                key={i}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-border shadow-inner flex items-center justify-center"
                style={{
                  backgroundColor: color?.color || "transparent",
                }}
              >
                {!color && (
                  <span className="text-muted-foreground text-2xl">?</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={removeLastColor}
            disabled={currentAttempt.length === 0}
            variant="outline"
            size="sm"
          >
            ⬅️ Borrar
          </Button>
          <Button
            onClick={checkCode}
            disabled={currentAttempt.length !== 4}
            className="bg-primary text-white"
            size="sm"
          >
            ✓ Verificar
          </Button>
        </div>
      </div>

      {/* Selector de colores */}
      <div className="grid grid-cols-3 gap-3">
        {availableColors.map((color) => (
          <button
            key={color.id}
            onClick={() => addColor(color.id)}
            disabled={currentAttempt.length >= 4}
            className="p-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:opacity-50"
            style={{ backgroundColor: color.color }}
          >
            <span className="text-white font-semibold text-sm drop-shadow-lg">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorCodePuzzle;
