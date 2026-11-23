export interface PainPoint {
  id: string;
  text: string;
  description: string;
}

export interface ProtocolCategory {
  title: string;
  description: string;
  protocols: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const PAIN_POINTS: PainPoint[] = [
  {
    id: "pain-1",
    text: "Falta de confiança perante patologias complexas",
    description: "Às vezes hesita sobre o posicionamento exato das ventosas para aliviar dores crónicas, nevralgias ou problemas digestivos específicos."
  },
  {
    id: "pain-2",
    text: "Pressão constante de tempo por consulta",
    description: "Perde minutos preciosos a procurar o protocolo adequado em papeladas antigas ou no Google enquanto o seu cliente espera na marquesa."
  },
  {
    id: "pain-3",
    text: "Dificuldade em justificar e valorizar as suas tarifas",
    description: "Sem um método clínico estruturado ou fichas de acompanhamento claras para entregar, é difícil cobrar valores premium por sessões de cupping."
  },
  {
    id: "pain-4",
    text: "Insegurança quanto às contraindicações rigorosas",
    description: "O receio de cometer um erro terapêutico (marcas excessivas, zonas de órgãos sensíveis, casos de problemas venosos) pesa sobre a sua prática."
  },
  {
    id: "pain-5",
    text: "Clientela irregular que não volta a agendar",
    description: "Os seus clientes gostam da sessão, mas têm dificuldade em ver um plano de acompanhamento a longo prazo associado à evolução dos seus sintomas."
  },
  {
    id: "pain-6",
    text: "Falta de sinergia com outras abordagens terapêuticas",
    description: "Sabe que combinar as ventosas com a aromaterapia ou com as estações do ano multiplicaria os resultados, mas carece de um guia preciso e seguro."
  }
];

export const PROTOCOL_CATEGORIES: ProtocolCategory[] = [
  {
    title: "Dores & Sistema Musculoesquelético",
    description: "Protocolos de ação rápida para libertar tensões miofasciais e acalmar a inflamação.",
    protocols: [
      "Lombalgias agudas e crónicas (L4-S1)",
      "Ciáticas e cruralgias rebeldes",
      "Cervicalgias de tensão e torcicolo",
      "Tendinopatias de Aquiles e rotulianas",
      "Nevralgia de Arnold e tensões suboccipitais",
      "Periartrite escapuloumeral (ombro congelado)",
      "Descompressão myofascial global das costas"
    ]
  },
  {
    title: "Sistema Digestivo & Orgânico",
    description: "Regulações reflexas viscerais através da estimulação das zonas dermatómicas de Head.",
    protocols: [
      "Inchaço abdominal e cólon irritável (regulação de trânsito)",
      "Espasmos gástricos e refluxo gastroesofágico (RGE)",
      "Apoio metabólico e desintoxicação hepática",
      "Cãibras e dores menstruais (dismenorreia)",
      "Estimulação da energia vital (Meridianos das Costas)"
    ]
  },
  {
    title: "Sistema Circulatório & Linfático",
    description: "Ative mecanismos potentes de retorno venoso e alisamento cutâneo.",
    protocols: [
      "Sensação de pernas pesadas e estase venosa",
      "Drenagem linfática profunda dos membros inferiores",
      "Protocolo para celulite adiposa e aquosa (coxas/nádegas)",
      "Relançamento microcirculatório pós-esforço intenso",
      "Retenção de líquidos e edema nos tornozelos"
    ]
  },
  {
    title: "Gestão de Stress, Sono & Estado Mental",
    description: "Ação neurovegetativa no sistema parassimpático para um apaziguamento profundo.",
    protocols: [
      "Insónias provocadas por ansiedade e dificuldade em adormecer",
      "Esgotamento profissional (Burnout) e fadiga adrenal",
      "Protocolo 'Ancoragem e Respiração' (Libertação do diafragma)",
      "Cefaleias de tensão e enxaquecas oftálmicas",
      "Tensões emocionais somatizadas no plexo solar"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Celine Goutier",
    role: "Osteopata D.O. & Terapeuta de Medicina Chinesa",
    location: "Genebra, Suíça",
    quote: "Uma base clínica de clareza incomparável. Os meus pacientes adoram ver a ficha explicativa antes de começarmos o cupping. Por 27€, é um presente inestimável para estruturar a prática. Pouco tempo todos os dias.",
    avatarText: "CG"
  },
  {
    name: "Marc-Antoine Laurent",
    role: "Fisioterapeuta Desportivo",
    location: "Bordéus, França",
    quote: "Utilizo os protocolos musculoesqueléticos para a recuperação dos meus atletas. A aliança com os óleos essenciais (Bónus 1) traz um valor acrescentado imenso. Os meus resultados de relaxamento muscular duplicaram.",
    avatarText: "ML"
  },
  {
    name: "Sofia Belkacem",
    role: "Profissional de Bem-Estar & Esteticista Holística",
    location: "Bruxelas, Bélgica",
    quote: "A ficha de consentimento e a tabela de preços (Bónus 2) permitiram-me lançar um pacote 'Minerva & Cupping' com total segurança logo no dia seguinte. Recuperei este investimento logo na primeira consulta da semana!",
    avatarText: "SB"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "A quem se dirige exatamente este compêndio de protocolos?",
    answer: "Este compêndio foi concebido para profissionais de bem-estar e da saúde: massagistas, osteopatas, fisioterapeutas, acupuntores, naturopatas, terapeutas de medicina tradicional chinesa, reflexologistas, esteticistas e relaxologistas. É ideal tanto para profissionais experientes que desejam diversificar a sua oferta quanto para iniciantes em busca de um enquadramento seguro."
  },
  {
    question: "Em que formato o produto é entregue?",
    answer: "Trata-se de um produto 100% digital. Assim que o seu pagamento (seguro, de 27€) for confirmado, receberá instantaneamente os seus dados de descarregamento por e-mail. Poderá ler os protocolos no seu telemóvel, tablet ou computador, bem como imprimir as fichas que desejar para o seu gabinete."
  },
  {
    question: "Preciso de material específico para aplicar estes protocolos?",
    answer: "Pode aplicar estes protocolos com ventosas manuais de plástico com bomba de aspiração, ventosas tradicionais de vidro (a fogo) ou ventosas de silicone flexível. A teoria adapta-se perfeitamente a todo o tipo de ferramentas."
  },
  {
    question: "Como funciona a garantia de 15 dias?",
    answer: "É muito simples. Se durante os 15 dias após a sua compra considerar que as fichas e bónus não lhe trazem valor prático ou não estão ao nível profissional que esperava, envie-nos um simples e-mail. Reembolsaremos a totalidade dos 27€ sem questionamentos complicados."
  },
  {
    question: "As contraindicações estão explicitamente descritas?",
    answer: "Sim. Para cada protocolo e de forma geral, as precauções de saúde, as zonas sensíveis a evitar e as contraidicações principais (problemas cardiovasculares, afeções cutâneas, gravidez, etc.) são exibidas com clareza para garantir a segurança absoluta dos seus clientes."
  },
  {
    question: "Os protocolos integram pontos e meridianos energéticos?",
    answer: "Sim, a maioria das fichas associa a visão clínica ocidental (tensões musculares, pontos-gatilho, drenagem circulatória) à cartografia ancestral (pontos Shu dorsais, meridianos de acupuntura) de modo a oferecer uma abordagem holística."
  },
  {
    question: "Posso utilizar os bónus de imediato?",
    answer: "Sem dúvida. O pack 'Gabinete Pronto a Usar' (Bónus 2) inclui modelos PDF / textos prontos a adaptar para a sua ficha de anamnese, o seu termo de consentimento informado e uma tabela de preços otimizada que pode copiar e adotar hoje mesmo."
  },
  {
    question: "O pagamento é seguro? Existe alguma subscrição oculta?",
    answer: "O pagamento conta com 15 dias de garantia e é 100% seguro via Stripe/PayPal com encriptação SSL. Trata-se de uma compra única de 27€. Não existe ABSOLUTAMENTE nenhum tipo de mensalidade ou taxas ocultas no futuro."
  }
];
