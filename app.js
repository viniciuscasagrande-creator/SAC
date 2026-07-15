/**
 * ApexERP - Central de Atendimento & SAC
 * Logic Core: Intelligent Deflection, Cascading Dropdowns, SLA Engine, Dynamic Auto-Routing
 */

// ==========================================================================
// MOCK DATABASES
// ==========================================================================

const KB_ARTICLES = [
    {
        id: "art-1",
        title: "Como emitir nota fiscal de serviço (NFS-e)",
        content: `
            <h1>Como emitir nota fiscal de serviço (NFS-e)</h1>
            <div class="article-meta-info">
                <span><i class="fa-solid fa-folder"></i> Módulo: Faturamento</span>
                <span><i class="fa-solid fa-eye"></i> 1.245 visualizações</span>
                <span><i class="fa-solid fa-clock"></i> Leitura: 2 min</span>
            </div>
            <div class="article-body-content">
                <p>Para emitir notas fiscais de serviço direto pelo ERP, siga o passo a passo abaixo:</p>
                <ol>
                    <li>Acesse o menu lateral <strong>Vendas & Faturamento</strong> e selecione a opção <strong>Emitir NFS-e</strong>.</li>
                    <li>Escolha o cliente correspondente pesquisando por CNPJ ou Razão Social.</li>
                    <li>Selecione o <strong>Serviço Prestado</strong> cadastrado na lista de códigos municipais.</li>
                    <li>Preencha o valor da nota. O sistema calculará os impostos federais (PIS, COFINS, CSLL) e o ISS municipal automaticamente com base no perfil tributário configurado.</li>
                    <li>Clique em <strong>Transmitir Nota</strong> no canto inferior direito.</li>
                </ol>
                <div class="article-alert-note">
                    <h5><i class="fa-solid fa-circle-info"></i> Nota Fiscal Rejeitada?</h5>
                    Se a nota for rejeitada com erro de <em>RPS duplicado</em>, você precisará sincronizar a numeração nas configurações fiscais do módulo ou alterar o número do lote.
                </div>
            </div>
        `,
        tags: ["emitir nota", "nota fiscal", "nfse", "faturamento", "impostos", "nota", "fiscal", "nfs-e"],
        level2: "faturamento"
    },
    {
        id: "art-2",
        title: "Como resetar sua senha de acesso",
        content: `
            <h1>Como resetar sua senha de acesso</h1>
            <div class="article-meta-info">
                <span><i class="fa-solid fa-folder"></i> Módulo: Login/Acesso</span>
                <span><i class="fa-solid fa-eye"></i> 3.812 visualizações</span>
                <span><i class="fa-solid fa-clock"></i> Leitura: 1 min</span>
            </div>
            <div class="article-body-content">
                <p>Se você esqueceu ou deseja resetar sua senha por motivos de segurança, siga as opções abaixo:</p>
                
                <h5>Opção 1: Reset pelo link de login (Autônomo)</h5>
                <ol>
                    <li>Na tela inicial de login do ERP, clique em <strong>Esqueceu sua senha?</strong> logo abaixo dos campos de login.</li>
                    <li>Digite o seu e-mail cadastrado ou CPF/CNPJ corporativo.</li>
                    <li>Acesse sua caixa de entrada e procure pelo e-mail com o assunto <em>"ApexERP - Recuperação de Senha"</em>.</li>
                    <li>Clique no link seguro e digite sua nova senha de no mínimo 8 caracteres contendo letras e números.</li>
                </ol>

                <h5>Opção 2: Pelo seu perfil logado</h5>
                <ol>
                    <li>Com o sistema aberto, clique na foto do seu perfil no canto superior direito e vá em <strong>Minha Conta</strong>.</li>
                    <li>Navegue até a aba de <strong>Segurança</strong>.</li>
                    <li>Digite sua senha atual e em seguida configure a nova senha desejada.</li>
                </ol>
            </div>
        `,
        tags: ["resetar senha", "senha nao funciona", "recuperar acesso", "bloqueado", "login", "esqueci", "senha", "acesso"],
        level2: "login"
    },
    {
        id: "art-3",
        title: "Erro 502 Bad Gateway - Como resolver instabilidades",
        content: `
            <h1>Erro 502 Bad Gateway ao carregar telas ou relatórios</h1>
            <div class="article-meta-info">
                <span><i class="fa-solid fa-folder"></i> Módulo: Relatórios</span>
                <span><i class="fa-solid fa-eye"></i> 940 visualizações</span>
                <span><i class="fa-solid fa-clock"></i> Leitura: 2 min</span>
            </div>
            <div class="article-body-content">
                <p>O Erro 502 normalmente indica que o servidor do ERP recebeu uma resposta inválida ou que há instabilidade temporária na sua conexão de rede ou rota de internet.</p>
                <p>Siga estes procedimentos para resolver rapidamente:</p>
                <ol>
                    <li><strong>Limpe o Cache do Navegador:</strong> Pressione <code>Ctrl + Shift + R</code> (Windows) ou <code>Cmd + Shift + R</code> (Mac) para recarregar a página limpando os arquivos temporários.</li>
                    <li><strong>Acesse via aba anônima:</strong> Tente abrir a mesma tela em modo anônimo. Se funcionar, indica que alguma extensão do seu navegador ou cookies antigos estão bloqueando as requisições HTTP do ERP.</li>
                    <li><strong>Verifique nosso Status Page:</strong> Ocasionalmente realizamos atualizações rápidas nos bancos de dados de relatórios complexos.</li>
                </ol>
                <div class="article-alert-note">
                    <h5>Dica do Suporte:</h5>
                    Relatórios com período superior a 12 meses geram timeout em conexões lentas. Tente filtrar por períodos menores (ex: mensal ou trimestral) antes de gerar o PDF.
                </div>
            </div>
        `,
        tags: ["erro 502", "tela branca", "timeout", "lento", "travado", "relatorios", "502", "erro", "relatorio"],
        level2: "relatorios"
    },
    {
        id: "art-4",
        title: "Divergências de Saldo Físico de Estoque",
        content: `
            <h1>Divergência de Saldo no Módulo de Estoque</h1>
            <div class="article-meta-info">
                <span><i class="fa-solid fa-folder"></i> Módulo: Estoque</span>
                <span><i class="fa-solid fa-eye"></i> 721 visualizações</span>
                <span><i class="fa-solid fa-clock"></i> Leitura: 3 min</span>
            </div>
            <div class="article-body-content">
                <p>Quando o saldo exibido no painel de vendas difere da contagem física realizada no almoxarifado, execute as seguintes checagens:</p>
                <ol>
                    <li>Acesse <strong>Estoque & Compras</strong> > <strong>Extrato de Movimentação</strong> do produto.</li>
                    <li>Verifique se existem <em>pedidos de venda aprovados mas ainda não faturados</em>. Estes itens já estão reservados e são deduzidos do saldo disponível, embora ainda estejam fisicamente no galpão.</li>
                    <li>Consulte se há alguma <strong>Inventário de Ajuste</strong> aberto em rascunho para este SKU. Se houver, o estoque ficará bloqueado para conciliação.</li>
                </ol>
            </div>
        `,
        tags: ["estoque", "divergencia", "saldo", "contagem", "almoxarifado", "compras"],
        level2: "estoque"
    },
    {
        id: "art-5",
        title: "Segunda Via de Boletos e Faturas Pendentes",
        content: `
            <h1>Como emitir 2ª via de faturas e boletos da assinatura</h1>
            <div class="article-meta-info">
                <span><i class="fa-solid fa-folder"></i> Módulo: Financeiro</span>
                <span><i class="fa-solid fa-eye"></i> 1.480 visualizações</span>
                <span><i class="fa-solid fa-clock"></i> Leitura: 1 min</span>
            </div>
            <div class="article-body-content">
                <p>O ERP envia as faturas mensalmente ao e-mail financeiro cadastrado, mas você pode retirá-las a qualquer momento:</p>
                <ol>
                    <li>No menu superior ou lateral, acesse o módulo <strong>Financeiro</strong>.</li>
                    <li>Clique no menu <strong>Minhas Faturas / Assinatura Apex</strong>.</li>
                    <li>Identifique o mês em aberto e clique no botão <strong>Imprimir Boleto</strong> ou copie a linha digitável do Pix copia e cola.</li>
                </ol>
            </div>
        `,
        tags: ["boleto", "fatura", "financeiro", "cobrança", "vencimento", "mensalidade"],
        level2: "boletos"
    }
];

