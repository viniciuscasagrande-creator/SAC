# 🏢 ApexERP - Central de Atendimento & SAC

Este repositório contém a especificação e implementação do módulo de **Central de Atendimento / Abertura de Chamados (SAC)** integrado ao sistema ERP corporativo da DiskIngressos, desenvolvido sob o template **Limitless (Layout 6)** e também integrado no projeto **produtor-disk (AdminLTE 3 / Yii2)**.

O objetivo do módulo é otimizar o fluxo de atendimento através da metodologia **"Shift-Left"**, estimulando o autoatendimento e reduzindo o tempo de resolução de chamados críticos via auto-roteamento (Bypass de triagem N1).

---

### 🎨 Esboço da Tela: "Central de Atendimento / Novo Chamado"

```text
====================================================================================
[ ☰ ERP Logo ] | 🔍 Pesquisar módulos, clientes ou chamados... | 🔔 [3] | 👤 Perfil 
====================================================================================

 📍 SAC > Abrir Novo Chamado

 [ 🔎 Como podemos ajudar? Digite seu problema aqui para buscar tutoriais... ] 
 (Ex: Como emitir nota fiscal, Erro 502, Resetar senha...)

------------------------------------------------------------------------------------
 PASSO 1: O QUE ESTÁ ACONTECENDO? (Categorias de Nível 1)
------------------------------------------------------------------------------------

 +----------------------------+  +----------------------------+  +----------------------------+
 | ⚠️ ESTOU COM UM PROBLEMA    |  | 📝 PRECISO DE UM SERVIÇO    |  | 💰 FINANCEIRO / DÚVIDAS     |
 | (Incidentes)               |  | (Requisições de Serviço)   |  | (Atendimento Comercial)    |
 |                            |  |                            |  |                            |
 | Algo parou de funcionar ou |  | Solicitação de acessos,    |  | Faturas, boletos, planos   |
 | está apresentando erro.    |  | novos cadastros e módulos. |  | e dúvidas gerais do ERP.   |
 +----------------------------+  +----------------------------+  +----------------------------+
```

---

### ⚙️ Comportamento Dinâmico (Ao clicar em um dos Cards)

Quando o usuário clica no card **"⚠️ ESTOU COM UM PROBLEMA"**, a tela se expande abaixo ou abre um painel lateral (Drawer) para afunilar o problema (CTI) e calcular o SLA invisivelmente.

```text
====================================================================================
 📝 DETALHES DO CHAMADO (Incidente)
====================================================================================

 1. Onde está o problema? (Tipo / Nível 2)
 [ ▼ Selecione o Módulo do ERP...                      ]
   ↳ Opções: Faturamento, Estoque, RH, Login/Acesso, Relatórios

 2. Qual é o problema exato? (Item / Nível 3)
 [ ▼ Selecione o problema...                           ]
   ↳ Opções (Se escolheu Login): Senha não funciona, Tela branca, Usuário bloqueado.

 ----------------------------------------------------------------------------------
 
 3. Título do Chamado
 [ Ex: Tela branca ao tentar logar no módulo de RH                                ]

 4. Descrição detalhada
 [ Descreva o que aconteceu, passos para reproduzir o erro, etc.                  ]
 [                                                                                ]
 [                                                                                ]

 📎 [ Anexar Print de Tela ou Log de Erro ]

 ----------------------------------------------------------------------------------
 ⏱️ EXPECTATIVA DE ATENDIMENTO (SLA Transparente)
 Baseado na sua seleção, este chamado será classificado como:
 [ 🔴 PRIORIDADE ALTA ] - Tempo estimado de resposta: Até 2 horas úteis.

                                            [ CANCELAR ]   [ 🚀 ABRIR CHAMADO ]
====================================================================================
```

---

### 🧠 Como programar as regras de TI e ITIL por trás dessa tela:

1. **A Busca Inteligente (Deflexão):** O campo de busca no topo está ligado à nossa Base de Conhecimento interna e à API externa do GitHub. Se o usuário digitar "Esqueci minha senha" ou "erro 502", o ERP sugere o artigo correspondente num painel lateral deslizante (*Offcanvas* ou *Drawer*) antes de deixá-lo preencher o resto da tela, reduzindo a incidência de chamados duplicados ou elementares.
2. **Combos Dependentes (Cascata):** O campo "Qual é o problema exato?" (Nível 3) só é habilitado *após* a seleção de "Onde está o problema?" (Nível 2). As opções carregadas no Nível 3 são dinamicamente vinculadas à categoria selecionada no Nível 1 e ao módulo selecionado no Nível 2.
3. **SLA Transparente:** Exibe em tempo real a criticidade estimada e o prazo de resposta com base na seleção da situação no Nível 3, reduzindo a ansiedade do usuário.
4. **Auto-Roteamento (Bypass N1):** Se `Card = Problema` + `Módulo = Faturamento` ou `Situação = Rejeição da SEFAZ`, o ticket é roteado diretamente para a fila N2 especialista (ex: *Suporte Fiscal & Tributário*), pulando a triagem geral de Nível 1.

---

## 📂 Arquivos no Projeto

A estrutura do módulo SAC está distribuída em duas grandes versões no repositório:

### 1. Versão Integrada ao Projeto Yii2 (`produtor-disk` / AdminLTE 3)
*   `produtor-disk/views/layouts/sidebar.php` - Adição do bloco de menu **"SAC"** na barra de navegação lateral do ERP.
*   `produtor-disk/modules/Chamados/controllers/IssuesController.php` - Método `actionSacNovoChamado()` responsável pela rota da tela de chamados do SAC.
*   `produtor-disk/modules/Chamados/views/issues/sac-novo-chamado.php` - Tela responsiva utilizando Bootstrap 4, FontAwesome 5, modal de confirmação nativo e integração persistente com o **Firebase Firestore**.

### 2. Versão Integrada ao Template `Limitless` (Layout 6)
*   `limitless/html/layout_6/full/sac_novo_chamado.html` - Página de chamados completa no template.
*   `limitless/html/layout_6/full/assets/css/ltr/custom_sac.css` - CSS de estilização de componentes adicionais (SLA, estrelas e timeline).
*   `limitless/html/layout_6/full/assets/js/sac_app.js` - Lógica das chamadas assíncronas, transições de abas, formulários operacionais integrados de finanças/eventos/catracas e sincronia Firebase.

### 3. Diretório de Referência de Documentos (OneDrive)
*   `C:\Users\vinad\OneDrive\Documentos\pdt\produtor-disk\views\layouts\sidebar.php` - Atualização realizada para sincronizar o **Menu SAC** na barra lateral de referência corporativa.

---

## 🚀 Como Executar e Testar (Servidor Ativo via npm start)

O servidor local HTTP está no ar. Você pode visualizar os protótipos em tempo real através dos seguintes links:

*   **Versão Limitless (Redirecionamento Padrão):** [https://brown-ties-own.loca.lt/index.html](https://brown-ties-own.loca.lt/index.html)
*   **Acesso Direto ao Painel Limitless:** [https://brown-ties-own.loca.lt/limitless/html/layout_6/full/sac_novo_chamado.html](https://brown-ties-own.loca.lt/limitless/html/layout_6/full/sac_novo_chamado.html)

*(Utilize o IP público de desvio **`168.194.161.207`** no prompt do localtunnel se solicitado)*
