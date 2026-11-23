import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Minus, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Bookmark, 
  Map, 
  TrendingUp, 
  BookmarkCheck, 
  Smile, 
  Stethoscope, 
  Activity, 
  Wind, 
  Droplet, 
  Sparkle,
  FlameKindling,
  BadgeCheck,
  ThumbsUp,
  MessageCircle,
  MoreHorizontal,
  ArrowLeft,
  Share2,
  Send
} from "lucide-react";

const FRENCH_NAMES = [
  "Jean-Pierre", "Clémence", "Matthieu", "Émilie", "Sébastien", "Marie-Laure", "Chantal", "Guillaume", 
  "Sandrine", "Nicolas", "Colette", "Olivier", "Béatrice", "Laurent", "Amélie", "Christophe", "Florence", 
  "Philippe", "Valérie", "Alexandre", "Geneviève", "Michel", "Cécile", "Stéphane", "Caroline", "Thierry", 
  "Jacqueline", "Vincent", "Isabelle", "François", "Monique", "Marc", "Josette", "Julien", "Sylvie", 
  "Alain", "Nathalie", "Antoine", "Sophie", "Bruno", "Catherine", "Franck", "Brigitte", "Didier", 
  "Chloé", "Bernard", "Élisabeth", "Christian", "Martine", "Gérard", "Lucas", "Aurélie", "Pascal", "Claudine"
];

const FRENCH_CITIES = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Bordeaux", "Lille", "Rennes", 
  "Reims", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Bruxelas", 
  "Genebra", "Lausanne", "Montreal", "Quebec", "Tours", "Limoges", "Metz", "Nancy", "Rouen", "Orléans", "Versalhes"
];

const SALE_ACTIONS = [
  "acabou de adquirir os 100 Protocolos de Ventosaterapia",
  "garantiu os 100 Protocolos de Ventosaterapia + os 3 Bônus de Presente",
  "liberou o acesso vitalício aos 100 Protocolos de Ventosaterapia",
  "comprou os 100 Protocolos de Ventosaterapia e a Ficha de Anamnese",
  "acabou de garantir o pacote dos 100 Protocolos"
];

