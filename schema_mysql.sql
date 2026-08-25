-- ==========================================================
-- MySQL Database Schema for SAC (DiskIngressos / ApexERP)
-- ==========================================================

-- 1. Tabela: tickets (Chamados de SAC/Suporte)
CREATE TABLE IF NOT EXISTS `tickets` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100),
    `subcategory` VARCHAR(100),
    `module` VARCHAR(100),
    `client` VARCHAR(255),
    `cpf` VARCHAR(20),
    `description` TEXT,
    `sla` VARCHAR(50),
    `priority` VARCHAR(50),
    `queue` VARCHAR(100),
    `status` VARCHAR(50) DEFAULT 'Aberto',
    `bypass` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_tickets_status` (`status`),
    INDEX `idx_tickets_cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela: estornos (Solicitações de Estorno / Reembolso)
CREATE TABLE IF NOT EXISTS `estornos` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `order_id` VARCHAR(50),
    `client` VARCHAR(255),
    `show` VARCHAR(255),
    `value` DECIMAL(10, 2),
    `gateway` VARCHAR(100),
    `net_refund` DECIMAL(10, 2),
    `status` VARCHAR(50) DEFAULT 'Em Processamento',
    `motivo` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_estornos_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela: clientes (Cadastro de Clientes)
CREATE TABLE IF NOT EXISTS `clientes` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(20) UNIQUE,
    `email` VARCHAR(255),
    `telefone` VARCHAR(50),
    `cidade` VARCHAR(100),
    `nivel` VARCHAR(50),
    `total_compras` DECIMAL(10, 2) DEFAULT 0.00,
    `pedidos_realizados` INT DEFAULT 0,
    `status` VARCHAR(50) DEFAULT 'Ativo',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_clientes_cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabela: eventos (Shows e Festivais)
CREATE TABLE IF NOT EXISTS `eventos` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `produtor` VARCHAR(255),
    `local` VARCHAR(255),
    `data` VARCHAR(50),
    `capacidade` INT DEFAULT 0,
    `ingressos_vendidos` INT DEFAULT 0,
    `receita_bruta` DECIMAL(12, 2) DEFAULT 0.00,
    `status` VARCHAR(50) DEFAULT 'Ativo',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabela: orders (Pedidos de Ingressos)
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `pedido` INT,
    `cliente` VARCHAR(255),
    `evento` VARCHAR(255),
    `qtd_ingressos` INT DEFAULT 1,
    `valor` DECIMAL(10, 2) DEFAULT 0.00,
    `forma_pagamento` VARCHAR(50),
    `status` VARCHAR(50) DEFAULT 'PENDENTE',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_orders_pedido` (`pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabela: payments (Transações de Pagamento)
CREATE TABLE IF NOT EXISTS `payments` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `pedido` INT,
    `gateway` VARCHAR(100),
    `adquirente` VARCHAR(100),
    `status` VARCHAR(50) DEFAULT 'PENDING',
    `nsu` VARCHAR(100),
    `tid` VARCHAR(100),
    `parcelas` INT DEFAULT 1,
    `valor` DECIMAL(10, 2) DEFAULT 0.00,
    `taxa_gateway` DECIMAL(10, 2) DEFAULT 0.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_payments_pedido` (`pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabela: repasses (Repasses aos Produtores)
CREATE TABLE IF NOT EXISTS `repasses` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `evento_id` VARCHAR(50),
    `evento_nome` VARCHAR(255),
    `produtor` VARCHAR(255),
    `valor` DECIMAL(12, 2) DEFAULT 0.00,
    `status` VARCHAR(50) DEFAULT 'Pendente',
    `conta_destino` VARCHAR(255),
    `data_solicitacao` VARCHAR(50),
    `data_pagamento` VARCHAR(50),
    `comprovante` VARCHAR(100),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabela: logs (Auditoria e Atividades)
CREATE TABLE IF NOT EXISTS `logs` (
    `id` VARCHAR(50) NOT NULL PRIMARY KEY,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) DEFAULT 'user_action',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