const LEVEL2_DATA = {
    problema: [
        { value: "faturamento", text: "Faturamento & Notas Fiscais" },
        { value: "estoque", text: "Estoque & Compras" },
        { value: "rh", text: "Recursos Humanos & Folha" },
        { value: "login", text: "Login & Acesso de Usuários" },
        { value: "relatorios", text: "Lentidão ou Erro em Relatórios" }
    ],
    servico: [
        { value: "acessos", text: "Acessos e Permissões" },
        { value: "cadastros", text: "Cadastros Gerais" },
        { value: "modulos", text: "Ativar novos Módulos" },
        { value: "integracoes", text: "Integrações & API" }
    ],
    financeiro: [
        { value: "boletos", text: "Boletos & Faturamento do ERP" },
        { value: "faturas", text: "Faturas & Cobranças do ERP" },
        { value: "planos", text: "Planos, Assinaturas e Licenças" },
        { value: "duvidas", text: "Dúvidas Gerais Financeiras" }
    ]
};

const LEVEL3_DATA = {
    // Incidentes (Problema)
    faturamento: [
        { value: "imposto-errado", text: "Cálculo de imposto incorreto na NF", priority: "Alta", sla: "2h úteis", route: "Suporte Fiscal & Tributário", bypass: true },
        { value: "rejeicao-sefaz", text: "Nota fiscal rejeitada pela SEFAZ", priority: "Alta", sla: "2h úteis", route: "Suporte Fiscal & Tributário", bypass: true },
        { value: "cancelamento-fora-prazo", text: "Dificuldade para cancelar nota fiscal", priority: "Média", sla: "8h úteis", route: "Suporte Faturamento N2", bypass: false }
    ],
    estoque: [
        { value: "erro-saldo", text: "Divergência ou saldo negativo incorreto", priority: "Média", sla: "8h úteis", route: "Suporte Operações N2", bypass: false },
        { value: "codigo-barras", text: "Leitor de código de barras não reconhece item", priority: "Baixa", sla: "24h úteis", route: "Suporte Operações N2", bypass: false }
    ],
    rh: [
        { value: "erro-folha", text: "Cálculo de FGTS/INSS incorreto na folha", priority: "Média", sla: "8h úteis", route: "Suporte RH & Pessoal N2", bypass: true },
        { value: "acesso-holerite", text: "Funcionário não consegue acessar portal do holerite", priority: "Baixa", sla: "24h úteis", route: "Suporte RH N2", bypass: false }
    ],
    login: [
        { value: "senha-invalida", text: "Senha não funciona (Reset travado)", priority: "Alta", sla: "2h úteis", route: "Suporte Infraestrutura & Acesso", bypass: true },
        { value: "tela-branca", text: "Tela branca logo após digitar credenciais", priority: "Alta", sla: "2h úteis", route: "Suporte Infraestrutura & Acesso", bypass: true },
        { value: "token-expirado", text: "Erro ao validar token de 2 fatores (MFA)", priority: "Alta", sla: "2h úteis", route: "Suporte Infraestrutura & Acesso", bypass: true }
    ],
    relatorios: [
        { value: "erro-502", text: "Erro 502 Bad Gateway / Timeout", priority: "Média", sla: "8h úteis", route: "Suporte Relatórios & BI", bypass: false },
        { value: "relatorio-vazio", text: "Relatório gerado sem informações", priority: "Baixa", sla: "24h úteis", route: "Suporte Relatórios & BI", bypass: false }
    ],
    
    // Requisições (Serviço)
    acessos: [
        { value: "novo-usuario", text: "Criar novo usuário no sistema", priority: "Média", sla: "8h úteis", route: "Admin Contas", bypass: false },
        { value: "liberar-admin", text: "Liberar permissões de administrador", priority: "Média", sla: "8h úteis", route: "Admin Contas", bypass: false }
    ],
    cadastros: [
        { value: "cadastro-fiscal", text: "Parametrizar nova CFOP fiscal", priority: "Média", sla: "8h úteis", route: "Projetos Tributários N2", bypass: false },
        { value: "cadastro-produto", text: "Ajustar cadastro em lote de produtos", priority: "Baixa", sla: "48h úteis", route: "Suporte Geral N1", bypass: false }
    ],
    modulos: [
        { value: "contratar-crm", text: "Solicitar ativação do módulo CRM", priority: "Baixa", sla: "24h úteis", route: "Comercial & Vendas", bypass: false },
        { value: "fiscal-avancado", text: "Ativar módulo fiscal interestadual", priority: "Média", sla: "8h úteis", route: "Comercial & Vendas", bypass: false }
    ],
    integracoes: [
        { value: "api-frete", text: "Configurar API de integração com transportadora", priority: "Baixa", sla: "48h úteis", route: "Projetos & Integrações", bypass: false },
        { value: "webhook", text: "Erro de autenticação no Webhook de cobrança", priority: "Média", sla: "8h úteis", route: "Suporte Integrações N2", bypass: true }
    ],
    
    // Financeiro / Dúvidas (Atendimento Comercial)
    boletos: [
        { value: "segunda-via", text: "Solicitar segunda via de boleto vencido", priority: "Baixa", sla: "4h úteis", route: "Financeiro Cobrança", bypass: false },
        { value: "alterar-vencimento", text: "Alterar vencimento definitivo de fatura", priority: "Média", sla: "8h úteis", route: "Financeiro Cobrança", bypass: false }
    ],
    faturas: [
        { value: "contestacao", text: "Contestar cobrança ou valor adicional", priority: "Média", sla: "24h úteis", route: "Financeiro Comercial", bypass: false },
        { value: "historico", text: "Exportar extrato anual de faturas pagas", priority: "Baixa", sla: "24h úteis", route: "Financeiro Geral", bypass: false }
    ],
    planos: [
        { value: "upgrade", text: "Mudar de plano / Adicionar licenças", priority: "Média", sla: "4h úteis", route: "Financeiro Comercial", bypass: true },
        { value: "cancelamento", text: "Redução de plano ou cancelamento da conta", priority: "Baixa", sla: "24h úteis", route: "Financeiro Comercial", bypass: false }
    ],
    duvidas: [
        { value: "reajuste", text: "Dúvida sobre reajuste anual de IPCA", priority: "Baixa", sla: "24h úteis", route: "Financeiro Geral", bypass: false },
        { value: "regras-cobranca", text: "Como funciona a cobrança proporcional", priority: "Baixa", sla: "24h úteis", route: "Financeiro Geral", bypass: false }
    ]
};

