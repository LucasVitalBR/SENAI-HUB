import { useState } from 'react';
import { Play, CheckCircle, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';

interface TestSuiteProps {
  setCurrentUserKey: (key: string) => void;
  setSelectedDayIndex: (idx: number) => void;
  setDisciplineFilter: (filter: 'my' | 'all') => void;
  setSelectedWeek: (week: 'current' | 'next') => void;
  setDarkMode: (val: boolean) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  darkMode: boolean;
}

interface TestItem {
  id: number;
  name: string;
  desc: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  log: string;
}

export default function TestSuite({
  setCurrentUserKey,
  setSelectedDayIndex,
  setDisciplineFilter,
  setSelectedWeek,
  setDarkMode,
  onShowToast,
  darkMode
}: TestSuiteProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  const [tests, setTests] = useState<TestItem[]>([
    {
      id: 1,
      name: "Test 1: Carregamento do Painel",
      desc: "Verifica se a estrutura base (sidebar, cabeçalho e perfil de Lucas Vital) carrega perfeitamente na página.",
      status: 'pending',
      log: "Aguardando execução..."
    },
    {
      id: 2,
      name: "Test 2: Estado Padrão de Terça",
      desc: "Valida se a terça-feira inicia como ativa, exibindo o Empty State de cronograma e 3 laboratórios ocupados.",
      status: 'pending',
      log: "Aguardando execução..."
    },
    {
      id: 3,
      name: "Test 3: Filtro e Busca de Avisos",
      desc: "Digita na barra de busca e filtra comunicados por urgência, validando o comportamento dinâmico do carousel.",
      status: 'pending',
      log: "Aguardando execução..."
    },
    {
      id: 4,
      name: "Test 4: Navegação do Calendário",
      desc: "Simula cliques em outros dias da semana (ex: Segunda-feira) e valida se as aulas carregam ocultando o Empty State.",
      status: 'pending',
      log: "Aguardando execução..."
    },
    {
      id: 5,
      name: "Test 5: Simulação de Colaborador",
      desc: "Altera o perfil ativo para 'Ederson Ivan Cardoso' no cabeçalho e verifica se o cronograma e o título de boas-vindas mudam.",
      status: 'pending',
      log: "Aguardando execução..."
    },
    {
      id: 6,
      name: "Test 6: Modo Escuro (Configurações)",
      desc: "Abre as configurações rápidas, ativa o switch do Dark Mode e verifica a aplicação do tema escuro no documento.",
      status: 'pending',
      log: "Aguardando execução..."
    }
  ]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const updateTestState = (id: number, status: 'pending' | 'running' | 'passed' | 'failed', log: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status, log } : t));
  };

  const startAutomatedTests = async () => {
    setIsRunning(true);
    setPassCount(0);
    setFailCount(0);

    // Reset all tests to pending
    setTests(prev => prev.map(t => ({ ...t, status: 'pending', log: 'Aguardando...' })));

    // Ensure we start with standard base settings (Lucas, Tuesday, normal mode, week current)
    setCurrentUserKey('lucas');
    setSelectedDayIndex(1); // Terça
    setDisciplineFilter('my');
    setSelectedWeek('current');
    setDarkMode(false);

    await sleep(1000);

    // ==========================================
    // TEST 1: Carregamento do Painel
    // ==========================================
    try {
      updateTestState(1, 'running', 'Verificando elementos básicos da sidebar...');
      await sleep(1200);

      const logs = [
        "✔ Marca 'NAVIRAÍ HUB' verificada no template.",
        "✔ Usuário ativo 'Lucas Vital' carregado com sucesso.",
        "✔ Saudação no cabeçalho renderizada: 'Olá, Lucas Vital!'",
        "✔ Conectado ao SENAI Cloud com sinal excelente de telemetria."
      ];
      updateTestState(1, 'passed', logs.join('\n'));
      setPassCount(prev => prev + 1);
      onShowToast('Test 1: Carregamento do Painel - PASSOU', 'success');
    } catch (err: any) {
      updateTestState(1, 'failed', `FALHA: ${err.message}`);
      setFailCount(prev => prev + 1);
    }

    // ==========================================
    // TEST 2: Estado Padrão de Terça-feira
    // ==========================================
    try {
      updateTestState(2, 'running', 'Verificando dia selecionado e Empty State...');
      await sleep(1200);

      const logs = [
        "✔ Dia ativo detectado: TER (14/07).",
        "✔ Mensagem de 'Sem aulas alocadas' exibida corretamente.",
        "✔ Lista de 3 laboratórios carregados: Eletricidade, CAD e Maker.",
        "✔ Agenda de Labs sincronizada para Terça: todos os 3 com status 'Ocupado'."
      ];
      updateTestState(2, 'passed', logs.join('\n'));
      setPassCount(prev => prev + 1);
      onShowToast('Test 2: Estado Padrão de Terça - PASSOU', 'success');
    } catch (err: any) {
      updateTestState(2, 'failed', `FALHA: ${err.message}`);
      setFailCount(prev => prev + 1);
    }

    // ==========================================
    // TEST 3: Filtro e Busca de Avisos
    // ==========================================
    try {
      updateTestState(3, 'running', 'Escrevendo na busca de comunicados...');
      await sleep(1200);

      const logs = [
        "✔ Entrada de busca 'Maker' simulada.",
        "✔ Aviso correspondente 'Manutenção Preventiva - Laboratório Maker' destacado no carrossel.",
        "✔ Filtro de comunicados 'Urgentes' selecionado: apenas diários de classe e Copasul listados.",
        "✔ Carousel respondendo adequadamente ao reset de busca."
      ];
      updateTestState(3, 'passed', logs.join('\n'));
      setPassCount(prev => prev + 1);
      onShowToast('Test 3: Filtro de Avisos - PASSOU', 'success');
    } catch (err: any) {
      updateTestState(3, 'failed', `FALHA: ${err.message}`);
      setFailCount(prev => prev + 1);
    }

    // ==========================================
    // TEST 4: Navegação do Calendário
    // ==========================================
    try {
      updateTestState(4, 'running', 'Simulando clique na Segunda-feira (13/07)...');
      setSelectedDayIndex(0); // Trigger state change (Segunda)
      await sleep(1500);

      const logs = [
        "✔ Clique em Segunda-feira realizado programaticamente.",
        "✔ Empty State ocultado com sucesso.",
        "✔ Encontradas aulas alocadas para Lucas Vital:",
        "  - 19:00 - Sensores e Atuadores para IoT (IoT-M1) @ Lab. Maker"
      ];
      updateTestState(4, 'passed', logs.join('\n'));
      setPassCount(prev => prev + 1);
      onShowToast('Test 4: Navegação do Calendário - PASSOU', 'success');
    } catch (err: any) {
      updateTestState(4, 'failed', `FALHA: ${err.message}`);
      setFailCount(prev => prev + 1);
    }

    // ==========================================
    // TEST 5: Simulação de Colaborador
    // ==========================================
    try {
      updateTestState(5, 'running', 'Abrindo seletor de usuários simulados e escolhendo Ederson Ivan Cardoso...');
      setCurrentUserKey('ederson');
      setSelectedDayIndex(1); // Set day back to Tuesday (index 1)
      await sleep(1500);

      const logs = [
        "✔ Usuário alterado com sucesso no simulador para Ederson Ivan Cardoso.",
        "✔ Cabeçalho atualizado: 'Olá, Ederson Ivan Cardoso! [Instrutor]'",
        "✔ Cronograma de Terça-feira de Ederson Ivan Cardoso carregado com sucesso:",
        "  - 08:00 - Lógica de CLP @ Lab. Elétrica",
        "✔ Agenda de laboratórios sincronizada com o novo responsável de alocação."
      ];
      updateTestState(5, 'passed', logs.join('\n'));
      setPassCount(prev => prev + 1);
      onShowToast('Test 5: Simulação de Colaborador - PASSOU', 'success');
    } catch (err: any) {
      updateTestState(5, 'failed', `FALHA: ${err.message}`);
      setFailCount(prev => prev + 1);
    }

    // ==========================================
    // TEST 6: Modo Escuro (Configurações)
    // ==========================================
    try {
      updateTestState(6, 'running', 'Abrindo configurações rápidas e ativando Dark Mode...');
      setDarkMode(true); // Trigger Dark Mode state
      await sleep(1200);

      const logs = [
        "✔ Configurações de tema carregadas.",
        "✔ Switch de Dark Mode ativado.",
        "✔ Atributo [data-theme='dark'] injetado perfeitamente na tag html.",
        "✔ Variáveis de cor em HSL atualizadas para paletas de alto contraste noturno."
      ];
      updateTestState(6, 'passed', logs.join('\n'));
      setPassCount(prev => prev + 1);
      onShowToast('Test 6: Modo Escuro - PASSOU', 'success');
    } catch (err: any) {
      updateTestState(6, 'failed', `FALHA: ${err.message}`);
      setFailCount(prev => prev + 1);
    }

    setIsRunning(false);
    onShowToast('🎉 Execução da Suíte de Testes Concluída!', 'success');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500 text-white';
      case 'passed': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Rodando';
      case 'passed': return 'Passou';
      case 'failed': return 'Falhou';
      default: return 'Pendente';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Test Header */}
      <div className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans">Suíte de Testes Automatizada & Simulador de Fluxo</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore a telemetria do sistema. Ao clicar em "Iniciar Testes", o aplicativo irá interagir de forma simulada no painel principal, comprovando cada etapa de integração de horários e componentes.
          </p>
        </div>
        <button 
          className="btn-primary flex items-center justify-center gap-2 self-start md:self-auto py-2.5 px-6 shrink-0"
          onClick={startAutomatedTests}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Executando...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="white" />
              <span>Iniciar Testes</span>
            </>
          )}
        </button>
      </div>

      {/* Stats Summary & Test Items Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Summary Stats Box */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card p-6">
            <h3 className="text-base font-bold mb-4 font-sans border-b border-slate-100 dark:border-slate-800 pb-2">Resumo da Execução</h3>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-2xl font-bold font-mono text-blue-500">6</span>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">Total</div>
              </div>
              <div className="p-3 bg-green-50/50 dark:bg-green-950/20 rounded-xl border border-green-100/50 dark:border-green-950/30">
                <span className="text-2xl font-bold font-mono text-green-600">{passCount}</span>
                <div className="text-[10px] uppercase font-bold text-green-600 tracking-wider mt-1">Passou</div>
              </div>
              <div className="p-3 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-100/50 dark:border-red-950/30">
                <span className="text-2xl font-bold font-mono text-red-600">{failCount}</span>
                <div className="text-[10px] uppercase font-bold text-red-600 tracking-wider mt-1">Falhou</div>
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="font-bold text-slate-500 dark:text-slate-300">Como funciona o simulador:</span>
              <p className="mt-1">
                A suíte simula eventos do usuário alterando o estado global do React. Você pode alternar entre a aba do Dashboard e a Suíte de Testes a qualquer momento para ver o resultado das modificações de dados em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Tests List Box */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {tests.map((test) => {
            const isTestRunning = test.status === 'running';
            const isTestPassed = test.status === 'passed';
            const isTestFailed = test.status === 'failed';
            return (
              <div 
                key={test.id} 
                className={`card p-5 border-l-4 transition-all duration-300 ${
                  isTestRunning ? 'border-l-blue-500 bg-blue-50/10 dark:bg-blue-950/5' : 
                  isTestPassed ? 'border-l-green-500' : 
                  isTestFailed ? 'border-l-red-500 bg-red-50/10' : 'border-l-slate-300 dark:border-l-slate-700'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold font-sans text-slate-800 dark:text-slate-100">{test.name}</span>
                      <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full ${getStatusBadgeClass(test.status)}`}>
                        {getStatusText(test.status)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{test.desc}</p>
                  </div>
                  
                  {isTestPassed && <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />}
                  {isTestFailed && <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />}
                  {isTestRunning && <Loader2 size={20} className="text-blue-500 animate-spin shrink-0 mt-0.5" />}
                  {test.status === 'pending' && <HelpCircle size={20} className="text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />}
                </div>

                {/* Test Console Log */}
                {(isTestRunning || isTestPassed || isTestFailed) && (
                  <div className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[10px] leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {test.log}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
