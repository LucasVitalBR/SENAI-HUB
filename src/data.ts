import { NoticeItem, UserProfile, LabItem, SimulatedWeek } from './types';

export const NOTICES_DATA: NoticeItem[] = [
  {
    id: 1,
    title: "Lançamento de Notas - Jovem Aprendiz Copasul",
    content: "Todos os instrutores que ministram disciplinas vinculadas aos programas de Jovem Aprendizagem Industrial em parceria com a Copasul e a Usina Rio Amambai devem lançar as notas e frequências no sistema acadêmico até a próxima sexta-feira. Esse prazo é crítico para o fechamento dos relatórios corporativos das empresas parceiras.",
    urgency: "high",
    time: "Há 10 minutos"
  },
  {
    id: 2,
    title: "Manutenção Preventiva - Laboratório Maker",
    content: "O Laboratório Maker passará por uma manutenção preventiva para calibração das impressoras 3D e corte a laser. O espaço estará indisponível na quinta-feira das 13:00 às 17:00. Instrutores com aulas agendadas foram realocados para a sala de teoria 04.",
    urgency: "normal",
    time: "Há 2 horas"
  },
  {
    id: 3,
    title: "Entrega de Diários de Classe - Julho/2026",
    content: "Lembramos a todos os docentes que o prazo final para assinatura física e digital dos diários de classe referentes às turmas encerradas no mês de Junho/Julho é quarta-feira (15/07). Favor entregar a documentação preenchida na Coordenação Pedagógica com Jaqueline Sant'Anna.",
    urgency: "high",
    time: "Ontem"
  },
  {
    id: 4,
    title: "Reunião Geral com Direção - Conexão Docente",
    content: "Teremos nossa reunião pedagógica de alinhamento com a Coordenadora Geral Taís Gimenez no próximo sábado, das 08:00 às 12:00, no auditório principal. Presença de todos os instrutores, estagiários e equipe técnica.",
    urgency: "normal",
    time: "Há 2 dias"
  }
];

