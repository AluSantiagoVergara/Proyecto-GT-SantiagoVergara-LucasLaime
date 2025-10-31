import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Componente que muestra el mensaje de felicitación al completar todos los puzzles
const CompletionMessage = ({ totalTime }: { totalTime: number }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Formatear el tiempo (ejemplo: 65 segundos = "1m 5s")
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Activar confetti cuando se monta el componente
  useEffect(() => {
    setShowConfetti(true);
  }, []);

  // Recargar la página para jugar de nuevo
  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="relative w-full max-w-2xl animate-bounce-in">
      {/* Efecto confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                backgroundColor: [
                  "hsl(217, 91%, 60%)",
                  "hsl(160, 84%, 39%)",
                  "hsl(25, 95%, 53%)",
                  "hsl(330, 81%, 60%)",
                  "hsl(45, 93%, 58%)",
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Card principal */}
      <Card className="p-12 shadow-2xl border-0 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
        {/* Emoji de celebración */}
        <div className="text-8xl mb-6 animate-wiggle">🎉</div>

        {/* Título */}
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ¡Felicidades!
        </h1>

        {/* Mensaje de tiempo */}
        <p className="text-2xl text-foreground mb-4">
          Completaste el juego
        </p>
        <p className="text-xl text-muted-foreground mb-8">
          Solo te demoró:{" "}
          <span className="font-bold text-primary text-3xl">
            {formatTime(totalTime)}
          </span>
        </p>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-primary/10">
            <div className="text-3xl font-bold text-primary">5</div>
            <div className="text-sm text-muted-foreground">Puzzles</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/10">
            <div className="text-3xl font-bold text-secondary">100%</div>
            <div className="text-sm text-muted-foreground">Completado</div>
          </div>
          <div className="p-4 rounded-lg bg-accent/10">
            <div className="text-3xl font-bold text-accent">🏆</div>
            <div className="text-sm text-muted-foreground">¡Campeón!</div>
          </div>
        </div>

        {/* Botón para jugar de nuevo */}
        <Button
          onClick={handlePlayAgain}
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🔄 Jugar de Nuevo
        </Button>
      </Card>
    </div>
  );
};

export default CompletionMessage;
