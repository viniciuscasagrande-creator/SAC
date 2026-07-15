/**
 * Limitless ERP - SAC & Helpdesk JavaScript Logic
 * Powered by public GitHub Issues Search API & local deflection knowledge base
 */

// ==========================================================================
// MOCK DATABASES
// ==========================================================================

const KB_ARTICLES = [
    {
        id: "art-1",
        title: "Como emitir nota fiscal de serviço (NFS-e)",
        content: `
            <h5>Como emitir nota fiscal de serviço (NFS-e)</h5>
            <hr class="my-2">
            <div class="d-flex gap-3 text-muted mb-3 fs-sm">
                <span><i class="ph-folder me-1"></i> Módulo: Faturamento</span>
                <span><i class="ph-eye me-1"></i> 1.245 visualizações</span>
                <span><i class="ph-clock me-1"></i> Leitura: 2 min</span>
            </div>
            <div class="article-body-content">
                <p>Para emitir notas fiscais de serviço direto pelo ERP, siga o passo a passo abaixo:</p>
                <ol class="ps-3 mb-3">
                    <li class="mb-1">Acesse o menu lateral <strong>Vendas & Faturamento</strong> e selecione a opção <strong>Emitir NFS-e</strong>.</li>
                    <li class="mb-1">Escolha o cliente correspondente pesquisando por CNPJ ou Razão Social.</li>
                    <li class="mb-1">Selecione o <strong>Serviço Prestado</strong> cadastrado na lista de códigos municipais.</li>
                    <li class="mb-1">Preencha o valor da nota. O sistema calculará os impostos federais (PIS, COFINS, CSLL) e o ISS municipal automaticamente com base no perfil tributário configurado.</li>
                    <li class="mb-1">Clique em <strong>Transmitir Nota</strong> no canto inferior direito.</li>
                </ol>
                <div class="alert alert-warning border-start border-start-width-3 border-warning rounded-0 p-3 mb-0">
                    <div class="fw-bold mb-1"><i class="ph-info me-2"></i> Nota Fiscal Rejeitada?</div>
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
            <h5>Como resetar sua senha de acesso</h5>
            <hr class="my-2">
            <div class="d-flex gap-3 text-muted mb-3 fs-sm">
                <span><i class="ph-folder me-1"></i> Módulo: Login/Acesso</span>
                <span><i class="ph-eye me-1"></i> 3.812 visualizações</span>
                <span><i class="ph-clock me-1"></i> Leitura: 1 min</span>
            </div>
            <div class="article-body-content">
                <p>Se você esqueceu ou deseja resetar sua senha por motivos de segurança, siga as opções abaixo:</p>
                
                <h6 class="fw-bold">Opção 1: Reset pelo link de login (Autônomo)</h6>
                <ol class="ps-3 mb-3">
                    <li class="mb-1">Na tela inicial de login do ERP, clique em <strong>Esqueceu sua senha?</strong> logo abaixo dos campos de login.</li>
                    <li class="mb-1">Digite o seu e-mail cadastrado ou CPF/CNPJ corporativo.</li>
                    <li class="mb-1">Acesse sua caixa de entrada e procure pelo e-mail com o assunto <em>"ApexERP - Recuperação de Senha"</em>.</li>
                    <li class="mb-1">Clique no link seguro e digite sua nova senha de no mínimo 8 caracteres contendo letras e números.</li>
                </ol>

                <h6 class="fw-bold">Opção 2: Pelo seu perfil logado</h6>
                <ol class="ps-3 mb-0">
                    <li class="mb-1">Com o sistema aberto, clique na foto do seu perfil no canto superior direito e vá em <strong>Minha Conta</strong>.</li>
                    <li class="mb-1">Navegue até a aba de <strong>Segurança</strong>.</li>
                    <li class="mb-1">Digite sua senha atual e em segurança configure a nova senha desejada.</li>
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
            <h5>Erro 502 Bad Gateway ao carregar telas ou relatórios</h5>
            <hr class="my-2">
            <div class="d-flex gap-3 text-muted mb-3 fs-sm">
                <span><i class="ph-folder me-1"></i> Módulo: Relatórios</span>
                <span><i class="ph-eye me-1"></i> 940 visualizações</span>
                <span><i class="ph-clock me-1"></i> Leitura: 2 min</span>
            </div>
            <div class="article-body-content">
                <p>O Erro 502 normalmente indica que o servidor do ERP recebeu uma resposta inválida ou que há instabilidade temporária na sua conexão de rede ou rota de internet.</p>
                <p>Siga estes procedimentos para resolver rapidamente:</p>
                <ol class="ps-3 mb-3">
                    <li class="mb-1"><strong>Limpe o Cache do Navegador:</strong> Pressione <code>Ctrl + Shift + R</code> (Windows) ou <code>Cmd + Shift + R</code> (Mac) para recarregar a página limpando os arquivos temporários.</li>
                    <li class="mb-1"><strong>Acesse via aba anônima:</strong> Tente abrir a mesma tela em modo anônimo. Se funcionar, indica que alguma extensão do seu navegador ou cookies antigos estão bloqueando as requisições HTTP do ERP.</li>
                    <li class="mb-1"><strong>Verifique nosso Status Page:</strong> Ocasionalmente realizamos atualizações rápidas nos bancos de dados de relatórios complexos.</li>
                </ol>
                <div class="alert alert-info border-start border-start-width-3 border-info rounded-0 p-3 mb-0">
                    <div class="fw-bold mb-1">Dica do Suporte:</div>
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
            <h5>Divergência de Saldo no Módulo de Estoque</h5>
            <hr class="my-2">
            <div class="d-flex gap-3 text-muted mb-3 fs-sm">
                <span><i class="ph-folder me-1"></i> Módulo: Estoque</span>
                <span><i class="ph-eye me-1"></i> 721 visualizações</span>
                <span><i class="ph-clock me-1"></i> Leitura: 3 min</span>
            </div>
            <div class="article-body-content">
                <p>Quando o saldo exibido no painel de vendas difere da contagem física realizada no almoxarifado, execute as seguintes checagens:</p>
                <ol class="ps-3 mb-0">
                    <li class="mb-1">Acesse <strong>Estoque & Compras</strong> > <strong>Extrato de Movimentação</strong> do produto.</li>
                    <li class="mb-1">Verifique se existem <em>pedidos de venda aprovados mas ainda não faturados</em>. Estes itens já estão reservados e são deduzidos do saldo disponível, embora ainda estejam fisicamente no galpão.</li>
                    <li class="mb-1">Consulte se há alguma <strong>Inventário de Ajuste</strong> aberto em rascunho para este SKU. Se houver, o estoque ficará bloqueado para conciliação.</li>
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
            <h5>Como emitir 2ª via de faturas e boletos da assinatura</h5>
            <hr class="my-2">
            <div class="d-flex gap-3 text-muted mb-3 fs-sm">
                <span><i class="ph-folder me-1"></i> Módulo: Financeiro</span>
                <span><i class="ph-eye me-1"></i> 1.480 visualizações</span>
                <span><i class="ph-clock me-1"></i> Leitura: 1 min</span>
            </div>
            <div class="article-body-content">
                <p>O ERP envia as faturas mensalmente ao e-mail financeiro cadastrado, mas você pode retirá-las a qualquer momento:</p>
                <ol class="ps-3 mb-0">
                    <li class="mb-1">No menu superior ou lateral, acesse o módulo <strong>Financeiro</strong>.</li>
                    <li class="mb-1">Clique no menu <strong>Minhas Faturas / Assinatura Apex</strong>.</li>
                    <li class="mb-1">Identifique o mês em aberto e clique no botão <strong>Imprimir Boleto</strong> ou copie a linha digitável do Pix copia e cola.</li>
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

// Application State
const STATE = {
    selectedCategory: null, // problem, service, financial
    selectedLevel2: null,
    selectedLevel3: null,
    deflectionCount: 0,
    createdTicketsCount: 3,
    attachedFiles: [],
    currentSla: null,
    currentRoute: null
};

// ==========================================================================
// DOM SELECTORS
// ==========================================================================

let DOM = {};
let articleOffcanvasInstance = null;
let successModalInstance = null;
let activeArticle = null;

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
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

function cacheElements() {
    DOM = {
        // Tabs Switching
        navNewTicket: document.getElementById("navNewTicket"),
        navMyTickets: document.getElementById("navMyTickets"),
        openTicketPage: document.getElementById("openTicketPage"),
        myTicketsPage: document.getElementById("myTicketsPage"),
        btnBackToNewTicket: document.getElementById("btnBackToNewTicket"),
        ticketCountBadge: document.getElementById("ticketCountBadge"),
        ticketsTableBody: document.getElementById("ticketsTableBody"),
        
        // Deflection search input
        deflectionSearch: document.getElementById("deflectionSearch"),
        deflectionSuggestions: document.getElementById("deflectionSuggestions"),
        suggestionsList: document.getElementById("suggestionsList"),
        clearSearchBtn: document.getElementById("clearSearchBtn"),
        searchLoader: document.getElementById("searchLoader"),
        
        // Cards (Passo 1)
        cardProblema: document.getElementById("cardProblema"),
        cardServico: document.getElementById("cardServico"),
        cardFinanceiro: document.getElementById("cardFinanceiro"),
        categoryCards: document.querySelectorAll(".category-card"),
        
        // Steps Headers
        step2Section: document.getElementById("step2Section"),
        step2Badge: document.getElementById("step2Badge"),
        step2Title: document.getElementById("step2Title"),
        step2Subtitle: document.getElementById("step2Subtitle"),
        
        // Form & inputs
        selectLevel2: document.getElementById("selectLevel2"),
        selectLevel3: document.getElementById("selectLevel3"),
        ticketTitle: document.getElementById("ticketTitle"),
        ticketDescription: document.getElementById("ticketDescription"),
        ticketForm: document.getElementById("ticketForm"),
        textareaHelpers: document.getElementById("textareaHelpers"),
        level3Hint: document.getElementById("level3Hint"),
        
        // Drag-n-drop file uploads
        fileDropzone: document.getElementById("fileDropzone"),
        fileInput: document.getElementById("fileInput"),
        attachedFilesList: document.getElementById("attachedFilesList"),
        
        // SLA & Routing sidebar
        slaCard: document.getElementById("slaCard"),
        slaPriorityBadge: document.getElementById("slaPriorityBadge"),
        slaPriorityText: document.getElementById("slaPriorityText"),
        slaTime: document.getElementById("slaTime"),
        slaExplanation: document.getElementById("slaExplanation"),
        routingCard: document.getElementById("routingCard"),
        routingFlow: document.querySelector(".routing-flow"),
        routingQueueName: document.getElementById("routingQueueName"),
        routingQueueDescription: document.getElementById("routingQueueDescription"),
        routingTargetStep: document.getElementById("routingTargetStep"),
        routingTargetIcon: document.getElementById("routingTargetIcon"),
        routingArrow: document.getElementById("routingArrow"),
        bypassBadge: document.getElementById("bypassBadge"),
        deflectionAlertCard: document.getElementById("deflectionAlertCard"),
        deflectionAlertText: document.getElementById("deflectionAlertText"),
        deflectionAlertBtn: document.getElementById("deflectionAlertBtn"),
        
        // Action Buttons
        btnCancel: document.getElementById("btnCancel"),
        btnSubmit: document.getElementById("btnSubmit"),
        
        // Modals & Drawers
        articleOffcanvas: document.getElementById("articleOffcanvas"),
        articleOffcanvasBody: document.getElementById("articleOffcanvasBody"),
        feedbackYesBtn: document.getElementById("feedbackYesBtn"),
        feedbackNoBtn: document.getElementById("feedbackNoBtn"),
        deflectionSuccessToast: document.getElementById("deflectionSuccessToast"),
        
        successModal: document.getElementById("successModal"),
        successTicketId: document.getElementById("successTicketId"),
        successQueueName: document.getElementById("successQueueName"),
        successSlaBadge: document.getElementById("successSlaBadge"),
        successSlaTime: document.getElementById("successSlaTime"),
        btnNewTicketAgain: document.getElementById("btnNewTicketAgain"),
        btnGoToTickets: document.getElementById("btnGoToTickets")
    };
    
    // Initialize bootstrap component wrappers
    if (DOM.articleOffcanvas) {
        articleOffcanvasInstance = new bootstrap.Offcanvas(DOM.articleOffcanvas);
    }
    if (DOM.successModal) {
        successModalInstance = new bootstrap.Modal(DOM.successModal);
    }
}

// 1. Tab Page Switcher
function setupPageSwitcher() {
    function showNewTicketPage() {
        DOM.openTicketPage.classList.remove("d-none");
        DOM.myTicketsPage.classList.add("d-none");
        DOM.navMyTickets.classList.remove("active");
        DOM.navNewTicket.classList.add("active");
    }

    function showMyTicketsPage() {
        DOM.openTicketPage.classList.add("d-none");
        DOM.myTicketsPage.classList.remove("d-none");
        DOM.navNewTicket.classList.remove("active");
        DOM.navMyTickets.classList.add("active");
        DOM.ticketCountBadge.textContent = STATE.createdTicketsCount;
    }

    if (DOM.navMyTickets) {
        DOM.navMyTickets.addEventListener("click", (e) => {
            e.preventDefault();
            showMyTicketsPage();
        });
    }

    if (DOM.navNewTicket) {
        DOM.navNewTicket.addEventListener("click", (e) => {
            e.preventDefault();
            showNewTicketPage();
        });
    }

    if (DOM.btnBackToNewTicket) {
        DOM.btnBackToNewTicket.addEventListener("click", showNewTicketPage);
    }
    
    if (DOM.btnCancel) {
        DOM.btnCancel.addEventListener("click", resetForm);
    }
}

// 2. Smart Search Deflection (incorporates public GitHub search issues API)
function setupSmartSearch() {
    let debounceTimeout = null;

    if (DOM.deflectionSearch) {
        DOM.deflectionSearch.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length > 0) {
                DOM.clearSearchBtn.classList.remove("d-none");
                DOM.searchLoader.classList.remove("d-none");
                
                // Debounce to optimize API requests
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    filterArticles(query);
                }, 350);
            } else {
                clearSearchState();
            }
        });

        DOM.clearSearchBtn.addEventListener("click", clearSearchState);

        // Hide recommendations dropdown on outer clicks
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
}

function clearSearchState() {
    DOM.deflectionSearch.value = "";
    DOM.clearSearchBtn.classList.add("d-none");
    DOM.searchLoader.classList.add("d-none");
    DOM.deflectionSuggestions.classList.remove("active");
}

function formatGithubMarkdown(md) {
    if (!md) return "<p>Sem descrição disponível.</p>";
    
    // Simple escape to avoid rendering raw HTML tags
    let html = md
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    // Headers replacement
    html = html.replace(/^### (.*?)$/gm, '<h6 class="fw-bold">$1</h6>');
    html = html.replace(/^## (.*?)$/gm, '<h5 class="fw-bold">$1</h5>');
    html = html.replace(/^# (.*?)$/gm, '<h4 class="fw-bold">$1</h4>');
    
    // Bold styles
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Block quotes and code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<div class="bg-slate text-light p-2 rounded mb-2 font-monospace fs-xs"><pre class="mb-0 text-wrap">$1</pre></div>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-light p-1 rounded font-monospace fs-xs">$1</code>');
    
    // List bullet points
    html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>');
    
    // Paragraph replacements
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
}

function filterArticles(query) {
    DOM.searchLoader.classList.remove("d-none");
    
    // 1. Local Search first
    const localMatches = KB_ARTICLES.filter(article => {
        return article.title.toLowerCase().includes(query) || 
               article.tags.some(tag => tag.toLowerCase().includes(query));
    });

    DOM.suggestionsList.innerHTML = "";

    if (localMatches.length > 0) {
        localMatches.forEach(article => {
            const item = document.createElement("div");
            item.className = "suggestion-item d-flex align-items-center gap-3 p-3 border-bottom";
            
            let moduleText = article.level2.toUpperCase();
            if (moduleText === "LOGIN") moduleText = "LOGIN / ACESSO";

            item.innerHTML = `
                <div class="bg-primary-100 text-primary rounded p-2"><i class="ph-file-text"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="fw-semibold text-dark text-truncate">${article.title}</div>
                    <div class="fs-xs text-muted">Tutorial interno de autoatendimento.</div>
                    <div class="mt-1 d-flex gap-1">
                        <span class="badge bg-light text-muted border"><i class="ph-tag me-1"></i> Base Interna</span>
                        <span class="badge bg-light text-muted border"><i class="ph-cpu me-1"></i> ${moduleText}</span>
                    </div>
                </div>
                <i class="ph-caret-right text-muted fs-sm"></i>
            `;
            item.addEventListener("click", () => {
                openArticleDrawer(article);
                DOM.deflectionSuggestions.classList.remove("active");
            });
            DOM.suggestionsList.appendChild(item);
        });
        DOM.deflectionSuggestions.classList.add("active");
    }

    // 2. Fetch from GitHub Search API (Free API)
    const githubApiUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}+is:issue&per_page=3`;
    
    fetch(githubApiUrl)
        .then(response => {
            if (!response.ok) throw new Error("API Limit Reached or Network error");
            return response.json();
        })
        .then(data => {
            DOM.searchLoader.classList.add("d-none");
            const issues = data.items || [];
            
            if (issues.length > 0) {
                // Divider header
                const divider = document.createElement("div");
                divider.className = "bg-light px-3 py-2 fs-xs fw-bold text-uppercase text-primary border-bottom";
                divider.innerHTML = `<i class="ph-github-logo me-1"></i> Discussões do GitHub (Comunidade)`;
                DOM.suggestionsList.appendChild(divider);
                
                issues.forEach(issue => {
                    const item = document.createElement("div");
                    item.className = "suggestion-item d-flex align-items-center gap-3 p-3 border-bottom";
                    
                    item.innerHTML = `
                        <div class="bg-dark-100 text-dark rounded p-2"><i class="ph-github-logo"></i></div>
                        <div class="flex-1 min-w-0">
                            <div class="fw-semibold text-dark text-truncate">${issue.title}</div>
                            <div class="fs-xs text-muted">Discussão pública sobre o erro.</div>
                            <div class="mt-1 d-flex gap-1">
                                <span class="badge bg-light text-muted border">Issue #${issue.number}</span>
                                <span class="badge bg-light text-muted border">@${issue.user.login}</span>
                            </div>
                        </div>
                        <i class="ph-arrow-square-out text-muted fs-sm"></i>
                    `;
                    
                    const simulatedArticle = {
                        id: `gh-${issue.id}`,
                        title: issue.title,
                        content: `
                            <h5>${issue.title}</h5>
                            <hr class="my-2">
                            <div class="d-flex gap-3 text-muted mb-3 fs-sm">
                                <span><i class="ph-github-logo me-1"></i> GitHub Issue #${issue.number}</span>
                                <span><i class="ph-user me-1"></i> Autor: @${issue.user.login}</span>
                                <span><i class="ph-chat-circle me-1"></i> ${issue.comments} comentários</span>
                            </div>
                            <div class="article-body-content">
                                <p><strong>Descrição da Issue no GitHub:</strong></p>
                                <div class="bg-light p-3 border rounded mb-3 fs-sm" style="max-height: 300px; overflow-y: auto;">
                                    ${formatGithubMarkdown(issue.body)}
                                </div>
                                <div class="alert alert-info border-start border-start-width-3 border-info rounded-0 p-3 mb-0">
                                    <div class="fw-bold mb-1"><i class="ph-arrow-square-out me-2"></i> Discussão Completa</div>
                                    Para ler todas as respostas de desenvolvedores e commits associados, acesse a discussão no GitHub.
                                    <br><br>
                                    <a href="${issue.html_url}" target="_blank" class="btn btn-sm btn-primary">Ver no GitHub <i class="ph-arrow-square-out ms-1"></i></a>
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
            
            if (localMatches.length === 0 && issues.length === 0) {
                renderEmptySearchState();
            }
        })
        .catch(err => {
            console.error("API error:", err);
            DOM.searchLoader.classList.add("d-none");
            
            if (localMatches.length === 0) {
                renderEmptySearchState();
            }
        });
}

function renderEmptySearchState() {
    DOM.suggestionsList.innerHTML = `
        <div class="text-center p-4">
            <i class="ph-info fs-1 text-muted mb-2"></i>
            <div class="fw-semibold">Nenhum tutorial encontrado</div>
            <div class="fs-xs text-muted mt-1">Preencha o formulário para abrir o chamado.</div>
        </div>
    `;
    DOM.deflectionSuggestions.classList.add("active");
}

// 3. Category cards selection (Passo 1)
function setupCategoryCards() {
    DOM.categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const cat = card.getAttribute("data-category");
            
            DOM.categoryCards.forEach(c => c.classList.remove("selected-card"));
            card.classList.add("selected-card");
            
            STATE.selectedCategory = cat;
            
            // Set styles dynamically for Passo 2
            let titleText = "Detalhes do Chamado";
            let subtitleText = "Preencha as informações detalhadamente";
            
            // Reset badge
            DOM.step2Badge.className = "badge me-2";
            
            if (cat === "problema") {
                titleText = "Detalhes do Chamado (Incidente)";
                subtitleText = "Algo parou de funcionar ou apresenta erros no ERP";
                DOM.step2Badge.classList.add("bg-danger-100", "text-danger");
                DOM.step2Badge.textContent = "INCIDENTE";
            } else if (cat === "servico") {
                titleText = "Detalhes do Chamado (Requisição de Serviço)";
                subtitleText = "Solicitações de acessos, cadastros e parametrizações";
                DOM.step2Badge.classList.add("bg-info-100", "text-info");
                DOM.step2Badge.textContent = "REQUISIÇÃO";
            } else if (cat === "financeiro") {
                titleText = "Detalhes do Chamado (Atendimento Comercial)";
                subtitleText = "Faturas, vencimento de faturas, licenças de ERP";
                DOM.step2Badge.classList.add("bg-success-100", "text-success");
                DOM.step2Badge.textContent = "COMERCIAL";
            }
            
            DOM.step2Title.textContent = titleText;
            DOM.step2Subtitle.textContent = subtitleText;
            
            // Populate module select
            populateLevel2(cat);
            
            // Show Step 2
            DOM.step2Section.classList.remove("collapsed");
            
            setTimeout(() => {
                DOM.step2Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    });
}

function populateLevel2(category) {
    DOM.selectLevel2.disabled = false;
    DOM.selectLevel2.innerHTML = '<option value="" disabled selected>Selecione o Módulo do ERP...</option>';
    
    DOM.selectLevel3.disabled = true;
    DOM.selectLevel3.innerHTML = '<option value="" disabled selected>Selecione o módulo ERP primeiro...</option>';
    DOM.level3Hint.textContent = "Selecione o módulo acima para ver as opções.";
    DOM.level3Hint.className = "form-text text-muted";
    
    const options = LEVEL2_DATA[category] || [];
    options.forEach(opt => {
        const el = document.createElement("option");
        el.value = opt.value;
        el.textContent = opt.text;
        DOM.selectLevel2.appendChild(el);
    });
    
    toggleInputs(false);
    updateSlaDisplay(null);
}

// 4. Cascading selects (Level 2 & 3)
function setupCascadingDropdowns() {
    DOM.selectLevel2.addEventListener("change", (e) => {
        const val = e.target.value;
        STATE.selectedLevel2 = val;
        
        populateLevel3(val);
        toggleInputs(false);
        
        // Show deflection alert badge if article matches
        checkDeflectionAlert(val);
    });
    
    DOM.selectLevel3.addEventListener("change", (e) => {
        const val = e.target.value;
        STATE.selectedLevel3 = val;
        
        const details = findLevel3Detail(STATE.selectedLevel2, val);
        if (details) {
            updateSlaDisplay(details);
            updateRoutingDisplay(details);
        }
        
        toggleInputs(true);
        validateForm();
    });
}

function populateLevel3(level2Value) {
    DOM.selectLevel3.disabled = false;
    DOM.selectLevel3.innerHTML = '<option value="" disabled selected>Selecione a situação exata...</option>';
    DOM.level3Hint.textContent = "Selecione a situação na lista de opções.";
    DOM.level3Hint.className = "form-text text-muted";
    
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

function toggleInputs(enabled) {
    DOM.ticketTitle.disabled = !enabled;
    DOM.ticketDescription.disabled = !enabled;
    
    if (enabled) {
        DOM.textareaHelpers.style.opacity = "1";
        DOM.textareaHelpers.style.pointerEvents = "all";
    } else {
        DOM.textareaHelpers.style.opacity = "0.4";
        DOM.textareaHelpers.style.pointerEvents = "none";
    }
}

function checkDeflectionAlert(level2Val) {
    const match = KB_ARTICLES.find(article => article.level2 === level2Val);
    if (match) {
        DOM.deflectionAlertText.textContent = `Temos o tutorial "${match.title}" na Base de Ajuda para resolver isso agora.`;
        DOM.deflectionAlertCard.classList.add("active");
        
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

// 5. SLA Calculator & Routing Dashboard
function updateSlaDisplay(details) {
    if (!details) {
        DOM.slaCard.className = "card sla-card";
        DOM.slaPriorityBadge.className = "badge bg-light text-muted border";
        DOM.slaPriorityText.textContent = "AGUARDANDO SELEÇÃO";
        DOM.slaTime.textContent = "--";
        DOM.slaExplanation.textContent = "Os tempos de resposta (SLA) serão calculados após definir o problema.";
        return;
    }
    
    const prio = details.priority;
    const time = details.sla;
    STATE.currentSla = `${prio.toUpperCase()} (SLA: ${time})`;
    
    DOM.slaTime.textContent = `Até ${time}`;
    
    if (prio === "Alta") {
        DOM.slaCard.className = "card sla-card border-danger bg-danger-100 bg-opacity-20";
        DOM.slaPriorityBadge.className = "badge bg-danger text-white";
        DOM.slaPriorityText.textContent = "🔴 PRIORIDADE ALTA";
        DOM.slaExplanation.textContent = "Incidentes de impacto crítico que bloqueiam a operação de faturamento ou login.";
    } else if (prio === "Média") {
        DOM.slaCard.className = "card sla-card border-warning bg-warning-100 bg-opacity-20";
        DOM.slaPriorityBadge.className = "badge bg-warning text-dark";
        DOM.slaPriorityText.textContent = "🟡 PRIORIDADE MÉDIA";
        DOM.slaExplanation.textContent = "Erros operacionais com impacto parcial em rotinas administrativas secundárias.";
    } else { // Baixa
        DOM.slaCard.className = "card sla-card border-success bg-success-100 bg-opacity-20";
        DOM.slaPriorityBadge.className = "badge bg-success text-white";
        DOM.slaPriorityText.textContent = "🟢 PRIORIDADE BAIXA";
        DOM.slaExplanation.textContent = "Dúvidas de uso geral, pequenos cadastros ou requisições gerais de novos módulos.";
    }
}

function updateRoutingDisplay(details) {
    if (!details) return;
    
    const queue = details.route;
    const isBypass = details.bypass;
    STATE.currentRoute = queue;
    
    DOM.routingQueueName.textContent = queue;
    
    if (isBypass) {
        DOM.routingQueueDescription.textContent = "Triagem automática via Bypass";
        DOM.routingFlow.classList.add("routed");
        DOM.routingTargetStep.className = "flow-step routed";
        DOM.routingTargetIcon.innerHTML = '<i class="ph-lightning"></i>';
        DOM.bypassBadge.style.display = "inline-flex";
    } else {
        DOM.routingQueueDescription.textContent = "Entra na fila padrão de analistas N1";
        DOM.routingFlow.classList.remove("routed");
        DOM.routingTargetStep.className = "flow-step";
        DOM.routingTargetIcon.innerHTML = '<i class="ph-headset"></i>';
        DOM.bypassBadge.style.display = "none";
    }
}

// 6. Form validation
function setupFormValidation() {
    const inputs = [DOM.ticketTitle, DOM.ticketDescription, DOM.selectLevel2, DOM.selectLevel3];
    inputs.forEach(i => {
        i.addEventListener("input", validateForm);
        i.addEventListener("change", validateForm);
    });
}

function validateForm() {
    const isValid = DOM.ticketForm.checkValidity() &&
                    STATE.selectedCategory &&
                    STATE.selectedLevel2 &&
                    STATE.selectedLevel3;
                    
    DOM.btnSubmit.disabled = !isValid;
}

// Description templates
function setupDescriptionTemplates() {
    const chips = DOM.textareaHelpers.querySelectorAll(".helper-chip");
    chips.forEach(c => {
        c.addEventListener("click", () => {
            const temp = c.getAttribute("data-template");
            if (temp === "incidente") {
                DOM.ticketDescription.value = `### Roteiro de Teste / Reprodução do Erro
1. Módulo / Tela:
2. Ações executadas:
3. Resultado obtido (Erro na tela):
4. Resultado esperado:
5. Copie e cole os logs de erro se aplicável:`;
            } else {
                DOM.ticketDescription.value = "";
            }
            validateForm();
            DOM.ticketDescription.focus();
        });
    });
}

// 7. Drag and drop uploads
function setupFileUpload() {
    const dz = DOM.fileDropzone;
    if (!dz) return;
    
    ['dragenter', 'dragover'].forEach(name => {
        dz.addEventListener(name, (e) => {
            e.preventDefault();
            dz.classList.add("dragover");
        });
    });
    
    ['dragleave', 'drop'].forEach(name => {
        dz.addEventListener(name, (e) => {
            e.preventDefault();
            dz.classList.remove("dragover");
        });
    });
    
    dz.addEventListener("drop", (e) => {
        handleFiles(e.dataTransfer.files);
    });
    
    DOM.fileInput.addEventListener("change", (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 10 * 1024 * 1024) {
            alert(`O arquivo ${file.name} excede o limite de 10MB.`);
            continue;
        }
        
        const fId = "f-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4);
        const fObj = {
            id: fId,
            name: file.name,
            size: formatBytes(file.size),
            raw: file
        };
        
        STATE.attachedFiles.push(fObj);
        renderAttachedFile(fObj);
    }
}

function renderAttachedFile(file) {
    const li = document.createElement("div");
    li.className = "d-flex align-items-center justify-content-between p-2 border rounded bg-white mb-2";
    li.id = file.id;
    
    let iconClass = "ph-file-image";
    if (file.name.endsWith(".pdf")) iconClass = "ph-file-pdf";
    else if (file.name.endsWith(".txt") || file.name.endsWith(".log")) iconClass = "ph-file-text";
    
    li.innerHTML = `
        <div class="d-flex align-items-center gap-2 flex-1 min-w-0">
            <div class="bg-light p-2 rounded"><i class="${iconClass}"></i></div>
            <div class="flex-1 min-w-0">
                <div class="fs-xs fw-semibold text-truncate mb-0">${file.name}</div>
                <div class="fs-10 text-muted" id="sz-${file.id}">Carregando arquivo (${file.size})...</div>
                <div class="file-progress-bar mt-1">
                    <div class="file-progress-fill" id="pg-${file.id}"></div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-icon btn-sm btn-light border-0 ms-2 text-danger"><i class="ph-trash-simple"></i></button>
    `;
    
    li.querySelector("button").addEventListener("click", () => {
        STATE.attachedFiles = STATE.attachedFiles.filter(f => f.id !== file.id);
        li.remove();
    });
    
    DOM.attachedFilesList.appendChild(li);
    
    // Simulate upload speed
    setTimeout(() => {
        const fill = document.getElementById(`pg-${file.id}`);
        const size = document.getElementById(`sz-${file.id}`);
        if (fill && size) {
            fill.style.width = "100%";
            setTimeout(() => {
                size.textContent = file.size;
                size.className = "fs-10 text-success fw-bold";
            }, 300);
        }
    }, 100);
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 8. Article Drawer Offcanvas
function setupArticleDrawer() {
    DOM.feedbackYesBtn.addEventListener("click", () => {
        STATE.deflectionCount++;
        articleOffcanvasInstance.hide();
        
        // Show success resolution toast
        showDeflectionSuccessToast();
        resetForm();
    });
    
    DOM.feedbackNoBtn.addEventListener("click", () => {
        articleOffcanvasInstance.hide();
        DOM.ticketTitle.focus();
    });
}

function openArticleDrawer(article) {
    activeArticle = article;
    DOM.articleOffcanvasBody.innerHTML = article.content;
    articleOffcanvasInstance.show();
}

function showDeflectionSuccessToast() {
    DOM.deflectionSuccessToast.classList.remove("d-none");
    DOM.deflectionSuccessToast.classList.add("show");
    
    setTimeout(() => {
        DOM.deflectionSuccessToast.classList.remove("show");
        setTimeout(() => {
            DOM.deflectionSuccessToast.classList.add("d-none");
        }, 300);
    }, 5000);
}

// 9. Form submit simulation
DOM.ticketForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (!DOM.btnSubmit.disabled) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const protocol = `APX-2026-${rand}`;
        const titleVal = DOM.ticketTitle.value;
        const level2Label = DOM.selectLevel2.options[DOM.selectLevel2.selectedIndex].text;
        
        // Populate modal data
        DOM.successTicketId.textContent = `#${protocol}`;
        DOM.successQueueName.textContent = STATE.currentRoute;
        DOM.successSlaBadge.textContent = STATE.currentSla.split(" (")[0];
        DOM.successSlaTime.textContent = DOM.slaTime.textContent;
        
        // Inject into My Tickets dashboard grid
        addNewTicketToGrid(protocol, titleVal, level2Label);
        
        STATE.createdTicketsCount++;
        
        // Open modal
        successModalInstance.show();
    }
});

function addNewTicketToGrid(protocol, title, level2) {
    const tr = document.createElement("tr");
    
    let prioClass = "bg-success text-white";
    if (STATE.currentSla.includes("Alta")) prioClass = "bg-danger text-white";
    else if (STATE.currentSla.includes("Média")) prioClass = "bg-warning text-dark";
    
    let catText = "Incidente";
    let catClass = "bg-danger-100 text-danger border-danger-200";
    if (STATE.selectedCategory === "servico") {
        catText = "Requisição";
        catClass = "bg-info-100 text-info border-info-200";
    } else if (STATE.selectedCategory === "financeiro") {
        catText = "Comercial";
        catClass = "bg-success-100 text-success border-success-200";
    }
    
    tr.innerHTML = `
        <td>
            <div class="fw-bold">#${protocol}</div>
            <span class="badge ${catClass} border fs-10 mt-1">${catText}</span>
        </td>
        <td>
            <div class="fw-bold">${title}</div>
            <div class="text-muted fs-xs">Aberto agora mesmo por Vinícius</div>
        </td>
        <td>
            <span class="badge bg-light text-dark border">${level2}</span>
        </td>
        <td>
            <span class="badge bg-primary-100 text-primary border">${STATE.currentRoute}</span>
        </td>
        <td>
            <span class="badge ${prioClass}">${STATE.currentSla.replace("SLA: ", "")}</span>
        </td>
        <td>
            <span class="badge bg-warning-100 text-warning border-warning-200 border">Aberto</span>
        </td>
        <td>
            <button type="button" class="btn btn-icon btn-sm btn-light border"><i class="ph-eye"></i></button>
        </td>
    `;
    
    DOM.ticketsTableBody.insertBefore(tr, DOM.ticketsTableBody.firstChild);
}

function setupSuccessModalActions() {
    DOM.btnNewTicketAgain.addEventListener("click", () => {
        successModalInstance.hide();
        resetForm();
    });
    
    DOM.btnGoToTickets.addEventListener("click", () => {
        successModalInstance.hide();
        resetForm();
        DOM.navMyTickets.click();
    });
}

function resetForm() {
    DOM.ticketForm.reset();
    
    STATE.selectedCategory = null;
    STATE.selectedLevel2 = null;
    STATE.selectedLevel3 = null;
    STATE.attachedFiles = [];
    
    DOM.categoryCards.forEach(c => c.classList.remove("selected-card"));
    
    DOM.selectLevel2.innerHTML = '<option value="" disabled selected>Selecione a categoria no Passo 1 primeiro...</option>';
    DOM.selectLevel2.disabled = true;
    
    DOM.selectLevel3.innerHTML = '<option value="" disabled selected>Selecione o módulo ERP primeiro...</option>';
    DOM.selectLevel3.disabled = true;
    
    DOM.level3Hint.textContent = "Selecione o módulo acima para ver as opções.";
    DOM.level3Hint.className = "form-text text-muted";
    
    toggleInputs(false);
    
    DOM.attachedFilesList.innerHTML = "";
    
    updateSlaDisplay(null);
    DOM.routingQueueName.textContent = "Fila de Triagem (N1)";
    DOM.routingQueueDescription.textContent = "Aguardando definição para rotear";
    DOM.routingFlow.classList.remove("routed");
    DOM.routingTargetStep.className = "flow-step";
    DOM.routingTargetIcon.innerHTML = '<i class="ph-headset"></i>';
    DOM.bypassBadge.style.display = "none";
    
    DOM.deflectionAlertCard.classList.remove("active");
    DOM.step2Section.classList.add("collapsed");
    
    clearSearchState();
    DOM.btnSubmit.disabled = true;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