// State Store
const STATE = {
    selectedCategory: null, // Level 1: problema, servico, financeiro
    selectedLevel2: null,     // Level 2 (Module)
    selectedLevel3: null,     // Level 3 (Item / Problem)
    deflectionCount: 0,       // Counter of successful self-resolutions
    createdTicketsCount: 3,   // Simulated counter of tickets
    attachedFiles: [],        // List of attached files
    currentSla: null,
    currentRoute: null
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================

const DOM = {
    sidebarToggle: document.getElementById("sidebarToggle"),
    sidebar: document.querySelector(".sidebar"),
    
    // Page switcher
    navMyTickets: document.getElementById("navMyTickets"),
    navNewTicket: document.querySelector(".submenu-item.active"),
    openTicketPage: document.getElementById("openTicketPage"),
    myTicketsPage: document.getElementById("myTicketsPage"),
    btnBackToNewTicket: document.getElementById("btnBackToNewTicket"),
    ticketCountBadge: document.getElementById("ticketCountBadge"),
    ticketsTableBody: document.getElementById("ticketsTableBody"),
    
    // Deflection search
    deflectionSearch: document.getElementById("deflectionSearch"),
    deflectionSuggestions: document.getElementById("deflectionSuggestions"),
    suggestionsList: document.getElementById("suggestionsList"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    searchLoader: document.getElementById("searchLoader"),
    
    // Category Cards (Level 1)
    cardProblema: document.getElementById("cardProblema"),
    cardServico: document.getElementById("cardServico"),
    cardFinanceiro: document.getElementById("cardFinanceiro"),
    categoryCards: document.querySelectorAll(".category-card"),
    
    // Steps Panels
    step1Section: document.getElementById("step1Section"),
    step2Section: document.getElementById("step2Section"),
    step2Title: document.getElementById("step2Title"),
    step2Subtitle: document.getElementById("step2Subtitle"),
    
    // Form fields
    selectLevel2: document.getElementById("selectLevel2"),
    selectLevel3: document.getElementById("selectLevel3"),
    ticketTitle: document.getElementById("ticketTitle"),
    ticketDescription: document.getElementById("ticketDescription"),
    ticketForm: document.getElementById("ticketForm"),
    textareaHelpers: document.getElementById("textareaHelpers"),
    level3Hint: document.getElementById("level3Hint"),
    
    // File attachments
    fileDropzone: document.getElementById("fileDropzone"),
    fileInput: document.getElementById("fileInput"),
    attachedFilesList: document.getElementById("attachedFilesList"),
    
    // SLA & Routing sidebar
    slaCard: document.getElementById("slaCard"),
    slaPriorityBadge: document.getElementById("slaPriorityBadge"),
    slaTime: document.getElementById("slaTime"),
    slaExplanation: document.getElementById("slaExplanation"),
    routingCard: document.getElementById("routingCard"),
    routingQueueName: document.getElementById("routingQueueName"),
    routingQueueDescription: document.getElementById("routingQueueDescription"),
    routingTargetStep: document.getElementById("routingTargetStep"),
    routingTargetIcon: document.getElementById("routingTargetIcon"),
    routingArrow: document.getElementById("routingArrow"),
    bypassBadge: document.getElementById("bypassBadge"),
    deflectionAlertCard: document.getElementById("deflectionAlertCard"),
    deflectionAlertText: document.getElementById("deflectionAlertText"),
    deflectionAlertBtn: document.getElementById("deflectionAlertBtn"),
    
    // Action buttons
    btnCancel: document.getElementById("btnCancel"),
    btnSubmit: document.getElementById("btnSubmit"),
    
    // Article modal / drawer
    articleModalBackdrop: document.getElementById("articleModalBackdrop"),
    articleCloseBtn: document.getElementById("articleCloseBtn"),
    articleModalBody: document.getElementById("articleModalBody"),
    feedbackYesBtn: document.getElementById("feedbackYesBtn"),
    feedbackNoBtn: document.getElementById("feedbackNoBtn"),
    deflectionSuccessToast: document.getElementById("deflectionSuccessToast"),
    
    // Success modal
    successModalBackdrop: document.getElementById("successModalBackdrop"),
    successTicketId: document.getElementById("successTicketId"),
    successQueueName: document.getElementById("successQueueName"),
    successSlaBadge: document.getElementById("successSlaBadge"),
    successSlaTime: document.getElementById("successSlaTime"),
    btnNewTicketAgain: document.getElementById("btnNewTicketAgain"),
    btnGoToTickets: document.getElementById("btnGoToTickets")
};

// Active Article currently open in modal
let activeArticle = null;

// ==========================================================================
// CORE FUNCTIONS & EVENT HANDLERS
// ==========================================================================

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    setupSidebarToggle();
    setupPageSwitcher();
    setupSmartSearch();
    setupCategoryCards();
    setupCascadingDropdowns();
    setupFormValidation();
    setupDescriptionTemplates();
    setupFileUpload();
    setupArticleDrawer();
    setupSuccessModalActions();
});

