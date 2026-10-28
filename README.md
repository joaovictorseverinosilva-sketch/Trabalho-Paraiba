# NotaVision - Sistema Administrativo-Financeiro (Avaliação N2)

Sistema desenvolvido para atender aos requisitos da **Avaliação N2 (1ª e 2ª Etapas)** do curso da **Universidade de Rio Verde (UniRV)**.

> **Design & Interface:** 100% reformulada e espelhada no **Farm-Fin Design System**, implementando arquitetura com **AppShell**, barra lateral retrátil (Sidebar), cabeçalho com Breadcrumbs e Commit Badge, cartões em **Claymorphism** suave, suporte a **Modo Noturno / Claro**, notificações **Toast** e paleta com identidade visual exclusiva do **NotaVision** (Indigo, Violeta, Slate e Esmeralda).

---

## 📌 Funcionalidades Implementadas

### 🔹 1ª Etapa: Extração Inteligente com LLM Gemini / Contingência Local
- **Upload de Notas Fiscais (PDF):** Suporte a DANFE, NF-e de insumos, maquinários e serviços com Drag & Drop intuitivo.
- **Botão de Teste do Professor:** Carregamento imediato com 1 clique da DANFE de teste (`DANFE_000084682_IGUACU_teste_professor.pdf` - Iguaçu Máquinas Agrícolas Ltda).
- **Extração com Gemini AI ou Contingência Local:**
  - Extração de Emitente/Fornecedor (Razão Social, Nome Fantasia, CNPJ).
  - Extração de Destinatário/Faturado (Nome Completo, CPF/CNPJ).
  - Dados da Nota: Número, Data de Emissão, Data de Vencimento, Valor Total, Parcelas.
  - Classificação inteligente de despesas nas **9 Categorias Oficiais**.
- **Exportação:** Cópia para área de transferência e download estruturado em formato `.JSON`.

---

### 🔹 2ª Etapa: Análise de Dados e Lançamento Automático
Conforme especificado nas instruções da 2ª Etapa:
- **Consulta no Banco de Dados em Tempo Real:**
  - **FORNECEDOR:** Consulta por CNPJ / Razão Social com badges dinâmicos (`EXISTE – ID: XX` ou `NÃO EXISTE · Criará novo`).
  - **FATURADO:** Consulta por CPF / Nome com badges dinâmicos (`EXISTE – ID: XX` ou `NÃO EXISTE · Criará novo`).
  - **DESPESA:** Consulta a classificação da despesa no banco (`EXISTE – ID: XX` ou `NÃO EXISTE · Criará nova`).
- **Lançamento Automático em 1 Clique (`LANÇAR NO BANCO`):**
  1. Cria o novo Fornecedor caso não exista.
  2. Cria o novo Faturado caso não exista.
  3. Cria a nova Despesa caso não exista.
  4. Registra o **Movimento de Contas** (`Tipo: APAGAR`, valor, emissão, produtos).
  5. Cria a **Parcela de Contas** com identificação única (`NF-...-P1`) e vencimento.
  6. Emite notificação de sucesso e atualiza a tela com os IDs vinculados.

---

### 🔹 Módulos de Manutenção (CRUDs) & Regras de Negócio
Layout e UX espelhados nos componentes de CRUD do Farm-Fin:
- **MANTER PESSOAS (`/pessoas/`):** Gestão de Fornecedores, Clientes e Faturados.
- **MANTER CLASSIFICAÇÃO (`/classificacoes/`):** Gestão de Tipos de Despesas e Receitas.
- **REGISTRAR CONTAS (`/contas/`):** Contas a Pagar e a Receber com suporte a **uma ou mais Classificações** (ManyToMany) e **uma ou mais Parcelas** com vencimentos distintos.

#### Regras de Negócio e Layout:
1. **Exclusão Lógica:** Cadastros nunca são apagados fisicamente (`STATUS = INATIVO`).
2. **Reativação:** Possibilidade de reativar registros inativos (`STATUS = ATIVO`).
3. **Tabela Inicialmente Vazia:** A tabela abre vazia e carrega via campo de Busca ou botão **TODOS**.
4. **TODOS Carrega Ativos:** O botão "TODOS" lista apenas os registros com `STATUS = ATIVO`.
5. **Indexação por Coluna:** Cabeçalhos da tabela são clicáveis para ordenação ascendente/descendente com indicadores visuais.
6. **Busca por Múltiplos Elementos:** Pesquisa simultânea por nome, documento, tipo ou status.
7. **Campos de Status Ocultos:** No cadastro (`CREATE`) o campo status é oculto com valor padrão `ATIVO`, e no `UPDATE` permanece oculto.

---

## 🎨 Design System & Estética (Espelhado Farm-Fin)
- **Clay Design System:** Efeitos de profundidade suave, bordas arredondadas e cartões com sombras delicadas.
- **AppShell Responsivo:** Barra lateral com seções colapsáveis, badges de contagem e gaveta retrátil para dispositivos móveis.
- **Paleta de Cores NotaVision:**
  - Primária: `#6366f1` / `#4f46e5` (Índigo e Violeta Elétrico)
  - Secundária: `#1e293b` / `#0f172a` (Slate Escuro e Grafite)
  - Acentos: `#10b981` (Esmeralda), `#14b8a6` (Teal), `#f59e0b` (Âmbar) e `#ef4444` (Coral)
- **Modo Noturno / Claro:** Alternância suave com persistência local (`localStorage`).

---

## 🚀 Como Executar o Projeto Localmente

1. **Pré-requisitos:**
   - Python 3.11+ instalado.

2. **Instalação das dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Execução das Migrações:**
   ```bash
   python manage.py migrate
   ```

4. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   python manage.py runserver
   ```

5. **Acesso:**
   - Local: `http://127.0.0.1:8000/`
   - Produção: [https://trabalho-paraiba-1.onrender.com](https://trabalho-paraiba-1.onrender.com)

---

## 📂 Estrutura do Banco de Dados
- **`Pessoa`**: Razão Social, Nome Fantasia, CPF/CNPJ, Tipo (`FORNECEDOR`, `CLIENTE`, `FATURADO`, `CLIENTE-FORNECEDOR`), Status (`ATIVO`, `INATIVO`).
- **`Classificacao`**: Tipo (`DESPESA`, `RECEITA`), Descrição, Status (`ATIVO`, `INATIVO`).
- **`MovimentoContas`**: Tipo (`APAGAR`, `RECEBER`), Nº Documento, Descrição, Data de Emissão, Valor Total, Pessoa (FK), Faturado (FK), Classificações (ManyToMany), Status.
- **`ParcelaContas`**: Movimento (FK), Identificação Única, Número da Parcela, Valor, Data de Vencimento, Status.
