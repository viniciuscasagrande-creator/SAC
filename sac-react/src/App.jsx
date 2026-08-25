import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase'; // Firebase integration import
import { collection, doc, onSnapshot, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

function App() {
  // Navigation State
  const [activePanel, setActivePanel] = useState('dashboard'); // 'dashboard' | 'coupons' | 'estornos' | 'sac' | 'financeiro'
  const [menuMeusEventosExpanded, setMenuMeusEventosExpanded] = useState(false);

  // Estorno Sub-views & Wizard State
  const [estornoSubView, setEstornoSubView] = useState('dashboard'); // 'dashboard' | 'wizard'
  const [wizardStep, setWizardStep] = useState(1);
  const [errorSimulationActive, setErrorSimulationActive] = useState(false);
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [gatewayStep, setGatewayStep] = useState(1); // 1 to 5

  // Gateway Selector State (Stone vs PagSeguro)
  const [selectedGateway, setSelectedGateway] = useState('pagseguro'); // 'stone' | 'pagseguro'
  
  // PagSeguro Credentials Config (Pre-filled for simulation)
  const [pagSeguroToken, setPagSeguroToken] = useState('A63F8D90B2E14D2C9E88F54785214D1D');
  const [pagSeguroEmail, setPagSeguroEmail] = useState('financeiro@diskingressos.com.br');
  const [pagSeguroEnv, setPagSeguroEnv] = useState('production'); // 'production' | 'sandbox'

  // Interactive Approvals Queue State
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'rowApp1', order: '#154231', client: 'João da Silva', show: 'Show Roupa Nova', value: 'R$ 580,00', tier: 'Gerente Financeiro' },
    { id: 'rowApp2', order: '#154299', client: 'Maria de Souza', show: 'Música e Natureza', value: 'R$ 1.200,00', tier: 'Gerente Financeiro' },
    { id: 'rowApp3', order: '#154302', client: 'Pedro Santos', show: 'Samba 90 Graus', value: 'R$ 240,00', tier: 'Supervisor' },
  ]);

  // Interactive Approval Modal State
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalPasswordInput, setApprovalPasswordInput] = useState('');
  
  // Dashboard Search & Filters
  const [estornoSearchQuery, setEstornoSearchQuery] = useState('');
  const [estornoGatewayFilter, setEstornoGatewayFilter] = useState('all'); // 'all' | 'pagseguro' | 'stone'

  // Firebase Status
  const [firebaseStatus, setFirebaseStatus] = useState('Off-line (Mock)');

  // ------------------------------------------------------------------------
  // ESTORNOS DATA STATE (LOCAL & FIRESTORE ALIGNED)
  // ------------------------------------------------------------------------
  const [estornosList, setEstornosList] = useState([
    { id: 'est-1', order: '154258', client: 'João da Silva', show: 'Show Roupa Nova', value: 580.00, gateway: 'pagseguro', netRefund: 556.46, status: 'Sucesso', timestamp: new Date(Date.now() - 1800000).toISOString() }
  ]);

  // ------------------------------------------------------------------------
  // FINANCEIRO PANEL STATE (EXPRESSES FIRESTORE COMPLETE SCHEMA)
  // ------------------------------------------------------------------------
  const [financeTab, setFinanceTab] = useState('saldos'); // 'saldos' | 'repasses' | 'antecipacoes' | 'extrato' | 'despesas' | 'contas'

  const [eventosList, setEventosList] = useState([
    { id: 'evt-1', nome: 'Show Roupa Nova', organizador: 'Teatro Positivo Produções', data: '20/07/2026', status: 'Ativo' },
    { id: 'evt-2', nome: 'Samba 90 Graus', organizador: 'Live Curitiba Ent.', data: '05/07/2025', status: 'Concluído' }
  ]);

  const [saldosList, setSaldosList] = useState([
    { id: 'sal-1', eventoId: 'evt-1', receitaBruta: 120500.00, taxas: 12050.00, liquido: 108450.00, disponivel: 80000.00, bloqueado: 28450.00, liberarEm: '2026-07-20' },
    { id: 'sal-2', eventoId: 'evt-2', receitaBruta: 85000.00, taxas: 8500.00, liquido: 76500.00, disponivel: 76500.00, bloqueado: 0.00, liberarEm: 'Imediato' }
  ]);

  const [repassesList, setRepassesList] = useState([
    { id: 'rep-1', eventoId: 'evt-2', valor: 50000.00, status: 'Concluído', contaDestino: 'Banco do Brasil (Ag: 1234, CC: 56789-0)', dataSolicitacao: '10/07/2025', dataPagamento: '11/07/2025' },
    { id: 'rep-2', eventoId: 'evt-2', valor: 26500.00, status: 'Pendente', contaDestino: 'Banco do Brasil (Ag: 1234, CC: 56789-0)', dataSolicitacao: '15/07/2025', dataPagamento: '-' }
  ]);

  const [antecipacoesList, setAntecipacoesList] = useState([
    { id: 'ant-1', eventoId: 'evt-1', valor: 30000.00, taxa: 4.50, status: 'Aprovado' },
    { id: 'ant-2', eventoId: 'evt-1', valor: 15000.00, taxa: 4.50, status: 'Pendente' }
  ]);

  const [extratoList, setExtratoList] = useState([
    { id: 'mov-1', eventoId: 'evt-1', tipo: 'Receita', descricao: 'Venda de Ingresso Lote 1', valor: 580.00, data: '16/07/2026 09:12' },
    { id: 'mov-2', eventoId: 'evt-1', tipo: 'Despesa', descricao: 'Aluguel de Palco & Som', valor: -15000.00, data: '10/07/2026 14:00' },
    { id: 'mov-3', eventoId: 'evt-2', tipo: 'Repasse', descricao: 'Transferência de Repasse Efetuada', valor: -50000.00, data: '11/07/2025 10:00' }
  ]);

  const [despesasList, setDespesasList] = useState([
    { id: 'des-1', eventoId: 'evt-1', descricao: 'Aluguel de Palco & Som', categoria: 'Produção', valor: 15000.00, fornecedor: 'Som & Luz Sul Ltda', data: '10/07/2026' },
    { id: 'des-2', eventoId: 'evt-1', descricao: 'Taxa Ecad Licença', categoria: 'Taxas Fiscais', valor: 3500.00, fornecedor: 'ECAD Regional Sul', data: '12/07/2026' }
  ]);

  const [contasList, setContasList] = useState([
    { id: 'cnt-1', banco: 'Banco do Brasil', agencia: '1234-5', conta: '56789-0', titular: 'Teatro Positivo Produções Ltda', pix: '00.000.000/0001-00' }
  ]);

  // Request payout form state
  const [selectedRepasseEvento, setSelectedRepasseEvento] = useState('evt-2');
  const [repasseValorInput, setRepasseValorInput] = useState(26500.00);

  // Firestore Real-time listener configuration
  useEffect(() => {
    // Helper to fetch local database REST collections (Express db API)
    const loadLocalDb = async () => {
      try {
        const res = await fetch('/api/db/estornos');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setEstornosList(data);
        }
      } catch (e) {
        console.warn("Local DB API offline, using default mocks.", e);
      }
    };

    if (db) {
      // Connect check
      getDocs(query(collection(db, "saldos"), limit(1)))
        .then(() => {
          setFirebaseStatus('Conectado 🔥');

          // Real-time listener: estornos
          onSnapshot(collection(db, "estornos"), (snapshot) => {
            if (!snapshot.empty) {
              const list = [];
              snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
              setEstornosList(list);
            }
          });

          // Real-time listener: saldos
          onSnapshot(collection(db, "saldos"), (snapshot) => {
            if (!snapshot.empty) {
              const list = [];
              snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
              setSaldosList(list);
            }
          });

          // Real-time listener: repasses
          onSnapshot(collection(db, "repasses"), (snapshot) => {
            if (!snapshot.empty) {
              const list = [];
              snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
              setRepassesList(list);
            }
          });

          // Real-time listener: despesas
          onSnapshot(collection(db, "despesas"), (snapshot) => {
            if (!snapshot.empty) {
              const list = [];
              snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
              setDespesasList(list);
            }
          });

          // Real-time listener: contas
          onSnapshot(collection(db, "contas"), (snapshot) => {
            if (!snapshot.empty) {
              const list = [];
              snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
              setContasList(list);
            }
          });
        })
        .catch((err) => {
          console.warn("Firestore connection unavailable, syncing with local REST DB.", err);
          setFirebaseStatus('Offline (Local DB)');
          loadLocalDb();
        });
    } else {
      loadLocalDb();
    }
  }, [activePanel]);

  const handleApprovalAction = (id) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
  };

  const saveRefundToDb = async (customRefundInfo = null) => {
    let value = 580.00;
    let gateway = selectedGateway;
    let netRefund = selectedGateway === 'pagseguro' ? 556.46 : 565.56;

    if (customRefundInfo) {
      // Parse value like "R$ 580,00" or similar
      const rawVal = customRefundInfo.value || "580.00";
      value = Number(rawVal.replace(/[^0-9,.-]/g, '').replace(',', '.')) || 580.00;
      gateway = Math.random() > 0.5 ? 'stone' : 'pagseguro';
      netRefund = value * 0.96; // 4% average gateway fee
    }

    const newRefund = {
      order: customRefundInfo ? customRefundInfo.order.replace('#', '') : "154258",
      client: customRefundInfo ? customRefundInfo.client : "João da Silva",
      show: customRefundInfo ? customRefundInfo.show : "Show Roupa Nova",
      value: value,
      gateway: gateway,
      netRefund: netRefund,
      status: "Sucesso",
      timestamp: new Date().toISOString()
    };

    if (db && firebaseStatus.includes('Conectado')) {
      try {
        await addDoc(collection(db, "estornos"), newRefund);
      } catch (e) {
        console.error("Erro ao gravar estorno no Firestore:", e);
      }
    } else {
      // Try local REST API
      try {
        const res = await fetch('/api/db/estornos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRefund)
        });
        if (res.ok) {
          const saved = await res.json();
          setEstornosList(prev => [saved, ...prev]);
        } else {
          setEstornosList(prev => [{ id: `est-${Date.now()}`, ...newRefund }, ...prev]);
        }
      } catch (err) {
        setEstornosList(prev => [{ id: `est-${Date.now()}`, ...newRefund }, ...prev]);
      }
    }
  };

  const runGatewaySimulation = () => {
    setGatewayProcessing(true);
    setGatewayStep(1);

    const interval = setInterval(() => {
      setGatewayStep(prev => {
        if (prev < 5) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setGatewayProcessing(false);
          setWizardStep(4);
          saveRefundToDb(); // Persist refund to database on success
          return 5;
        }
      });
    }, 850);
  };

  // Submit payout request handler (Firestore integrated)
  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (repasseValorInput <= 0) return;
    
    const newRepasse = {
      eventoId: selectedRepasseEvento,
      valor: Number(repasseValorInput),
      status: 'Pendente',
      contaDestino: 'Banco do Brasil (Ag: 1234, CC: 56789-0)',
      dataSolicitacao: new Date().toLocaleDateString('pt-BR'),
      dataPagamento: '-'
    };

    if (db && firebaseStatus.includes('Conectado')) {
      try {
        await addDoc(collection(db, "repasses"), newRepasse);
      } catch (err) {
        console.error("Erro ao gravar repasse no Firestore:", err);
      }
    } else {
      // Fallback
      setRepassesList(prev => [{ id: `rep-${Date.now()}`, ...newRepasse }, ...prev]);
    }
    
    alert("Solicitação de Repasse enviada com sucesso!");
  };

  // Use relative path for unified hosting
  const getIframeSrc = () => {
    return "/limitless/html/layout_6/full/sac_novo_chamado.html";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. MAIN GLOBAL HEADER */}
      <header className="main-header">
        <div className="header-left">
          <div className="di-logo-box">
            D<span>i</span>
          </div>
          <div className="brand-text">DiskIngressos</div>
        </div>
        
        <div className="header-center">
          <i className="fa-solid fa-magnifying-glass search-icon-header"></i>
          <input type="text" className="header-search" placeholder="Pesquisa global (eventos, participantes...)" />
        </div>
        
        <div className="header-right">
          <div className="profile-pill">
            <div className="profile-avatar">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bgGradMaleReact" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="skinGradMaleReact" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5d0c5" />
                    <stop offset="100%" stopColor="#e2a997" />
                  </linearGradient>
                  <linearGradient id="suitGradMaleReact" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="32" fill="url(#bgGradMaleReact)" />
                <path d="M12 56 C12 44 20 38 32 38 C44 38 52 44 52 56 Z" fill="url(#suitGradMaleReact)" />
                <polygon points="32,42 27,38 37,38" fill="#ffffff" />
                <polygon points="32,40 29,54 32,58 35,54" fill="#ef4444" />
                <rect x="27" y="30" width="10" height="10" rx="3" fill="url(#skinGradMaleReact)" />
                <path d="M20 22 C20 14 24 12 32 12 C40 12 44 14 44 22 C44 30 40 34 32 34 C24 34 20 30 20 22 Z" fill="url(#skinGradMaleReact)" />
                <circle cx="19" cy="22" r="2.5" fill="url(#skinGradMaleReact)" />
                <circle cx="45" cy="22" r="2.5" fill="url(#skinGradMaleReact)" />
                <path d="M19 20 C18 13 24 9 32 9 C40 9 46 13 45 20 C43 14 39 11 32 11 C25 11 21 14 19 20 Z" fill="#1c1917" />
                <path d="M21 24 C21 31 26 34 32 34 C38 34 43 31 43 24 C43 26 38 32 32 32 C26 32 21 26 21 24 Z" fill="#1c1917" opacity="0.35" />
              </svg>
              <span className="status-dot"></span>
            </div>
            <div className="profile-email">vinicius.casagrande@diskingressos.com.br</div>
          </div>
          <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '12px' }} className="badge bg-success">{firebaseStatus}</span>
        </div>
      </header>

      {/* 2. MAIN SPLIT LAYOUT */}
      <div className="main-container">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="menu-section-header">Navegação</div>
            <div className="sidebar-menu">
              <a className={`menu-item ${activePanel === 'dashboard' ? 'active' : ''}`} onClick={() => { setActivePanel('dashboard'); setEstornoSubView('dashboard'); }}>
                <div className="menu-item-left"><i className="fa-regular fa-calendar-days"></i> Todos os Eventos</div>
              </a>
              <a className={`menu-item ${activePanel === 'dashboard' ? 'active' : ''}`} onClick={() => { setActivePanel('dashboard'); setEstornoSubView('dashboard'); }}>
                <div className="menu-item-left"><i className="fa-solid fa-gauge-high"></i> Painel Geral</div>
              </a>
              
              {/* ACCORDION: MEUS EVENTOS */}
              <a className="menu-item" onClick={() => setMenuMeusEventosExpanded(!menuMeusEventosExpanded)}>
                <div className="menu-item-left"><i className="fa-regular fa-calendar"></i> Meus Eventos</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-sidebar badge-orange">2</span>
                  <i className="fa-solid fa-angle-down" style={{ fontSize: '0.7rem', transform: menuMeusEventosExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}></i>
                </div>
              </a>
              {/* SUBMENU CONTAINER */}
              <div className={`submenu-container ${menuMeusEventosExpanded ? 'show' : ''}`}>
                <a className="submenu-item" onClick={() => { setActivePanel('dashboard'); }}>Todos Eventos</a>
                <a className="submenu-item">Novo Evento</a>
                <a className="submenu-item">Lotes</a>
                <a className={`submenu-item ${activePanel === 'coupons' ? 'active' : ''}`} onClick={() => { setActivePanel('coupons'); }}>Cupons</a>
                <a className="submenu-item">Check-in</a>
                <a className="submenu-item">Participantes</a>
                <a className="submenu-item">Página do Evento</a>
              </div>

              <a className="menu-item">
                <div className="menu-item-left"><i className="fa-solid fa-ticket"></i> Consulta de Ingressos</div>
              </a>
              <a className="menu-item">
                <div className="menu-item-left"><i className="fa-solid fa-bullhorn"></i> Marketing</div>
                <i className="fa-solid fa-angle-down" style={{ fontSize: '0.7rem' }}></i>
              </a>
              <a className="menu-item">
                <div className="menu-item-left"><i className="fa-solid fa-arrows-rotate"></i> Remarketing</div>
              </a>
              
              {/* FINANCEIRO MENU ITEM */}
              <a className={`menu-item ${activePanel === 'financeiro' ? 'active' : ''}`} onClick={() => { setActivePanel('financeiro'); setFinanceTab('saldos'); }} style={{ borderLeft: activePanel === 'financeiro' ? '3px solid var(--primary-green)' : 'none' }}>
                <div className="menu-item-left"><i className="fa-solid fa-wallet" style={{ color: activePanel === 'financeiro' ? 'var(--primary-green)' : 'inherit' }}></i> Financeiro</div>
                <span className="badge-sidebar badge-green">3</span>
              </a>
              
              <a className="menu-item">
                <div className="menu-item-left"><i className="fa-solid fa-chart-simple"></i> Relatórios</div>
                <span className="badge-sidebar badge-purple">Novo</span>
              </a>
              <a className="menu-item">
                <div className="menu-item-left"><i className="fa-solid fa-gear"></i> Configurações</div>
              </a>
              
              {/* ESTORNO MENU ITEM */}
              <a className={`menu-item ${activePanel === 'estornos' ? 'active' : ''}`} onClick={() => { setActivePanel('estornos'); setEstornoSubView('dashboard'); }} style={{ borderLeft: '3px solid var(--primary-orange)', backgroundColor: 'rgba(255, 87, 34, 0.05)', color: '#ffffff', marginTop: '4px' }}>
                <div className="menu-item-left"><i className="fa-solid fa-arrow-rotate-left" style={{ color: 'var(--primary-orange)' }}></i> Estornos</div>
                <span className="badge-sidebar badge-orange">ERP</span>
              </a>
              
              {/* SAC / ATENDIMENTO MENU ITEM */}
              <a className={`menu-item ${activePanel === 'sac' ? 'active' : ''}`} onClick={() => { setActivePanel('sac'); }} style={{ borderLeft: '3px solid var(--primary-blue)', backgroundColor: 'rgba(0, 123, 255, 0.05)', color: '#ffffff', marginTop: '4px' }}>
                <div className="menu-item-left"><i className="fa-solid fa-headset" style={{ color: 'var(--primary-blue)' }}></i> Atendimento / SAC</div>
                <span className="badge-sidebar badge-blue">Novo</span>
              </a>
            </div>
          </div>
          
          <div className="sidebar-footer">
            <button className="btn-sidebar-footer btn-create-event"><i className="fa-solid fa-plus"></i> Criar Evento</button>
            <button className="btn-sidebar-footer btn-request-payout"><i className="fa-solid fa-money-bill-transfer"></i> Solicitar Repasse</button>
          </div>
        </aside>

        {/* MAIN DYNAMIC CONTENT */}
        <main className="content-area">
            
          {/* PANEL A: DASHBOARD PAINEL DE CONTROLE (EVENT CARDS) */}
          {activePanel === 'dashboard' && (
            <div>
              <div className="dashboard-header">
                <div className="dashboard-title-box">
                  <h2>Painel de Controle</h2>
                  <p>Bem-vindo de volta! Visualize as métricas operacionais consolidadas.</p>
                </div>
                <div className="header-buttons">
                  <button className="btn-header-action primary"><i className="fa-solid fa-database"></i> Dados</button>
                  <button className="btn-header-action"><i className="fa-regular fa-file-pdf"></i> PDF</button>
                </div>
              </div>

              <div className="events-panel">
                <div className="events-panel-header">
                  <h5>Eventos</h5>
                  
                  <div className="filter-tabs">
                    <button className="btn-header-action" style={{ padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }}><i className="fa-solid fa-sliders"></i> Comparar</button>
                    <button className="filter-tab-btn active">Ativos</button>
                    <button className="filter-tab-btn">Inativos</button>
                    <button className="filter-tab-btn">Todos</button>
                    <button className="btn-header-action" style={{ padding: '6px 12px', borderRadius: '20px', fontWeight: 600 }}><i className="fa-solid fa-table-cells-large"></i> Layout</button>
                  </div>
                </div>

                <div className="event-cards-grid">
                  {/* Event 1 */}
                  <div className="event-card">
                    <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=250&q=80" alt="Música e Natureza" className="event-card-img" />
                    <div className="event-card-body">
                      <div>
                        <div className="event-card-title">Experiência Música e Natureza - JI</div>
                        <div className="event-card-location"><i className="fa-solid fa-location-dot"></i> Parque Jaime Lerner - Curitiba/PR</div>
                      </div>
                      <div>
                        <div className="event-card-stats">
                          <div className="stat-col"><span className="stat-label">Total (R$)</span><span className="stat-val">2.033,00</span></div>
                          <div className="stat-col"><span className="stat-label">Vendas</span><span className="stat-val">99</span></div>
                          <div className="stat-col"><span className="stat-label">Disponível</span><span className="stat-val">1901</span></div>
                          <div className="stat-col"><span className="stat-label">Cortesia</span><span className="stat-val">39</span></div>
                          <div className="stat-col"><span className="stat-label">Ocupação</span><span className="stat-val percentage">6.9%</span></div>
                        </div>
                        <div className="event-card-footer">
                          <div><i className="fa-regular fa-calendar-check"></i> Seg, 06/07/2026 - 11:00</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="event-card">
                    <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=250&q=80" alt="Samba 90 Graus" className="event-card-img" />
                    <div className="event-card-body">
                      <div>
                        <div className="event-card-title">Samba 90 Graus</div>
                        <div className="event-card-location"><i className="fa-solid fa-location-dot"></i> Live Curitiba - Curitiba/PR</div>
                      </div>
                      <div>
                        <div className="event-card-stats">
                          <div className="stat-col"><span className="stat-label">Total (R$)</span><span className="stat-val">11.669,90</span></div>
                          <div className="stat-col"><span className="stat-label">Vendas</span><span className="stat-val">300</span></div>
                          <div className="stat-col"><span className="stat-label">Disponível</span><span className="stat-val">1700</span></div>
                          <div className="stat-col"><span className="stat-label">Cortesia</span><span className="stat-val">50</span></div>
                          <div className="stat-col"><span className="stat-label">Ocupação</span><span className="stat-val percentage">17.5%</span></div>
                        </div>
                        <div className="event-card-footer">
                          <div><i className="fa-regular fa-calendar-check"></i> Sáb, 05/07/2025 - 19:00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PANEL B: CUPONS DE DESCONTO PANEL */}
          {activePanel === 'coupons' && (
            <div>
              <div className="dashboard-header">
                <div className="dashboard-title-box">
                  <h2>Painel de Controle</h2>
                  <p>Cupons de desconto configurados para os seus eventos.</p>
                </div>
              </div>

              <div className="events-panel">
                <div className="events-panel-header" style={{ borderBottom: 'none', marginBottom: 0 }}>
                  <h5>Cupons de Desconto</h5>
                </div>

                <table className="coupon-table">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Desconto</th>
                      <th>Uso Limite</th>
                      <th>Utilizados</th>
                      <th>Validade</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 700 }}>DESCONTO10</td>
                      <td>10%</td>
                      <td>100</td>
                      <td>42</td>
                      <td>30/07/2026</td>
                      <td>
                        <button className="btn-edit-coupon"><i className="fa-regular fa-edit"></i></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PANEL C: FLUXO DE ESTORNO DE INGRESSOS */}
          {activePanel === 'estornos' && (
            <div>
              <div className="dashboard-header">
                <div className="dashboard-title-box">
                  <h2>Módulo de Estorno de Ingressos</h2>
                  <p>Gestão executiva de devoluções financeiras, conciliação e alçadas de aprovação.</p>
                </div>
                <div className="header-buttons">
                  {estornoSubView === 'dashboard' ? (
                    <button className="btn-header-action primary" onClick={() => { setEstornoSubView('wizard'); setWizardStep(1); }} style={{ backgroundColor: 'var(--primary-orange)', borderColor: 'var(--primary-orange)', color: '#ffffff' }}>
                      <i className="fa-solid fa-plus-circle"></i> Novo Estorno
                    </button>
                  ) : (
                    <button className="btn-header-action" onClick={() => setEstornoSubView('dashboard')}>
                      <i className="fa-solid fa-chart-pie"></i> Voltar ao Painel
                    </button>
                  )}
                </div>
              </div>

              {/* SUBVIEW 1: EXECUTIVE ANALYTICS DASHBOARD */}
              {estornoSubView === 'dashboard' && (
                <div>
                  {/* Top Cards Grid */}
                  <div className="row g-3 mb-4" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px' }}>Estornos Executados</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{estornosList.length}</h2>
                        <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600 }}><i className="fa-solid fa-arrow-up me-1"></i>+5%</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '8px' }}>Atualizado em tempo real</div>
                    </div>
                    
                    <div style={{ flex: 1, background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', color: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.5px' }}>Montante Devolvido</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
                          R$ {estornosList.reduce((acc, curr) => acc + Number(curr.value || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h2>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Integrado via APIs</div>
                    </div>

                    <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>Taxas Convenience Retidas</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                          R$ {estornosList.reduce((acc, curr) => acc + (Number(curr.value || 0) - Number(curr.netRefund || 0)), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h2>
                        <span style={{ color: '#3b82f6', fontSize: '0.7rem', fontWeight: 600 }}>15% retido</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '8px' }}>Retido no caixa do ERP</div>
                    </div>

                    <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px' }}>Preservado em Voucher</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#10b981' }}>
                          R$ {(estornosList.reduce((acc, curr) => acc + Number(curr.value || 0), 0) * 0.3).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h2>
                        <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600 }}>30% preservado</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '8px' }}>Retido em crédito de compras</div>
                    </div>
                  </div>

                  {/* Split Panel: Pending Approvals & Risk metrics */}
                  <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    
                    {/* Interactive Pending Approvals List */}
                    <div className="events-panel" style={{ flex: 7, borderRadius: '12px', padding: '20px' }}>
                      <div className="events-panel-header" style={{ marginBottom: '15px', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-file-shield text-orange me-2"></i> Fila de Aprovações Pendentes (Alçadas)</h6>
                        <span className={`badge ${pendingApprovals.length > 0 ? 'bg-warning text-dark' : 'bg-success text-white'}`} style={{ padding: '6px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
                          {pendingApprovals.length > 0 ? `${pendingApprovals.length} Chamados Requerem Alçada` : 'Fila Limpa! ✅'}
                        </span>
                      </div>

                      <div style={{ overflowX: 'auto' }}>
                        <table className="info-table" style={{ fontSize: '0.8rem' }}>
                          <thead className="table-light">
                            <tr>
                              <th>Pedido</th>
                              <th>Cliente / Evento</th>
                              <th>Valor</th>
                              <th>Alçada Alvo</th>
                              <th style={{ textAlign: 'center' }}>Análise</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingApprovals.map((item) => (
                              <tr key={item.id} onClick={() => setSelectedApproval(item)} style={{ cursor: 'pointer', transition: 'background-color 0.15s' }} className="hover-row-effect">
                                <td className="fw-bold" style={{ color: 'var(--primary-orange)' }}>{item.order}</td>
                                <td>
                                  <strong>{item.client}</strong><br/>
                                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>{item.show}</span>
                                </td>
                                <td className="fw-bold">{item.value}</td>
                                <td><span className="badge bg-light text-primary border" style={{ padding: '4px 8px', fontSize: '0.65rem' }}>{item.tier}</span></td>
                                <td style={{ textAlign: 'center' }}>
                                  <button className="btn btn-xs btn-outline-primary" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' }}>Analisar</button>
                                </td>
                              </tr>
                            ))}
                            {pendingApprovals.length === 0 && (
                              <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                  <i className="fa-solid fa-circle-check text-success" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}></i>
                                  Nenhuma alçada de aprovação pendente na fila!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Beautiful Interactive Risk Gauge Card */}
                    <div className="events-panel" style={{ flex: 5, borderRadius: '12px', padding: '20px' }}>
                      <div className="events-panel-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                        <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-shield-halved text-orange me-2"></i> Conciliação & Risco Operacional</h6>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
                        {/* Circular Gauge Chart */}
                        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="50" cy="50" r="44" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                            <circle cx="50" cy="50" r="44" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="276.46" strokeDashoffset={276.46 * (1 - 0.0085)} style={{ strokeLinecap: 'round', transition: 'stroke-dashoffset 1s ease' }} />
                          </svg>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>0.85%</div>
                            <div style={{ fontSize: '0.5rem', color: '#64748b', textTransform: 'uppercase' }}>Taxa</div>
                          </div>
                        </div>

                        <div>
                          <h6 className="fw-bold text-dark m-0" style={{ fontSize: '0.85rem' }}>Zona de Segurança Ativa</h6>
                          <p className="text-muted m-0" style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>Métricas de Chargeback e contestações consolidadas no gateway dentro da meta operacional permitida.</p>
                        </div>
                      </div>

                      {/* Sub-Progress metrics */}
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', fontSize: '0.75rem' }}>
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span className="text-muted">Estornos por PIX (Rápido)</span>
                            <span className="fw-bold text-dark">{Math.round(estornosList.length * 0.36)} devoluções</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                            <div style={{ width: '36%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '3px' }}></div>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span className="text-muted">Estornos por Cartão (Crédito)</span>
                            <span className="fw-bold text-dark">{Math.round(estornosList.length * 0.64)} devoluções</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                            <div style={{ width: '64%', height: '100%', backgroundColor: '#ea580c', borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Table 3: Database Completed Refunds Table (Fully Filterable) */}
                  <div className="events-panel" style={{ marginTop: '20px', borderRadius: '12px', padding: '20px' }}>
                    <div className="events-panel-header" style={{ marginBottom: '15px', borderBottom: 'none', display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-list-check text-orange me-2"></i> Registro Geral de Estornos Efetuados (Banco de Dados)</h6>
                      
                      {/* Interactive Search and Filters */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {/* Search Input */}
                        <div style={{ position: 'relative' }}>
                          <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '0.75rem', color: '#94a3b8' }}></i>
                          <input type="text" placeholder="Buscar por pedido ou cliente..." value={estornoSearchQuery} onChange={(e) => setEstornoSearchQuery(e.target.value)} style={{ padding: '6px 12px 6px 30px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', width: '220px' }} />
                        </div>
                        {/* Gateway Filter Tabs */}
                        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '6px', padding: '2px' }}>
                          <button onClick={() => setEstornoGatewayFilter('all')} style={{ padding: '4px 10px', fontSize: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: estornoGatewayFilter === 'all' ? '#ffffff' : 'transparent', fontWeight: estornoGatewayFilter === 'all' ? 700 : 500, boxShadow: estornoGatewayFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>Todos</button>
                          <button onClick={() => setEstornoGatewayFilter('pagseguro')} style={{ padding: '4px 10px', fontSize: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: estornoGatewayFilter === 'pagseguro' ? '#ffffff' : 'transparent', fontWeight: estornoGatewayFilter === 'pagseguro' ? 700 : 500, boxShadow: estornoGatewayFilter === 'pagseguro' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>PagSeguro</button>
                          <button onClick={() => setEstornoGatewayFilter('stone')} style={{ padding: '4px 10px', fontSize: '0.7rem', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: estornoGatewayFilter === 'stone' ? '#ffffff' : 'transparent', fontWeight: estornoGatewayFilter === 'stone' ? 700 : 500, boxShadow: estornoGatewayFilter === 'stone' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>Stone</button>
                        </div>
                      </div>
                    </div>

                    <table className="info-table" style={{ fontSize: '0.8rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th>Data/Hora</th>
                          <th>Pedido</th>
                          <th>Cliente</th>
                          <th>Show/Evento</th>
                          <th>Gateway</th>
                          <th>Valor Pago</th>
                          <th>Valor Reembolsado (Líquido)</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estornosList.filter(item => {
                          const matchesSearch = item.client.toLowerCase().includes(estornoSearchQuery.toLowerCase()) || item.order.toLowerCase().includes(estornoSearchQuery.toLowerCase());
                          const matchesGateway = estornoGatewayFilter === 'all' || item.gateway === estornoGatewayFilter;
                          return matchesSearch && matchesGateway;
                        }).map((item) => (
                          <tr key={item.id} className="hover-row-effect">
                            <td className="text-muted">{item.timestamp ? new Date(item.timestamp).toLocaleString('pt-BR') : '-'}</td>
                            <td className="fw-bold">#{item.order}</td>
                            <td>{item.client}</td>
                            <td>{item.show}</td>
                            <td><span className="badge bg-light text-dark border">{item.gateway === 'pagseguro' ? 'PagSeguro' : 'Stone'}</span></td>
                            <td className="fw-bold">R$ {Number(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="text-success fw-bold">R$ {Number(item.netRefund).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td><span className="badge bg-success">{item.status}</span></td>
                          </tr>
                        ))}
                        {estornosList.filter(item => {
                          const matchesSearch = item.client.toLowerCase().includes(estornoSearchQuery.toLowerCase()) || item.order.toLowerCase().includes(estornoSearchQuery.toLowerCase());
                          const matchesGateway = estornoGatewayFilter === 'all' || item.gateway === estornoGatewayFilter;
                          return matchesSearch && matchesGateway;
                        }).length === 0 && (
                          <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Nenhum estorno correspondente aos filtros.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Beautiful Overlay Modal for Pending Approvals Analysis */}
                  {selectedApproval && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                      <div className="custom-modal-card" style={{ width: '460px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', padding: '24px', animation: 'scaleUp 0.2s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                          <h5 className="fw-bold m-0 text-dark"><i className="fa-solid fa-user-shield text-orange me-2"></i> Analisar Alçada de Liberação</h5>
                          <button onClick={() => { setSelectedApproval(null); setApprovalPasswordInput(''); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>&times;</button>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>
                          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #f1f5f9', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '6px' }}>
                              <span>Código do Pedido:</span>
                              <strong className="text-dark">{selectedApproval.order}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '6px' }}>
                              <span>Cliente Portador:</span>
                              <strong className="text-dark">{selectedApproval.client}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '6px' }}>
                              <span>Show associado:</span>
                              <strong className="text-dark">{selectedApproval.show}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                              <span>Valor de Devolução:</span>
                              <strong style={{ color: 'var(--primary-orange)', fontSize: '1.05rem' }}>{selectedApproval.value}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeft: '3px solid #3b82f6', padding: '10px 12px', borderRadius: '4px', marginBottom: '15px' }}>
                            <i className="fa-solid fa-triangle-exclamation text-primary"></i>
                            <div>
                              <strong>Alçada de Liberação Necessária:</strong><br/>
                              Exige validação de credencial nível <strong>{selectedApproval.tier}</strong>.
                            </div>
                          </div>

                          <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label className="fw-bold text-dark" style={{ display: 'block', marginBottom: '6px' }}>Senha de Supervisor/Gerente</label>
                            <input type="password" placeholder="Digite sua senha de autorização..." value={approvalPasswordInput} onChange={(e) => setApprovalPasswordInput(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                          <button className="btn btn-sm btn-light border" onClick={() => { setSelectedApproval(null); setApprovalPasswordInput(''); }} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Voltar</button>
                          <button className="btn btn-sm btn-danger" onClick={() => { handleApprovalAction(selectedApproval.id); setSelectedApproval(null); setApprovalPasswordInput(''); }} style={{ color: '#ffffff', backgroundColor: '#ef4444', border: 'none', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px' }}>Rejeitar</button>
                          <button className="btn btn-sm btn-success" onClick={() => { handleApprovalAction(selectedApproval.id); saveRefundToDb(selectedApproval); setSelectedApproval(null); setApprovalPasswordInput(''); }} style={{ color: '#ffffff', backgroundColor: '#10b981', border: 'none', fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px' }} disabled={!approvalPasswordInput}>Aprovar & Processar</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBVIEW 2: DYNAMIC COMPREHENSIVE WIZARD */}
              {estornoSubView === 'wizard' && (
                <div>
                  <div className="wizard-stepper">
                    <div className="stepper-progress" style={{ width: wizardStep === 1 ? '0%' : wizardStep === 2 ? '33%' : wizardStep === 3 ? '66%' : '100%' }}></div>
                    <div className={`step-indicator ${wizardStep === 1 ? 'active' : ''} ${wizardStep > 1 ? 'completed' : ''}`}>1</div>
                    <div className={`step-indicator ${wizardStep === 2 ? 'active' : ''} ${wizardStep > 2 ? 'completed' : ''}`}>2</div>
                    <div className={`step-indicator ${wizardStep === 3 ? 'active' : ''} ${wizardStep > 3 ? 'completed' : ''}`}>3</div>
                    <div className={`step-indicator ${wizardStep === 4 ? 'active' : 'completed'}`}>4</div>
                  </div>

                  <div className="wizard-card">
                    {/* STEP 1 */}
                    {wizardStep === 1 && (
                      <div>
                        <h5 className="fw-bold mb-3"><i className="fa-solid fa-magnifying-glass text-orange me-2"></i> Passo 1: Localizar Venda no ERP</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Insira o código do pedido ou o CPF do comprador para carregar a transação.</p>
                        
                        <div style={{ display: 'flex', gap: '15px' }}>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Código do Pedido</label>
                            <input type="text" defaultValue="154258" />
                          </div>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>CPF do Comprador</label>
                            <input type="text" defaultValue="000.000.000-00" />
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                          <button className="btn-wizard-next" onClick={() => setWizardStep(2)}>Consultar Venda <i className="fa-solid fa-chevron-right"></i></button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {wizardStep === 2 && (
                      <div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <div style={{ flex: 7 }}>
                            <div style={{ backgroundColor: 'var(--bg-header)', color: '#ffffff', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
                              <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Cabeçalho de Estorno</div>
                              <h4 style={{ fontWeight: 800, margin: '4px 0 0 0' }}>ESTORNO DE INGRESSOS</h4>
                              <div style={{ borderTop: '1px solid #4a5568', marginTop: '10px', paddingTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.7rem' }}>
                                <span>Pedido: <strong>#1548</strong></span>
                                <span>Cliente: <strong>João da Silva</strong></span>
                                <span>Valor: <strong>R$ 580,00</strong></span>
                                <span>Evento: <strong>Show Roupa Nova</strong></span>
                                <span>Status: <span className="badge bg-success" style={{ fontSize: '0.6rem', padding: '2px 4px' }}>PAGO</span></span>
                              </div>
                            </div>

                            <h6 className="fw-bold mb-2">Dados da Venda</h6>
                            <table className="info-table">
                              <tbody>
                                <tr><th>Pedido</th><td>154258</td><th>Data Compra</th><td>10/07/2026</td></tr>
                                <tr><th>Evento</th><td colSpan="3">Show Roupa Nova (Data: 20/07/2026)</td></tr>
                              </tbody>
                            </table>

                            <h6 className="fw-bold mb-2">Situação Financeira ({selectedGateway === 'pagseguro' ? 'PagSeguro' : 'Stone'})</h6>
                            <table className="info-table">
                              <tbody>
                                <tr>
                                  <th>Pagamento</th>
                                  <td><span className="badge bg-success" style={{ fontSize: '0.65rem', color: '#ffffff', padding: '2px 6px' }}>Aprovado</span></td>
                                  <th>Gateway</th>
                                  <td>{selectedGateway === 'pagseguro' ? 'PagSeguro (UOL)' : 'Stone'}</td>
                                </tr>
                                <tr>
                                  <th>Código Transação</th>
                                  <td>{selectedGateway === 'pagseguro' ? '9E884547-68F5-4214-B1F3-E88A813D1D1D' : '854785214 / TID: 789654123'}</td>
                                  <th>Taxas</th>
                                  <td>{selectedGateway === 'pagseguro' ? '3,99% + R$ 0,40' : '2,49%'}</td>
                                </tr>
                                <tr>
                                  <th>Valor Pago</th>
                                  <td>R$ 580,00</td>
                                  <th>Valor Líquido</th>
                                  <td className="text-success fw-bold">{selectedGateway === 'pagseguro' ? 'R$ 556,46' : 'R$ 565,56'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div style={{ flex: 5 }}>
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px' }}>
                              <h6 className="fw-bold border-bottom pb-2 mb-3">Validações Automáticas</h6>
                              
                              <div className="validation-item val-ok"><i className="fa-solid fa-check-circle"></i> Pedido localizado</div>
                              <div className="validation-item val-ok"><i className="fa-solid fa-check-circle"></i> Pagamento confirmado</div>
                              <div className="validation-item val-ok"><i className="fa-solid fa-check-circle"></i> Evento ativo</div>
                              <div className="validation-item val-ok"><i className="fa-solid fa-check-circle"></i> Ingresso não utilizado</div>
                              
                              {errorSimulationActive ? (
                                <div style={{ borderTop: '1px solid #dee2e6', marginTop: '10px', paddingTop: '10px' }}>
                                  <div className="validation-item val-fail"><i className="fa-solid fa-times-circle"></i> Ingresso já utilizado</div>
                                  <div className="validation-item val-fail"><i className="fa-solid fa-times-circle"></i> Prazo expirado</div>
                                </div>
                              ) : (
                                <div className="validation-item val-ok"><i className="fa-solid fa-check-circle"></i> Dentro do prazo</div>
                              )}

                              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <button className={`btn btn-xs ${errorSimulationActive ? 'btn-success' : 'btn-outline-danger'}`} onClick={() => setErrorSimulationActive(!errorSimulationActive)} style={{ fontSize: '0.65rem', padding: '4px 8px', cursor: 'pointer' }}>
                                  {errorSimulationActive ? 'Remover Falhas' : 'Simular Falha de Regras'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                          <button className="btn-header-action" onClick={() => setWizardStep(1)}><i className="fa-solid fa-chevron-left"></i> Voltar</button>
                          <button className="btn-wizard-next" onClick={() => setWizardStep(3)}>Avançar <i className="fa-solid fa-chevron-right"></i></button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {wizardStep === 3 && (
                      <div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <div style={{ flex: 7 }}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                              <label style={{ display: 'block', marginBottom: '8px' }}>Selecione o Gateway de Destino</label>
                              <div style={{ display: 'flex', gap: '15px' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                  <input type="radio" name="gatewaySelect" checked={selectedGateway === 'pagseguro'} onChange={() => setSelectedGateway('pagseguro')} style={{ width: 'auto', marginRight: '6px' }} />
                                  PagSeguro (UOL)
                                </label>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                  <input type="radio" name="gatewaySelect" checked={selectedGateway === 'stone'} onChange={() => setSelectedGateway('stone')} style={{ width: 'auto', marginRight: '6px' }} />
                                  Stone / Cielo
                                </label>
                              </div>
                            </div>

                            {/* PagSeguro Creds drawer */}
                            {selectedGateway === 'pagseguro' && (
                              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary-orange)', marginBottom: '10px' }}>
                                  <i className="fa-solid fa-key me-1"></i> Credenciais da API PagSeguro
                                </div>
                                <div className="form-group">
                                  <label style={{ fontSize: '0.7rem' }}>API Token PagSeguro</label>
                                  <input type="password" value={pagSeguroToken} onChange={(e) => setPagSeguroToken(e.target.value)} style={{ padding: '6px 10px', fontSize: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                  <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem' }}>E-mail da Conta</label>
                                    <input type="text" value={pagSeguroEmail} onChange={(e) => setPagSeguroEmail(e.target.value)} style={{ padding: '6px 10px', fontSize: '0.8rem' }} />
                                  </div>
                                  <div className="form-group" style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem' }}>Ambiente</label>
                                    <select value={pagSeguroEnv} onChange={(e) => setPagSeguroEnv(e.target.value)} style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                                      <option value="production">Produção</option>
                                      <option value="sandbox">Sandbox (Testes)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="form-group">
                              <label>Tipo de Estorno</label>
                              <div style={{ display: 'flex', gap: '15px', marginTop: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}><input type="radio" name="estornoTipo" defaultChecked /> Total</label>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}><input type="radio" name="estornoTipo" /> Parcial</label>
                                <label style={{ fontSize: '0.75rem', fontWeight: 600 }}><input type="radio" name="estornoTipo" /> Voucher</label>
                              </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '15px' }}>
                              <label>Motivo do Estorno</label>
                              <select>
                                <option>Cliente desistiu</option>
                                <option>Evento cancelado</option>
                                <option>Compra duplicada</option>
                                <option>Outros</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ flex: 5 }}>
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px' }}>
                              <h6 className="fw-bold border-bottom pb-2">Alçadas de Aprovação</h6>
                              <table className="info-table" style={{ fontSize: '0.7rem', marginTop: '10px' }}>
                                <thead>
                                  <tr><th>Valor</th><th>Aprovação</th></tr>
                                </thead>
                                <tbody>
                                  <tr><td>Até R$ 500</td><td>Supervisor</td></tr>
                                  <tr style={{ fontWeight: 700, backgroundColor: 'rgba(0,123,255,0.05)' }}><td>Até R$ 5.000</td><td>Gerente Financeiro (Exigido)</td></tr>
                                </tbody>
                              </table>
                              <div className="alert alert-info" style={{ backgroundColor: 'rgba(0,123,255,0.08)', padding: '8px 12px', fontSize: '0.7rem', borderRadius: '4px', borderLeft: '3px solid var(--primary-blue)', marginTop: '10px' }}>
                                <strong>Aprovação:</strong> Valor de R$ 580,00 exige alçada do <strong>Gerente Financeiro</strong>.
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* LIVE GATEWAY PROGRESS ANIMATION */}
                        {gatewayProcessing && (
                          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #dee2e6', textAlign: 'center' }}>
                            <h6 className="fw-bold">
                              <i className="fa-solid fa-spinner fa-spin text-orange" style={{ marginRight: '6px' }}></i> 
                              Comunicando com {selectedGateway === 'pagseguro' ? 'API PagSeguro (Reembolso UOL)...' : 'Gateway Stone / Cielo...'}
                            </h6>
                            <div className="gateway-flow-steps">
                              <div className={`g-step ${gatewayStep >= 1 ? 'active' : ''} ${gatewayStep > 1 ? 'done' : ''}`}>Solicitação</div>
                              <div className={`g-step ${gatewayStep >= 2 ? 'active' : ''} ${gatewayStep > 2 ? 'done' : ''}`}>{selectedGateway === 'pagseguro' ? 'PagSeguro API' : 'Gateway'}</div>
                              <div className={`g-step ${gatewayStep >= 3 ? 'active' : ''} ${gatewayStep > 3 ? 'done' : ''}`}>{selectedGateway === 'pagseguro' ? 'Validar Token' : 'Autorização'}</div>
                              <div className={`g-step ${gatewayStep >= 4 ? 'active' : ''} ${gatewayStep > 4 ? 'done' : ''}`}>Estorno</div>
                              <div className={`g-step ${gatewayStep >= 5 ? 'active' : ''} ${gatewayStep > 5 ? 'done' : ''}`}>Confirmação</div>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                          <button className="btn-header-action" onClick={() => setWizardStep(2)} disabled={gatewayProcessing}><i className="fa-solid fa-chevron-left"></i> Voltar</button>
                          <button className="btn-wizard-next" onClick={runGatewaySimulation} disabled={gatewayProcessing} style={{ backgroundColor: 'var(--primary-green)' }}>
                            <i className="fa-solid fa-check"></i> Executar & Integrar Estorno
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4 */}
                    {wizardStep === 4 && (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                          <i className="fa-solid fa-circle-check text-success" style={{ fontSize: '2.5rem', color: 'var(--primary-green)' }}></i>
                        </div>
                        <h4 className="fw-bold mb-1">Estorno Finalizado com Sucesso!</h4>
                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>As catracas do Teatro Positivo foram atualizadas e o ingresso foi invalidado.</p>

                        <div style={{ display: 'flex', gap: '20px', textAlign: 'left', marginTop: '20px' }}>
                          <div style={{ flex: 1 }}>
                            <h6 className="fw-bold">Comunicação Enviada ({selectedGateway === 'pagseguro' ? 'PagSeguro' : 'Stone'})</h6>
                            <div style={{ border: '1px solid #dee2e6', padding: '10px', borderRadius: '4px', fontSize: '0.7rem', backgroundColor: '#fcfcfc' }}>
                              "Seu estorno foi realizado com sucesso. Pedido: 154258 | Valor: R$ 580,00 | Gateway: {selectedGateway === 'pagseguro' ? 'PagSeguro' : 'Cartão Crédito'} | Prazo: 5 dias úteis."
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h6 className="fw-bold">Auditoria do Sistema ({selectedGateway === 'pagseguro' ? 'PagSeguro API' : 'Stone API'})</h6>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              ✔ 10:32 - Solicitou Estorno (Vinicius)<br/>
                              ✔ 10:36 - Confirmado pelo {selectedGateway === 'pagseguro' ? 'API PagSeguro' : 'Gateway Stone'}<br/>
                              ✔ 10:37 - Ingressos cancelados nas catracas
                            </div>
                          </div>
                        </div>

                        <button className="btn-wizard-next" onClick={() => setEstornoSubView('dashboard')} style={{ marginTop: '25px' }}>Concluir e Fechar</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PANEL D: INTEGRATED SAC WORKSTATION HUB */}
          {activePanel === 'sac' && (
            <div style={{ height: '100%' }}>
              <iframe 
                src={getIframeSrc()} 
                style={{ width: '100%', height: 'calc(100vh - 120px)', border: 'none', borderRadius: '8px', backgroundColor: '#ffffff' }}
              ></iframe>
            </div>
          )}

          {/* PANEL E: COMPREHENSIVE FINANCEIRO MODULE */}
          {activePanel === 'financeiro' && (
            <div>
              <div className="dashboard-header">
                <div className="dashboard-title-box">
                  <h2>Módulo Financeiro & Controle de Eventos</h2>
                  <p>Consiliação de saldos, fluxo de repasse aos produtores e controle de contas bancárias.</p>
                </div>
                <div className="header-buttons" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className={`btn-header-action ${financeTab === 'saldos' ? 'primary' : ''}`} onClick={() => setFinanceTab('saldos')} style={{ backgroundColor: financeTab === 'saldos' ? 'var(--primary-green)' : '', borderColor: financeTab === 'saldos' ? 'var(--primary-green)' : '', color: financeTab === 'saldos' ? '#ffffff' : '' }}>
                    <i className="fa-solid fa-wallet"></i> Saldos por Evento
                  </button>
                  <button className={`btn-header-action ${financeTab === 'repasses' ? 'primary' : ''}`} onClick={() => setFinanceTab('repasses')} style={{ backgroundColor: financeTab === 'repasses' ? 'var(--primary-green)' : '', borderColor: financeTab === 'repasses' ? 'var(--primary-green)' : '', color: financeTab === 'repasses' ? '#ffffff' : '' }}>
                    <i className="fa-solid fa-money-bill-transfer"></i> Solicitações de Repasse
                  </button>
                  <button className={`btn-header-action ${financeTab === 'antecipacoes' ? 'primary' : ''}`} onClick={() => setFinanceTab('antecipacoes')} style={{ backgroundColor: financeTab === 'antecipacoes' ? 'var(--primary-green)' : '', borderColor: financeTab === 'antecipacoes' ? 'var(--primary-green)' : '', color: financeTab === 'antecipacoes' ? '#ffffff' : '' }}>
                    <i className="fa-solid fa-hand-holding-dollar"></i> Antecipações
                  </button>
                  <button className={`btn-header-action ${financeTab === 'extrato' ? 'primary' : ''}`} onClick={() => setFinanceTab('extrato')} style={{ backgroundColor: financeTab === 'extrato' ? 'var(--primary-green)' : '', borderColor: financeTab === 'extrato' ? 'var(--primary-green)' : '', color: financeTab === 'extrato' ? '#ffffff' : '' }}>
                    <i className="fa-solid fa-list-check"></i> Extrato
                  </button>
                  <button className={`btn-header-action ${financeTab === 'despesas' ? 'primary' : ''}`} onClick={() => setFinanceTab('despesas')} style={{ backgroundColor: financeTab === 'despesas' ? 'var(--primary-green)' : '', borderColor: financeTab === 'despesas' ? 'var(--primary-green)' : '', color: financeTab === 'despesas' ? '#ffffff' : '' }}>
                    <i className="fa-solid fa-file-invoice-dollar"></i> Despesas
                  </button>
                  <button className={`btn-header-action ${financeTab === 'contas' ? 'primary' : ''}`} onClick={() => setFinanceTab('contas')} style={{ backgroundColor: financeTab === 'contas' ? 'var(--primary-green)' : '', borderColor: financeTab === 'contas' ? 'var(--primary-green)' : '', color: financeTab === 'contas' ? '#ffffff' : '' }}>
                    <i className="fa-solid fa-building-columns"></i> Contas Bancárias
                  </button>
                </div>
              </div>

              {/* FINANCE TAB 1: SALDOS POR EVENTO */}
              {financeTab === 'saldos' && (
                <div className="events-panel">
                  <div className="events-panel-header" style={{ marginBottom: '15px' }}>
                    <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-wallet text-green me-2"></i> Balanços e Receita Consolidada por Evento (Firestore)</h6>
                  </div>

                  <table className="info-table" style={{ fontSize: '0.8rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Evento</th>
                        <th>Receita Bruta</th>
                        <th>Taxas Cobradas</th>
                        <th>Receita Líquida</th>
                        <th>Disponível Repasse</th>
                        <th>Bloqueado</th>
                        <th>Liberação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saldosList.map((saldo) => {
                        const evt = eventosList.find(e => e.id === saldo.eventoId) || {};
                        return (
                          <tr key={saldo.id}>
                            <td>
                              <strong>{evt.nome || 'Evento'}</strong><br/>
                              <span className="text-muted" style={{ fontSize: '0.7rem' }}>Organizador: {evt.organizador}</span>
                            </td>
                            <td className="fw-bold">R$ {saldo.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="text-danger">R$ {saldo.taxas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="fw-bold text-dark">R$ {saldo.liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="text-success fw-bold">R$ {saldo.disponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="text-warning">R$ {saldo.bloqueado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td><span className="badge bg-light text-dark border">{saldo.liberarEm}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FINANCE TAB 2: SOLICITAÇÕES DE REPASSE */}
              {financeTab === 'repasses' && (
                <div style={{ display: 'flex', gap: '20px' }}>
                  {/* Left Table */}
                  <div className="events-panel" style={{ flex: 7 }}>
                    <div className="events-panel-header" style={{ marginBottom: '15px' }}>
                      <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-money-bill-transfer text-green me-2"></i> Extrato de Repasses aos Produtores</h6>
                    </div>

                    <table className="info-table" style={{ fontSize: '0.8rem' }}>
                      <thead className="table-light">
                        <tr>
                          <th>Evento</th>
                          <th>Valor Solicitado</th>
                          <th>Data Solicitação</th>
                          <th>Data Pagamento</th>
                          <th>Conta de Crédito</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repassesList.map((rep) => {
                          const evt = eventosList.find(e => e.id === rep.eventoId) || {};
                          return (
                            <tr key={rep.id}>
                              <td><strong>{evt.nome || 'Evento'}</strong></td>
                              <td className="fw-bold">R$ {rep.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td>{rep.dataSolicitacao}</td>
                              <td>{rep.dataPagamento || '-'}</td>
                              <td style={{ fontSize: '0.7rem' }}>{rep.contaDestino}</td>
                              <td>
                                <span className={`badge ${rep.status === 'Concluído' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                                  {rep.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Right Form: Request Repasse */}
                  <div className="events-panel" style={{ flex: 5 }}>
                    <div className="events-panel-header" style={{ marginBottom: '15px' }}>
                      <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-paper-plane text-green me-2"></i> Solicitar Novo Repasse</h6>
                    </div>

                    <form onSubmit={handleRequestPayout}>
                      <div className="form-group">
                        <label>Evento para Repasse</label>
                        <select value={selectedRepasseEvento} onChange={(e) => setSelectedRepasseEvento(e.target.value)}>
                          {eventosList.map(evt => (
                            <option key={evt.id} value={evt.id}>{evt.nome}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ marginTop: '10px' }}>
                        <label>Valor a Liberar (R$)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={repasseValorInput} 
                          onChange={(e) => setRepasseValorInput(e.target.value)} 
                          required 
                        />
                        <span className="text-muted" style={{ fontSize: '0.65rem', display: 'block', marginTop: '4px' }}>
                          O valor solicitado será debitado do saldo "Disponível" e creditado na conta cadastrada.
                        </span>
                      </div>

                      <button type="submit" className="btn-wizard-next" style={{ backgroundColor: 'var(--primary-green)', marginTop: '15px', width: '100%' }}>
                        Confirmar & Solicitar Payout
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* FINANCE TAB 3: ANTECIPAÇÕES */}
              {financeTab === 'antecipacoes' && (
                <div className="events-panel">
                  <div className="events-panel-header" style={{ marginBottom: '15px' }}>
                    <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-hand-holding-dollar text-green me-2"></i> Solicitações de Antecipação de Recebíveis</h6>
                  </div>

                  <table className="info-table" style={{ fontSize: '0.8rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Evento</th>
                        <th>Valor Solicitado</th>
                        <th>Taxa (%)</th>
                        <th>Valor da Taxa</th>
                        <th>Valor Líquido Antecipado</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {antecipacoesList.map((ant) => {
                        const evt = eventosList.find(e => e.id === ant.eventoId) || {};
                        const valTaxa = ant.valor * (ant.taxa / 100);
                        const valLiq = ant.valor - valTaxa;
                        return (
                          <tr key={ant.id}>
                            <td><strong>{evt.nome || 'Evento'}</strong></td>
                            <td className="fw-bold">R$ {ant.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td>{ant.taxa.toFixed(2)}%</td>
                            <td className="text-danger">R$ {valTaxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="text-success fw-bold">R$ {valLiq.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td>
                              <span className={`badge ${ant.status === 'Aprovado' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                                {ant.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FINANCE TAB 4: EXTRATO COMPLETO */}
              {financeTab === 'extrato' && (
                <div className="events-panel">
                  <div className="events-panel-header" style={{ marginBottom: '15px' }}>
                    <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-list-check text-green me-2"></i> Extrato de Movimentações da Conta do Evento</h6>
                  </div>

                  <table className="info-table" style={{ fontSize: '0.8rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Data/Hora</th>
                        <th>Evento</th>
                        <th>Descrição da Movimentação</th>
                        <th>Tipo</th>
                        <th>Valor Movimentado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extratoList.map((mov) => {
                        const evt = eventosList.find(e => e.id === mov.eventoId) || {};
                        const isIncome = mov.valor > 0;
                        return (
                          <tr key={mov.id}>
                            <td style={{ color: 'var(--text-muted)' }}>{mov.data}</td>
                            <td><strong>{evt.nome || 'Evento'}</strong></td>
                            <td>{mov.descricao}</td>
                            <td>
                              <span className={`badge ${isIncome ? 'bg-success text-white' : mov.tipo === 'Repasse' ? 'bg-blue text-white' : 'bg-red text-white'}`}>
                                {mov.tipo}
                              </span>
                            </td>
                            <td className={`fw-bold ${isIncome ? 'text-success' : 'text-danger'}`}>
                              {isIncome ? '+' : ''} R$ {mov.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FINANCE TAB 5: DESPESAS */}
              {financeTab === 'despesas' && (
                <div className="events-panel">
                  <div className="events-panel-header" style={{ marginBottom: '15px' }}>
                    <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-file-invoice-dollar text-green me-2"></i> Despesas e Borderô Operacional (Notas Fiscais/Extratos)</h6>
                  </div>

                  <table className="info-table" style={{ fontSize: '0.8rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Evento Relacionado</th>
                        <th>Fornecedor</th>
                        <th>Descrição da Despesa</th>
                        <th>Categoria</th>
                        <th>Data Lançamento</th>
                        <th>Valor Debitado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {despesasList.map((des) => {
                        const evt = eventosList.find(e => e.id === des.eventoId) || {};
                        return (
                          <tr key={des.id}>
                            <td><strong>{evt.nome || 'Evento'}</strong></td>
                            <td><strong>{des.fornecedor || 'Fornecedor corporativo'}</strong></td>
                            <td>{des.descricao}</td>
                            <td><span className="badge bg-light text-dark border">{des.categoria}</span></td>
                            <td>{des.data}</td>
                            <td className="fw-bold text-danger">- R$ {des.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FINANCE TAB 6: CONTAS BANCÁRIAS */}
              {financeTab === 'contas' && (
                <div className="events-panel">
                  <div className="events-panel-header" style={{ marginBottom: '15px' }}>
                    <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-building-columns text-green me-2"></i> Contas Bancárias Cadastradas para Recebimento</h6>
                  </div>

                  <table className="info-table" style={{ fontSize: '0.8rem' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Titularidade</th>
                        <th>Banco</th>
                        <th>Agência</th>
                        <th>Conta Corrente</th>
                        <th>Chave PIX Associada</th>
                        <th>Status Conexão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contasList.map((conta) => (
                        <tr key={conta.id}>
                          <td><strong>{conta.titular}</strong></td>
                          <td>{conta.banco}</td>
                          <td>{conta.agencia}</td>
                          <td>{conta.conta}</td>
                          <td><code>{conta.pix}</code></td>
                          <td><span className="badge bg-success text-white">Verificada (Ativa)</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* FLOATING ASSISTANT */}
      <button className="assistant-float-btn">
        <i className="fa-solid fa-robot"></i> Assistente Virtual
      </button>
    </div>
  );
}

export default App;