// 1. Sidebar Collapse Interaction
function setupSidebarToggle() {
    DOM.sidebarToggle.addEventListener("click", () => {
        DOM.sidebar.classList.toggle("collapsed");
    });
}

// 2. Page Swapping (Simulated ERP tabs)
function setupPageSwitcher() {
    function showNewTicketPage() {
        DOM.openTicketPage.classList.remove("hidden");
        DOM.myTicketsPage.classList.add("hidden");
        DOM.navMyTickets.classList.remove("active");
        DOM.navNewTicket.classList.add("active");
    }

    function showMyTicketsPage() {
        DOM.openTicketPage.classList.add("hidden");
        DOM.myTicketsPage.classList.remove("hidden");
        DOM.navNewTicket.classList.remove("active");
        DOM.navMyTickets.classList.add("active");
        DOM.ticketCountBadge.textContent = STATE.createdTicketsCount;
    }

    DOM.navMyTickets.addEventListener("click", (e) => {
        e.preventDefault();
        showMyTicketsPage();
    });

    DOM.navNewTicket.addEventListener("click", (e) => {
        e.preventDefault();
        showNewTicketPage();
    });

    DOM.btnBackToNewTicket.addEventListener("click", showNewTicketPage);
    DOM.btnCancel.addEventListener("click", resetForm);
}

// 3. Smart Search Deflection Logic
function setupSmartSearch() {
    let debounceTimeout = null;

    DOM.deflectionSearch.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length > 0) {
            DOM.clearSearchBtn.style.display = "flex";
            DOM.searchLoader.style.display = "block";
            
            // Debounce input to simulate database delay (300ms)
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                filterArticles(query);
            }, 300);
        } else {
            clearSearchState();
        }
    });

    DOM.clearSearchBtn.addEventListener("click", clearSearchState);

    // Hide dropdown if clicked outside
    document.addEventListener("click", (e) => {
        if (!DOM.deflectionSearch.contains(e.target) && !DOM.deflectionSuggestions.contains(e.target)) {
            DOM.deflectionSuggestions.classList.remove("active");
        }
    });

    DOM.deflectionSearch.addEventListener("focus", () => {
        if (DOM.deflectionSearch.value.trim().length > 0) {
            DOM.deflectionSuggestions.classList.add("active");
        }
    });
}

function clearSearchState() {
    DOM.deflectionSearch.value = "";
    DOM.clearSearchBtn.style.display = "none";
    DOM.searchLoader.style.display = "none";
    DOM.deflectionSuggestions.classList.remove("active");
}

function formatGithubMarkdown(md) {
    if (!md) return "<p>Sem descrição disponível.</p>";
    
    // Escape HTML to prevent XSS
    let html = md
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Code blocks: ```code```
    html = html.replace(/```([\s\S]*?)```/g, '<div class="article-code-snippet"><pre style="white-space: pre-wrap; word-break: break-all;">$1</pre></div>');
    
    // Inline code: `code`
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // List items: - or *
    html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
    
    // Double newlines to paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    // Single newlines to linebreaks
    html = html.replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
}

