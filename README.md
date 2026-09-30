# 📄 NotaVision - Processamento Inteligente de Notas Fiscais

O **NotaVision** é um sistema web inteligente desenvolvido para automatizar a leitura, extração e estruturação de dados de Notas Fiscais Eletrônicas (NF-e) utilizando Inteligência Artificial. Este projeto foi desenvolvido como requisito de avaliação (N2) para a disciplina de **Prática de Engenharia de Software**.

---

## 🎯 Objetivo do Projeto

O objetivo principal do NotaVision é eliminar o trabalho manual de digitação de notas fiscais em sistemas gerenciais. O sistema recebe arquivos de notas fiscais (PDF) e utiliza modelos de linguagem de grande escala (LLMs) para extrair os principais dados financeiros, retornando-os em um formato estruturado (JSON) padronizado.

Para garantir alta disponibilidade, a arquitetura conta com um **Mecanismo de Fallback (Contingência)** que entra em ação automaticamente caso a API de Inteligência Artificial fique indisponível, garantindo que o fluxo de trabalho do usuário nunca seja interrompido.

---

## 🚀 Tecnologias Utilizadas

### Backend (Cérebro do Sistema)
*   **Python 3** - Linguagem base do servidor.
*   **Django** - Framework web responsável pelo roteamento, segurança e lógica de negócio.
*   **Google Gemini 1.5 Pro API** - IA encarregada de ler e interpretar o contexto da Nota Fiscal.
*   **pdfplumber** - Biblioteca de contingência para extração textual local de PDFs.

### Frontend (Interface de Usuário)
*   **HTML5 / CSS3** - Estruturação e estilização com design moderno (Glassmorphism).
*   **Vanilla JavaScript** - Lógica assíncrona (AJAX/Fetch) para comunicação fluida com a API sem recarregar a página (Single Page Application).
*   **FontAwesome** - Ícones vetoriais.

---

## 🛠️ Arquitetura e Funcionalidades

1. **Autenticação Simulada:** O sistema conta com uma tela de login moderna que gerencia tokens JWT simulados no `localStorage` para proteger a rota principal.
2. **Upload Inteligente:** Interface drag-and-drop para envio da NF-e em formato PDF.
3. **Extração via Inteligência Artificial:** Ao receber o arquivo, o backend se comunica via SDK oficial do Google GenAI para processar o documento.
4. **Fallback de Contingência:** Caso a chave de API seja revogada ou a rede bloqueie a comunicação externa (ex: bloqueios corporativos/educacionais), o sistema redireciona a extração para um interpretador local que utiliza expressões regulares (Regex) para garimpar os dados do PDF, devolvendo o JSON sem falhas.
5. **Renderização Dupla:** Os dados extraídos podem ser visualizados de duas formas:
   *   **Cards Visuais:** Interface amigável e colorida separada por blocos (Fornecedor, Faturado, Valores).
   *   **Código JSON:** Visualização crua para desenvolvedores validarem a estrutura dos dados retornados.

---
## HOSPEDAGEM

https://trabalho-paraiba-1.onrender.com

## ⚙️ Como Executar o Projeto Localmente

Para rodar este projeto na sua máquina, certifique-se de ter o Python instalado e siga os passos abaixo:

1. **Clone o repositório:**
```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
