import { useState } from "react";
import { CheckCircle2, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";

interface Question {
  id: number;
  questionText: string;
  options: { text: string; painScore: string }[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: "Qual é o seu principal entrave ao utilizar ventosas no seu consultório?",
    options: [
      { text: "A dúvida sobre o posicionamento anatómico correto dependendo da queixa", painScore: "anatomie" },
      { text: "O medo de cometer erros ou esquecer contraindicações importantes", painScore: "securite" },
      { text: "A dificuldade em saber como combinar ventosas com outras terapias (óleos essenciais, estações)", painScore: "synergie" },
      { text: "A falta de ferramentas profissionais para passar segurança ao cliente e cobrar um preço justo", painScore: "cabinet" }
    ]
  },
  {
    id: 2,
    questionText: "Qual é a atitude dos seus clientes em relação à terapia por ventosas?",
    options: [
      { text: "Eles têm curiosidade, mas receiam as marcas escuras na pele", painScore: "securite" },
      { text: "Gostam muito, mas eu gostava de sugerir programas sazonais de acompanhamento", painScore: "synergie" },
      { text: "Adoram o efeito relaxante, mas eu queria focar-me em queixas clínicas específicas", painScore: "anatomie" }
    ]
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (painScore: string) => {
    const nextAnswers = [...answers, painScore];
    setAnswers(nextAnswers);

    if (currentStep + 1 < QUIZ_QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsFinished(false);
  };

  return (
    <div className="bg-[#E8DFD0] rounded-2xl p-6 md:p-8 border border-[#C4A97D] max-w-2xl mx-auto shadow-sm text-left">
      {!isFinished ? (
        <div>
          {/* Progress bar */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-widest text-[#A0785A] uppercase">Auto-Avaliação do Terapeuta</span>
            <span className="text-xs font-mono text-[#2C2A27]/60">Passo {currentStep + 1} de {QUIZ_QUESTIONS.length}</span>
          </div>
          
          <div className="w-full bg-[#F5F0E8] h-1.5 rounded-full mb-6">
            <div 
              className="bg-[#A0785A] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          <h4 className="font-serif text-base md:text-lg text-[#2C2A27] font-semibold mb-6">
            {QUIZ_QUESTIONS[currentStep].questionText}
          </h4>

          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt.painScore)}
                className="w-full text-left p-4 rounded-xl bg-[#F5F0E8] hover:bg-white text-xs md:text-sm text-[#2C2A27] font-medium border border-[#C4A97D]/40 hover:border-[#A0785A] transition-all flex justify-between items-center group shadow-xs cursor-pointer"
              >
                <span>{opt.text}</span>
                <ChevronRight size={14} className="text-[#A0785A] transform group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-[#6B4E35]/10 flex items-center justify-center text-[#6B4E35]">
            <CheckCircle2 size={24} />
          </div>

          <p className="text-xs font-semibold tracking-widest text-[#A0785A] uppercase">Análise de necessidades concluída</p>
          <h4 className="font-serif text-xl md:text-2xl font-semibold text-[#2C2A27]">O diagnóstico para o seu consultório de terapias</h4>

          <div className="bg-[#F5F0E8] p-5 rounded-xl border border-[#C4A97D]/60 text-left text-xs md:text-sm text-[#2C2A27] space-y-3">
            <div className="flex gap-2.5 items-start">
              <AlertCircle size={18} className="text-[#A0785A] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#6B4E35]">Solução Recomendada:</p>
                <p className="mt-1 leading-relaxed">
                  O seu perfil indica que beneficiará imenso e de forma imediata das nossas fichas clínicas. O guia principal <strong>100 Protocolos de Ventoses Terapêuticas</strong> e o módulo de bónus <strong>Gabinete Pronto a Usar</strong> responderão exatamente às suas dúvidas práticas, fornecendo fichas anatómicas detalhadas que transmitem segurança aos seus pacientes.
                </p>
              </div>
            </div>

            <p className="border-t border-[#C4A97D]/30 pt-3 text-[11px] text-[#2C2A27]/70 italic leading-snug">
              Ao investir apenas 27€ hoje, elimina as dúvidas de anatomia, protege a sua prática e conquista a autoridade necessária para cobrar o valor real que o seu serviço merece.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row justify-center gap-2.5">
            <button
              onClick={resetQuiz}
              className="px-4 py-2.5 bg-transparent border border-[#A0785A] text-[#A0785A] hover:bg-[#A0785A]/10 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={12} />
              Recomeçar o teste
            </button>
            
            <a
              href="#order-section"
              className="px-5 py-2.5 bg-[#6B4E35] text-white hover:bg-[#6B4E35]/90 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              Aceder à oferta completa
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
