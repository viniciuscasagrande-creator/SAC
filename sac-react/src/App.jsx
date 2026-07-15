import React, { useState, useEffect } from 'react';
import './App.css';
import { db, auth } from './firebase'; // Firebase integration import
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

function App() {
  // Navigation State
  const [activePanel, setActivePanel] = useState('dashboard'); // 'dashboard' | 'coupons' | 'estornos' | 'sac'
  const [menuMeusEventosExpanded, setMenuMeusEventosExpanded] = useState(false);

  // Estorno Sub-views & Wizard State
  const [estornoSubView, setEstornoSubView] = useState('dashboard'); // 'dashboard' | 'wizard'
  const [wizardStep, setWizardStep] = useState(1);
  const [errorSimulationActive, setErrorSimulationActive] = useState(false);
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [gatewayStep, setGatewayStep] = useState(1); // 1 to 5

  // Interactive Approvals Queue State
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'rowApp1', order: '#154231', client: 'João da Silva', show: 'Show Roupa Nova', value: 'R$ 580,00', tier: 'Gerente Financeiro' },
    { id: 'rowApp2', order: '#154299', client: 'Maria de Souza', show: 'Música e Natureza', value: 'R$ 1.200,00', tier: 'Gerente Financeiro' },
    { id: 'rowApp3', order: '#154302', client: 'Pedro Santos', show: 'Samba 90 Graus', value: 'R$ 240,00', tier: 'Supervisor' },
  ]);

  // Firestore Sync & Logs State
  const [firebaseStatus, setFirebaseStatus] = useState('Off-line (Mock)');
  const [ticketsList, setTicketsList] = useState([]);

  useEffect(() => {
    // Attempt connecting to Firestore
    if (db) {
      getDocs(query(collection(db, "tickets"), orderBy("timestamp", "desc"), limit(5)))
        .then((snapshot) => {
          setFirebaseStatus('Conectado 🔥');
          const docs = [];
          snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
          setTicketsList(docs);
        })
        .catch((err) => {
          console.warn("Firestore connection unavailable, using local mock storage.", err);
          setFirebaseStatus('Offline (Mock Local)');
        });
    }
  }, [activePanel]);

  // Handler to approve/deny pending approvals
  const handleApprovalAction = (id) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
  };

  // Run Gateway Refund Simulation Steps
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
          // Complete and advance to Step 4 (Conclusão)
          setWizardStep(4);
          
          // Proactively log this refund to Firestore if available
          if (db && firebaseStatus.includes('Conectado')) {
            addDoc(collection(db, "tickets"), {
              type: "Estorno",
              order: "154258",
              client: "João da Silva",
              value: 580.00,
              nsu: "ADY_854785214",
              timestamp: new Date()
            }).catch(e => console.error(e));
          }
          return 5;
        }
      });
    }, 850);
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
              VI
              <span className="status-dot"></span>
            </div>
            <div className="profile-email">vinicius.casagrande@diskingressos.com.br</div>
          </div>
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }} className="badge bg-secondary">{firebaseStatus}</span>
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
              <a className="menu-item">
                <div className="menu-item-left"><i className="fa-solid fa-wallet"></i> Financeiro</div>
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
                    <img src="https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=250&q=80" alt="Música e Natureza" className="event-card-img" />
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
                  {/* KPI Advanced Grid */}
                  <div className="row g-3 mb-4" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', padding: '20px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Estornos Executados</div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0 0 0' }}>38</h2>
                      <span style={{ color: '#10b981', fontSize: '0.7rem' }}><i className="fa-solid fa-arrow-up me-1"></i>+5% vs ontem</span>
                    </div>
                    <div style={{ flex: 1, background: 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)', color: '#ffffff', padding: '20px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Montante Devolvido</div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0 0 0' }}>R$ 18.420,00</h2>
                      <span style={{ color: '#ffffff', opacity: 0.8, fontSize: '0.7rem' }}><i className="fa-solid fa-arrow-down me-1"></i>-12% vs ontem</span>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Taxas Convenience Retidas</div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0 0 0', color: 'var(--text-dark)' }}>R$ 2.763,00</h2>
                      <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600 }}><i className="fa-solid fa-lock me-1"></i>15% retido no caixa</span>
                    </div>
                    <div style={{ flex: 1, backgroundColor: '#ffffff', border: '1px solid #dee2e6', padding: '20px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Preservado em Voucher</div>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '5px 0 0 0', color: 'var(--primary-green)' }}>R$ 5.430,00</h2>
                      <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600 }}><i className="fa-solid fa-shield-halved me-1"></i>29% retido em crédito</span>
                    </div>
                  </div>

                  {/* Pending approvals & fraud analysis */}
                  <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    <div className="events-panel" style={{ flex: 7 }}>
                      <div className="events-panel-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                        <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-file-shield text-orange me-2"></i> Fila de Aprovações Pendentes (Alçadas)</h6>
                        <span className={`badge ${pendingApprovals.length > 0 ? 'bg-warning text-dark' : 'bg-success text-white'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {pendingApprovals.length > 0 ? `${pendingApprovals.length} Pendentes` : 'Fila Limpa! ✅'}
                        </span>
                      </div>

                      <table className="info-table" style={{ fontSize: '0.8rem' }}>
                        <thead className="table-light">
                          <tr>
                            <th>Pedido</th>
                            <th>Cliente / Evento</th>
                            <th>Valor</th>
                            <th>Alçada Alvo</th>
                            <th style={{ textAlign: 'center' }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingApprovals.map((item) => (
                            <tr key={item.id}>
                              <td className="fw-bold">{item.order}</td>
                              <td>
                                <strong>{item.client}</strong><br/>
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>{item.show}</span>
                              </td>
                              <td className="fw-bold">{item.value}</td>
                              <td><span className="badge bg-light text-primary border" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>{item.tier}</span></td>
                              <td style={{ textAlign: 'center' }}>
                                <button className="btn btn-sm btn-success me-1" onClick={() => handleApprovalAction(item.id)} style={{ color: '#ffffff', backgroundColor: '#10b981', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}><i className="fa-solid fa-check"></i></button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleApprovalAction(item.id)} style={{ color: '#ffffff', backgroundColor: '#ff5722', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><i className="fa-solid fa-times"></i></button>
                              </td>
                            </tr>
                          ))}
                          {pendingApprovals.length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Nenhuma aprovação pendente no momento!</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="events-panel" style={{ flex: 5 }}>
                      <div className="events-panel-header" style={{ marginBottom: '15px', paddingBottom: '10px' }}>
                        <h6 className="fw-bold text-dark m-0"><i className="fa-solid fa-shield-halved text-orange me-2"></i> Risco e Conciliação Adyen</h6>
                      </div>

                      <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-green)', margin: 0 }}>0.85%</h1>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Taxa de Chargeback Adyen (Zona Segura Green ✅)</span>
                      </div>

                      <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Estornos por PIX:</span>
                          <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>14 devoluções (36%)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Estornos por Cartão:</span>
                          <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>20 devoluções (53%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
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

                            <h6 className="fw-bold mb-2">Situação Financeira</h6>
                            <table className="info-table">
                              <tbody>
                                <tr><th>Pagamento</th><td><span className="badge bg-success" style={{ fontSize: '0.65rem', color: '#ffffff', padding: '2px 6px' }}>Aprovado</span></td><th>Gateway / Adq</th><td>Stone / Cielo</td></tr>
                                <tr><th>TID / NSU</th><td>789654123 / 854785214</td><th>Líquido</th><td className="text-success fw-bold">R$ 565,56</td></tr>
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
                            <h6 className="fw-bold"><i className="fa-solid fa-spinner fa-spin text-orange" style={{ marginRight: '6px' }}></i> Comunicando com Gateway Stone / Cielo...</h6>
                            <div className="gateway-flow-steps">
                              <div className={`g-step ${gatewayStep >= 1 ? 'active' : ''} ${gatewayStep > 1 ? 'done' : ''}`}>Solicitação</div>
                              <div className={`g-step ${gatewayStep >= 2 ? 'active' : ''} ${gatewayStep > 2 ? 'done' : ''}`}>Gateway</div>
                              <div className={`g-step ${gatewayStep >= 3 ? 'active' : ''} ${gatewayStep > 3 ? 'done' : ''}`}>Autorização</div>
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
                            <h6 className="fw-bold">Comunicação Enviada</h6>
                            <div style={{ border: '1px solid #dee2e6', padding: '10px', borderRadius: '4px', fontSize: '0.7rem', backgroundColor: '#fcfcfc' }}>
                              "Seu estorno foi realizado com sucesso. Pedido: 154258 | Valor: R$ 580,00 | Forma: Cartão Crédito | Prazo: 5 dias úteis."
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <h6 className="fw-bold">Auditoria do Sistema</h6>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              ✔ 10:32 - Solicitou Estorno (Vinicius)<br/>
                              ✔ 10:36 - Confirmado pelo Gateway Stone<br/>
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
              <iframe src="limitless/html/layout_6/full/sac_novo_chamado.html" style={{ width: '100%', height: 'calc(100vh - 120px)', border: 'none', borderRadius: '8px', backgroundColor: '#ffffff' }}></iframe>
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
