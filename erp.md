# 🏢 ApexERP - Central de Atendimento & SAC

Este repositório contém a especificação e implementação do módulo de **Central de Atendimento / Abertura de Chamados** integrado ao sistema ERP corporativo ApexERP, desenvolvido sobre o template **Limitless (Layout 6)**.

O objetivo do módulo é otimizar o fluxo de atendimento através da metodologia **"Shift-Left"**, estimulando o autoatendimento e reduzindo o tempo de resolução de chamados críticos via auto-roteamento (Bypass de triagem N1).

---

## 🛠️ Tecnologias Utilizadas

*   **HTML5 & CSS3** (Estrutura semântica corporativa)
*   **Bootstrap 5** (Design e componentes responsivos do template Limitless)
*   **Phosphor Icons** (Pacote de ícones padrão do Layout 6)
*   **JavaScript (Vanilla ES6)** (Manipulação do DOM e integrações assíncronas)
*   **API Pública do GitHub** (Pesquisa dinâmica de issues da comunidade global)

---

## 📂 Arquivos no Projeto

A estrutura de arquivos do módulo SAC está dividida em duas versões no repositório:

### 1. Versão Integrada ao Template Limitless (Padrão ERP)
*   [sac_novo_chamado.html](file:///C:/Users/vinad/SAC/limitless/html/layout_6/full/sac_novo_chamado.html) - Tela de atendimento com cabeçalhos, painel de busca de autoatendimento, cards e formulários seguindo a estrutura visual do ERP.
*   [custom_sac.css](file:///C:/Users/vinad/SAC/limitless/html/layout_6/full/assets/css/ltr/custom_sac.css) - Estilos e animações adicionais (desenho do checkmark de sucesso, timelime de roteamento e cards de SLA).
*   [sac_app.js](file:///C:/Users/vinad/SAC/limitless/html/layout_6/full/assets/js/sac_app.js) - Lógica de busca na API do GitHub, cascading dropdowns, cálculo de SLA e transição de telas.

### 2. Versão Standalone (Cópia Independente)
*   [index.html](file:///C:/Users/vinad/SAC/index.html) - Protótipo com sidebar ERP customizada própria.
*   [styles.css](file:///C:/Users/vinad/SAC/styles.css) - Folha de estilos independente.
*   [app.js](file:///C:/Users/vinad/SAC/app.js) - Lógica JavaScript independente.

---

## ⚙️ Regras ITIL e Fluxos de Negócio Implementados

### 1. Pesquisa de Deflexão Inteligente (Shift-Left)
A barra de pesquisa principal incentiva a resolução autônoma do problema:
*   Faz buscas locais na base de conhecimento.
*   Consulta discussões de bugs e soluções na **API pública do GitHub**.
*   Renderiza o tutorial em um painel lateral deslizante (**Offcanvas** do Bootstrap 5).
*   Registra a deflexão (auto-resolução) e reseta o formulário caso o artigo solucione a dúvida.

### 2. Combos Dependentes (Cascata)
*   A seleção do card de Categoria (Passo 1) define as opções disponíveis no Módulo (Nível 2).
*   A seleção do Módulo libera o select do Item Exato (Nível 3).
*   Os campos de Título, Descrição e Anexo só são habilitados após a definição completa do problema.

### 3. Calculadora de SLA e Roteamento Bypass N1
*   **SLA dinâmico:** Calcula e exibe instantaneamente a prioridade (Alta, Média, Baixa), tempo limite de resposta e políticas de conformidade.
*   **Bypass de Triagem N1:** Se a situação configurada no Nível 3 for crítica (ex: *Transmissão SEFAZ, erros de login ou upgrades de conta*), o sistema contorna a fila de triagem geral N1, ativando uma badge visual e encaminhando o ticket diretamente para a fila N2 especialista.

---

## 🚀 Como Executar e Testar

### Servidor Local
Um servidor local já está ativo a partir do diretório raiz. Para testar as telas, acesse os links correspondentes no seu navegador:

*   **Versão Limitless (ERP Padrão):** [http://127.0.0.1:8080/limitless/html/layout_6/full/sac_novo_chamado.html](http://127.0.0.1:8080/limitless/html/layout_6/full/sac_novo_chamado.html)
*   **Versão Standalone:** [http://127.0.0.1:8080/index.html](http://127.0.0.1:8080/index.html)

---

## 📦 Hospedagem e Publicação (GitHub Pages)

Para publicar esta aplicação online no seu perfil do GitHub, execute os seguintes comandos no terminal:

```bash
# 1. Autenticar no GitHub CLI
gh auth login

# 2. Criar o repositório remoto e enviar os arquivos
gh repo create SAC --public --source=. --remote=origin --push

# 3. Habilitar a publicação via GitHub Pages
gh repo edit --enable-pages --publish
```

Seu link de acesso público estará disponível em:
`https://<seu-usuario-github>.github.io/SAC/limitless/html/layout_6/full/sac_novo_chamado.html`
