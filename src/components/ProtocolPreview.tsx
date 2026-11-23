import { useState } from "react";
import { Shield, Compass, Heart, Activity } from "lucide-react";

interface SampleProtocol {
  id: string;
  name: string;
  indication: string;
  vacuumType: string;
  cupCount: string;
  duration: string;
  cuppingStyle: string;
  placement: string[];
  clinicalTip: string;
  icon: any;
}

const PREVIEW_PROTOCOLS: SampleProtocol[] = [
  {
    id: "p1",
    name: "Ciatica e Descompressão Miofascial bruta",
    indication: "Dor irradiada ao longo do nervo ciático, bloqueio lombar L4-S5.",
    vacuumType: "Médio a Forte (Aspiração calibrada)",
    cupCount: "6 a 8 ventosas",
    duration: "12 - 15 minutos",
    cuppingStyle: "Estática & Flash alternado",
    icon: Activity,
    placement: [
      "2 ventosas paravertebrais lombares (nível L4-L5) para descompressão da raiz",
      "1 ventosa no ponto gatilho (Trigger Point) do glúteo máximo (meio da nádega)",
      "2 ventosas ao longo do trajeto isquiotibial externo",
      "1 ventosa reflexa na fossa poplítea (aspiração muito suave)"
    ],
    clinicalTip: "Massagear sempre com óleo de amêndoas doces antes da aplicação estática para evitar tensões desnecessárias. Mobilize suavemente a perna se usar ventosa de silicone."
  },
  {
    id: "p2",
    name: "Apoio Detox Gástrico e Hepático (Zonas Reflexas)",
    indication: "Inchaço abdominal, digestão lenta, sensação de estômago pesado.",
    vacuumType: "Muito Suave (Aspiração leve)",
    cupCount: "4 ventosas",
    duration: "8 - 10 minutos",
    cuppingStyle: "Deslizamento superficial e drenagem",
    icon: Compass,
    placement: [
      "1 ventosa deslizada em espiral no sentido horário ao redor do umbigo",
      "2 ventosas fixas na área de associação reflexa do fígado (costas, nível T7-T9 à direita)",
      "1 ventosa reflexa no ponto do estômago (abaixo da grelha costal esquerda)"
    ],
    clinicalTip: "Adicione 2 gotas de Óleos Essenciais de Hortelã-Pimenta e de Estragão no seu óleo de base para acalmar espasmos musculares viscerais."
  },
  {
    id: "p3",
    name: "Libertação Psicossomática 'Plexo e Ansiedade'",
    indication: "Insónias recorrentes, sensação de falta de ar, aperto no peito.",
    vacuumType: "Médio (Harmonizante)",
    cupCount: "5 ventosas",
    duration: "10 minutos",
    cuppingStyle: "Estática nos pontos de acupuntura sagrados",
    icon: Heart,
    placement: [
      "1 ventosa central no ponto 17VC (Shanzhong - meio do esterno) *aspiração muito suave*",
      "2 pontos de tensão nos meridianos da Bexiga (pontos Shu do Coração T5 e do Pulmão T3 nas costas)",
      "2 ventosas na zona sagrada para acalmar o sistema nervoso vegetativo (parassimpático)"
    ],
    clinicalTip: "Complemente a aspiração com a difusão de Lavanda Verdadeira. Ondas de relaxamento parassimpático ativam-se após apenas 3 minutos."
  }
];

export default function ProtocolPreview() {
  const [activeTab, setActiveTab] = useState("p1");
  const protocol = PREVIEW_PROTOCOLS.find((p) => p.id === activeTab) || PREVIEW_PROTOCOLS[0];

  return (
    <div className="bg-[#F5F0E8] rounded-2xl p-6 md:p-8 border border-[#C4A97D] shadow-sm max-w-4xl mx-auto text-left">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#A0785A]">Amostra Exclusiva</span>
        <h4 className="font-serif text-2xl md:text-4xl text-[#2C2A27] mt-1 font-semibold">Os bastidores de um protocolo clínico real</h4>
        <p className="text-xs md:text-sm text-[#2C2A27]/80 mt-2 max-w-xl mx-auto">
          Descubra a estrutura anatómica exata, rigorosa e segura de cada ficha presente no nosso manual prático <strong>100 Protocolos</strong>.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-col sm:flex-row gap-2 border-b border-[#C4A97D]/30 pb-4 mb-6">
        {PREVIEW_PROTOCOLS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-medium transition-all text-left flex items-center gap-2.5 cursor-pointer ${
              activeTab === p.id
                ? "bg-[#6B4E35] text-white shadow-sm"
                : "bg-[#E8DFD0]/60 text-[#2C2A27] hover:bg-[#E8DFD0]"
            }`}
          >
            <p.icon size={16} className={activeTab === p.id ? "text-[#C4A97D]" : "text-[#A0785A]"} />
            <span className="truncate">{p.name.split(" e ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Detail card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Specification Column */}
        <div className="md:col-span-5 space-y-4 bg-[#E8DFD0] p-5 rounded-xl border border-[#C4A97D]/50">
          <h5 className="font-serif font-bold text-[#6B4E35] leading-tight text-lg">
            {protocol.name}
          </h5>
          <p className="text-xs text-[#2C2A27]/90 italic">
            <strong>Indicação clínica:</strong> {protocol.indication}
          </p>

          <div className="space-y-2 border-t border-[#C4A97D]/25 pt-3 font-mono text-xs text-[#2C2A27]">
            <div className="flex justify-between">
              <span className="text-opacity-70 text-[#2C2A27]">Tipo de aspiração:</span>
              <span className="font-bold text-[#A0785A]">{protocol.vacuumType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-opacity-70 text-[#2C2A27]">Número de ventosas:</span>
              <span className="font-bold">{protocol.cupCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-opacity-70 text-[#2C2A27]">Duração recomendada:</span>
              <span className="font-bold">{protocol.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-opacity-70 text-[#2C2A27]">Método chave:</span>
              <span className="font-bold">{protocol.cuppingStyle}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 bg-[#F5F0E8] rounded-lg border border-[#C4A97D]/30 flex gap-2">
              <Shield className="text-[#A0785A] shrink-0" size={16} />
              <p className="text-[11px] text-[#2C2A27]/90 leading-normal">
                Segurança incluída: Higienização cutânea e desinfecção a frio obrigatória de cada ventosa após o término.
              </p>
            </div>
          </div>
        </div>

        {/* Right Manual Steps Column */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white/60 p-5 rounded-xl border border-[#C4A97D]/30 space-y-3">
            <span className="text-[11px] font-semibold tracking-wider text-[#A0785A] uppercase block">Cartografia Passo a Passo</span>
            
            <ul className="space-y-3">
              {protocol.placement.map((step, idx) => (
                <li key={idx} className="flex gap-3 items-start text-xs md:text-sm text-[#2C2A27]">
                  <span className="font-mono font-bold text-xs bg-[#6B4E35] text-[#F5F0E8] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expert tip box */}
          <div className="bg-[#6B4E35]/5 border border-[#6B4E35]/20 p-4 rounded-xl">
            <span className="text-[11px] font-bold text-[#6B4E35] uppercase tracking-wider block mb-1">💡 Concelho Clínico de Claire Fontaine:</span>
            <p className="text-xs text-[#2C2A27] leading-relaxed italic">
              « {protocol.clinicalTip} »
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
