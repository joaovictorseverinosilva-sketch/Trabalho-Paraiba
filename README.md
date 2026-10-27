# NotaVision - Sistema Administrativo-Financeiro (Avaliação N2)

Sistema desenvolvido para atender aos requisitos da **Avaliação N2 (1ª e 2ª Etapas)** do curso da **Universidade de Rio Verde (UniRV)**.

---

## 📌 Funcionalidades Implementadas

### 🔹 1ª Etapa: Extração Inteligente com LLM Gemini
- **Upload de Notas Fiscais (PDF):** Suporte a DANFE, NF-e e boletos de despesas.
- **Extração com Gemini AI ou Contingência Local:**
  - Extração de Emitente/Fornecedor (Razão Social, Nome Fantasia, CNPJ).
  - Extração de Destinatário/Faturado (Nome Completo, CPF/CNPJ).
  - Dados da Nota: Número, Data de Emissão, Data de Vencimento, Valor Total, Parcelas.
  - Classificação inteligente de despesas com base na descrição dos produtos.
- **Exportação:** Cópia e download estruturado em formato `.JSON`.

---

### 🔹 2ª Etapa: Análise de Dados e Lançamento Automático
Conforme especificado nas instruções da 2ª Etapa:
- **Consulta no Banco de Dados:**
  - **FORNECEDOR:** Consulta por CNPJ / Razão Social e informa status na tela (`EXISTE – ID: XX` ou `NÃO EXISTE`).
  - **FATURADO:** Consulta por CPF / Nome e informa status na tela (`EXISTE – ID: XX` ou `NÃO EXISTE`).
  - **DESPESA:** Consulta a classificação da despesa no banco (`EXISTE – ID: XX` ou `NÃO EXISTE`).
- **Lançamento Automático em 1 Clique (`LANÇAR NO BANCO`):**
  1. Cria o novo Fornecedor caso não exista.
  2. Cria o novo Faturado caso não exista.
  3. Cria a nova Despesa caso não exista.
  4. Registra o **Movimento de Contas** (`Tipo: APAGAR`, valor, emissão, produtos).
  5. Cria a **Parcela de Contas** com identificação única (`NF-...-P1-MOV...`) e vencimento.
  6. Emite notificação de sucesso e atualiza a tela com os IDs vinculados.

---

### 🔹 Módulos de Manutenção (CRUDs) & Regras de Negócio
Atende 100% às recomendações de layout:
- **MANTER PESSOAS (`/pessoas/`):** Gestão de Fornecedores, Clientes e Faturados.
- **MANTER CLASSIFICAÇÃO (`/classificacoes/`):** Gestão de Tipos de Despesas e Receitas.
- **REGISTRAR CONTAS (`/contas/`):** Contas a Pagar e a Receber com suporte a **uma ou mais Classificações** e **uma ou mais Parcelas** com vencimentos distintos.

#### Regras de Negócio e Layout:
1. **Exclusão Lógica:** Cadastros nunca são apagados fisicamente (`STATUS = INATIVO`).
2. **Reativação:** Possibilidade de reativar registros inativos (`STATUS = ATIVO`).
3. **Tabela Inicialmente Vazia:** A tabela abre vazia e carrega via campo de Busca ou botão **TODOS**.
4. **TODOS Carrega Ativos:** O botão "TODOS" lista apenas os registros com `STATUS = ATIVO`.
5. **Indexação por Coluna:** Cabeçalhos da tabela são clicáveis para ordenação ascendente/descendente.
6. **Busca por Múltiplos Elementos:** Pesquisa simultânea por nome, documento, tipo ou status.
7. **Campos de Status Ocultos:** No cadastro (`CREATE`) o campo status é oculto com valor padrão `ATIVO`, e no `UPDATE` permanece oculto.

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
   Abra o navegador em: https://trabalho-paraiba-1.onrender.com
---

## 📂 Estrutura do Banco de Dados
- **`Pessoa`**: Razão Social, Nome Fantasia, CPF/CNPJ, Tipo (`FORNECEDOR`, `CLIENTE`, `FATURADO`, `CLIENTE-FORNECEDOR`), Status (`ATIVO`, `INATIVO`).
- **`Classificacao`**: Tipo (`DESPESA`, `RECEITA`), Descrição, Status (`ATIVO`, `INATIVO`).
- **`MovimentoContas`**: Tipo (`APAGAR`, `RECEBER`), Nº Documento, Descrição, Data de Emissão, Valor Total, Pessoa (FK), Faturado (FK), Classificações (ManyToMany), Status.
- **`ParcelaContas`**: Movimento (FK), Identificação Única, Número da Parcela, Valor, Data de Vencimento, Status.