function filterArticles(query) {
    // Show spinner loader
    DOM.searchLoader.style.display = "block";
    
    // 1. Filter local database articles first (instant feedback)
    const localResults = KB_ARTICLES.filter(article => {
        return article.title.toLowerCase().includes(query) || 
               article.tags.some(tag => tag.toLowerCase().includes(query));
    });

    DOM.suggestionsList.innerHTML = "";

    // Render local results
    if (localResults.length > 0) {
        localResults.forEach(article => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            
            let moduleText = article.level2.toUpperCase();
            if (moduleText === "LOGIN") moduleText = "LOGIN/ACESSO";

            item.innerHTML = `
                <div class="suggestion-item-icon">
                    <i class="fa-solid fa-file-lines"></i>
                </div>
                <div class="suggestion-details">
                    <h4>${article.title}</h4>
                    <p>Resolva este problema de forma autônoma seguindo este guia prático de suporte.</p>
                    <div class="suggestion-meta">
                        <span class="suggestion-meta-pill"><i class="fa-solid fa-tag"></i> Base Interna: ${moduleText}</span>
                        <span class="suggestion-meta-pill"><i class="fa-solid fa-bolt"></i> Auto-resolução</span>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right" style="color: var(--text-light); font-size: 11px; align-self: center;"></i>
            `;
            item.addEventListener("click", () => {
                openArticleDrawer(article);
                DOM.deflectionSuggestions.classList.remove("active");
            });
            DOM.suggestionsList.appendChild(item);
        });
        DOM.deflectionSuggestions.classList.add("active");
    }

    // 2. Fetch from GitHub Search API in parallel (Free Public API)
    const githubApiUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}+is:issue&per_page=3`;
    
    fetch(githubApiUrl)
        .then(response => {
            if (!response.ok) throw new Error("Erro na API do GitHub");
            return response.json();
        })
        .then(data => {
            DOM.searchLoader.style.display = "none";
            
            const issues = data.items || [];
            if (issues.length > 0) {
                // Add a divider header in suggestions for GitHub results
                const header = document.createElement("div");
                header.className = "suggestions-header";
                header.style.backgroundColor = "var(--primary-light)";
                header.style.color = "var(--primary)";
                header.style.borderTop = "1px solid var(--border-color)";
                header.innerHTML = `
                    <span><i class="fa-brands fa-github"></i> Discussões do GitHub (Comunidade)</span>
                    <span class="badge blue">API Conectada</span>
                `;
                DOM.suggestionsList.appendChild(header);
                
                issues.forEach(issue => {
                    const item = document.createElement("div");
                    item.className = "suggestion-item";
                    
                    item.innerHTML = `
                        <div class="suggestion-item-icon" style="color: #24292e; background-color: #f6f8fa;">
                            <i class="fa-brands fa-github"></i>
                        </div>
                        <div class="suggestion-details">
                            <h4>${issue.title}</h4>
                            <p>Discussão pública da comunidade GitHub relacionada à sua dúvida.</p>
                            <div class="suggestion-meta">
                                <span class="suggestion-meta-pill"><i class="fa-solid fa-code-fork"></i> Issue #${issue.number}</span>
                                <span class="suggestion-meta-pill"><i class="fa-solid fa-user"></i> @${issue.user.login}</span>
                            </div>
                        </div>
                        <i class="fa-solid fa-external-link" style="color: var(--text-light); font-size: 11px; align-self: center;"></i>
                    `;
                    
                    // Create simulated article from GitHub issue details
                    const simulatedArticle = {
                        id: `gh-${issue.id}`,
                        title: issue.title,
                        content: `
                            <h1>${issue.title}</h1>
                            <div class="article-meta-info">
                                <span><i class="fa-brands fa-github"></i> GitHub Issue #${issue.number}</span>
                                <span><i class="fa-solid fa-user"></i> Autor: @${issue.user.login}</span>
                                <span><i class="fa-solid fa-comments"></i> ${issue.comments} comentários</span>
                            </div>
                            <div class="article-body-content">
                                <p><strong>Descrição da Issue no GitHub:</strong></p>
                                <div style="font-family: inherit; font-size: 13px; color: var(--text-medium); line-height: 1.5; background: #fafbfc; border: 1px solid var(--border-color); padding: 18px; border-radius: 8px; margin-bottom: 20px; max-height: 350px; overflow-y: auto;">
                                    ${formatGithubMarkdown(issue.body)}
                                </div>
                                <div class="article-alert-note" style="background-color: var(--primary-light); border-left: 4px solid var(--primary); margin-top: 10px;">
                                    <h5><i class="fa-solid fa-arrow-up-right-from-square"></i> Quer participar da discussão?</h5>
                                    Acesse a issue completa diretamente no GitHub para ver todos os comentários e soluções propostas pela comunidade de desenvolvedores.
                                    <br><br>
                                    <a href="${issue.html_url}" target="_blank" class="btn btn-primary" style="padding: 8px 16px; font-size: 11px; text-decoration: none; display: inline-flex; border-radius: 4px; color: #fff;">Acessar no GitHub <i class="fa-solid fa-external-link" style="margin-left: 6px;"></i></a>
                                </div>
                            </div>
                        `,
                        level2: "github"
                    };

                    item.addEventListener("click", () => {
                        openArticleDrawer(simulatedArticle);
                        DOM.deflectionSuggestions.classList.remove("active");
                    });
                    
                    DOM.suggestionsList.appendChild(item);
                });
            }
            
            // If neither has results, display empty state
            if (localResults.length === 0 && issues.length === 0) {
                renderEmptySearchState();
            }
        })
        .catch(err => {
            console.error("Erro ao buscar issues no GitHub:", err);
            DOM.searchLoader.style.display = "none";
            
            // If local is also empty, show empty state
            if (localResults.length === 0) {
                renderEmptySearchState();
            }
        });
}

function renderEmptySearchState() {
    DOM.suggestionsList.innerHTML = `
        <div class="suggestion-item" style="cursor: default; padding: 24px; flex-direction: column; align-items: center; gap: 8px; text-align: center;">
            <i class="fa-solid fa-circle-info" style="font-size: 24px; color: var(--text-light);"></i>
            <div>
                <h4 style="margin: 0; color: var(--text-medium);">Nenhum tutorial encontrado</h4>
                <p style="font-size: 12px; margin-top: 4px;">Você ainda pode abrir seu chamado preenchendo as opções abaixo.</p>
            </div>
        </div>
    `;
    DOM.deflectionSuggestions.classList.add("active");
}

// 4. Category Cards Click (Level 1)
function setupCategoryCards() {
    DOM.categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const category = card.getAttribute("data-category");
            
            // Reset selection state on siblings
            DOM.categoryCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            
            STATE.selectedCategory = category;
            
            // Set dynamic header text for Passo 2 based on selected card
            let step2Text = "Detalhes do Chamado";
            let step2Subtitle = "Preencha as informações detalhadamente";
            
            if (category === "problema") {
                step2Text = "📝 DETALHES DO CHAMADO (Incidente)";
                step2Subtitle = "Relate o problema técnico para triagem ou bypass imediato";
                DOM.step2Badge.className = "step-badge error-tag";
                DOM.step2Badge.style.backgroundColor = "var(--error-bg)";
                DOM.step2Badge.style.color = "var(--error)";
                DOM.step2Badge.style.borderColor = "var(--error-border)";
            } else if (category === "servico") {
                step2Text = "📝 DETALHES DO CHAMADO (Requisição de Serviço)";
                step2Subtitle = "Solicite acessos, permissões, cadastros ou módulos";
                DOM.step2Badge.className = "step-badge service-tag";
                DOM.step2Badge.style.backgroundColor = "var(--service-bg)";
                DOM.step2Badge.style.color = "var(--service)";
                DOM.step2Badge.style.borderColor = "var(--service-border)";
            } else if (category === "financeiro") {
                step2Text = "📝 DETALHES DO CHAMADO (Atendimento Comercial)";
                step2Subtitle = "Questões de faturas, boletos, planos e licenças do ERP";
                DOM.step2Badge.className = "step-badge finance-tag";
                DOM.step2Badge.style.backgroundColor = "var(--success-bg)";
                DOM.step2Badge.style.color = "var(--success)";
                DOM.step2Badge.style.borderColor = "var(--success-border)";
            }
            
            DOM.step2Title.firstChild.textContent = step2Text + " ";
            DOM.step2Subtitle.textContent = step2Subtitle;
            
            // Enable and populate Level 2 dropdown
            populateLevel2(category);
            
            // Expand Step 2 Section
            DOM.step2Section.classList.remove("collapsed");
            DOM.step2Section.classList.add("active");
            
            // Scroll smoothly to Step 2
            setTimeout(() => {
                DOM.step2Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    });
}

// 5. Cascading Dropdowns Logic (Level 2 & 3)
function populateLevel2(category) {
    DOM.selectLevel2.disabled = false;
    DOM.selectLevel2.innerHTML = '<option value="" disabled selected>Selecione o Módulo do ERP...</option>';
    
    // Clear Level 3 select
    DOM.selectLevel3.disabled = true;
    DOM.selectLevel3.innerHTML = '<option value="" disabled selected>Selecione o módulo ERP primeiro...</option>';
    DOM.level3Hint.textContent = "Selecione o módulo acima para ver as opções.";
    DOM.level3Hint.style.color = "var(--text-muted)";
    
    const options = LEVEL2_DATA[category] || [];
    options.forEach(opt => {
        const el = document.createElement("option");
        el.value = opt.value;
        el.textContent = opt.text;
        DOM.selectLevel2.appendChild(el);
    });
    
    // Disable inputs until Level 2 and 3 are filled
    toggleFormInputs(false);
    updateSlaDisplay(null);
}

function setupCascadingDropdowns() {
    // Level 2 change handler
    DOM.selectLevel2.addEventListener("change", (e) => {
        const val = e.target.value;
        STATE.selectedLevel2 = val;
        
        populateLevel3(val);
        toggleFormInputs(false);
        
        // Trigger deflection suggestion in sidebar if article matches Level 2
        checkDeflectionAlert(val);
    });
    
    // Level 3 change handler
    DOM.selectLevel3.addEventListener("change", (e) => {
        const val = e.target.value;
        STATE.selectedLevel3 = val;
        
        const optionDetails = findLevel3Detail(STATE.selectedLevel2, val);
        if (optionDetails) {
            updateSlaDisplay(optionDetails);
            updateRoutingDisplay(optionDetails);
        }
        
        // Enable Title and Description
        toggleFormInputs(true);
        validateForm();
    });
}

function populateLevel3(level2Value) {
    DOM.selectLevel3.disabled = false;
    DOM.selectLevel3.innerHTML = '<option value="" disabled selected>Selecione o problema / item...</option>';
    DOM.level3Hint.textContent = "Selecione a situação correspondente na lista.";
    DOM.level3Hint.style.color = "var(--text-muted)";
    
    const options = LEVEL3_DATA[level2Value] || [];
    options.forEach(opt => {
        const el = document.createElement("option");
        el.value = opt.value;
        el.textContent = opt.text;
        DOM.selectLevel3.appendChild(el);
    });
}

function findLevel3Detail(level2, level3) {
    const list = LEVEL3_DATA[level2] || [];
    return list.find(item => item.value === level3);
}

function toggleFormInputs(enabled) {
    DOM.ticketTitle.disabled = !enabled;
    DOM.ticketDescription.disabled = !enabled;
    
    // Show helper text template buttons if enabled
    if (enabled) {
        DOM.textareaHelpers.style.opacity = "1";
        DOM.textareaHelpers.style.pointerEvents = "all";
    } else {
        DOM.textareaHelpers.style.opacity = "0.4";
        DOM.textareaHelpers.style.pointerEvents = "none";
    }
}

// Check if there is a matching article for Level 2 selection to alert user (Deflection)
function checkDeflectionAlert(level2Val) {
    const match = KB_ARTICLES.find(article => article.level2 === level2Val);
    if (match) {
        DOM.deflectionAlertText.textContent = `Encontramos o tutorial "${match.title}" relacionado à sua seleção. Resolva sem abrir chamado.`;
        DOM.deflectionAlertCard.classList.add("active");
        
        // Clear previous event listener
        const newBtn = DOM.deflectionAlertBtn.cloneNode(true);
        DOM.deflectionAlertBtn.parentNode.replaceChild(newBtn, DOM.deflectionAlertBtn);
        DOM.deflectionAlertBtn = newBtn;
        
        DOM.deflectionAlertBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openArticleDrawer(match);
        });
    } else {
        DOM.deflectionAlertCard.classList.remove("active");
    }
}

// 6. SLA and Routing Dashboard Display Updates (Intelligent calculation)
function updateSlaDisplay(details) {
    if (!details) {
        DOM.slaCard.className = "sla-card";
        DOM.slaPriorityBadge.className = "priority-badge";
        DOM.slaPriorityBadge.querySelector(".priority-text").textContent = "AGUARDANDO SELEÇÃO";
        DOM.slaTime.textContent = "--";
        DOM.slaExplanation.textContent = "Selecione a categoria, o módulo e o problema para calcular o SLA e o tempo estimado de atendimento.";
        return;
    }
    
    const prio = details.priority;
    const time = details.sla;
    STATE.currentSla = `${prio.toUpperCase()} (SLA: ${time})`;
    
    DOM.slaTime.textContent = `Até ${time}`;
    
    if (prio === "Alta") {
        DOM.slaCard.className = "sla-card high-priority";
        DOM.slaPriorityBadge.className = "priority-badge error-tag";
        DOM.slaPriorityBadge.querySelector(".priority-text").textContent = "🔴 PRIORIDADE ALTA";
        DOM.slaExplanation.textContent = "Incidentes críticos que impactam a operação principal do ERP. Atendimento emergencial prioritário.";
    } else if (prio === "Média") {
        DOM.slaCard.className = "sla-card medium-priority";
        DOM.slaPriorityBadge.className = "priority-badge warning-tag";
        DOM.slaPriorityBadge.querySelector(".priority-text").textContent = "🟡 PRIORIDADE MÉDIA";
        DOM.slaExplanation.textContent = "Problemas operacionais parciais ou solicitações com impacto moderado nas rotinas da empresa.";
    } else { // Baixa
        DOM.slaCard.className = "sla-card low-priority";
        DOM.slaPriorityBadge.className = "priority-badge success-tag";
        DOM.slaPriorityBadge.querySelector(".priority-text").textContent = "🟢 PRIORIDADE BAIXA";
        DOM.slaExplanation.textContent = "Dúvidas gerais, melhorias de layout, ou requisições não emergenciais.";
    }
}

function updateRoutingDisplay(details) {
    if (!details) return;
    
    const route = details.route;
    const isBypass = details.bypass;
    STATE.currentRoute = route;
    
    DOM.routingQueueName.textContent = route;
    
    if (isBypass) {
        DOM.routingQueueDescription.textContent = "Triagem automática (Pulou N1)";
        DOM.routingCard.querySelector(".routing-flow").classList.add("routed");
        DOM.routingTargetStep.className = "flow-step routed";
        DOM.routingTargetIcon.innerHTML = '<i class="fa-solid fa-bolt-lightning"></i>';
        DOM.bypassBadge.style.display = "inline-flex";
    } else {
        DOM.routingQueueDescription.textContent = "Enfileirado para analistas N1/N2";
        DOM.routingCard.querySelector(".routing-flow").classList.remove("routed");
        DOM.routingTargetStep.className = "flow-step";
        DOM.routingTargetIcon.innerHTML = '<i class="fa-solid fa-headset"></i>';
        DOM.bypassBadge.style.display = "none";
    }
}

// 7. Form validation & Submissions
function setupFormValidation() {
    const inputs = [DOM.ticketTitle, DOM.ticketDescription, DOM.selectLevel2, DOM.selectLevel3];
    inputs.forEach(input => {
        input.addEventListener("input", validateForm);
        input.addEventListener("change", validateForm);
    });
}

function validateForm() {
    const isValid = DOM.ticketForm.checkValidity() && 
                    STATE.selectedCategory && 
                    STATE.selectedLevel2 && 
                    STATE.selectedLevel3;
                    
    DOM.btnSubmit.disabled = !isValid;
}

// Description template triggers
function setupDescriptionTemplates() {
    const helperChips = DOM.textareaHelpers.querySelectorAll(".helper-chip");
    helperChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const templateType = chip.getAttribute("data-template");
            if (templateType === "incidente") {
                DOM.ticketDescription.value = `### Roteiro de Teste / Reprodução do Erro