export default function App() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  
  // Custom states for interactive engagement
  const [socialLikes, setSocialLikes] = useState<Record<string, number>>({
    ana: 12,
    jucelia: 42,
    paola: 8,
    helena: 19,
    adriana: 47,
    ricardo: 32,
    camila: 56,
    marcos: 34,
    claire_marcos: 12,
    gabriela: 47,
    claire_gabriela: 18,
    marcelo: 21,
    claire_marcelo: 9
  });
  
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const [facebookComments, setFacebookComments] = useState<any[]>([
    {
      id: "marcos",
      name: "Jean-Pierre Laurent",
      avatarLetter: "J",
      avatarColor: "bg-[#1877F2]/10 text-[#1877F2]",
      avatarUrl: "https://iili.io/CHLHSOQ.jpg",
      time: "2 h",
      comment: "Eu estava na dúvida se o compêndio traria mesmo protocolos práticos para lombalgia crônica. Apliquei hoje a descompressão miofascial global e o resultado com meu primeiro paciente foi incrivelmente rápido! Alívio imediato da tensão nas costas. Material nota 10, muito bem diagramado, economiza um tempo precioso de raciocínio clínico na hora de montar a sessão. Vale cada centavo!",
      likes: 34,
      reply: {
        id: "claire_marcos",
        name: "Claire Fontaine",
        avatarUrl: "https://iili.io/CHsK4ZQ.jpg",
        tag: "Autora Especialista",
        comment: "Olá, Jean-Pierre! Fico imensamente feliz com o seu retorno. A técnica de descompressão miofascial global das costas atua diretamente nas conexões fasciais profundas, devolvendo a mobilidade na hora. Essa é a diferença de usar um mapeamento exato, com tempos e pressões corretos, em vez de improvisar na correria. Muito sucesso nos seus atendimentos!",
        time: "1 h",
        likes: 12
      }
    },
    {
      id: "gabriela",
      name: "Nathalie Mercier",
      avatarLetter: "N",
      avatarColor: "bg-[#e1306c]/10 text-[#e1306c]",
      avatarUrl: "https://iili.io/CHL3OQV.jpg",
      time: "4 h",
      comment: "Com certeza o melhor investimento que fiz neste mês! Os bônus incluídos são sensacionais. Já imprimi a ficha de anamnese e usei na clínica hoje de manhã com duas clientes novas de drenagem e ventosaterapia estética. Passa uma postura muito profissional, digna de uma grande clínica, e ainda coleta tudo o que precisamos saber. Parabéns, Claire Fontaine, material perfeito e com entrega imediata!",
      likes: 47,
      reply: {
        id: "claire_gabriela",
        name: "Claire Fontaine",
        avatarUrl: "https://iili.io/CHsK4ZQ.jpg",
        tag: "Autora Especialista",
        comment: "Que maravilha ouvir isso, Nathalie! A Ficha de Anamnese foi criada justamente para estruturar os seus primeiros minutos de avaliação de forma rápida e segura, protegendo o terapeuta de aplicar em zonas de contraindicação. Use com dedicação e o retorno das clientes vem naturalmente!",
        time: "3 h",
        likes: 18
      }
    },
    {
      id: "marcelo",
      name: "Dr. Adrien Moreau",
      avatarLetter: "A",
      avatarColor: "bg-[#0f766e]/10 text-[#0f766e]",
      avatarUrl: "https://iili.io/CHLKeg1.jpg",
      time: "6 h",
      comment: "Atuo como fisioterapeuta e osteopata e sempre busquei integrar a ventosaterapia em um nível clínico profundo. Analisei o protocolo para lombalgias agudas e a disposição anatômica das ventosas é perfeita. Isso simplifica demais a rotina na clínica, onde o tempo é crucial. É o tipo de conteúdo direto que dá segurança ao profissional e resultados impecáveis para o paciente. Uma seleção cirúrgica, de altíssimo nível.",
      likes: 21,
      reply: {
        id: "claire_marcelo",
        name: "Claire Fontaine",
        avatarUrl: "https://iili.io/CHsK4ZQ.jpg",
        tag: "Autora Especialista",
        comment: "Obrigada, Dr. Adrien! Vinda de um profissional de saúde qualificado como o senhor, sua avaliação tem um peso enorme. O compêndio foi criado justamente com esse rigor anatômico e fisiológico para que os profissionais se sintam totalmente amparados. É uma honra estar na sua mesa de atendimento!",
        time: "5 h",
        likes: 9
      }
    }
  ]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCommentId = `user_${Date.now()}`;
    const newComment = {
      id: newCommentId,
      name: "Você (Visitante)",
      avatarUrl: "https://iili.io/CHsK4ZQ.jpg",
      time: "Agora mesmo",
      comment: newCommentText.trim(),
      likes: 0,
      reply: null
    };

    setFacebookComments(prev => [...prev, newComment]);
    setNewCommentText("");

    // Simulate real specialist reply
    setTimeout(() => {
      setFacebookComments(prev => {
        return prev.map(c => {
          if (c.id === newCommentId) {
            return {
              ...c,
              reply: {
                id: `claire_reply_${Date.now()}`,
                name: "Claire Fontaine",
                avatarUrl: "https://iili.io/CHsK4ZQ.jpg",
                tag: "Autora Especialista",
                comment: "Olá! Seja muito bem-vindo(a) à nossa comunidade de terapeutas. O Compêndio foi criado exatamente para isso: economizar o seu tempo clínico e trazer resultados excepcionais aos seus pacientes já na primeira sessão. Desejo muito sucesso para você!",
                time: "Agora mesmo",
                likes: 1
              }
            };
          }
          return c;
        });
      });
    }, 1500);
  };

  const focusCommentInput = () => {
    commentInputRef.current?.focus();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para compartilhar!");
    } else {
      alert("Acesse o Compêndio de Ventosaterapia para compartilhar!");
    }
  };

  const [currentNotification, setCurrentNotification] = useState<{
    name: string;
    city: string;
    action: string;
    timeAgo: string;
  } | null>(null);

  useEffect(() => {
    let queue: { name: string; city: string; action: string; timeAgo: string; }[] = [];
    
    function recreateQueue() {
      // Shuffle names & cities independently to get randomized pairings without repeat
      const shuffledNames = [...FRENCH_NAMES].sort(() => Math.random() - 0.5);
      const shuffledCities = [...FRENCH_CITIES].sort(() => Math.random() - 0.5);
      
      queue = [];
      const count = Math.min(shuffledNames.length, shuffledCities.length);
      for (let i = 0; i < count; i++) {
        const actionIdx = Math.floor(Math.random() * SALE_ACTIONS.length);
        const randMinutes = Math.floor(Math.random() * 50) + 2;
        queue.push({
          name: shuffledNames[i],
          city: shuffledCities[i],
          action: SALE_ACTIONS[actionIdx],
          timeAgo: `há ${randMinutes} min`
        });
      }
    }

    recreateQueue();
    let currentIndex = 0;

    const showNext = () => {
      if (currentIndex >= queue.length) {
        recreateQueue();
        currentIndex = 0;
      }
      
      const nextSale = queue[currentIndex];
      setCurrentNotification(nextSale);
      currentIndex++;

      // Clear the notification after 6.5 seconds
      setTimeout(() => {
        setCurrentNotification(null);
      }, 6500);
    };

    // Show initial notification after 6 seconds to show to user quickly
    const initialTimeout = setTimeout(() => {
      showNext();
    }, 6000);

    // Set up standard 45-second intervals as requested by user
    const saleInterval = setInterval(() => {
      showNext();
    }, 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(saleInterval);
    };
  }, []);

  const pricingSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToCheckout = () => {
    const target = pricingSectionRef.current || document.getElementById("checkout");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLike = (id: string) => {
    // Check if user has liked this ID before
    const liked = !!userLiked[id];
    setUserLiked(prev => ({ ...prev, [id]: !liked }));

    // Update in-place counts in standard state dictionary if registered
    if (socialLikes[id] !== undefined) {
      setSocialLikes(prev => ({ ...prev, [id]: liked ? prev[id] - 1 : prev[id] + 1 }));
      return;
    }

    // Otherwise, check and update our facebookComments state array
    setFacebookComments(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: liked ? item.likes - 1 : item.likes + 1
        };
      }
      if (item.reply && item.reply.id === id) {
        return {
          ...item,
          reply: {
            ...item.reply,
            likes: liked ? item.reply.likes - 1 : item.reply.likes + 1
          }
        };
      }
      return item;
    }));
  };

  // Protocols Categories Data with individual examples
  const categories = [
    {
      title: "Categoria A — Dores Musculares e Articulares",
      description: "Protocolos para lombalgia, cervicalgia, ciatalgia, tendinopatias, neuralgias e descompressão miofascial global.",
      icon: <Activity className="w-6 h-6" />,
      protocols: [
        "Lombalgias agudas e crônicas (L4-S1)",
        "Ciatalgias e cruralgias persistentes",
        "Cervicalgias tensionais e torcicolo",
        "Tendinopatias do tendão de Aquiles e patelar",
        "Neuralgia de Arnold e tensões suboccipitais",
        "Periartrite escapuloumeral (ombro congelado)",
        "Descompressão miofascial global das costas"
      ]
    },
    {
      title: "Categoria B — Bem-Estar Emocional e Nervoso",
      description: "Atue na ansiedade, no estresse, na insônia e no burnout por meio da regulação do sistema nervoso e da liberação do diafragma.",
      icon: <Smile className="w-6 h-6" />,
      protocols: [
        "Insônia ligada à ansiedade e dificuldade para pegar no sono",
        "Esgotamento profissional (burnout) e fadiga adrenal",
        "Protocolo 'Enraizamento e Respiração' (liberação do diafragma)",
        "Cefaleias tensionais e enxaquecas oftálmicas",
        "Tensões emocionais somatizadas no plexo solar"
      ]
    },
    {
      title: "Categoria C — Estética e Modelagem Corporal",
      description: "Protocolos para circulação, celulite, retenção de líquidos, edema, drenagem linfática e modelagem corporal.",
      icon: <Droplet className="w-6 h-6" />,
      protocols: [
        "Sensação de pernas pesadas e estase venosa",
        "Drenagem linfática profunda dos membros inferiores",
        "Protocolo para celulite adiposa e aquosa (coxas/glúteos)",
        "Reativação da microcirculação após esforço intenso",
        "Retenção de líquidos e inchaço nos tornozelos"
      ]
    },
    {
      title: "Categoria D — Equilíbrio Orgânico e Imunidade",
      description: "Regulação dos sistemas digestivo e respiratório e ativação da imunidade por meio da estimulação de zonas reflexas.",
      icon: <Stethoscope className="w-6 h-6" />,
      protocols: [
        "Distensão abdominal e intestino irritável (regulação do trânsito intestinal)",
        "Espasmos gástricos e refluxo gastroesofágico (DRGE)",
        "Bronquite asmática crônica e espasmos pulmonares",
        "Suporte metabólico e desintoxicação hepática",
        "Cólicas e dores menstruais (dismenorreia)",
        "Sinusite aguda e desobstrução das vias aéreas superiores",
        "Fortalecimento da imunidade e regulação da energia vital"
      ]
    }
  ];

  // FAQs aligned with copy
  const faqs = [
    {
      question: "Serve para iniciantes?",
      answer: "Sim! O e-book foi criado de forma extremamente didática. Cada protocolo traz ilustrações precisas do posicionamento das ventosas, além de instruções claras de pressão e tempo de aplicação. Serve tanto para iniciantes quanto para profissionais experientes."
    },
    {
      question: "Preciso ter formação prévia em ventosaterapia?",
      answer: "Não é obrigatório. Os protocolos funcionam como um guia visual passo a passo para consulta rápida. Mesmo assim, o material traz as melhores práticas de biossegurança, as zonas proibidas e as contraindicações detalhadas para você atender com total segurança desde o primeiro dia."
    },
    {
      question: "O material é físico ou digital?",
      answer: "É um compêndio 100% digital, em PDF de alta resolução. Assim que a compra for aprovada, você recebe na hora o acesso por e-mail para baixar. Dá para consultar direto no celular, tablet ou computador, ou até imprimir para o seu consultório."
    },
    {
      question: "Quanto tempo demora a entrega?",
      answer: "É imediata! O pagamento é aprovado e processado em poucos segundos pela nossa plataforma integrada e altamente segura. Assim que a compra é concluída, o guia principal e os seus 3 bônus gratuitos chegam na hora no seu e-mail."
    },
    {
      question: "Posso usar no meu consultório?",
      answer: "Com certeza, esse é justamente o objetivo principal! Os bônus incluídos ajudam a agilizar a sua rotina profissional, com fichas de atendimento práticas e prontas para imprimir."
    },
    {
      question: "Tem atualizações?",
      answer: "Sim! Com uma compra única e acesso vitalício, todas as revisões periódicas do compêndio de 100 protocolos e os novos bônus são enviados gratuitamente para o seu e-mail cadastrado, sem nenhuma assinatura adicional!"
    },
    {
      question: "E se eu não gostar?",
      answer: "Temos total confiança no valor deste material, por isso oferecemos uma garantia incondicional de 7 dias. Se, por qualquer motivo, você sentir que os protocolos não melhoraram os seus atendimentos, basta nos enviar um e-mail para receber o reembolso integral, sem burocracia e sem perguntas."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2C2A27] font-sans overflow-x-hidden antialiased selection:bg-[#A0785A]/20 selection:text-[#2C2A27]">
      
      {/* 1. Header Announcement Bar */}
      <div id="top-announcement" className="w-full bg-[#6B4E35] text-[#F5F0E8] py-2.5 px-4 text-center text-[11px] md:text-xs font-semibold tracking-wider flex items-center justify-center gap-2 border-b border-[#C4A97D]/30">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C4A97D] animate-ping" />
          🔥 OFERTA DE LANÇAMENTO: EXCLUSIVA PARA TERAPEUTAS, MASSOTERAPEUTAS E ESTETICISTAS
        </span>
      </div>

      {/* 2. Hero Section */}
      <header id="hero" className="relative pt-12 pb-20 md:py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Decorative background shapes mimicking real workspace */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#A0785A]/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#C4A97D]/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="lg:col-span-7 space-y-6 flex flex-col items-center text-center relative z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-[#E8DFD0] border border-[#C4A97D]/50 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-[#A0785A] mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#A0785A]" />
            <span>Guia 100% Digital • Acesso Vitalício</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#2C2A27] leading-[1.1] tracking-tight text-center w-full">
            100 Protocolos <br />
            <span className="text-[#A0785A] drop-shadow-sm">de Ventosaterapia</span>
          </h1>

          <div className="my-5 max-w-lg mx-auto">
            <img 
              src="https://iili.io/C2Xfwrb.png" 
              alt="100 Protocolos de Ventosaterapia" 
              className="w-full h-auto rounded-2xl shadow-lg border border-[#C4A97D]/30 object-contain select-none"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith('.png')) {
                  target.src = 'https://iili.io/C2Xfwrb.png';
                }
              }}
            />
          </div>

          <p className="text-base md:text-lg text-[#2C2A27]/85 leading-relaxed max-w-xl font-light text-center mx-auto">
            Tenha protocolos de ação rápida prontos para cada tipo de queixa. Aplique a ventosaterapia com máxima precisão, total segurança clínica e um alto nível de profissionalismo para fidelizar mais clientes.
          </p>

          {/* Quick list specs in hero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-xl mx-auto w-full text-left">
            {[
              "Mapas precisos de aplicação",
              "Passo a passo para cada tipo de queixa",
              "Zonas de atenção e biossegurança",
              "Integração com a aromaterapia"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-[#2C2A27]/90 justify-center sm:justify-start">
                <CheckCircle className="w-4.5 h-4.5 text-[#A0785A] shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full">
            <button 
              id="hero-cta-btn"
              onClick={scrollToCheckout}
              className="px-8 py-4 bg-[#6B4E35] text-[#F5F0E8] rounded-xl font-semibold text-base transition-all duration-300 hover:bg-[#6B4E35]/95 hover:translate-y-[-2px] tracking-wide shadow-lg hover:shadow-xl active:translate-y-0 text-center cursor-pointer relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                QUERO MEUS PROTOCOLOS AGORA 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          </div>

          {/* Compartimento da Expert / Criadora do Método */}
          <div className="pt-6 mt-6 border-t border-[#C4A97D]/30 select-none animate-fade-in bg-[#E8DFD0]/30 p-6 rounded-3xl border border-[#C4A97D]/20">
            <div className="mb-4 text-center sm:text-left">
              <span className="bg-[#6B4E35] text-[#F5F0E8] text-[10px] uppercase tracking-widest font-extrabold px-3.5 py-1.5 rounded-lg shadow-sm border border-[#C4A97D]/30">
                CURRÍCULO DA SUA MENTORA
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative p-3 bg-white rounded-3xl border border-[#C4A97D]/50 shadow-2xl max-w-sm sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] w-full shrink-0 overflow-hidden group">
                <img 
                  src="https://iili.io/CHsK4ZQ.jpg" 
                  alt="CLAIRE FONTAINE" 
                  className="rounded-2xl w-full h-auto object-cover transform scale-100 hover:scale-[1.02] transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-5 right-5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              <div className="text-center sm:text-left space-y-2 flex-1 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 justify-center sm:justify-start">
                  <span className="text-[10px] uppercase tracking-widest text-[#A0785A] font-bold bg-[#A0785A]/10 px-2.5 py-0.5 rounded">Criadora do Método</span>
                </div>
                <div>
                  <p className="text-xl font-serif font-bold text-[#2C2A27] tracking-wider">CLAIRE FONTAINE</p>
                  <p className="text-xs text-[#A0785A] font-semibold uppercase tracking-wider">Especialista Clínica em Ventosaterapia</p>
                </div>
                <p className="text-[13px] text-[#2C2A27]/85 leading-relaxed max-w-md font-light">
                  Profissional da saúde, acupunturista e terapeuta integrativa com mais de 12 anos de experiência clínica. Especialista em vacuoterapia (cupping) e reabilitação, dedicada a orientar profissionais da terapia e da estética com máxima autoridade, biossegurança e protocolos práticos de alto desempenho.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Right Banner Image Mockup - Framed like a physical layout */}
        <div className="lg:col-span-5 relative z-10 flex justify-center">
          <div className="relative group max-w-md w-full">
            {/* Soft decorative glow behind */}
            <div className="absolute inset-0 bg-[#A0785A]/15 rounded-3xl filter blur-xl transform group-hover:scale-105 transition-all duration-500" />
            
            <div className="relative p-2 bg-[#E8DFD0] rounded-3xl border border-[#C4A97D]/40 shadow-xl overflow-hidden">
              <img 
                src="https://iili.io/C2Xfwrb.png" 
                alt="Pacote 100 Protocolos de Ventosaterapia" 
                className="w-full h-auto rounded-2xl object-cover transform scale-100 group-hover:scale-[1.02] transition-all duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.endsWith('.png')) {
                    target.src = 'https://iili.io/C2Xfwrb.png';
                  }
                }}
              />
              
              {/* Overlay elements mapping value tags */}
              <div className="absolute top-6 right-6 bg-[#6B4E35] text-[#F5F0E8] text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-md">
                Mais Vendido
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Accent Bar Ribbon */}
      <div id="hero-ribbon" className="w-full bg-[#E8DFD0] border-y border-[#C4A97D]/40 py-5 text-center px-4 font-normal text-[#2C2A27]">
        <p className="text-base md:text-lg tracking-wide max-w-3xl mx-auto">
          Prontos para serem <strong className="font-semibold text-[#A0785A]">aplicados imediatamente</strong> e <strong className="font-semibold text-[#A0785A]">transformar as suas sessões</strong>.
        </p>
      </div>

      {/* 3. Live Customer Social Proof / Social Comments */}
      <section id="social-comments" className="py-16 px-4 bg-[#FAFAFA] border-y border-[#C4A97D]/20">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-8">
          <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold block font-sans">Comunidade Ativa</span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2C2A27]">
            Veja os comentários nas redes
          </h2>
          <p className="text-xs sm:text-sm text-[#2C2A27]/70 max-w-lg mx-auto">
            Depoimentos da nossa comunidade de fisioterapeutas, massoterapeutas e esteticistas pelo mundo.
          </p>
        </div>

        {/* Facebook-style Native Mobile Post Mockup ("After" Screen Representation) */}
        <div className="max-w-xl mx-auto bg-white border border-[#dadde1] shadow-md rounded-2xl overflow-hidden font-sans text-[#1c1e21]">
          
          {/* Post Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white select-none">
            <div className="flex items-center gap-3">
              <img 
                src="https://iili.io/CHsK4ZQ.jpg" 
                alt="Claire Fontaine" 
                className="w-10 h-10 rounded-full border border-[#dadde1] object-cover shrink-0 select-none bg-stone-100"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-[15px] text-[#050505] hover:underline cursor-pointer truncate">
                    CLAIRE FONTAINE
                  </span>
                  <BadgeCheck className="w-4 h-4 text-white fill-[#1877F2] shrink-0" title="Perfil de Autora Verificado" />
                </div>
                <div className="flex items-center gap-1 text-[12px] text-[#65676b] min-w-0">
                  <span className="truncate">Publicado por CLAIRE FONTAINE</span>
                  <span className="shrink-0">·</span>
                  <span className="shrink-0" title="Agora mesmo">À l'instant</span>
                  <span className="shrink-0">·</span>
                  <span className="text-[11px] shrink-0 select-none" title="Public">🌐</span>
                </div>
              </div>
            </div>
            
            <button className="text-[#65676b] hover:bg-[#f2f3f5] p-2 rounded-full transition-colors shrink-0">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 pb-3 text-[15px] leading-normal text-[#050505] select-text text-left">
            Muito orgulhosa de ver o impacto real do <strong className="font-semibold text-[#6B4E35]">Compêndio de Ventosaterapia Clínica</strong> no raciocínio rápido e no alívio imediato da dor dos seus pacientes. Juntos, estamos elevando o nível da reabilitação! Confira alguns dos depoimentos práticos da nossa comunidade 👇❤️
          </div>

          {/* Dual-Split Post Media Attachments (Mimicking Chris' Desert split photos in the mockup) */}
          <div className="grid grid-cols-2 gap-[2px] bg-[#dadde1] border-y border-[#dadde1] overflow-hidden select-none">
            {/* Column 1: Expert in her clinical setting */}
            <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden group cursor-pointer">
              <img 
                src="https://iili.io/CHsK4ZQ.jpg" 
                alt="Claire Fontaine na prática" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                Método Oficial
              </div>
            </div>

            {/* Column 2: Creative Bundle Representation */}
            <div 
              onClick={scrollToCheckout}
              className="aspect-[4/3] bg-[#F5F0E8] relative overflow-hidden group cursor-pointer flex items-center justify-center p-2"
            >
              <img 
                src="https://iili.io/C2Xfwrb.png" 
                alt="Compêndio Digital" 
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.endsWith('.png')) {
                    target.src = 'https://iili.io/C2Xfwrb.png';
                  }
                }}
              />
              <div className="absolute bottom-2 right-2 bg-[#6B4E35] text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shadow-sm">
                Acesso de Lançamento
              </div>
            </div>
          </div>

          {/* Reactions Row Bar */}
          <div className="px-4 py-2 flex items-center justify-between text-[12px] text-[#65676b] select-none font-sans border-b border-[#e5e5e5] mx-3">
            <div className="flex items-center gap-1.5 min-w-0 py-2">
              <div className="flex items-center -space-x-1 shrink-0">
                {/* FB Like Circle Icon */}
                <span className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[9px] border border-white shadow-xs select-none">👍</span>
                {/* FB Heart Circle Icon */}
                <span className="w-4 h-4 rounded-full bg-[#f33e58] flex items-center justify-center text-white text-[9px] border border-white shadow-xs select-none">❤️</span>
                {/* FB Wow Circle Icon */}
                <span className="w-4 h-4 rounded-full bg-[#f5c33b] flex items-center justify-center text-white text-[9px] border border-white shadow-xs select-none">😮</span>
              </div>
              <span className="hover:underline cursor-pointer font-normal truncate text-[#65676b] text-left">
                {postLiked ? "Você, Jean-Pierre Laurent e outras 182 pessoas" : "Jean-Pierre Laurent, Nathalie Mercier e outras 182 pessoas"}
              </span>
            </div>
            
            <div className="flex items-center gap-1 hover:underline cursor-pointer shrink-0 text-[#65676b] text-xs py-2">
              <span>{3 + facebookComments.length} comentários</span>
              <span>·</span>
              <span>29 compartilhamentos</span>
            </div>
          </div>

          {/* Interactive Flat Buttons Bar */}
          <div className="grid grid-cols-3 gap-1 px-2 py-1 text-[13px] sm:text-[14px] font-semibold text-[#65676b] border-b border-[#e5e5e5] select-none bg-white font-sans text-center mx-1">
            <button 
              onClick={() => setPostLiked(!postLiked)} 
              className={`flex items-center justify-center gap-2 py-2 hover:bg-[#f2f3f5] rounded-lg transition-colors cursor-pointer active:scale-95 ${postLiked ? "text-[#1877F2]" : ""}`}
            >
              <ThumbsUp className={`w-[18px] h-[18px] ${postLiked ? "fill-[#1877F2] text-[#1877F2]" : "text-[#65676b]"}`} />
              <span>{postLiked ? "Curtido" : "Curtir"}</span>
            </button>
            <button 
              onClick={focusCommentInput}
              className="flex items-center justify-center gap-2 py-2 hover:bg-[#f2f3f5] rounded-lg transition-colors cursor-pointer active:scale-95 text-[#65676b]"
            >
              <MessageCircle className="w-[18px] h-[18px] text-[#65676b]" />
              <span>Comentar</span>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2 hover:bg-[#f2f3f5] rounded-lg transition-colors cursor-pointer active:scale-95 text-[#65676b]"
            >
              <Share2 className="w-[18px] h-[18px] text-[#65676b]" />
              <span>Compartilhar</span>
            </button>
          </div>

          {/* View Previews Comments Trigger Area */}
          <div className="px-4 py-2 flex items-center justify-between bg-white text-xs sm:text-[13px] text-[#65676b] font-semibold select-none">
            <button className="hover:underline cursor-pointer text-left">Ver comentários anteriores...</button>
            <button className="flex items-center gap-1 hover:bg-[#f2f3f5] px-2 py-1 rounded-md text-[#65676b] cursor-pointer">
              <span>Mais relevantes</span>
              <span className="text-[9px]">▼</span>
            </button>
          </div>

          {/* Feed Comments List Block */}
          <div className="px-3 pb-4 space-y-5 bg-white">
            {facebookComments.map((item) => (
              <div key={item.id} className="space-y-3 font-sans text-left">
                
                {/* Main Parent Comment bubble row */}
                <div className="flex gap-2.5 items-start min-w-0">
                  {/* User Avatar */}
                  {item.avatarUrl ? (
                    <img 
                      src={item.avatarUrl} 
                      alt={item.name} 
                      className="w-8 h-8 rounded-full shrink-0 border border-[#dadde1] shadow-inner object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border border-[#dadde1] shadow-inner select-none ${item.avatarColor}`}>
                      {item.avatarLetter}
                    </div>
                  )}
                  
                  {/* Speech container */}
                  <div className="flex-1 min-w-0">
                    <div className="relative inline-block max-w-[96%] sm:max-w-[90%] group">
                      <div className="bg-[#f0f2f5] px-3.5 py-2 rounded-2xl text-[#050505] text-left">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="font-semibold text-[#050505] hover:underline cursor-pointer text-xs sm:text-[13px]">
                            {item.name}
                          </span>
                        </div>
                        
                        <p className="font-normal leading-normal text-[#050505] text-xs sm:text-[13px] break-words whitespace-normal text-left">
                          {item.comment}
                        </p>
                      </div>

                      {/* Float reactions pill over bubble corner */}
                      {(socialLikes[item.id] ?? item.likes) > 0 && (
                        <button 
                          onClick={() => handleLike(item.id)}
                          className="absolute -bottom-1 right-2 bg-white flex items-center gap-0.5 px-1 py-0.5 h-5 min-w-[28px] justify-center rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.15)] border border-[#e5e5e5] text-[10px] text-[#65676b] select-none cursor-pointer active:scale-95 transition-transform"
                          title="Curtir este comentário"
                        >
                          <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[8px] shrink-0">👍</span>
                          <span className="font-semibold text-[#65676b] leading-none shrink-0">{socialLikes[item.id] ?? item.likes}</span>
                        </button>
                      )}
                    </div>

                    {/* Meta actions bar links underneath speech bubble */}
                    <div className="flex items-center gap-1 px-3 pt-1 text-[11px] font-bold text-[#65676b] select-none flex-wrap font-sans">
                      <button 
                        onClick={() => handleLike(item.id)}
                        className={`hover:underline cursor-pointer ${userLiked[item.id] ? "text-[#1877F2] font-semibold" : ""}`}
                      >
                        {userLiked[item.id] ? "Curtido" : "Curtir"}
                      </button>
                      <span className="text-gray-400 font-normal px-0.5">·</span>
                      <button onClick={focusCommentInput} className="hover:underline cursor-pointer">Responder</button>
                      <span className="text-gray-400 font-normal px-0.5">·</span>
                      <span className="text-[#65676b] font-normal">{item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Sub Expert Reply Nested (Facebook layout thread curve representation) */}
                {item.reply && (
                  <div className="pl-4 sm:pl-10 md:pl-12 flex gap-2.5 relative min-w-0">
                    {/* Visual Connector Bracket Threading Line */}
                    <div className="absolute left-[16px] sm:left-[22px] md:left-[24px] top-[-16px] bottom-4 w-0.5 bg-[#dadde1]" />
                    <div className="absolute left-[16px] sm:left-[22px] md:left-[24px] bottom-4 w-3 sm:w-4.5 h-0.5 bg-[#dadde1]" />

                    {/* Expert Avatar with Green Active Radar */}
                    <div className="relative shrink-0 select-none">
                      <img 
                        src={item.reply.avatarUrl} 
                        alt={item.reply.name} 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#dadde1] shadow-sm bg-stone-200 object-cover z-10 relative"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>

                    {/* Expert Bubble Container */}
                    <div className="flex-1 min-w-0 font-sans">
                      <div className="relative inline-block max-w-[96%] sm:max-w-[90%] font-sans">
                        <div className="bg-[#f0f2f5] px-3.5 py-2 rounded-2xl text-[#050505] text-left font-sans">
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <span className="font-semibold text-[#050505] hover:underline cursor-pointer text-xs sm:text-[13px]">
                              {item.reply.name}
                            </span>
                            
                            <BadgeCheck className="w-3.5 h-3.5 text-white fill-[#1877F2] shrink-0" title="Perfil de Autora Verificado" />
                            
                            <span className="text-[11px] text-[#65676b] font-semibold select-none ml-1">
                              · Autora
                            </span>
                          </div>
                          
                          <p className="font-normal leading-normal text-[#050505] text-xs sm:text-[13px] break-words whitespace-normal text-left font-sans">
                            {item.reply.comment}
                          </p>
                        </div>

                        {/* Overlapping thumbs icon on replied bubble */}
                        {(socialLikes[item.reply.id] ?? item.reply.likes) > 0 && (
                          <button 
                            onClick={() => handleLike(item.reply.id)}
                            className="absolute -bottom-1 right-2 bg-white flex items-center gap-0.5 px-1 py-0.5 h-5 min-w-[28px] justify-center rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.15)] border border-[#e5e5e5] text-[10px] text-[#65676b] select-none cursor-pointer active:scale-95 transition-transform"
                            title="Curtir esta resposta"
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[8px] shrink-0">👍</span>
                            <span className="font-semibold text-[#65676b] leading-none shrink-0">{socialLikes[item.reply.id] ?? item.reply.likes}</span>
                          </button>
                        )}
                      </div>

                      {/* Replied row actions link list */}
                      <div className="flex items-center gap-1 px-3.5 pt-1 text-[11px] font-bold text-[#65676b] select-none flex-wrap font-sans">
                        <button 
                          onClick={() => handleLike(item.reply.id)}
                          className={`hover:underline cursor-pointer ${userLiked[item.reply.id] ? "text-[#1877F2] font-semibold" : ""}`}
                        >
                          {userLiked[item.reply.id] ? "Curtido" : "Curtir"}
                        </button>
                        <span className="text-gray-400 font-normal px-0.5">·</span>
                        <button onClick={focusCommentInput} className="hover:underline cursor-pointer">Responder</button>
                        <span className="text-gray-400 font-normal px-0.5">·</span>
                        <span className="text-[#65676b] font-normal">{item.reply.time}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Interactive Mobile Keyboard Input row at Card bottom */}
          <form 
            onSubmit={handleCommentSubmit} 
            className="flex gap-2.5 items-center border-t border-[#e5e5e5] p-3 sm:p-4 bg-white select-none font-sans"
          >
            <img 
              src="https://iili.io/CHsK4ZQ.jpg" 
              alt="Você" 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-[#dadde1] shadow-inner object-cover select-none shrink-0"
            />
            <div className="flex-1 flex items-center bg-[#f0f2f5] hover:bg-[#ebedf0] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#1877F2] border border-transparent focus-within:border-[#1877F2] transition-all rounded-full px-3.5 py-1.5 relative min-w-0">
              <input 
                ref={commentInputRef}
                type="text"
                placeholder="Escreva um comentário..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-transparent border-0 p-0 pr-16 text-xs sm:text-[13px] text-[#1c1e21] focus:ring-0 placeholder-[#65676b] leading-normal"
              />
              <div className="absolute right-2.5 flex items-center gap-2 text-[#65676b]">
                <button type="button" className="hover:text-[#1877F2] transition-colors p-0.5 cursor-pointer" title="Adicionar emoji">
                  <Smile className="w-[18px] h-[18px] shrink-0" />
                </button>
                <button 
                  type="submit" 
                  disabled={!newCommentText.trim()} 
                  className="text-[#1877F2] hover:text-[#1464cc] transition-colors p-0.5 disabled:text-[#65676b]/40 disabled:pointer-events-none cursor-pointer"
                  title="Enviar comentário"
                >
                  <Send className="w-4.5 h-4.5 shrink-0" />
                </button>
              </div>
            </div>
          </form>

        </div>
      </section>

      {/* 4. Target Audience / Este material foi feito pra você que... */}
      <section id="audience" className="py-16 bg-[#E8DFD0] border-y border-[#C4A97D]/35 px-4 font-sans text-left">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold block">Identificação Clínica</span>
            <h2 className="text-3xl font-serif font-bold text-[#2C2A27]">
              Este guia foi feito para você que...
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              "Fica em dúvida sobre as zonas exatas na hora de escolher os pontos e acaba perdendo tempo demais durante os atendimentos.",
              "Sente que os seus atendimentos poderiam entregar resultados terapêuticos e alívio da dor mais consistentes.",
              "Quer parar de depender de anotações soltas e ter tudo perfeitamente mapeado, limpo e organizado em um só lugar.",
              "Busca se destacar no mercado como terapeuta altamente qualificado, técnico e diferenciado da concorrência.",
              "Quer oferecer uma experiência de ventosaterapia impecável, que faça seus pacientes voltarem e indicarem você."
            ].map((text, i) => (
              <div 
                key={i} 
                className={`bg-[#F5F0E8] p-5 rounded-2xl border border-[#C4A97D]/30 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow ${i === 4 ? "md:col-span-2" : ""}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#A0785A]/10 text-[#A0785A] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-sm text-[#2C2A27]/90 leading-relaxed font-light text-left">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-base text-[#2C2A27]/80 font-normal italic max-w-2xl mx-auto pt-4 leading-relaxed font-sans block text-center">
            "Se você se identificou com pelo menos uma dessas situações, este compêndio de protocolos estruturados vai transformar a sua forma de atender com ventosas."
          </p>
        </div>
      </section>

      {/* 5. Direct Contrast Comparison */}
      <section id="comparison" className="py-20 px-4 max-w-5xl mx-auto font-sans text-left">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold block">Profissionalismo x Amadorismo</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2A27]">
            A diferença entre improvisar e dominar
          </h2>
          <p className="text-sm md:text-base text-[#2C2A27]/70 max-w-lg mx-auto text-center">
            Compare a rotina de quem improvisa com a de quem usa os guias de ação rápida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Sem o protocolo, você continua... (Red) */}
          <div className="bg-[#E8DFD0]/40 rounded-3xl p-6 md:p-8 border border-red-900/10 shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-[#C4A97D]/20 pb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2C2A27] font-serif">
                  Sem o protocolo, você continua...
                </h3>
              </div>
              
              <ul className="space-y-4 pt-6 text-sm text-[#2C2A27]/90 font-light">
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span><strong>Com sessões longas e confusas:</strong> perdendo tempo procurando as melhores zonas durante a sessão, com o paciente já deitado na maca.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span><strong>Com pacientes que não voltam:</strong> atendimentos genéricos que não trazem benefícios imediatos e reduzem a fidelização.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span><strong>Com medo de errar:</strong> inseguro na hora de dosar a pressão, lidar com as marcas das ventosas ou atender pessoas sensíveis.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                  <span><strong>Estagnado tecnicamente:</strong> repetindo no automático o mesmo posicionamento de ventosas para todas as queixas.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Com o protocolo, você passa a... (Green) */}
          <div className="bg-[#E8DFD0] rounded-3xl p-6 md:p-8 border border-emerald-900/20 shadow-md space-y-6 flex flex-col justify-between relative overflow-hidden">
            {/* Elegant organic gold highlight borders on success card */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C4A97D]/15 rounded-full filter blur-xl" />

            <div>
              <div className="flex items-center gap-3 border-b border-[#C4A97D]/40 pb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#2C2A27] font-serif">
                  Com o protocolo, você passa a ter...
                </h3>
              </div>

              <ul className="space-y-4 pt-6 text-sm text-[#2C2A27]/90 font-light">
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Sessões altamente estruturadas:</strong> cada queixa tem o seu protocolo exato, ilustrado e pronto. É só seguir o guia.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Clientes encantados:</strong> alívio rápido das tensões nas costas e melhora visível, gerando indicações naturalmente.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Segurança clínica absoluta:</strong> você domina as zonas de contraindicação e os tempos de aplicação.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Autoridade profissional reconhecida:</strong> valorização do seu trabalho para cobrar com tranquilidade o preço justo pelos seus atendimentos.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Imagem do Protocolo / Produto */}
        <div className="mt-12 select-none flex justify-center">
          <div className="relative group max-w-2xl w-full px-4 sm:px-0">
            <div className="absolute inset-0 bg-[#A0785A]/10 rounded-2xl sm:rounded-3xl filter blur-xl group-hover:bg-[#A0785A]/15 transition-colors" />
            <img 
              src="https://iili.io/CHsb8rv.png" 
              alt="Protocolos Ilustrados de Ventosaterapia" 
              className="relative rounded-2xl sm:rounded-3xl border border-[#C4A97D]/50 shadow-xl w-full object-cover bg-[#F5F0E8]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith('.png')) {
                  target.src = 'https://iili.io/CHsb8rv.jpg';
                }
              }}
            />
          </div>
        </div>

        {/* Centralized CTA button right under comparison */}
        <div className="pt-12 text-center space-y-3">
          <button 
            onClick={() => window.open("https://pay.hotmart.com/N106028023S?checkoutMode=10", "_blank")}
            className="px-10 py-4.5 bg-[#6B4E35] text-[#F5F0E8] rounded-xl font-bold text-base transition-all duration-300 hover:bg-[#6B4E35]/95 hover:translate-y-[-2px] tracking-widest shadow-lg hover:shadow-xl cursor-pointer"
          >
            QUERO ATENDER COM EXCELÊNCIA
          </button>
          <div className="text-[11px] text-[#2C2A27]/60 flex items-center justify-center gap-1 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A0785A]" /> Pagamento 100% Seguro • Acesso imediato após a aprovação
          </div>
        </div>
      </section>

      {/* 6. Protocol Modules (4 categories listed vertically) */}
      <section id="categories" className="py-20 bg-[#E8DFD0] border-y border-[#C4A97D]/35 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold">Conteúdo do Compêndio</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2A27]">
              4 categorias de protocolos para cobrir cada necessidade
            </h2>
            <p className="text-sm md:text-base text-[#2C2A27]/75 max-w-xl mx-auto">
              Cada categoria foi estruturada com precisão cirúrgica, com protocolos de aplicação ilustrados e explicados em detalhes.
            </p>
          </div>

          {/* List of 4 categories stacked vertically as interactive accordions */}
          <div className="space-y-4">
            {categories.map((cat, idx) => {
              const isOpen = selectedCategory === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-[#F5F0E8] rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? "border-[#6B4E35] shadow-md ring-1 ring-[#6B4E35]/15" 
                      : "border-[#C4A97D]/40 shadow-sm hover:shadow-md hover:border-[#C4A97D]/70 bg-[#F5F0E8]/90"
                  }`}
                >
                  {/* Category Header Button */}
                  <button
                    onClick={() => setSelectedCategory(isOpen ? -1 : idx)}
                    className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 cursor-pointer select-none focus:outline-none"
                  >
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 transition-colors duration-300 ${
                        isOpen 
                          ? "bg-[#6B4E35] text-[#F5F0E8] border-[#6B4E35]" 
                          : "bg-[#E8DFD0] text-[#A0785A] border-[#C4A97D]/35"
                      }`}>
                        {idx === 0 && "A"}
                        {idx === 1 && "B"}
                        {idx === 2 && "C"}
                        {idx === 3 && "D"}
                      </span>
                      <div className={`p-2 rounded-xl border shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? "bg-[#6B4E35] text-[#F5F0E8] border-[#6B4E35]"
                          : "bg-[#E8DFD0]/40 text-[#A0785A] border-[#C4A97D]/20"
                      }`}>
                        {cat.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-serif font-bold text-[#2C2A27] leading-tight truncate">
                        {cat.title}
                      </h3>
                    </div>
                    
                    {/* Expand/Collapse Indicator */}
                    <div className={`w-8 h-8 rounded-full bg-[#E8DFD0]/50 flex items-center justify-center text-[#A0785A] border border-[#C4A97D]/35 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 bg-[#6B4E35]/10" : ""}`}>
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Category Content (Smooth animation on open) */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#C4A97D]/20 px-6 py-6 md:px-8 md:py-8 bg-[#F5F0E8]/30">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                            
                            {/* Left/Intro Column */}
                            <div className="lg:col-span-5 space-y-4">
                              <p className="text-sm text-[#2C2A27]/80 leading-relaxed font-light">
                                {cat.description}
                              </p>
                              
                              <div className="pt-2">
                                <div className="p-4 bg-[#E8DFD0]/40 rounded-2xl border border-[#C4A97D]/25">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A0785A] mb-1">
                                    Como essa regulação funciona:
                                  </h4>
                                  <p className="text-xs text-[#2C2A27]/90 leading-relaxed font-light">
                                    {idx === 0 && "O mapeamento guia você pelos dermátomos e pelas zonas reflexas mais receptivas à estimulação por sucção, otimizando a circulação fascial e garantindo uma descompressão muscular profunda."}
                                    {idx === 1 && "Atua no sistema nervoso autônomo (SNA), reduzindo o estresse e o cansaço ao estimular os receptores da pele para induzir um relaxamento muscular profundo."}
                                    {idx === 2 && "Ativa o retorno linfático e melhora a circulação local com técnicas de deslizamento controlado, ajudando a reduzir edemas e melhorar a firmeza da pele."}
                                    {idx === 3 && "Regula a motilidade visceral e ajuda a acalmar os sistemas gastrointestinal e respiratório com estímulos mecânicos suaves nos dermátomos correspondentes."}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Right/List Column (Protocols) */}
                            <div className="lg:col-span-7 space-y-3.5 border-t lg:border-t-0 lg:border-l border-[#C4A97D]/35 pt-6 lg:pt-0 lg:pl-8">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C2A27]/60 mb-3 flex items-center gap-1.5 pl-1">
                                <BookmarkCheck className="w-4 h-4 text-[#A0785A]" /> Alguns protocolos incluídos nesta categoria:
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-[#2C2A27]/90 font-light">
                                {cat.protocols.map((protocol, i) => (
                                  <div key={i} className="flex items-center gap-2.5 bg-[#E8DFD0]/30 px-3.5 py-2.5 rounded-xl border border-[#C4A97D]/20 hover:border-[#C4A97D]/50 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#A0785A] shrink-0" />
                                    <span>{protocol}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Bonus Section (3 free bonuses) */}
      <section id="bonuses" className="py-20 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold">Oferta Especial</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2A27]">
            E não para por aí: 3 bônus de grande valor de presente
          </h2>
          <p className="text-sm md:text-base text-[#2C2A27]/75 max-w-lg mx-auto">
            Incluídos automaticamente no seu acesso imediato, 100% gratuitos, sem nenhum custo adicional no futuro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bonus 1 */}
          <div className="bg-[#E8DFD0] rounded-3xl p-6 border border-[#C4A97D] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F0E8] border border-[#C4A97D]/30 relative flex items-center justify-center p-2 group">
                <img 
                  src="/src/assets/images/bonus_one_aromatique_1779572479501.png" 
                  alt="A Aliança Aromática" 
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#6B4E35] text-[#F5F0E8] text-[9px] font-bold px-2 py-1 rounded-full border border-[#C4A97D]/40 uppercase tracking-widest">
                  Bônus 1
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg text-[#2C2A27]">
                    A Aliança Aromática
                  </h3>
                </div>
                <p className="text-xs text-[#2C2A27]/80 leading-relaxed font-light">
                  Guia de sinergia entre ventosas e óleos essenciais — tabela de combinações, dosagens recomendadas e 3 protocolos inéditos.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#C4A97D]/30 mt-4 flex items-center justify-between">
              <span className="text-xs text-[#2C2A27]/60 line-through">Valor real: 67€</span>
              <span className="text-sm font-bold text-[#A0785A]">GRÁTIS HOJE</span>
            </div>
          </div>

          {/* Bonus 2 */}
          <div className="bg-[#E8DFD0] rounded-3xl p-6 border border-[#C4A97D] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F0E8] border border-[#C4A97D]/30 relative flex items-center justify-center p-2 group">
                <img 
                  src="https://iili.io/C2Xfwrb.png" 
                  alt="O Consultório Pronto para Usar" 
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith('.png')) {
                      target.src = 'https://iili.io/C2Xfwrb.png';
                    }
                  }}
                />
                <span className="absolute top-3 left-3 bg-[#6B4E35] text-[#F5F0E8] text-[9px] font-bold px-2 py-1 rounded-full border border-[#C4A97D]/40 uppercase tracking-widest">
                  Bônus 2
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg text-[#2C2A27]">
                    O Consultório Pronto para Usar
                  </h3>
                </div>
                <p className="text-xs text-[#2C2A27]/80 leading-relaxed font-light">
                  Ficha de anamnese, termo de consentimento livre e esclarecido e tabela de preços de atendimento — documentos em francês prontos para imprimir.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#C4A97D]/30 mt-4 flex items-center justify-between">
              <span className="text-xs text-[#2C2A27]/60 line-through">Valor real: 47€</span>
              <span className="text-sm font-bold text-[#A0785A]">GRÁTIS HOJE</span>
            </div>
          </div>

          {/* Bonus 3 */}
          <div className="bg-[#E8DFD0] rounded-3xl p-6 border border-[#C4A97D] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F0E8] border border-[#C4A97D]/30 relative flex items-center justify-center p-2 group">
                <img 
                  src="/src/assets/images/bonus_three_seasons_1779572499868.png" 
                  alt="O Ritmo das Estações" 
                  className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-[#6B4E35] text-[#F5F0E8] text-[9px] font-bold px-2 py-1 rounded-full border border-[#C4A97D]/40 uppercase tracking-widest">
                  Bônus 3
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-lg text-[#2C2A27]">
                    O Ritmo das Estações
                  </h3>
                </div>
                <p className="text-xs text-[#2C2A27]/80 leading-relaxed font-light">
                  4 sequências de atendimento adaptadas ao calendário europeu — primavera, verão, outono e inverno.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#C4A97D]/30 mt-4 flex items-center justify-between">
              <span className="text-xs text-[#2C2A27]/60 line-through">Valor real: 57€</span>
              <span className="text-sm font-bold text-[#A0785A]">GRÁTIS HOJE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Elegant Expert Section for Claire Fontaine */}
      <section id="expert" className="py-20 bg-[#E8DFD0] border-y border-[#C4A97D]/35 px-4 relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 text-center flex flex-col items-center">
          
          {/* Expert biography text column */}
          <div className="space-y-6 flex flex-col items-center">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold block">Criadora do Método</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2A27]">
                Seu guia assinado por <br className="hidden sm:inline" />
                <span className="text-[#A0785A] tracking-wider font-extrabold">CLAIRE FONTAINE</span>
              </h2>
            </div>

            <div className="space-y-4 text-sm md:text-base text-[#2C2A27]/90 leading-relaxed font-light">
              <p>
                Como profissional da saúde formada, especializada em reabilitação clínica e alívio da dor, dediquei mais de 12 anos à prática convencional até entender os seus limites diante de uma visão integral da saúde da pessoa.
              </p>
              <p>
                Apaixonada pelas abordagens integrativas, me formei em Acupuntura, Reflexologia e Drenagem Linfática com mestres renomados. Foi no meu próprio consultório que pude observar a extraordinária eficácia terapêutica das ventosas quando aplicadas seguindo um mapeamento anatômico rigoroso.
              </p>
              <p>
                Hoje, a minha missão é ajudar massoterapeutas, esteticistas e terapeutas holísticos a <strong className="font-semibold">profissionalizar e valorizar a sua prática com ventosas (cupping)</strong>, transformando-a em uma fonte de autoridade indiscutível.
              </p>
            </div>

            {/* Cabinet signature detail badge without Lyon reference */}
            <div className="inline-flex gap-3 items-center bg-[#F5F0E8] p-4 rounded-xl border border-[#C4A97D]/45 mx-auto">
              <Bookmark className="w-5 h-5 text-[#A0785A] shrink-0" />
              <p className="text-xs text-[#2C2A27] font-semibold tracking-wide">
                Consultório de Terapias Holísticas e Cuidados Integrativos
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 9. Second Feedback Grid ("Quem já usa, não volta atrás") */}
      <section id="proof" className="py-20 px-4 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold">Depoimentos</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2A27]">
            Quem usa não volta atrás
          </h2>
          <p className="text-sm md:text-base text-[#2C2A27]/75 max-w-lg mx-auto">
            Veja a experiência de terapeutas e profissionais que adotaram o método no dia a dia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: "veronique",
              name: "Véronique Martin",
              time: "há 7 dias",
              quote: "Antes eu levava 40 minutos para preparar cada sessão. Agora, em 5 minutos, sei exatamente onde posicionar as ventosas. Meus clientes notaram a diferença na hora! 🙌",
              role: "Massoterapeuta",
              avatar: "https://iili.io/C2WDiOJ.jpg"
            },
            {
              id: "maxime",
              name: "Maxime Lambert",
              time: "há 5 dias",
              quote: "Material extremamente bem ilustrado e prático. Uso no celular durante as sessões e os bônus são perfeitos para organizar o consultório. Vale cada centavo investido. 💯",
              role: "Fisioterapeuta Clínico",
              avatar: "https://iili.io/C2WDaAG.jpg"
            },
            {
              id: "camille",
              name: "Camille Fournier",
              time: "há 8 dias",
              quote: "A sequência lógica dos protocolos me deu um fio condutor que eu não tinha antes. Meus atendimentos chegaram a outro nível técnico e as indicações explodiram! ❤️",
              role: "Esteticista e Cosmetóloga",
              avatar: "https://iili.io/C2Wm8a1.jpg"
            }
          ].map((card) => (
            <div key={card.id} className="bg-[#E8DFD0] rounded-3xl p-6 border border-[#C4A97D]/45 shadow-sm space-y-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-center gap-3">
                {card.avatar ? (
                  <img 
                    src={card.avatar} 
                    alt={card.name} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#6B4E35]/25" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#6B4E35]/15 text-[#6B4E35] flex items-center justify-center font-bold text-sm">
                    {card.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-sm text-[#2C2A27]">{card.name}</h4>
                  <p className="text-[10px] text-[#2C2A27]/50">{card.role} • {card.time}</p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#2C2A27]/85 font-light leading-relaxed italic">
                "{card.quote}"
              </p>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#C4A97D]/20">
                <button 
                  onClick={() => handleLike(card.id)}
                  className={`flex items-center gap-1 cursor-pointer font-semibold ${userLiked[card.id] ? "text-[#A0785A]" : "text-[#2C2A27]/60 hover:text-[#A0785A]"}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${userLiked[card.id] ? "fill-[#A0785A]" : ""}`} />
                  <span>Curtir ({socialLikes[card.id]})</span>
                </button>
                <span className="text-[10px] text-[#2C2A27]/40 font-light">Profissional Verificado</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Pricing & Checkout Board */}
      <section 
        id="checkout" 
        ref={pricingSectionRef}
        className="py-20 bg-[#E8DFD0] border-y border-[#C4A97D]/50 px-4 scroll-mt-6"
      >
        <div className="max-w-xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold">Inscrição Imediata</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2A27]">
              Garanta o seu acesso completo
            </h2>
            <p className="text-sm text-[#2C2A27]/75">
              Receba o compêndio com os 100 protocolos oficiais e todos os bônus de lançamento incluídos.
            </p>
          </div>

          {/* Golden Badge Card Pricing Frame */}
          <div className="bg-[#F5F0E8] rounded-3xl border-2 border-[#C4A97D] shadow-2xl relative overflow-hidden text-left">
            {/* Dark Top bar on checkout card */}
            <div className="bg-[#6B4E35] text-[#F5F0E8] py-4 px-6 text-center border-b border-[#C4A97D]/30">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C4A97D]">
                PLANO ESPECIAL • OFERTA LIMITADA
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Offer checklists */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 font-medium text-[#2C2A27]">
                    <CheckCircle className="w-4.5 h-4.5 text-[#A0785A]" />
                    Compêndio de Ventosaterapia Clínica
                  </span>
                  <span className="text-[#2C2A27]/60 font-mono text-xs">69,00 €</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 font-medium text-[#2C2A27]">
                    <CheckCircle className="w-4.5 h-4.5 text-[#A0785A]" />
                    Bônus 01: A Aliança Aromática
                  </span>
                  <span className="text-[#2C2A27]/60 font-mono text-xs">47,00 €</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 font-medium text-[#2C2A27]">
                    <CheckCircle className="w-4.5 h-4.5 text-[#A0785A]" />
                    Bônus 02: O Consultório Pronto para Usar
                  </span>
                  <span className="text-[#2C2A27]/60 font-mono text-xs">27,00 €</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5 font-medium text-[#2C2A27]">
                    <CheckCircle className="w-4.5 h-4.5 text-[#A0785A]" />
                    Bônus 03: O Ritmo das Estações
                  </span>
                  <span className="text-[#2C2A27]/60 font-mono text-xs">17,00 €</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-[#C4A97D]/20 pt-3">
                  <span className="flex items-center gap-2.5 font-semibold text-[#A0785A]">
                    <CheckCircle className="w-4.5 h-4.5 text-[#A0785A]" />
                    Suporte VIP e Acesso Vitalício
                  </span>
                  <span className="text-[#A0785A] font-semibold text-xs uppercase bg-[#A0785A]/10 px-2 py-0.5 rounded">Grátis</span>
                </div>
              </div>

              {/* Price comparison labels */}
              <div className="border-t border-[#C4A97D]/20 pt-6 text-center space-y-2">
                <span className="text-xs text-[#2C2A27]/50 block">De 160,00 € por apenas</span>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-[#A0785A] font-serif text-2xl font-semibold">€</span>
                  <span className="text-[#2C2A27] font-serif text-5xl font-bold tracking-tight">27,00</span>
                </div>
                <span className="text-xs text-[#2C2A27]/70 block font-light">
                  ou em até <strong>8x de 3,37 €</strong>
                </span>
                
                <div className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-emerald-200 mt-2">
                  Economia Real de 133,00 €
                </div>
              </div>

              {/* Button checkout triggers */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => window.open("https://pay.hotmart.com/N106028023S?checkoutMode=10", "_blank")}
                  className="w-full py-4.5 bg-[#6B4E35] text-[#F5F0E8] rounded-2xl font-bold text-center text-lg transition-transform hover:scale-[1.01] active:scale-100 cursor-pointer shadow-lg hover:bg-[#6B4E35]/95 tracking-wide uppercase"
                >
                  QUERO MEUS PROTOCOLOS
                </button>
                <div className="text-[10px] text-center text-[#2C2A27]/60 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#A0785A]" /> Pagamento protegido com criptografia SSL • Acesso imediato
                </div>
              </div>

              {/* Payment vector indicators */}
              <div className="border-t border-[#C4A97D]/20 pt-4 flex flex-wrap justify-center items-center gap-3 opacity-80 shrink-0">
                {["VISA", "Mastercard", "Apple Pay", "PayPal", "Stripe"].map((card, i) => (
                  <span key={i} className="text-[10px] bg-[#E8DFD0] text-[#2C2A27]/80 px-2.5 py-1 rounded font-mono border border-[#C4A97D]/20 uppercase">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Security & Guarantee Section */}
      <section id="guarantee" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-[#E8DFD0] rounded-3xl p-8 md:p-12 border border-[#C4A97D] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-3 flex justify-center">
            {/* Visual badge mimicking 7 days icon */}
            <div className="w-24 h-24 rounded-full bg-[#6B4E35] border-4 border-[#C4A97D] flex flex-col items-center justify-center text-[#F5F0E8] shadow-md">
              <span className="font-serif text-3xl font-bold font-serif leading-none">7</span>
              <span className="text-[9px] uppercase tracking-widest font-bold mt-0.5">Dias de</span>
              <span className="text-[8px] uppercase tracking-widest leading-none">Garantia</span>
            </div>
          </div>

          <div className="md:col-span-9 space-y-4 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2C2A27]">
              Garantia Incondicional de 7 Dias
            </h3>
            <p className="text-xs md:text-sm text-[#2C2A27]/95 leading-relaxed font-light">
              Compre com total segurança! Você tem 7 dias completos para explorar o material, consultar as 100 fichas clínicas e testar os 3 bônus de presente. Se, por qualquer motivo, sentir que esse investimento não elevou o nível técnico das suas sessões, é só pedir o reembolso por e-mail: devolvemos 100% do valor pago, sem perguntas.
            </p>
          </div>
        </div>
      </section>

      {/* 12. Elegant FAQ Accordion */}
      <section id="faq" className="py-20 bg-[#E8DFD0] border-y border-[#C4A97D]/35 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#A0785A] font-bold">Suporte e Dúvidas</span>
            <h2 className="text-3xl font-serif font-bold text-[#2C2A27]">
              Ficou com dúvidas? A gente responde.
            </h2>
            <p className="text-sm text-[#2C2A27]/70">
              Confira as perguntas frequentes para esclarecer as dúvidas e os aspectos práticos do guia.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#F5F0E8] border border-[#C4A97D]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#C4A97D]"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between text-[#2C2A27] font-semibold text-sm md:text-base cursor-pointer hover:bg-[#F5F0E8]/70"
                  >
                    <span>{faq.question}</span>
                    <span className="w-6 h-6 rounded-full bg-[#E8DFD0] flex items-center justify-center text-[#A0785A]">
                      {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>

                  <div 
                    className={`transition-all duration-300 md:text-sm text-xs font-light text-[#2C2A27]/90 bg-[#E8DFD0]/30 border-t border-[#C4A97D]/10 overflow-hidden ${
                      isOpen ? "max-h-[300px] p-5 leading-relaxed" : "max-h-0"
                    }`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13. High-Converting Call-Out Footer Banner */}
      <section id="conclusion" className="py-20 px-4 text-center bg-[#6B4E35] text-[#F5F0E8] border-b border-[#C4A97D]/35 text-center relative overflow-hidden">
        {/* Soft atmospheric background lights */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#A0785A]/15 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight">
            Daqui a 5 minutos, você pode estar com o compêndio completo dos 100 protocolos nas mãos.
          </h2>
          <p className="text-sm md:text-base text-[#F5F0E8]/85 max-w-lg mx-auto leading-relaxed font-light">
            Ou pode fechar esta página e continuar improvisando no seu próximo atendimento. A escolha é totalmente sua. Mas lembre-se: <strong className="text-[#C4A97D]">este preço de lançamento é por tempo limitado</strong>.
          </p>

          <div className="pt-4 space-y-3">
            <button 
              onClick={() => window.open("https://pay.hotmart.com/N106028023S?checkoutMode=10", "_blank")}
              className="px-10 py-5 bg-[#F5F0E8] text-[#6B4E35] rounded-xl font-bold tracking-widest text-base shadow-xl transition-all hover:scale-[1.01] hover:shadow-2xl hover:bg-white cursor-pointer uppercase"
            >
              QUERO MEUS PROTOCOLOS
            </button>
            <p className="text-[10px] text-[#F5F0E8]/60 uppercase tracking-widest font-mono">
              [ Compra 100% Segura • 27,00 € em Pagamento Único ]
            </p>
          </div>
        </div>
      </section>

      {/* 14. Standard Minimalist Legal Footer */}
      <footer id="footer" className="py-10 bg-[#2C2A27] text-[#F5F0E8]/60 border-t border-black/25 px-4 text-center space-y-3 text-xs md:text-sm font-light">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 • 100 Protocolos de Ventosaterapia. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-xs font-medium text-[#C4A97D]">
            <span className="hover:underline cursor-pointer">Segurança</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Privacidade</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Termos de Uso</span>
          </div>
        </div>
        <p className="text-[10px] text-[#F5F0E8]/30 max-w-2xl mx-auto leading-relaxed">
          Aviso Legal: os protocolos descritos neste compêndio têm finalidade exclusivamente educativa e de apoio integrativo. O diagnóstico de doenças ou condições físicas é de competência exclusiva dos profissionais de saúde.
        </p>
      </footer>

      {/* Sales notification toast in bottom-left corner with custom French name pairings */}
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            id="sales-notification-toast"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 left-4 z-50 bg-[#F5F0E8]/95 border-2 border-[#C4A97D] text-[#2C2A27] rounded-2xl shadow-2xl p-4 max-w-sm w-[90%] md:w-auto flex items-start gap-3.5 backdrop-blur-md shadow-[#6B4E35]/15"
          >
            {/* Round initial badge with active pulsing green light */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-full bg-[#6B4E35] text-[#F5F0E8] flex items-center justify-center font-bold font-serif text-base border-2 border-[#C4A97D]">
                {currentNotification.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#F5F0E8] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Notification content */}
            <div className="flex-1 space-y-1 text-left min-w-0">
              <p className="text-xs font-semibold leading-relaxed tracking-tight break-words">
                <span className="text-[#A0785A] font-bold">{currentNotification.name}</span> de {currentNotification.city}
              </p>
              <p className="text-[11px] text-[#2C2A27]/80 leading-normal font-light">
                {currentNotification.action}
              </p>
              <p className="text-[10px] text-[#2C2A27]/50 font-mono">
                {currentNotification.timeAgo} • compra verificada ✅
              </p>
            </div>

            {/* Closing button */}
            <button 
              onClick={() => setCurrentNotification(null)}
              className="text-[#2C2A27]/40 hover:text-[#A0785A] transition-colors p-1"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
