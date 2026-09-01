import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  GraduationCap, 
  Layers, 
  Award,
  BookOpen,
  Calendar,
  Building2,
  ChevronRight,
  Send,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface UnidadeNaviraiProps {
  currentUserProfile: UserProfile;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export default function UnidadeNavirai({ currentUserProfile, onShowToast }: UnidadeNaviraiProps) {
  const [activeTabSection, setActiveTabSection] = useState<'geral' | 'cursos' | 'estrutura'>('geral');
  const [selectedContactSetor, setSelectedContactSetor] = useState<string | null>(null);
  const [duvidaText, setDuvidaText] = useState('');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copiado para a área de transferência!`, 'success');
  };

  const handleSendDuvida = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duvidaText.trim()) return;
    onShowToast('Sua dúvida/solicitação foi enviada para a Coordenação Pedagógica! Retorno em até 24h.', 'success');
    setDuvidaText('');
  };

  const cursos = [
    { id: 1, nome: "Técnico em Eletrotécnica", modalidade: "Habilitação Técnica", carga: "1200h", status: "Em Andamento", cor: "border-emerald-500 text-emerald-600 dark:text-emerald-400" },
    { id: 2, nome: "Técnico em Eletromecânica", modalidade: "Habilitação Técnica", carga: "1200h", status: "Em Andamento", cor: "border-emerald-500 text-emerald-600 dark:text-emerald-400" },
    { id: 3, nome: "Técnico em Automação Industrial", modalidade: "Habilitação Técnica", carga: "1200h", status: "Em Andamento", cor: "border-emerald-500 text-emerald-600 dark:text-emerald-400" },
    { id: 4, nome: "Técnico em Açúcar e Álcool", modalidade: "Habilitação Técnica", carga: "1200h", status: "Em Andamento", cor: "border-purple-500 text-purple-600 dark:text-purple-400" },
    { id: 5, nome: "Técnico em Administração", modalidade: "Habilitação Técnica", carga: "1000h", status: "Em Andamento", cor: "border-blue-500 text-blue-600 dark:text-blue-400" },
    { id: 6, nome: "Técnico em Logística", modalidade: "Habilitação Técnica", carga: "1000h", status: "Em Andamento", cor: "border-blue-500 text-blue-600 dark:text-blue-400" },
    { id: 7, nome: "Jovem Aprendiz Eletromecânica", modalidade: "Aprendizagem Industrial", carga: "800h", status: "Parceria Corporativa (Copasul/Usina)", cor: "border-amber-500 text-amber-600 dark:text-amber-400" },
  ];

  const setores = [
    { nome: "Coordenação Geral", responsavel: "Taís Gimenez", email: "tais.gimenez@ms.senai.br", ramal: "4501", icone: Award },
    { nome: "Coordenação Pedagógica", responsavel: "Jaqueline Sant'Anna", email: "jaqueline.santanna@ms.senai.br", ramal: "4502", icone: GraduationCap },
    { nome: "Secretaria Acadêmica", responsavel: "Thais Ribeiro / Sara Mazlom", email: "secretaria.navirai@ms.senai.br", ramal: "4503", icone: BookOpen },
    { nome: "Setor Financeiro", responsavel: "Eliane", email: "eliane.financeiro@ms.senai.br", ramal: "4504", icone: Layers },
    { nome: "Comercial / Atendimento", responsavel: "Bruno Fernando", email: "bruno.fernando@ms.senai.br", ramal: "4508", icone: Users },
  ];

  const infraestrutura = [
    { nome: "Laboratório de Elétrica", area: "85 m²", equipamentos: "22 Computadores Lenovo, Lousa Interativa, Bancadas de Dispositivos Elétricos, Bancadas de Automação, Aupro3000 (Instrumentação e Controle), Motores.", cap: 22 },
    { nome: "Laboratório CAD", area: "75 m²", equipamentos: "30 Computadores Lenovo de alto desempenho para simulação, Lousa Interativa, softwares CAD e SolidWorks.", cap: 30 },
    { nome: "Oficina Mecânica", area: "120 m²", equipamentos: "Máquinas de Solda, Bancadas de Ajustagem, Torno Mecânico, Fresadora, Serra Fita.", cap: 18 },
    { nome: "Laboratório Maker 4.0", area: "90 m²", equipamentos: "Bancada 4.0, Máquina Laser MF 4040, Projetor a Laser de alta definição, Lousa Interativa.", cap: 15 },
  ];

  return (
    <div className="space-y-6 fade-in" id="unidade-navirai-container">
      {/* Banner Superior */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 p-8 text-white shadow-lg border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30">
                CETEC SENAI Naviraí
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans text-white">
              SENAI Naviraí
            </h1>
            <p className="text-slate-300 mt-2 max-w-xl text-sm md:text-base">
              Referência regional na formação profissional para o setor sucroenergético, agroindustrial, metalmecânico e de automação industrial no Cone Sul de MS.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 min-w-[280px]">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Clock size={14} className="text-blue-400 shrink-0" />
              <span>Funcionamento: Seg-Sex: 08:00 - 22:00 | Sáb: 08:00 - 12:00</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Clock size={14} className="text-blue-400 shrink-0" />
              <span>Admin: 08:00-11:00 | 13:00-17:00 | 18:00-22:00</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Phone size={14} className="text-blue-400 shrink-0" />
              <span>(67) 3409-3601 | (67) 99263-9000</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin size={14} className="text-blue-400 shrink-0" />
              <span>Rua Ceará, 135, Centro - Naviraí, MS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Internas */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTabSection('geral')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTabSection === 'geral'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/20'
          }`}
          id="btn-tab-geral"
        >
          Visão Geral & Contatos
        </button>
        <button
          onClick={() => setActiveTabSection('cursos')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTabSection === 'cursos'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/20'
          }`}
          id="btn-tab-cursos"
        >
          Cursos Ativos ({cursos.length})
        </button>
        <button
          onClick={() => setActiveTabSection('estrutura')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTabSection === 'estrutura'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/20'
          }`}
          id="btn-tab-estrutura"
        >
          Infraestrutura Técnica ({infraestrutura.length})
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTabSection === 'geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1 e 2: Informações e Contatos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Missão e Visão */}
            <div className="card p-6" id="card-missao">
              <h2 className="text-lg font-bold font-sans mb-3 flex items-center gap-2">
                <Award className="text-blue-500" size={18} />
                Nossa Missão
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Promover a educação profissional e tecnológica, a inovação e a transferência de tecnologias industriais, contribuindo para elevar a competitividade da indústria do Cone Sul de Mato Grosso do Sul.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                  <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">450+</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Alunos Ativos</span>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                  <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">20+</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Parcerias Corporativas</span>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                  <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">92%</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Empregabilidade Local</span>
                </div>
              </div>
            </div>

            {/* Lista de Contatos dos Setores */}
            <div className="card p-6" id="card-setores">
              <h2 className="text-lg font-bold font-sans mb-4 flex items-center gap-2">
                <Phone className="text-blue-500" size={18} />
                Canais de Atendimento por Setor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {setores.map((setor, index) => {
                  const Icon = setor.icone;
                  const isSelected = selectedContactSetor === setor.nome;
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/10' 
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                      onClick={() => setSelectedContactSetor(isSelected ? null : setor.nome)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Icon size={18} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{setor.nome}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{setor.responsavel}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1 font-mono">
                            <Mail size={12} className="text-slate-400" />
                            {setor.email}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(setor.email, `E-mail da ${setor.nome}`);
                            }}
                            className="text-blue-500 hover:underline px-1 py-0.5 rounded"
                          >
                            Copiar
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Phone size={12} className="text-slate-400" />
                          <span>Ramal Interno: <strong>{setor.ramal}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna 3: Suporte Rápido e Fale com a Coordenação */}
          <div className="space-y-6">
            <div className="card p-6 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30" id="card-suporte-direto">
              <h2 className="text-base font-bold font-sans mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Mail className="text-blue-600 dark:text-blue-400" size={16} />
                Mensagem para Coordenação
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                Dúvidas sobre diários, liberação de salas, calendário de provas ou solicitações gerais? Envie uma mensagem rápida diretamente para o painel de Géssica Oliveira.
              </p>
              
              <form onSubmit={handleSendDuvida} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Instrutor Solicitante</label>
                  <input 
                    type="text" 
                    disabled 
                    value={`${currentUserProfile.name} (${currentUserProfile.role})`}
                    className="w-full text-xs px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Sua Mensagem/Dúvida</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Descreva sua solicitação aqui..."
                    value={duvidaText}
                    onChange={(e) => setDuvidaText(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send size={12} />
                  <span>Enviar Solicitação</span>
                </button>
              </form>
            </div>

            <div className="card p-5 border border-amber-100 dark:border-amber-900/20 bg-amber-50/20 dark:bg-amber-950/5">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                <Clock size={16} />
                Quadro de Avisos da Portaria
              </h3>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <li className="flex gap-2 items-start">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>O acesso de veículos ao estacionamento interno exige crachá atualizado.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Visitantes externos para palestras ou visitas técnicas devem ser pré-cadastrados na recepção.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Pedidos de salas adicionais no sábado letivo devem ser formalizados até quarta-feira ao meio-dia.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTabSection === 'cursos' && (
        <div className="card p-6" id="card-cursos-lista">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold font-sans flex items-center gap-2">
                <GraduationCap className="text-blue-500" size={18} />
                Cursos e Programas Ativos na Unidade
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Turmas regulares atualmente cadastradas no ano letivo de 2026.
              </p>
            </div>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-1 rounded-full font-medium border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              Total: {cursos.length} Turmas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                  <th className="p-3">Nome do Curso / Especialidade</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Carga Horária</th>
                  <th className="p-3">Status / Informações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {cursos.map((curso) => (
                  <tr key={curso.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">{curso.nome}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{curso.modalidade}</td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{curso.carga}</td>
                    <td className="p-3">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${curso.cor}`}>
                        {curso.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quer incluir ou alterar dados de uma turma no sistema do Hub? Envie os diários assinados diretamente para a <strong>Secretaria Acadêmica</strong>.
            </p>
          </div>
        </div>
      )}

      {activeTabSection === 'estrutura' && (
        <div className="space-y-6">
          <div className="card p-6" id="card-estrutura-lista">
            <h2 className="text-lg font-bold font-sans mb-2 flex items-center gap-2">
              <Building2 className="text-blue-500" size={18} />
              Nossos Laboratórios Técnicos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Infraestrutura industrial com recursos práticos para aulas integradas e simulação de rotinas reais de fábrica.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infraestrutura.map((item, index) => (
                <div key={index} className="p-5 rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900/20 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {item.nome}
                    </h3>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono px-2.5 py-0.5 rounded-full">
                      Capacidade: {item.cap} Alunos
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed min-h-[40px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-400">Equipamentos principais:</span> {item.equipamentos}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Área Útil: <strong>{item.area}</strong></span>
                    <span className="text-blue-500 font-semibold flex items-center gap-0.5 cursor-pointer hover:underline">
                      Ver agenda completa <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
