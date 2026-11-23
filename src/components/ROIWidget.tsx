import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ROIWidget() {
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [pricePerSession, setPricePerSession] = useState(55);

  const weeklyRev = sessionsPerWeek * pricePerSession;
  const monthlyRev = weeklyRev * 4;
  const yearlyRev = monthlyRev * 12;

  // Investment is 27 euros
  const percentRecouped = Math.min(100, Math.round((sessionsPerWeek * pricePerSession / 27) * 100));
  const patientsNeeded = (27 / pricePerSession).toFixed(1);

  return (
    <div className="bg-[#E8DFD0] rounded-2xl p-6 md:p-8 border border-[#C4A97D] max-w-2xl mx-auto shadow-sm text-left">
      <div className="text-center mb-6">
        <span className="text-xs font-semibold tracking-widest text-[#A0785A] uppercase block">Calculadora de Rentabilidade</span>
        <h4 className="font-serif text-2xl md:text-3xl text-[#2C2A27] mt-1 font-medium">Quando é que recupera o seu investimento de 27€?</h4>
        <p className="text-xs md:text-sm text-[#2C2A27]/80 mt-2">Arraste os seletores abaixo para simular a atividade do seu próprio gabinete acadêmico.</p>
      </div>

      <div className="space-y-6">
        {/* Slider 1: Sessions per week */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm font-medium text-[#2C2A27]">Consultas por semana</span>
            <span className="font-mono text-xs md:text-sm font-bold text-[#A0785A] bg-[#F5F0E8] px-3 py-1 rounded-md border border-[#C4A97D]/40">
              {sessionsPerWeek} {sessionsPerWeek > 1 ? "consultas" : "consulta"}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="1"
            value={sessionsPerWeek}
            onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
            className="w-full h-2 bg-[#F5F0E8] rounded-lg appearance-none cursor-pointer accent-[#A0785A]"
          />
        </div>

        {/* Slider 2: Price per session */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm font-medium text-[#2C2A27]">Preço cobrado por consulta</span>
            <span className="font-mono text-xs md:text-sm font-bold text-[#A0785A] bg-[#F5F0E8] px-3 py-1 rounded-md border border-[#C4A97D]/40">
              {pricePerSession} €
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={pricePerSession}
            onChange={(e) => setPricePerSession(Number(e.target.value))}
            className="w-full h-2 bg-[#F5F0E8] rounded-lg appearance-none cursor-pointer accent-[#A0785A]"
          />
        </div>
      </div>

      <hr className="my-6 border-[#C4A97D]/40" />

      {/* ROI Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <div className="flex justify-between border-b border-[#C4A97D]/20 pb-2">
            <span className="text-xs md:text-sm text-[#2C2A27]/80">Faturação mensal estimada:</span>
            <span className="font-mono font-bold text-[#2C2A27]">{monthlyRev} €</span>
          </div>
          <div className="flex justify-between border-b border-[#C4A97D]/20 pb-2">
            <span className="text-xs md:text-sm text-[#2C2A27]/80">Faturação anual estimada:</span>
            <span className="font-mono font-bold text-[#2C2A27]">{yearlyRev} €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs md:text-sm text-[#2C2A27]/80 font-medium">Nº de pacientes para amortizar:</span>
            <span className="font-mono font-bold text-[#A0785A]">{patientsNeeded} paciente</span>
          </div>
        </div>

        <div className="bg-[#F5F0E8] p-4 rounded-xl border border-[#C4A97D] text-center space-y-2">
          <div className="text-[10px] text-[#2C2A27]/60 font-semibold tracking-wider uppercase">Velocidade de Retorno</div>
          <div className="text-2xl md:text-3xl font-serif font-semibold text-[#A0785A]">{percentRecouped >= 100 ? "Imediata" : `${percentRecouped}%`}</div>
          <p className="text-[11px] text-[#2C2A27]/80 px-2 leading-relaxed">
            {percentRecouped >= 100 
              ? `A sua primeira consulta paga ${pricePerSession}€, o que cobre com folga os 27€ investidos no pack!`
              : `Uma única sessão paga o custo total deste manual.`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#6B4E35] font-medium bg-[#6B4E35]/5 py-2 px-3 rounded-lg border border-[#A0785A]/10">
        <CheckCircle2 size={13} className="shrink-0" />
        <span>Gabinete de Sucesso: Rentabilizado logo na primeira hora de consulta da semana.</span>
      </div>
    </div>
  );
}