export const DEFAULT_USER_PROFILES: Record<string, UserProfile> = {
  lucas: {
    name: "Lucas Vital",
    role: "Instrutor",
    tag: "Instrutor - Elétrica",
    discipline: "Eletrônica Industrial e IoT",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    initials: "LV",
    schedule: {
      current: {
        0: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Sensores e Atuadores para IoT", class: "IoT-M1", lab: "Lab. Maker", students: 15 }
        ],
        1: [],
        2: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Eletrônica Industrial", class: "EAE-2026", lab: "Lab. Elétrica", students: 22 }
        ],
        3: [],
        4: [], 5: [], 6: []
      },
      next: {
        0: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Sensores e Atuadores para IoT", class: "IoT-M1", lab: "Lab. Maker", students: 15 }
        ],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [
          { timeStart: "07:30", timeEnd: "11:30", subject: "Projeto Integrador IoT", class: "IoT-M1", lab: "Lab. Maker", students: 15 },
          { timeStart: "13:00", timeEnd: "17:00", subject: "Projeto Integrador IoT", class: "IoT-M1", lab: "Lab. Maker", students: 15 }
        ],
        6: []
      }
    }
  },
  ederson: {
    name: "Ederson Ivan Cardoso",
    role: "Instrutor",
    tag: "Instrutor - Elétrica",
    discipline: "Eletricidade e Automação CLP",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ederson",
    initials: "EC",
    schedule: {
      current: {
        0: [
          { timeStart: "08:00", timeEnd: "11:30", subject: "Instalações Industriais", class: "Téc. Eletrotécnica", lab: "Lab. Elétrica", students: 20 }
        ],
        1: [
          { timeStart: "08:00", timeEnd: "11:30", subject: "Lógica de CLP", class: "Téc. Automação", lab: "Lab. Elétrica", students: 18 }
        ],
        2: [],
        3: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Sistemas de Automação", class: "Téc. Automação", lab: "Lab. Elétrica", students: 22 }
        ],
        4: [], 5: [], 6: []
      },
      next: {
        0: [
          { timeStart: "08:00", timeEnd: "11:30", subject: "Instalações Industriais", class: "Téc. Eletrotécnica", lab: "Lab. Elétrica", students: 20 }
        ],
        1: [
          { timeStart: "08:00", timeEnd: "11:30", subject: "Lógica de CLP", class: "Téc. Automação", lab: "Lab. Elétrica", students: 18 }
        ],
        2: [], 3: [], 4: [], 5: [], 6: []
      }
    }
  },
  tais: {
    name: "Taís Gimenez",
    role: "Administrador",
    tag: "Coordenação Geral",
    discipline: "Gestão Estratégica Unidade",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tais",
    initials: "TG",
    schedule: {
      current: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  },
  jaqueline: {
    name: "Jaqueline Sant'Anna",
    role: "Coordenador",
    tag: "Coordenação Pedagógica",
    discipline: "Gestão Pedagógica de Cursos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jaqueline",
    initials: "JS",
    schedule: {
      current: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  },
  gessica: {
    name: "Géssica Muniz",
    role: "Instrutor",
    tag: "Instrutor - Gestão",
    discipline: "Administração e Logística",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gessica",
    initials: "GM",
    schedule: {
      current: {
        0: [],
        1: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Teoria Geral da Administração", class: "Téc. Administração", lab: "Lab. CAD", students: 25 }
        ],
        2: [],
        3: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Gestão de Cadeia de Suprimentos", class: "Téc. Logística", lab: "Lab. CAD", students: 22 }
        ],
        4: [], 5: [], 6: []
      },
      next: {
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
      }
    }
  },
  vilson: {
    name: "Vilson Rodrigues",
    role: "Instrutor",
    tag: "Instrutor - Mecânica",
    discipline: "Metalmecânica e Soldagem",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vilson",
    initials: "VR",
    schedule: {
      current: {
        0: [
          { timeStart: "13:00", timeEnd: "17:00", subject: "Processos de Ajustagem", class: "Jovem Aprendiz Eletromecânica", lab: "Oficina Mecânica", students: 16 }
        ],
        1: [],
        2: [
          { timeStart: "13:00", timeEnd: "17:00", subject: "Soldagem Industrial MIG/TIG", class: "Téc. Eletromecânica", lab: "Oficina Mecânica", students: 18 }
        ],
        3: [], 4: [], 5: [], 6: []
      },
      next: {
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
      }
    }
  },
  marcos: {
    name: "Marcos Aurélio",
    role: "Manutenção",
    tag: "Técnico de Manutenção",
    discipline: "Infraestrutura predial e de TI",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos",
    initials: "MA",
    schedule: {
      current: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  },
  rosemilda: {
    name: "Rosemilda",
    role: "Estagiário",
    tag: "Estagiária",
    discipline: "Suporte e Apoio Secretaria",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rose",
    initials: "RM",
    schedule: {
      current: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  },
  jessica_m: {
    name: "Jéssica Martins",
    role: "Instrutor",
    tag: "Instrutor - Gestão",
    discipline: "Gestão Organizacional",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JessicaM",
    initials: "JM",
    schedule: {
      current: {
        1: [
          { timeStart: "13:00", timeEnd: "17:00", subject: "Comportamento Organizacional", class: "Téc. Administração", lab: "Lab. CAD", students: 24 }
        ],
        0: [], 2: [], 3: [], 4: [], 5: [], 6: []
      },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  },
  flavio: {
    name: "Flávio Welter",
    role: "Instrutor",
    tag: "Instrutor - Elétrica",
    discipline: "Instalações de Baixa Tensão",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Flavio",
    initials: "FW",
    schedule: {
      current: {
        3: [
          { timeStart: "13:00", timeEnd: "17:00", subject: "Segurança em Eletricidade NR10", class: "Téc. Eletrotécnica", lab: "Lab. Elétrica", students: 22 }
        ],
        0: [], 1: [], 2: [], 4: [], 5: [], 6: []
      },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  },
  janaina: {
    name: "Janaina Facco",
    role: "Instrutor",
    tag: "Instrutor - Química",
    discipline: "Química Industrial e Açúcar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Janaina",
    initials: "JF",
    schedule: {
      current: {
        4: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Análise Físico-Química", class: "Téc. Açúcar e Álcool", lab: "Laboratório Maker", students: 20 }
        ],
        0: [], 1: [], 2: [], 3: [], 5: [], 6: []
      },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  },
  jhonatan: {
    name: "Jhonatan Manoel",
    role: "Instrutor",
    tag: "Instrutor - Segurança",
    discipline: "Saúde e Segurança Ocupacional",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jhonatan",
    initials: "JM",
    schedule: {
      current: {
        2: [
          { timeStart: "19:00", timeEnd: "22:30", subject: "Normas Regulamentadoras", class: "Téc. Automação", lab: "Laboratório de Eletricidade", students: 19 }
        ],
        0: [], 1: [], 3: [], 4: [], 5: [], 6: []
      },
      next: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    }
  }
};

export const DEFAULT_LABS_OCCUPANCY_DATA: Record<number, LabItem[]> = {
  0: [
    { name: "Laboratório de Elétrica", cap: 22, resp: "Ederson Ivan Cardoso", status: "ocupado", schedules: ["08:00 - Instalações Industriais (Téc. Eletrotécnica)"] },
    { name: "Laboratório CAD", cap: 30, resp: "Jaqueline Sant'Anna", status: "livre", schedules: [] },
    { name: "Oficina Mecânica", cap: 18, resp: "Vilson Rodrigues", status: "ocupado", schedules: ["13:00 - Processos de Ajustagem (Jovem Aprendiz)"] },
    { name: "Laboratório Maker 4.0", cap: 15, resp: "Lucas Vital", status: "ocupado", schedules: ["19:00 - Sensores e Atuadores (IoT-M1)"] }
  ],
  1: [
    { name: "Laboratório de Elétrica", cap: 22, resp: "Ederson Ivan Cardoso", status: "ocupado", schedules: ["08:00 - Lógica de CLP (Téc. Automação)"] },
    { name: "Laboratório CAD", cap: 30, resp: "Géssica Muniz", status: "ocupado", schedules: ["19:00 - Teoria Geral da Administração (Téc. Administração)"] },
    { name: "Oficina Mecânica", cap: 18, resp: "Vilson Rodrigues", status: "livre", schedules: [] },
    { name: "Laboratório Maker 4.0", cap: 15, resp: "Lucas Vital", status: "livre", schedules: [] }
  ],
  2: [
    { name: "Laboratório de Elétrica", cap: 22, resp: "Lucas Vital", status: "ocupado", schedules: ["19:00 - Eletrônica Industrial (EAE-2026)"] },
    { name: "Laboratório CAD", cap: 30, resp: "Jaqueline Sant'Anna", status: "livre", schedules: [] },
    { name: "Oficina Mecânica", cap: 18, resp: "Vilson Rodrigues", status: "ocupado", schedules: ["13:00 - Soldagem Industrial MIG/TIG (Téc. Eletromecânica)"] },
    { name: "Laboratório Maker 4.0", cap: 15, resp: "Lucas Vital", status: "livre", schedules: [] }
  ],
  3: [
    { name: "Laboratório de Elétrica", cap: 22, resp: "Ederson Ivan Cardoso", status: "ocupado", schedules: ["19:00 - Sistemas de Automação"] },
    { name: "Laboratório CAD", cap: 30, resp: "Géssica Muniz", status: "ocupado", schedules: ["19:00 - Gestão de Cadeia de Suprimentos"] },
    { name: "Oficina Mecânica", cap: 18, resp: "Vilson Rodrigues", status: "livre", schedules: [] },
    { name: "Laboratório Maker 4.0", cap: 15, resp: "Lucas Vital", status: "livre", schedules: [] }
  ],
  4: [
    { name: "Laboratório de Elétrica", cap: 22, resp: "Ederson Ivan Cardoso", status: "livre", schedules: [] },
    { name: "Laboratório CAD", cap: 30, resp: "Jaqueline Sant'Anna", status: "livre", schedules: [] },
    { name: "Oficina Mecânica", cap: 18, resp: "Vilson Rodrigues", status: "livre", schedules: [] },
    { name: "Laboratório Maker 4.0", cap: 15, resp: "Janaina Facco", status: "ocupado", schedules: ["19:00 - Análise Físico-Química (Téc. Açúcar e Álcool)"] }
  ],
  5: [
    { name: "Laboratório de Elétrica", cap: 22, resp: "Lucas Vital", status: "ocupado", schedules: ["07:30 - Projeto Integrador IoT"] },
    { name: "Laboratório CAD", cap: 30, resp: "Jaqueline Sant'Anna", status: "livre", schedules: [] },
    { name: "Oficina Mecânica", cap: 18, resp: "Vilson Rodrigues", status: "livre", schedules: [] },
    { name: "Laboratório Maker 4.0", cap: 15, resp: "Lucas Vital", status: "ocupado", schedules: ["13:00 - Projeto Integrador IoT"] }
  ],
  6: [
    { name: "Laboratório de Elétrica", cap: 22, resp: "Nenhum", status: "livre", schedules: [] },
    { name: "Laboratório CAD", cap: 30, resp: "Nenhum", status: "livre", schedules: [] },
    { name: "Oficina Mecânica", cap: 18, resp: "Nenhum", status: "livre", schedules: [] },
    { name: "Laboratório Maker 4.0", cap: 15, resp: "Nenhum", status: "livre", schedules: [] }
  ]
};

export const WEEKDAYS_SHORT = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
export const WEEKDAYS_FULL = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

export const SIMULATED_WEEKS: Record<string, SimulatedWeek> = {
  current: {
    dates: [13, 14, 15, 16, 17, 18, 19],
    monthNum: 6,
    monthYear: "Julho de 2026"
  },
  next: {
    dates: [20, 21, 22, 23, 24, 25, 26],
    monthNum: 6,
    monthYear: "Julho de 2026"
  }
};

export const STATIC_EVENTS_BY_MONTH: Record<'Junho' | 'Julho' | 'Agosto', Record<number, { matutino?: any; vespertino?: any; noturno?: any }>> = {
  Junho: {
    2: { noturno: { subject: "Lógica de CLP", instructor: "Ederson Ivan Cardoso", class: "Téc. Automação", lab: "Lab. Elétrica", students: 18 } },
    4: { vespertino: { subject: "Sistemas Microcontrolados", instructor: "Lucas Vital", class: "Téc. Eletrotécnica", lab: "Laboratório Maker 4.0", students: 15 } },
    8: { noturno: { subject: "Eletrônica Industrial", instructor: "Lucas Vital", class: "EAE-2026", lab: "Lab. Elétrica", students: 22 } },
    10: { vespertino: { subject: "Desenho Auxiliado por Computador", instructor: "Géssica Muniz", class: "Téc. Logística", lab: "Lab. CAD", students: 20 } },
    15: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } },
    18: { matutino: { subject: "Projeto Integrador IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } },
    22: { vespertino: { subject: "Lógica de CLP", instructor: "Ederson Ivan Cardoso", class: "Téc. Automação", lab: "Lab. Elétrica", students: 18 } },
    24: { noturno: { subject: "Eletrônica Industrial", instructor: "Lucas Vital", class: "EAE-2026", lab: "Lab. Elétrica", students: 22 } },
    26: { noturno: { subject: "Sistemas Microcontrolados", instructor: "Lucas Vital", class: "Téc. Eletrotécnica", lab: "Laboratório Maker 4.0", students: 15 } },
    29: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } }
  },
  Julho: {
    1: { noturno: { subject: "Eletrônica Industrial", instructor: "Lucas Vital", class: "EAE-2026", lab: "Lab. Elétrica", students: 22 } },
    2: { vespertino: { subject: "Lógica de CLP", instructor: "Lucas Vital", class: "Téc. Automação", lab: "Lab. Elétrica", students: 18 } },
    3: { 
      vespertino: { subject: "Sistemas Microcontrolados", instructor: "Lucas Vital", class: "Téc. Eletrotécnica", lab: "Laboratório Maker 4.0", students: 15 },
      noturno: { subject: "Desenho Auxiliado por Computador", instructor: "Géssica Muniz", class: "Téc. Administração", lab: "Lab. CAD", students: 20 }
    },
    7: { noturno: { subject: "Desenho Auxiliado por Computador", instructor: "Géssica Muniz", class: "Téc. Administração", lab: "Lab. CAD", students: 20 } },
    8: { vespertino: { subject: "Sistemas Microcontrolados", instructor: "Lucas Vital", class: "Téc. Eletrotécnica", lab: "Laboratório Maker 4.0", students: 15 } },
    10: { vespertino: { subject: "Lógica de CLP", instructor: "Lucas Vital", class: "Téc. Automação", lab: "Lab. Elétrica", students: 18 } },
    13: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } },
    15: { noturno: { subject: "Eletrônica Industrial", instructor: "Lucas Vital", class: "EAE-2026", lab: "Lab. Elétrica", students: 22 } },
    20: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } },
    25: { 
      matutino: { subject: "Projeto Integrador IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 },
      vespertino: { subject: "Projeto Integrador IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 }
    },
    27: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } }
  },
  Agosto: {
    3: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } },
    5: { vespertino: { subject: "Sistemas Microcontrolados", instructor: "Lucas Vital", class: "Téc. Eletrotécnica", lab: "Laboratório Maker 4.0", students: 15 } },
    7: { noturno: { subject: "Desenho Auxiliado por Computador", instructor: "Géssica Muniz", class: "Téc. Logística", lab: "Lab. CAD", students: 20 } },
    10: { noturno: { subject: "Eletrônica Industrial", instructor: "Lucas Vital", class: "EAE-2026", lab: "Lab. Elétrica", students: 22 } },
    12: { vespertino: { subject: "Lógica de CLP", instructor: "Ederson Ivan Cardoso", class: "Téc. Automação", lab: "Lab. Elétrica", students: 18 } },
    14: { noturno: { subject: "Sistemas Microcontrolados", instructor: "Lucas Vital", class: "Téc. Eletrotécnica", lab: "Laboratório Maker 4.0", students: 15 } },
    17: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } },
    19: { noturno: { subject: "Eletrônica Industrial", instructor: "Lucas Vital", class: "EAE-2026", lab: "Lab. Elétrica", students: 22 } },
    24: { noturno: { subject: "Sensores e Atuadores para IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 } },
    26: { 
      matutino: { subject: "Projeto Integrador IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 },
      vespertino: { subject: "Projeto Integrador IoT", instructor: "Lucas Vital", class: "IoT-M1", lab: "Laboratório Maker 4.0", students: 15 }
    },
    28: { noturno: { subject: "Desenho Auxiliado por Computador", instructor: "Géssica Muniz", class: "Téc. Logística", lab: "Lab. CAD", students: 20 } },
    31: { noturno: { subject: "Sistemas Microcontrolados", instructor: "Lucas Vital", class: "Téc. Eletrotécnica", lab: "Laboratório Maker 4.0", students: 15 } }
  }
};

export const STATIC_JULY_EVENTS = STATIC_EVENTS_BY_MONTH['Julho'];