1. Onde ocorreu (Caminho completo do menu):
2. O que foi feito (Passo a passo):
3. Comportamento esperado:
4. Comportamento observado (Erro exibido):
5. Mensagem de erro (Copiar texto se aplicável):
6. Impacto na operação (Ex: Faturamento travado, apenas lentidão, etc):`;
            } else {
                DOM.ticketDescription.value = "";
            }
            validateForm();
            DOM.ticketDescription.focus();
        });
    });
}

// 8. File Upload UI simulation
function setupFileUpload() {
    const dropzone = DOM.fileDropzone;
    
    // Highlight drop zone when item dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
        }, false);
    });

    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    DOM.fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Exclude big files
        if (file.size > 10 * 1024 * 1024) {
            alert(`O arquivo ${file.name} excede o tamanho limite de 10MB.`);
            continue;
        }
        
        const fileId = "file-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
        const fileObj = {
            id: fileId,
            name: file.name,
            size: formatBytes(file.size),
            rawFile: file
        };
        
        STATE.attachedFiles.push(fileObj);
        renderAttachedFile(fileObj);
    }
}

function renderAttachedFile(fileObj) {
    const item = document.createElement("div");
    item.className = "attached-file-item";
    item.id = fileObj.id;
    
    // Choose appropriate file icon
    let iconClass = "fa-file-image";
    if (fileObj.name.endsWith(".pdf")) iconClass = "fa-file-pdf";
    else if (fileObj.name.endsWith(".txt") || fileObj.name.endsWith(".log")) iconClass = "fa-file-lines";
    
    item.innerHTML = `
        <div class="file-preview-icon">
            <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="attached-file-info">
            <div class="attached-file-name" title="${fileObj.name}">${fileObj.name}</div>
            <div class="attached-file-size" id="size-${fileObj.id}">Simulando upload (${fileObj.size})</div>
            <div class="file-progress-bar">
                <div class="file-progress-fill" id="progress-${fileObj.id}"></div>
            </div>
        </div>
        <button class="btn-remove-file" title="Remover"><i class="fa-solid fa-trash-can"></i></button>
    `;
    
    // Remove button action
    item.querySelector(".btn-remove-file").addEventListener("click", () => {
        STATE.attachedFiles = STATE.attachedFiles.filter(f => f.id !== fileObj.id);
        item.remove();
    });
    
    DOM.attachedFilesList.appendChild(item);
    
    // Simulate upload progress bar
    setTimeout(() => {
        const fill = document.getElementById(`progress-${fileObj.id}`);
        const sizeText = document.getElementById(`size-${fileObj.id}`);
        if (fill && sizeText) {
            fill.style.width = "100%";
            setTimeout(() => {
                sizeText.textContent = fileObj.size;
                sizeText.style.color = "var(--success)";
            }, 400);
        }
    }, 100);
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 9. Deflection Article Drawer/Modal Setup
function setupArticleDrawer() {
    DOM.articleCloseBtn.addEventListener("click", () => {
        DOM.articleModalBackdrop.classList.remove("active");
    });
    
    DOM.articleModalBackdrop.addEventListener("click", (e) => {
        if (e.target === DOM.articleModalBackdrop) {
            DOM.articleModalBackdrop.classList.remove("active");
        }
    });

    // Helpful deflection feedback button (Yes - Auto-resolved!)
    DOM.feedbackYesBtn.addEventListener("click", () => {
        STATE.deflectionCount++;
        DOM.articleModalBackdrop.classList.remove("active");
        
        // Show beautiful satisfaction/success toast
        showDeflectionSuccessToast();
        
        // Reset ticket opening page completely
        resetForm();
    });
    
    // Unhelpful feedback button (No - Continue opening ticket)
    DOM.feedbackNoBtn.addEventListener("click", () => {
        DOM.articleModalBackdrop.classList.remove("active");
        // Keep inputs as they are, focus on form
        DOM.ticketTitle.focus();
    });
}

function openArticleDrawer(article) {
    activeArticle = article;
    DOM.articleModalBody.innerHTML = article.content;
    DOM.articleModalBackdrop.classList.add("active");
}

function showDeflectionSuccessToast() {
    DOM.deflectionSuccessToast.style.display = "flex";
    setTimeout(() => {
        DOM.deflectionSuccessToast.style.opacity = "1";
    }, 50);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        DOM.deflectionSuccessToast.style.opacity = "0";
        setTimeout(() => {
            DOM.deflectionSuccessToast.style.display = "none";
        }, 300);
    }, 5000);
}

// 10. Form submission simulation
DOM.ticketForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (!DOM.btnSubmit.disabled) {
        // Compile ticket details
        const randId = Math.floor(1000 + Math.random() * 9000);
        const protocol = `APX-2026-${randId}`;
        const titleVal = DOM.ticketTitle.value;
        const level2Label = DOM.selectLevel2.options[DOM.selectLevel2.selectedIndex].text;
        
        // Set success modal details
        DOM.successTicketId.textContent = `#${protocol}`;
        DOM.successQueueName.textContent = STATE.currentRoute;
        DOM.successSlaBadge.textContent = STATE.currentSla.split(" (")[0]; // Just the priority name
        DOM.successSlaTime.textContent = DOM.slaTime.textContent;
        
        // Dynamically append new ticket to simulated table grid
        addNewTicketToGrid(protocol, titleVal, level2Label);
        
        // Increment count
        STATE.createdTicketsCount++;
        
        // Show success modal backdrop
        DOM.successModalBackdrop.style.display = "flex";
        setTimeout(() => {
            DOM.successModalBackdrop.classList.add("active");
        }, 50);
    }
});

