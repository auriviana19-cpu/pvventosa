import { useEffect, useState } from "react";
import { ShoppingBag, Eye, Award } from "lucide-react";

interface NotificationItem {
  message: string;
  time: string;
  type: "purchase" | "view" | "guarantee";
}

const NOTIFICATIONS: NotificationItem[] = [
  { message: "Isabel S. (Lisboa) escolheu os seus protocolos", time: "neste momento", type: "purchase" },
  { message: "Jean-Pierre D. (Genebra) acabou de descarregar a Aliança Aromática", time: "há 3 min", type: "purchase" },
  { message: "4 terapeutas na Bélgica estão a ler a ficha de Ciatalgia", time: "atualmente", type: "view" },
  { message: "Ana R. (Porto) ativou o acesso ao Gabinete Pronto a Usar", time: "há 10 min", type: "purchase" },
  { message: "Margarida F. (Lausanne) juntou-se ao programa de lançamento", time: "há 14 min", type: "purchase" },
  { message: "Garantia de 15 dias 'Satisfeito ou Reembolsado' ativa", time: "Atualizado hoje", type: "guarantee" },
  { message: "Sofia G. (Bruxelas) acabou de encomendar por apenas 27€", time: "agora mesmo", type: "purchase" }
];

export default function SocialNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the first notification after 6 seconds
    const startTimer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    // Rotate notification every 15 seconds
    const rotationInterval = setInterval(() => {
      setIsVisible(false);
      
      // Delay to allow slide down animation
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
        setIsVisible(true);
      }, 500);

    }, 15000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(rotationInterval);
    };
  }, []);

  if (!isVisible) return null;

  const current = NOTIFICATIONS[currentIndex];

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-[#C4A97D]/50 transition-all duration-500 ease-out transform translate-y-0 opacity-100 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[#6B4E35]/10 flex items-center justify-center text-[#6B4E35] shrink-0">
        {current.type === "purchase" && <ShoppingBag size={16} />}
        {current.type === "view" && <Eye size={16} />}
        {current.type === "guarantee" && <Award size={16} />}
      </div>
      <div className="text-left">
        <p className="text-xs font-semibold text-[#2C2A27] leading-snug">{current.message}</p>
        <span className="text-[10px] font-mono text-[#A0785A]/80">{current.time}</span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="text-[#2C2A27]/40 hover:text-[#2C2A27] text-xs shrink-0 self-start ml-2 cursor-pointer"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
}
