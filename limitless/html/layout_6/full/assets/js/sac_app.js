/**
 * DiskIngressos ERP - Hub Operacional SAC JavaScript Logic
 * Powered by Firebase Firestore, Bootstrap 5 & AI sentiment analysis
 */

(function() {
    // 1. Firebase Configuration & Initialization
    const firebaseConfig = {
        apiKey: "AIzaSyDummyKeyHere-ForApexERPSacRealtimeDb",
        authDomain: "apexerp-sac.firebaseapp.com",
        projectId: "apexerp-sac",
        storageBucket: "apexerp-sac.appspot.com",
        messagingSenderId: "1234567890",
        appId: "1:1234567890:web:abcdef123456"
    };

    let db = null;
    let useFirebase = false;

    try {
        if (typeof firebase !== 'undefined') {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            useFirebase = true;
            console.log("Firebase Firestore initialized successfully.");
        }
    } catch (e) {
        console.warn("Firebase initialization failed, falling back to local simulation:", e);
    }

    // 2. Mock Databases (CTI structure & auto-routing metadata)
    const CATEGORY_SUBCATEGORIES = {
        financeiro: [
            { value: "pagamento-nao-aprovado", text: "Pagamento não aprovado", priority: "Alta", route: "Fila Financeiro - Gateway", bypass: false },
            { value: "pix-pendente", text: "PIX pendente", priority: "Alta", route: "Fila Financeiro - PIX", bypass: true },
            { value: "cartao-recusado", text: "Cartão recusado", priority: "Média", route: "Fila Financeiro - Gateway", bypass: false },
            { value: "cobranca-duplicada", text: "Cobrança duplicada", priority: "Urgente", route: "Fila Financeiro - Conciliação", bypass: true },
            { value: "reembolso", text: "Reembolso", priority: "Média", route: "Fila Financeiro - Estorno", bypass: false },
            { value: "estorno", text: "Estorno", priority: "Média", route: "Fila Financeiro - Estorno", bypass: false },
            { value: "chargeback", text: "Chargeback", priority: "Alta", route: "Fila Financeiro - Risco", bypass: true },
            { value: "conciliacao", text: "Conciliação", priority: "Média", route: "Fila Financeiro - Auditoria", bypass: false },
            { value: "nota-fiscal", text: "Nota Fiscal", priority: "Baixa", route: "Fila Financeiro - Impostos", bypass: false }
        ],
        ingresso: [
            { value: "nao-recebeu-ingresso", text: "Não recebeu ingresso", priority: "Alta", route: "Fila Vendas - Envio", bypass: true },
            { value: "qrcode-invalido", text: "QR Code inválido", priority: "Urgente", route: "Fila Vendas - Reenvio", bypass: true },
            { value: "qrcode-duplicado", text: "QR Code duplicado", priority: "Urgente", route: "Fila Vendas - Triagem", bypass: true },
            { value: "troca-titularidade", text: "Troca de titularidade", priority: "Média", route: "Fila Vendas - Operações", bypass: false },
            { value: "alteracao-data", text: "Alteração de data", priority: "Média", route: "Fila Vendas - Operações", bypass: false },
            { value: "cancelamento-ingresso", text: "Cancelamento do ingresso", priority: "Média", route: "Fila Vendas - Estornos", bypass: false },
            { value: "transferência", text: "Transferência", priority: "Média", route: "Fila Vendas - Operações", bypass: false },
            { value: "upgrade", text: "Upgrade de Setor", priority: "Alta", route: "Fila Vendas - Operações", bypass: false }
        ],
        evento: [
            { value: "mudanca-horario", text: "Mudança de horário", priority: "Média", route: "Fila Operações - Eventos", bypass: false },
            { value: "mudanca-local", text: "Mudança de local", priority: "Média", route: "Fila Operações - Eventos", bypass: false },
            { value: "evento-cancelado", text: "Evento cancelado", priority: "Alta", route: "Fila Operações - Estornos", bypass: true },
            { value: "evento-adiado", text: "Evento adiado", priority: "Média", route: "Fila Operações - Eventos", bypass: false },
            { value: "informacoes-gerais", text: "Informações gerais", priority: "Baixa", route: "Fila Operações - SAC", bypass: false },
            { value: "acessibilidade", text: "Acessibilidade / PNE", priority: "Baixa", route: "Fila Operações - SAC", bypass: false },
            { value: "estacionamento", text: "Estacionamento", priority: "Baixa", route: "Fila Operações - SAC", bypass: false }
        ],
        acesso: [
            { value: "catraca-bloqueada", text: "Catraca bloqueada", priority: "Urgente", route: "Fila Controle de Acesso - N2", bypass: true },
            { value: "pulseira", text: "Pulseira / RFID", priority: "Média", route: "Fila Controle de Acesso - N2", bypass: false },
            { value: "credenciamento-erro", text: "Erro no credenciamento", priority: "Alta", route: "Fila Controle de Acesso - Operações", bypass: false },
            { value: "visitante", text: "Cadastro Visitante", priority: "Baixa", route: "Fila Controle de Acesso - Operações", bypass: false },
            { value: "morador", text: "Cadastro Morador", priority: "Baixa", route: "Fila Controle de Acesso - Operações", bypass: false },
            { value: "pcd", text: "Acesso PCD", priority: "Média", route: "Fila Controle de Acesso - N2", bypass: false },
            { value: "vip", text: "Acesso Área VIP", priority: "Média", route: "Fila Controle de Acesso - N2", bypass: false }
        ],
        produtor: [
            { value: "relatorios", text: "Relatórios", priority: "Média", route: "Fila Contas - Produtores", bypass: false },
            { value: "borderô", text: "Borderô", priority: "Média", route: "Fila Contas - Produtores", bypass: false },
            { value: "financeiro-produtor", text: "Financeiro / Faturamento", priority: "Alta", route: "Fila Contas - Financeiro", bypass: false },
            { value: "pagamento-repasse", text: "Pagamento de repasse", priority: "Alta", route: "Fila Financeiro - Produtores", bypass: true },
            { value: "comissão", text: "Dúvidas de Comissão", priority: "Média", route: "Fila Contas - Produtores", bypass: false },
            { value: "ingresso-config", text: "Ingressos / Lotes", priority: "Média", route: "Fila Vendas - Operações", bypass: false },
            { value: "configuracao-evento", text: "Configuração do Evento", priority: "Alta", route: "Fila Vendas - Operações", bypass: false }
        ],
        cancelamento: [
            { value: "solicitar-cancelamento", text: "Solicitar Cancelamento de Compra", priority: "Alta", route: "Fila Vendas - Estornos", bypass: true },
            { value: "prazo-cancelamento", text: "Dúvidas sobre Prazo de Cancelamento", priority: "Baixa", route: "Fila Operações - SAC", bypass: false },
            { value: "cancelamento-parcial", text: "Cancelamento Parcial de Pedido", priority: "Média", route: "Fila Vendas - Estornos", bypass: false }
        ],
        estorno: [
            { value: "estorno-nao-recebido", text: "Estorno não recebido na conta", priority: "Alta", route: "Fila Financeiro - Estorno", bypass: true },
            { value: "estorno-pix", text: "Estorno de PIX", priority: "Alta", route: "Fila Financeiro - Estorno", bypass: true },
            { value: "estorno-cartao", text: "Estorno de Cartão", priority: "Alta", route: "Fila Financeiro - Estorno", bypass: true },
            { value: "comprovante-estorno", text: "Solicitar comprovante de estorno", priority: "Média", route: "Fila Financeiro - Estorno", bypass: false }
        ],
        pix: [
            { value: "pix-copia-cola", text: "Dificuldade com PIX Copia e Cola", priority: "Alta", route: "Fila Financeiro - PIX", bypass: false },
            { value: "pix-nao-aprovado", text: "PIX pago mas pedido não aprovado", priority: "Urgente", route: "Fila Financeiro - PIX", bypass: true },
            { value: "comprovante-pix", text: "Envio de comprovante PIX", priority: "Média", route: "Fila Financeiro - PIX", bypass: false }
        ],
        cartao: [
            { value: "recusa-anti-fraude", text: "Cartão recusado pelo Anti-Fraude", priority: "Alta", route: "Fila Financeiro - Risco", bypass: true },
            { value: "cartao-erro-3ds", text: "Erro de autenticação 3D Secure", priority: "Alta", route: "Fila Financeiro - Gateway", bypass: false },
            { value: "dupla-cobranca", text: "Cobrança em duplicidade na fatura", priority: "Urgente", route: "Fila Financeiro - Conciliação", bypass: true }
        ],
        troca: [
            { value: "troca-cadeira", text: "Troca de assento marcado", priority: "Média", route: "Fila Vendas - Operações", bypass: false },
            { value: "troca-data", text: "Troca de data do show/sessão", priority: "Média", route: "Fila Vendas - Operações", bypass: false },
            { value: "troca-ingresso", text: "Troca de setor/tipo de ingresso", priority: "Alta", route: "Fila Vendas - Operações", bypass: false }
        ],
        suporte: [
            { value: "erro-login", text: "Erro de login / Esqueci minha senha", priority: "Média", route: "Fila Operações - SAC", bypass: false },
            { value: "pdf-corrompido", text: "PDF do ingresso corrompido / não abre", priority: "Alta", route: "Fila Vendas - Reenvio", bypass: true },
            { value: "site-instabilidade", text: "Instabilidade no fluxo de compra", priority: "Alta", route: "Fila Tecnologia - N3", bypass: true }
        ]
    };

    const MOCK_CLIENT_INFO = {
        name: "João da Silva",
        cpf: "123.456.789-00",
        phone: "(41) 99999-9999",
        email: "joao@email.com",
        level: "Cliente Ouro",
        orders: 24,
        lastPurchase: "12/07/2026",
        totalSpent: "R$ 8.420",
        cancellations: 2,
        refunds: 1,
        tickets: 7,
        satisfaction: "4,8★"
    };

    const STATE = {
        currentTab: "dashboard",
        activeClient: null,
        selectedCategory: null,
        selectedSubcategory: null,
        currentProtocol: "SAC-2026-000154",
        csatScore: 5
    };

    let DOM = {};

    // 3. Initialize Elements and Listeners
    document.addEventListener("DOMContentLoaded", () => {
        cacheDomElements();
        setupNavigation();
        setupCustomerSearch();
        setupFormCascades();
        setupActionButtons();
        setupAiSimulation();
        setupCsatActions();
        loadTicketsFromFirebase();
    });

    function cacheDomElements() {
        DOM = {
            sacNavTabs: document.getElementById("sacNavTabs"),
            tabPanes: document.querySelectorAll(".sac-tab-pane"),
            currentSectionTitle: document.getElementById("currentSectionTitle"),
            currentSectionBreadcrumb: document.getElementById("currentSectionBreadcrumb"),
            
            searchCustomerKey: document.getElementById("searchCustomerKey"),
            btnSearchCustomer: document.getElementById("btnSearchCustomer"),
            
            clientCardPanel: document.getElementById("clientCardPanel"),
            clientCardPlaceholder: document.getElementById("clientCardPlaceholder"),
            clientCardDetails: document.getElementById("clientCardDetails"),
            timelinePanel: document.getElementById("timelinePanel"),
            integrationHubCard: document.getElementById("integrationHubCard"),
            
            clientName: document.getElementById("clientName"),
            clientCpf: document.getElementById("clientCpf"),
            clientPhone: document.getElementById("clientPhone"),
            clientEmail: document.getElementById("clientEmail"),
            clientOrdersCount: document.getElementById("clientOrdersCount"),
            clientTotalSpent: document.getElementById("clientTotalSpent"),
            clientRefundsCount: document.getElementById("clientRefundsCount"),
            
            ticketProtocolHeader: document.getElementById("ticketProtocolHeader"),
            ticketCategory: document.getElementById("ticketCategory"),
            ticketSubcategory: document.getElementById("ticketSubcategory"),
            ticketPriority: document.getElementById("ticketPriority"),
            ticketOrigin: document.getElementById("ticketOrigin"),
            ticketTitle: document.getElementById("ticketTitle"),
            ticketDesc: document.getElementById("ticketDesc"),
            btnHelpScript: document.getElementById("btnHelpScript"),
            
            financeLoadingMsg: document.getElementById("financeLoadingMsg"),
            financeDataContent: document.getElementById("financeDataContent"),
            eventsLoadingMsg: document.getElementById("eventsLoadingMsg"),
            eventsDataContent: document.getElementById("eventsDataContent"),
            accessLoadingMsg: document.getElementById("accessLoadingMsg"),
            accessDataContent: document.getElementById("accessDataContent"),
            
            btnConsultPix: document.getElementById("btnConsultPix"),
            btnConsultGateway: document.getElementById("btnConsultGateway"),
            btnResendTicket: document.getElementById("btnResendTicket"),
            btnGenerateQr: document.getElementById("btnGenerateQr"),
            btnRefund: document.getElementById("btnRefund"),
            btnSendPaymentLink: document.getElementById("btnSendPaymentLink"),
            btnReleaseGate: document.getElementById("btnReleaseGate"),
            btnRefreshQrAccess: document.getElementById("btnRefreshQrAccess"),
            btnCancelQrAccess: document.getElementById("btnCancelQrAccess"),
            btnRecordIncident: document.getElementById("btnRecordIncident"),
            btnChangeSeat: document.getElementById("btnChangeSeat"),
            btnTransferTicket: document.getElementById("btnTransferTicket"),
            btnChangeDate: document.getElementById("btnChangeDate"),
            btnIssueCortesia: document.getElementById("btnIssueCortesia"),
            
            aiSentimentBadge: document.getElementById("aiSentimentBadge"),
            aiRecommendedQueue: document.getElementById("aiRecommendedQueue"),
            aiSuggestedText: document.getElementById("aiSuggestedText"),
            btnUseAiSuggestedText: document.getElementById("btnUseAiSuggestedText"),
            
            btnSubmitTicket: document.getElementById("btnSubmitTicket"),
            btnCancelTicket: document.getElementById("btnCancelTicket"),
            btnNewAtendimentoQuick: document.getElementById("btnNewAtendimentoQuick"),
            
            ticketsTableBody: document.getElementById("ticketsTableBody"),
            actionToast: document.getElementById("actionToast"),
            toastTitle: document.getElementById("toastTitle"),
            toastMessage: document.getElementById("toastMessage"),
            
            csatModal: document.getElementById("csatModal"),
            csatTicketId: document.getElementById("csatTicketId"),
            csatStars: document.querySelectorAll("#csatStarsContainer .rating-star-btn"),
            csatComment: document.getElementById("csatComment"),
            btnSubmitCsat: document.getElementById("btnSubmitCsat")
        };
    }

    // Navigation and tabs control
    function setupNavigation() {
        DOM.sacNavTabs.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;
            e.preventDefault();
            
            const targetTab = btn.getAttribute("data-tab");
            switchTab(targetTab);
        });
        
        DOM.btnNewAtendimentoQuick.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab("atendimento");
        });
        
        DOM.btnCancelTicket.addEventListener("click", resetWorkstation);
    }
    
    function switchTab(tabName) {
        STATE.currentTab = tabName;
        
        DOM.sacNavTabs.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("active");
            if (btn.getAttribute("data-tab") === tabName) btn.classList.add("active");
        });
        
        DOM.tabPanes.forEach(pane => {
            pane.classList.add("d-none");
            if (pane.id === `tabContent${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`) {
                pane.classList.remove("d-none");
            }
        });

        // Update titles
        const titles = {
            dashboard: { title: "/ Dashboard", crumb: "Dashboard Inicial" },
            atendimento: { title: "/ Novo Atendimento", crumb: "Ficha do Operador" },
            chamados: { title: "/ Chamados", crumb: "Histórico Geral" },
            relatorios: { title: "/ Relatórios", crumb: "BI & Indicadores" }
        };

        if (titles[tabName]) {
            DOM.currentSectionTitle.textContent = titles[tabName].title;
            DOM.currentSectionBreadcrumb.textContent = titles[tabName].crumb;
        }
    }

    // Customer profile search
    function setupCustomerSearch() {
        DOM.btnSearchCustomer.addEventListener("click", (e) => {
            e.preventDefault();
            const key = DOM.searchCustomerKey.value.trim();
            if (key === "123.456.789-00" || key.toLowerCase() === "joao" || key.toLowerCase() === "joão") {
                loadClient(MOCK_CLIENT_INFO);
                showToast("Pesquisa Automática", "Histórico de compras e acessos localizado no ERP.");
            } else {
                showToast("Pesquisa", "Nenhum cliente localizado com a chave informada.", "bg-danger text-white");
            }
        });
        
        DOM.searchCustomerKey.addEventListener("keyup", (e) => {
            if (e.key === "Enter") DOM.btnSearchCustomer.click();
        });
    }
    
    function loadClient(client) {
        STATE.activeClient = client;
        
        DOM.clientCardPanel.style.opacity = "1";
        DOM.timelinePanel.style.opacity = "1";
        DOM.integrationHubCard.style.opacity = "1";
        
        DOM.clientCardPlaceholder.classList.add("d-none");
        DOM.clientCardDetails.classList.remove("d-none");
        
        DOM.clientName.textContent = client.name;
        DOM.clientCpf.textContent = client.cpf;
        DOM.clientPhone.textContent = client.phone;
        DOM.clientEmail.textContent = client.email;
        DOM.clientOrdersCount.textContent = client.orders;
        DOM.clientTotalSpent.textContent = client.totalSpent;
        DOM.clientRefundsCount.textContent = client.refunds;
        
        DOM.financeLoadingMsg.classList.add("d-none");
        DOM.financeDataContent.classList.remove("d-none");
        DOM.eventsLoadingMsg.classList.add("d-none");
        DOM.eventsDataContent.classList.remove("d-none");
        DOM.accessLoadingMsg.classList.add("d-none");
        DOM.accessDataContent.classList.remove("d-none");
        
        validateForm();
    }

    // Form cascade selects
    function setupFormCascades() {
        DOM.ticketCategory.addEventListener("change", (e) => {
            const cat = e.target.value;
            STATE.selectedCategory = cat;
            populateSubcategories(cat);
            validateForm();
        });
        
        DOM.ticketSubcategory.addEventListener("change", (e) => {
            const sub = e.target.value;
            STATE.selectedSubcategory = sub;
            
            const data = CATEGORY_SUBCATEGORIES[STATE.selectedCategory].find(opt => opt.value === sub);
            if (data) {
                DOM.ticketPriority.value = data.priority;
                DOM.aiRecommendedQueue.innerHTML = `<i class="ph-git-fork me-1 text-primary"></i> ${data.route}`;
                if (data.bypass) {
                    DOM.aiRecommendedQueue.innerHTML += ` <span class="badge bg-success text-uppercase fs-10 ms-2"><i class="ph-bolt"></i> Bypass N1</span>`;
                }
                updateAiSuggestion(data.text);
            }
            validateForm();
        });
        
        DOM.ticketTitle.addEventListener("input", validateForm);
        DOM.ticketDesc.addEventListener("input", (e) => {
            validateForm();
            analyzeTextSentiment(e.target.value);
        });
        
        DOM.btnHelpScript.addEventListener("click", () => {
            DOM.ticketDesc.value = `### Detalhes da ocorrência:\n- Módulo / Menu: \n- Descrição da falha: \n- Passos para simulação: \n- Impacto no cliente: \n`;
            DOM.ticketDesc.focus();
            validateForm();
        });
    }
    
    function populateSubcategories(category) {
        DOM.ticketSubcategory.disabled = false;
        DOM.ticketSubcategory.innerHTML = '<option value="" disabled selected>Selecione...</option>';
        
        const list = CATEGORY_SUBCATEGORIES[category] || [];
        list.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.value;
            opt.textContent = item.text;
            DOM.ticketSubcategory.appendChild(opt);
        });
    }
    
    function validateForm() {
        const isValid = STATE.activeClient &&
                        DOM.ticketCategory.value.trim().length > 0 &&
                        DOM.ticketSubcategory.value.trim().length > 0 &&
                        DOM.ticketTitle.value.trim().length > 0 &&
                        DOM.ticketDesc.value.trim().length > 0;
                        
        DOM.btnSubmitTicket.disabled = !isValid;
    }

    // Action buttons inside integrations
    function setupActionButtons() {
        DOM.btnConsultPix.addEventListener("click", () => {
            showToast("Gateway de Pagamento", "Consultando transação no Adyen... Status: Confirmado e Consolidado.");
            addTimelineStep("Operador consultou transação PIX (Pago)");
        });
        DOM.btnConsultGateway.addEventListener("click", () => {
            showToast("Adyen Gateway", "NSU: 1002930211 | TID: ADY_928103A812. Conexão OK.");
        });
        DOM.btnResendTicket.addEventListener("click", () => {
            showToast("DiskIngressos Envio", "E-mail com PDF e link de acesso enviado para joao@email.com.");
            addTimelineStep("Ingresso reenviado para o e-mail");
        });
        DOM.btnGenerateQr.addEventListener("click", () => {
            showToast("Controle de Ingressos", "Novo QR Code gerado para o ingresso. Código anterior cancelado.");
            addTimelineStep("Gerado novo QR Code");
        });
        DOM.btnRefund.addEventListener("click", () => {
            showToast("Estorno Financeiro", "Solicitação de estorno processada. Reembolso Adyen iniciado.");
            addTimelineStep("Estorno financeiro iniciado");
        });
        DOM.btnSendPaymentLink.addEventListener("click", () => {
            showToast("Gateway Financeiro", "Link de pagamento gerado e enviado via WhatsApp.");
        });
        DOM.btnReleaseGate.addEventListener("click", () => {
            showToast("Controle de Acesso", "Comando de liberação manual enviado para a Catraca 3.");
            addTimelineStep("Liberado entrada manual na catraca");
        });
        
        DOM.btnRefreshQrAccess.addEventListener("click", () => {
            showToast("Controle de Acesso", "Leitura de QR code resetada e atualizada na catraca.");
        });
        DOM.btnCancelQrAccess.addEventListener("click", () => {
            showToast("Controle de Acesso", "QR code bloqueado para entradas físicas.");
        });
        DOM.btnRecordIncident.addEventListener("click", () => {
            showToast("Controle de Acesso", "Ocorrência inserida no log do evento.");
        });
        
        DOM.btnChangeSeat.addEventListener("click", () => {
            showToast("Gestão de Evento", "Assento alterado com sucesso no mapa.");
            addTimelineStep("Assento alterado no ERP");
        });
        DOM.btnTransferTicket.addEventListener("click", () => {
            showToast("Gestão de Evento", "Transferência de titularidade efetuada.");
        });
        DOM.btnChangeDate.addEventListener("click", () => {
            showToast("Gestão de Evento", "Data de comparecimento atualizada.");
        });
        DOM.btnIssueCortesia.addEventListener("click", () => {
            showToast("Gestão de Evento", "Ingresso cortesia emitido sob aprovação.");
        });
    }
    
    function addTimelineStep(text) {
        const list = DOM.ticketTimelineList;
        const pending = document.getElementById("timelinePendingStep");
        
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        
        const li = document.createElement("li");
        li.className = "timeline-v-item completed";
        li.innerHTML = `
            <div class="timeline-v-time">${timeStr}</div>
            <div class="timeline-v-desc">${text}</div>
        `;
        
        list.insertBefore(li, pending);
    }
    
    function showToast(title, message, bgClass = "bg-success text-white") {
        const toastEl = DOM.actionToast;
        toastEl.querySelector(".toast-header").className = `toast-header ${bgClass}`;
        DOM.toastTitle.innerHTML = `<i class="ph-check-circle me-1"></i> ${title}`;
        DOM.toastMessage.textContent = message;
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    // AI suggestions & sentiment analyzer
    function setupAiSimulation() {
        DOM.btnUseAiSuggestedText.addEventListener("click", () => {
            DOM.ticketDesc.value += "\n\nSugestão de Resposta:\n" + DOM.aiSuggestedText.textContent;
            validateForm();
        });
    }
    
    function updateAiSuggestion(issueText) {
        let answer = `Olá João, identificamos o problema de "${issueText}". Já acionei a equipe responsável para regularizar imediatamente.`;
        if (issueText.includes("QR Code")) {
            answer = `Olá João, localizei seu pedido e o QR Code foi regenerado. Pode passar novamente o código na catraca do Teatro Positivo.`;
        } else if (issueText.includes("PIX")) {
            answer = `Olá João, localizei seu PIX e seu ingresso foi reenviado para joao@email.com.`;
        }
        
        DOM.aiSuggestedText.textContent = answer;
        DOM.btnUseAiSuggestedText.disabled = false;
    }
    
    function analyzeTextSentiment(text) {
        const lower = text.toLowerCase();
        const angryWords = ["não funciona", "erro", "recusado", "bloqueada", "ruim", "péssimo", "estou com raiva", "demora"];
        const happyWords = ["obrigado", "valeu", "ótimo", "funciona", "perfeito", "parabéns"];
        
        let countAngry = angryWords.filter(w => lower.includes(w)).length;
        let countHappy = happyWords.filter(w => lower.includes(w)).length;
        
        DOM.aiSentimentBadge.className = "sentiment-indicator";
        
        if (countAngry > 0) {
            DOM.aiSentimentBadge.classList.add("sentiment-anger");
            DOM.aiSentimentBadge.innerHTML = '<i class="ph-smiley-angry me-1"></i> Sentimento Frustrado';
        } else if (countHappy > 0) {
            DOM.aiSentimentBadge.classList.add("sentiment-happy");
            DOM.aiSentimentBadge.innerHTML = '<i class="ph-smiley me-1"></i> Sentimento Satisfeito';
        } else {
            DOM.aiSentimentBadge.classList.add("sentiment-neutral");
            DOM.aiSentimentBadge.innerHTML = '<i class="ph-smiley-meh me-1"></i> Sentimento Neutro';
        }
    }

    // Submit Actions
    DOM.btnSubmitTicket.addEventListener("click", (e) => {
        e.preventDefault();
        
        if (!DOM.btnSubmitTicket.disabled) {
            const rand = Math.floor(100 + Math.random() * 900);
            const protocol = `SAC-2026-000${rand}`;
            const titleVal = DOM.ticketTitle.value;
            const categoryLabel = DOM.ticketCategory.options[DOM.ticketCategory.selectedIndex].text;
            const originVal = DOM.ticketOrigin.value;
            const priorityVal = DOM.ticketPriority.value;
            
            DOM.csatTicketId.textContent = `#${protocol}`;
            STATE.currentProtocol = protocol;
            
            addTicketToGrid(protocol, titleVal, categoryLabel, originVal, priorityVal);
            
            if (useFirebase && db) {
                db.collection("disk_ingressos_tickets").add({
                    protocol: protocol,
                    title: titleVal,
                    category: categoryLabel,
                    origin: originVal,
                    priority: priorityVal,
                    status: "Fechado",
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(err => {
                    console.warn("Firestore write error:", err);
                });
            }
            
            const modal = new bootstrap.Modal(DOM.csatModal);
            modal.show();
        }
    });
    
    function addTicketToGrid(protocol, title, category, origin, priority) {
        const tr = document.createElement("tr");
        
        let prioClass = "bg-success";
        if (priority === "Alta" || priority === "Urgente") prioClass = "bg-danger";
        else if (priority === "Média") prioClass = "bg-warning text-dark";
        
        tr.innerHTML = `
            <td>
                <div class="fw-bold">#${protocol}</div>
                <span class="badge bg-gold text-uppercase fs-10 mt-1"><i class="ph-star me-1"></i> Ouro</span>
            </td>
            <td>
                <div class="fw-bold">${title}</div>
                <small class="text-muted">Aberto agora por Operador</small>
            </td>
            <td>
                <span class="badge bg-light text-muted border">${category}</span>
            </td>
            <td>
                <span class="badge bg-primary bg-opacity-10 text-primary border-primary-200"><i class="ph-activity me-1"></i> ${origin}</span>
            </td>
            <td>
                <span class="badge ${prioClass}">${priority}</span>
            </td>
            <td>
                <span class="badge bg-success bg-opacity-10 text-success border-success-200">Resolvido</span>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-light border"><i class="ph-eye"></i></button>
            </td>
        `;
        
        DOM.ticketsTableBody.insertBefore(tr, DOM.ticketsTableBody.firstChild);
    }

    // CSAT ratings triggers
    function setupCsatActions() {
        DOM.csatStars.forEach(star => {
            star.addEventListener("click", () => {
                const rating = parseInt(star.getAttribute("data-val"));
                STATE.csatScore = rating;
                
                DOM.csatStars.forEach(s => {
                    const sVal = parseInt(s.getAttribute("data-val"));
                    if (sVal <= rating) s.classList.add("active");
                    else s.classList.remove("active");
                });
            });
        });
        
        DOM.btnSubmitCsat.addEventListener("click", () => {
            showToast("Pesquisa de Satisfação", `Avaliação do chamado ${STATE.currentProtocol} enviada! Pontuação: ${STATE.csatScore}/5 estrelas.`);
            
            if (useFirebase && db) {
                db.collection("disk_ingressos_tickets").where("protocol", "==", STATE.currentProtocol).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            doc.ref.update({
                                csat: STATE.csatScore,
                                csatComment: DOM.csatComment.value
                            });
                        });
                    });
            }
            
            const modal = bootstrap.Modal.getInstance(DOM.csatModal);
            if (modal) modal.hide();
            resetWorkstation();
        });
    }

    // Load from Firebase
    function loadTicketsFromFirebase() {
        if (useFirebase && db) {
            db.collection("disk_ingressos_tickets").orderBy("createdAt", "desc").limit(10).get()
                .then(querySnapshot => {
                    if (!querySnapshot.empty) {
                        DOM.ticketsTableBody.innerHTML = "";
                        querySnapshot.forEach(doc => {
                            const data = doc.data();
                            const tr = document.createElement("tr");
                            
                            let prioClass = "bg-success";
                            if (data.priority === "Alta" || data.priority === "Urgente") prioClass = "bg-danger";
                            else if (data.priority === "Média") prioClass = "bg-warning text-dark";
                            
                            tr.innerHTML = `
                                <td>
                                    <div class="fw-bold">#${data.protocol}</div>
                                    <span class="badge bg-gold text-uppercase fs-10 mt-1"><i class="ph-star me-1"></i> Ouro</span>
                                </td>
                                <td>
                                    <div class="fw-bold">${data.title}</div>
                                    <small class="text-muted">Carregado do Firebase Firestore</small>
                                </td>
                                <td>
                                    <span class="badge bg-light text-muted border">${data.category}</span>
                                </td>
                                <td>
                                    <span class="badge bg-primary bg-opacity-10 text-primary border-primary-200"><i class="ph-activity me-1"></i> ${data.origin}</span>
                                </td>
                                <td>
                                    <span class="badge ${prioClass}">${data.priority}</span>
                                </td>
                                <td>
                                    <span class="badge bg-success bg-opacity-10 text-success border-success-200">${data.status || "Resolvido"}</span>
                                </td>
                                <td class="text-center">
                                    <button type="button" class="btn btn-sm btn-light border"><i class="ph-eye"></i></button>
                                </td>
                            `;
                            DOM.ticketsTableBody.appendChild(tr);
                        });
                    }
                })
                .catch(err => {
                    console.warn("Firestore query fail:", err);
                });
        }
    }

    function resetWorkstation() {
        DOM.operatorTicketForm.reset();
        
        STATE.activeClient = null;
        STATE.selectedCategory = null;
        STATE.selectedSubcategory = null;
        
        DOM.searchCustomerKey.value = "";
        DOM.ticketSubcategory.innerHTML = '<option value="" disabled selected>Selecione a categoria...</option>';
        DOM.ticketSubcategory.disabled = true;
        
        DOM.clientCardPanel.style.opacity = "0.5";
        DOM.timelinePanel.style.opacity = "0.5";
        DOM.integrationHubCard.style.opacity = "0.5";
        
        DOM.clientCardPlaceholder.classList.remove("d-none");
        DOM.clientCardDetails.classList.add("d-none");
        
        DOM.financeLoadingMsg.classList.remove("d-none");
        DOM.financeDataContent.classList.add("d-none");
        DOM.eventsLoadingMsg.classList.remove("d-none");
        DOM.eventsDataContent.classList.add("d-none");
        DOM.accessLoadingMsg.classList.remove("d-none");
        DOM.accessDataContent.classList.add("d-none");
        
        DOM.aiSentimentBadge.className = "sentiment-indicator sentiment-neutral";
        DOM.aiSentimentBadge.innerHTML = '<i class="ph-smiley-meh me-1"></i> Sentimento Neutro';
        DOM.aiRecommendedQueue.innerHTML = '<i class="ph-git-fork me-1 text-primary"></i> Triagem Geral (N1)';
        DOM.aiSuggestedText.textContent = "Selecione uma categoria e preencha a descrição para que a IA gere uma resposta rápida.";
        DOM.btnUseAiSuggestedText.disabled = true;
        
        DOM.btnSubmitTicket.disabled = true;
        switchTab("dashboard");
    }
})();
