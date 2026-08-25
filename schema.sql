-- ==========================================================
-- PostgreSQL Database Schema for SAC (DiskIngressos / ApexERP)
-- ==========================================================

-- 1. Tabela: tickets (Chamados de SAC/Suporte)
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    module VARCHAR(100),
    client VARCHAR(255),
    cpf VARCHAR(20),
    description TEXT,
    sla VARCHAR(50),
    priority VARCHAR(50),
    queue VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Aberto',
    bypass BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela: estornos (Solicitações de Estorno / Reembolso)
CREATE TABLE IF NOT EXISTS estornos (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50),
    client VARCHAR(255),
    show VARCHAR(255),
    value NUMERIC(10, 2),
    gateway VARCHAR(100),
    net_refund NUMERIC(10, 2),
    status VARCHAR(50) DEFAULT 'Em Processamento',
    motivo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela: clientes (Cadastro de Clientes)
CREATE TABLE IF NOT EXISTS clientes (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(20) UNIQUE,
    email VARCHAR(255),
    telefone VARCHAR(50),
    cidade VARCHAR(100),
    nivel VARCHAR(50),
    total_compras NUMERIC(10, 2) DEFAULT 0,
    pedidos_realizados INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela: eventos (Shows e Festivais)
CREATE TABLE IF NOT EXISTS eventos (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    produtor VARCHAR(255),
    local VARCHAR(255),
    data VARCHAR(50),
    capacidade INT DEFAULT 0,
    ingressos_vendidos INT DEFAULT 0,
    receita_bruta NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela: orders (Pedidos de Ingressos)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    pedido INT,
    cliente VARCHAR(255),
    evento VARCHAR(255),
    qtd_ingressos INT DEFAULT 1,
    valor NUMERIC(10, 2) DEFAULT 0,
    forma_pagamento VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDENTE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela: payments (Transações de Pagamento)
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(50) PRIMARY KEY,
    pedido INT,
    gateway VARCHAR(100),
    adquirente VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    nsu VARCHAR(100),
    tid VARCHAR(100),
    parcelas INT DEFAULT 1,
    valor NUMERIC(10, 2) DEFAULT 0,
    taxa_gateway NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela: repasses (Repasses aos Produtores)
CREATE TABLE IF NOT EXISTS repasses (
    id VARCHAR(50) PRIMARY KEY,
    evento_id VARCHAR(50),
    evento_nome VARCHAR(255),
    produtor VARCHAR(255),
    valor NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pendente',
    conta_destino VARCHAR(255),
    data_solicitacao VARCHAR(50),
    data_pagamento VARCHAR(50),
    comprovante VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabela: logs (Auditoria e Atividades)
CREATE TABLE IF NOT EXISTS logs (
    id VARCHAR(50) PRIMARY KEY,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'user_action',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação de Índices para performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_cpf ON tickets(cpf);
CREATE INDEX IF NOT EXISTS idx_estornos_order ON estornos(order_id);
CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_orders_pedido ON orders(pedido);
CREATE INDEX IF NOT EXISTS idx_payments_pedido ON payments(pedido);