function addNewTicketToGrid(protocol, title, level2Text) {
    const row = document.createElement("tr");
    row.className = "ticket-row";
    
    let prioClass = "low";
    if (STATE.currentSla.includes("Alta")) prioClass = "high";
    else if (STATE.currentSla.includes("Média")) prioClass = "medium";
    
    let catLabel = "Incidente";
    let catTagClass = "error-tag";
    if (STATE.selectedCategory === "servico") {
        catLabel = "Requisição";
        catTagClass = "service-tag";
    } else if (STATE.selectedCategory === "financeiro") {
        catLabel = "Financeiro";
        catTagClass = "finance-tag";
    }

    row.innerHTML = `
        <td>
            <div class="ticket-id-cat">
                <span class="ticket-id">#${protocol}</span>
                <span class="ticket-category-tag ${catTagClass}">${catLabel}</span>
            </div>
        </td>
        <td>
            <div class="ticket-title-wrapper-table">
                <strong>${title}</strong>
                <span class="ticket-time">Aberto agora mesmo por Vinícius</span>
            </div>
        </td>
        <td>
            <span class="module-pill">${level2Text}</span>
        </td>
        <td>
            <span class="route-pill">${STATE.currentRoute}</span>
        </td>
        <td>
            <span class="table-priority-badge ${prioClass}"><span class="dot"></span> ${STATE.currentSla.replace("SLA: ", "")}</span>
        </td>
        <td>
            <span class="status-pill status-open">Aberto</span>
        </td>
        <td>
            <button class="btn-table-action" title="Visualizar Detalhes"><i class="fa-solid fa-eye"></i></button>
        </td>
    `;
    
    DOM.ticketsTableBody.insertBefore(row, DOM.ticketsTableBody.firstChild);
}

function setupSuccessModalActions() {
    DOM.btnNewTicketAgain.addEventListener("click", () => {
        DOM.successModalBackdrop.classList.remove("active");
        setTimeout(() => {
            DOM.successModalBackdrop.style.display = "none";
            resetForm();
        }, 300);
    });
    
    DOM.btnGoToTickets.addEventListener("click", () => {
        DOM.successModalBackdrop.classList.remove("active");
        setTimeout(() => {
            DOM.successModalBackdrop.style.display = "none";
            resetForm();
            // Switch tabs
            DOM.navMyTickets.click();
        }, 300);
    });
}

// Reset form fields and selections
function resetForm() {
    DOM.ticketForm.reset();
    
    // Reset selections states
    STATE.selectedCategory = null;
    STATE.selectedLevel2 = null;
    STATE.selectedLevel3 = null;
    STATE.attachedFiles = [];
    
    DOM.categoryCards.forEach(c => c.classList.remove("selected"));
    
    // Clear dynamic dropdowns
    DOM.selectLevel2.innerHTML = '<option value="" disabled selected>Selecione a categoria no Passo 1 primeiro...</option>';
    DOM.selectLevel2.disabled = true;
    DOM.selectLevel3.innerHTML = '<option value="" disabled selected>Selecione o módulo ERP primeiro...</option>';
    DOM.selectLevel3.disabled = true;
    DOM.level3Hint.textContent = "Selecione o módulo acima para ver as opções.";
    DOM.level3Hint.style.color = "var(--text-muted)";
    
    // Disable inputs
    toggleFormInputs(false);
    
    // Clear files lists
    DOM.attachedFilesList.innerHTML = "";
    
    // Reset SLA and route
    updateSlaDisplay(null);
    DOM.routingQueueName.textContent = "Fila de Triagem (N1)";
    DOM.routingQueueDescription.textContent = "Aguardando definição para rotear";
    DOM.routingCard.querySelector(".routing-flow").classList.remove("routed");
    DOM.routingTargetStep.className = "flow-step";
    DOM.routingTargetIcon.innerHTML = '<i class="fa-solid fa-headset"></i>';
    DOM.bypassBadge.style.display = "none";
    
    // Hide deflection alert
    DOM.deflectionAlertCard.classList.remove("active");
    
    // Collapse Step 2 section
    DOM.step2Section.classList.remove("active");
    DOM.step2Section.classList.add("collapsed");
    
    // Clear deflection search
    clearSearchState();
    
    // Reset submit button state
    DOM.btnSubmit.disabled = true;
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
