document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('AUTH_TOKEN');
    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.endsWith('/login.html') || 
                       path.endsWith('/register.html') || 
                       path.endsWith('/login') || 
                       path.endsWith('/register');

    if (!authToken && !isAuthPage) {
        window.location.replace('/login.html');
        return;
    }

    const API_BASE_URL = '';

    const dropZone = document.getElementById('dropZone');
    const pdfInput = document.getElementById('pdfInput');
    const btnBrowse = document.getElementById('btnBrowse');
    const fileInfoCard = document.getElementById('fileInfoCard');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const fileSizeDisplay = document.getElementById('fileSizeDisplay');
    const btnRemoveFile = document.getElementById('btnRemoveFile');
    const btnExtract = document.getElementById('btnExtract');
    const btnSpinner = document.getElementById('btnSpinner');

    const btnSampleManutencao = document.getElementById('btnSampleManutencao');
    const btnSampleInsumos = document.getElementById('btnSampleInsumos');

    const resultsSection = document.getElementById('resultsSection');
    const extractionSourceBadge = document.getElementById('extractionSourceBadge');
    const tabFormattedBtn = document.getElementById('tabFormattedBtn');
    const tabJsonBtn = document.getElementById('tabJsonBtn');
    const tabFormatted = document.getElementById('tabFormatted');
    const tabJson = document.getElementById('tabJson');

    const formattedCategoria = document.getElementById('formattedCategoria');
    const formattedTermos = document.getElementById('formattedTermos');
    const formattedEmitente = document.getElementById('formattedEmitente');
    const formattedFantasia = document.getElementById('formattedFantasia');
    const formattedCnpjEmitente = document.getElementById('formattedCnpjEmitente');
    const formattedDestinatario = document.getElementById('formattedDestinatario');
    const formattedCpfDestinatario = document.getElementById('formattedCpfDestinatario');
    const formattedNumeroNf = document.getElementById('formattedNumeroNf');
    const formattedDataEmissao = document.getElementById('formattedDataEmissao');
    const formattedDataVencimento = document.getElementById('formattedDataVencimento');
    const formattedValorTotal = document.getElementById('formattedValorTotal');
    const formattedParcelas = document.getElementById('formattedParcelas');
    const formattedDescricaoProdutos = document.getElementById('formattedDescricaoProdutos');

    const jsonCodeDisplay = document.getElementById('jsonCodeDisplay');
    const btnCopyJson = document.getElementById('btnCopyJson');
    const btnDownloadJson = document.getElementById('btnDownloadJson');

    const btnConfigModal = document.getElementById('btnConfigModal');
    const apiModal = document.getElementById('apiModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelKey = document.getElementById('btnCancelKey');
    const btnSaveKey = document.getElementById('btnSaveKey');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const btnToggleKey = document.getElementById('btnToggleKey');
    const apiStatusText = document.getElementById('apiStatusText');
    const apiStatusDot = document.getElementById('apiStatusDot');

    // Elementos da 2ª Etapa
    const etapa2Section = document.getElementById('etapa2Section');
    const etapa2FornecedorNome = document.getElementById('etapa2FornecedorNome');
    const etapa2FornecedorDoc = document.getElementById('etapa2FornecedorDoc');
    const etapa2FornecedorBadge = document.getElementById('etapa2FornecedorBadge');

    const etapa2FaturadoNome = document.getElementById('etapa2FaturadoNome');
    const etapa2FaturadoDoc = document.getElementById('etapa2FaturadoDoc');
    const etapa2FaturadoBadge = document.getElementById('etapa2FaturadoBadge');

    const etapa2DespesaNome = document.getElementById('etapa2DespesaNome');
    const etapa2DespesaTipo = document.getElementById('etapa2DespesaTipo');
    const etapa2DespesaBadge = document.getElementById('etapa2DespesaBadge');

    const btnLancarBanco = document.getElementById('btnLancarBanco');
    const btnLancarText = document.getElementById('btnLancarText');
    const btnReconsultarBanco = document.getElementById('btnReconsultarBanco');
    const etapa2SuccessCard = document.getElementById('etapa2SuccessCard');
    const successTagsContainer = document.getElementById('successTagsContainer');

    let currentSelectedFile = null;
    let latestExtractedJson = null;

    async function checkApiStatus() {
        const savedKey = localStorage.getItem('GEMINI_USER_API_KEY');
        if (savedKey) {
            if (apiKeyInput) apiKeyInput.value = savedKey;
            if (apiStatusDot) apiStatusDot.classList.add('active');
            if (apiStatusText) apiStatusText.textContent = 'API Gemini: Conectada';
            return;
        }

        try {
            const resp = await fetch(`${API_BASE_URL}/api/status`);
            const data = await resp.json();
            if (data.has_gemini_key) {
                if (apiStatusDot) apiStatusDot.classList.add('active');
                if (apiStatusText) apiStatusText.textContent = 'API Gemini: Ativa';
            } else {
                if (apiStatusDot) apiStatusDot.classList.remove('active');
                if (apiStatusText) apiStatusText.textContent = 'Modo Demonstrativo (Local)';
            }
        } catch (e) {
            console.warn('Não foi possível verificar status da API:', e);
        }
    }
    checkApiStatus();

    function handleFile(file) {
        if (!file) return;

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            showToast('Por favor, selecione um arquivo no formato PDF.', 'error');
            return;
        }

        currentSelectedFile = file;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

        fileNameDisplay.textContent = file.name;
        fileSizeDisplay.textContent = `${sizeMb} MB`;

        fileInfoCard.classList.remove('hidden');
        btnExtract.disabled = false;
        showToast(`Arquivo "${file.name}" pronto para extração.`, 'info');
    }

    if (btnBrowse) {
        btnBrowse.addEventListener('click', (e) => {
            e.stopPropagation();
            pdfInput.click();
        });
    }

    if (dropZone) {
        dropZone.addEventListener('click', () => {
            pdfInput.click();
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('dragover');
            });
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files && dt.files[0]) {
                handleFile(dt.files[0]);
            }
        });
    }

    if (pdfInput) {
        pdfInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        });
    }

    if (btnRemoveFile) {
        btnRemoveFile.addEventListener('click', () => {
            currentSelectedFile = null;
            pdfInput.value = '';
            fileInfoCard.classList.add('hidden');
            btnExtract.disabled = true;
        });
    }

    // PDFs de exemplo rápido
    if (btnSampleManutencao) {
        btnSampleManutencao.addEventListener('click', () => {
            const mockFile = new File(["pdf content"], "danfe (ciclano - pecas).pdf", { type: "application/pdf" });
            handleFile(mockFile);
        });
    }

    if (btnSampleInsumos) {
        btnSampleInsumos.addEventListener('click', () => {
            const mockFile = new File(["pdf content"], "nota_fiscal_insumos.pdf", { type: "application/pdf" });
            handleFile(mockFile);
        });
    }

    // EXTRAÇÃO (1ª ETAPA)
    if (btnExtract) {
        btnExtract.addEventListener('click', async () => {
            if (!currentSelectedFile) {
                showToast('Selecione um arquivo PDF antes de extrair.', 'error');
                return;
            }

            btnExtract.disabled = true;
            btnExtract.querySelector('.btn-text').classList.add('hidden');
            btnSpinner.classList.remove('hidden');

            const formData = new FormData();
            formData.append('pdf_file', currentSelectedFile);

            const customKey = localStorage.getItem('GEMINI_USER_API_KEY');
            const headers = {};
            if (customKey) {
                headers['X-Gemini-Key'] = customKey;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/extrair/`, {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });

                if (!response.ok) {
                    let errorMsg = `Erro ${response.status}: ${response.statusText}`;
                    try {
                        const errData = await response.json();
                        errorMsg = errData.error || errorMsg;
                    } catch (_) {}
                    throw new Error(errorMsg);
                }

                const data = await response.json();
                latestExtractedJson = data;

                renderResults(data);
                showToast('Dados extraídos com sucesso! Consultando banco de dados (2ª Etapa)...', 'success');

                // Executar automaticamente a consulta da 2ª Etapa no Banco de Dados
                await consultarBancoEtapa2(data);

                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } catch (error) {
                console.error('Erro na extração:', error);
                showToast(`Erro: ${error.message}`, 'error');
            } finally {
                btnExtract.disabled = false;
                btnExtract.querySelector('.btn-text').classList.remove('hidden');
                btnSpinner.classList.add('hidden');
            }
        });
    }

    function renderResults(data) {
        resultsSection.classList.remove('hidden');

        if (data._metadados && data._metadados.origem) {
            extractionSourceBadge.innerHTML = `<i class="fa-solid fa-microchip"></i> ${data._metadados.origem}`;
        }

        const classif = data['CLASSIFICAÇÃO'] || data['classificacao'] || {};
        const categoria = classif.categoria || 'MANUTENÇÃO E OPERAÇÃO';
        const termos = classif.termos_detectados || [];

        formattedCategoria.textContent = categoria;
        formattedTermos.innerHTML = '';
        if (termos.length > 0) {
            termos.forEach(t => {
                const badge = document.createElement('span');
                badge.className = 'tag-badge';
                badge.textContent = t;
                formattedTermos.appendChild(badge);
            });
        } else {
            formattedTermos.innerHTML = '<span class="tag-badge">Termos identificados automaticamente</span>';
        }

        const fornecedor = data['Fornecedor'] || {};
        const emitente = data['Nome do Emitente'] || fornecedor['Razão Social'] || fornecedor['razao_social'] || '-';
        const fantasia = data['Nome Fantasia do Emitente'] || fornecedor['Fantasia'] || emitente;
        const cnpjEmit = data['CNPJ do Emitente'] || fornecedor['CNPJ'] || fornecedor['cnpj'] || '-';

        formattedEmitente.textContent = emitente;
        formattedFantasia.textContent = fantasia;
        formattedCnpjEmitente.textContent = cnpjEmit;

        const faturado = data['Faturado'] || {};
        const destNome = data['Nome do Destinatário'] || faturado['Nome Completo'] || faturado['nome'] || '-';
        const destDoc = data['CPF/CNPJ do Destinatário'] || faturado['CPF'] || faturado['cpf'] || '-';

        formattedDestinatario.textContent = destNome;
        formattedCpfDestinatario.textContent = destDoc;

        formattedNumeroNf.textContent = data['Número da Nota Fiscal'] || '-';
        formattedDataEmissao.textContent = data['Data de Emissão'] || '-';
        formattedDataVencimento.textContent = data['Data de Vencimento'] || data['Data de Emissão'] || '-';
        
        let valorTotal = data['Valor Total'] || '0.00';
        if (!valorTotal.includes('R$')) valorTotal = `R$ ${valorTotal}`;
        formattedValorTotal.textContent = valorTotal;

        const parcelas = data['Parcelas'] || {};
        const qtdParcelas = data['Quantidade de Parcelas'] || parcelas['Quantidade de Parcelas'] || 1;
        formattedParcelas.textContent = `${qtdParcelas} parcela(s)`;

        formattedDescricaoProdutos.textContent = data['Descrição dos Produtos'] || 'Descrição geral dos produtos constante na NF.';

        const jsonString = JSON.stringify(data, null, 2);
        jsonCodeDisplay.innerHTML = syntaxHighlightJson(jsonString);
    }

    // =========================================================================
    // 2ª ETAPA: CONSULTA NO BANCO DE DADOS E LANÇAMENTO AUTOMÁTICO
    // =========================================================================

    async function consultarBancoEtapa2(data) {
        if (!data) return;
        etapa2Section.classList.remove('hidden');
        etapa2SuccessCard.classList.add('hidden');

        etapa2FornecedorBadge.className = 'db-status-badge';
        etapa2FornecedorBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CONSULTANDO...';

        etapa2FaturadoBadge.className = 'db-status-badge';
        etapa2FaturadoBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CONSULTANDO...';

        etapa2DespesaBadge.className = 'db-status-badge';
        etapa2DespesaBadge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CONSULTANDO...';

        try {
            const resp = await fetch('/api/etapa2/consultar/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const res = await resp.json();

            // 1. FORNECEDOR
            etapa2FornecedorNome.textContent = res.fornecedor.razao_social;
            etapa2FornecedorDoc.textContent = `CNPJ: ${res.fornecedor.cpf_cnpj}`;
            if (res.fornecedor.existe) {
                etapa2FornecedorBadge.className = 'db-status-badge exists';
                etapa2FornecedorBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> EXISTE – ID: ${res.fornecedor.id}`;
            } else {
                etapa2FornecedorBadge.className = 'db-status-badge not-exists';
                etapa2FornecedorBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> NÃO EXISTE`;
            }

            // 2. FATURADO
            etapa2FaturadoNome.textContent = res.faturado.razao_social;
            etapa2FaturadoDoc.textContent = `CPF: ${res.faturado.cpf_cnpj}`;
            if (res.faturado.existe) {
                etapa2FaturadoBadge.className = 'db-status-badge exists';
                etapa2FaturadoBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> EXISTE – ID: ${res.faturado.id}`;
            } else {
                etapa2FaturadoBadge.className = 'db-status-badge not-exists';
                etapa2FaturadoBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> NÃO EXISTE`;
            }

            // 3. DESPESA
            etapa2DespesaNome.textContent = res.despesa.descricao;
            etapa2DespesaTipo.textContent = `CLASSIFICAÇÃO: ${res.despesa.tipo}`;
            if (res.despesa.existe) {
                etapa2DespesaBadge.className = 'db-status-badge exists';
                etapa2DespesaBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> EXISTE – ID: ${res.despesa.id}`;
            } else {
                etapa2DespesaBadge.className = 'db-status-badge not-exists';
                etapa2DespesaBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> NÃO EXISTE`;
            }

        } catch (err) {
            console.error('Erro na consulta da 2ª etapa:', err);
            showToast('Erro ao consultar banco de dados: ' + err.message, 'error');
        }
    }

    if (btnReconsultarBanco) {
        btnReconsultarBanco.addEventListener('click', () => {
            if (latestExtractedJson) {
                consultarBancoEtapa2(latestExtractedJson);
                showToast('Status no banco de dados atualizado.', 'info');
            }
        });
    }

    // Ação: Lançar no Banco de Dados (2ª Etapa)
    if (btnLancarBanco) {
        btnLancarBanco.addEventListener('click', async () => {
            if (!latestExtractedJson) {
                showToast('Nenhum dado extraído disponível para lançar.', 'error');
                return;
            }

            btnLancarBanco.disabled = true;
            btnLancarText.textContent = 'GRAVANDO NO BANCO DE DADOS...';

            try {
                const resp = await fetch('/api/etapa2/lancar/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(latestExtractedJson)
                });

                const res = await resp.json();

                if (res.success) {
                    showToast('Registro lançado com sucesso!', 'success');

                    // Preencher card de sucesso detalhado
                    const det = res.detalhes;
                    successTagsContainer.innerHTML = `
                        <span class="success-tag"><i class="fa-solid fa-hashtag"></i> Movimento #${det.movimento_id} (${det.tipo_movimento})</span>
                        <span class="success-tag"><i class="fa-solid fa-building"></i> ${det.fornecedor}</span>
                        <span class="success-tag"><i class="fa-solid fa-user-check"></i> ${det.faturado}</span>
                        <span class="success-tag"><i class="fa-solid fa-tag"></i> ${det.classificacao}</span>
                        <span class="success-tag"><i class="fa-solid fa-barcode"></i> Parcela: ${det.parcela_identificacao} (R$ ${det.valor} - Venc: ${det.vencimento})</span>
                    `;

                    etapa2SuccessCard.classList.remove('hidden');

                    // Atualizar a verificação no banco (agora todas as entidades mostrarão EXISTE com seus IDs!)
                    await consultarBancoEtapa2(latestExtractedJson);

                    etapa2SuccessCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    showToast(res.error || 'Erro ao lançar no banco', 'error');
                }

            } catch (err) {
                console.error('Erro ao lançar no banco:', err);
                showToast('Falha na comunicação: ' + err.message, 'error');
            } finally {
                btnLancarBanco.disabled = false;
                btnLancarText.textContent = 'LANÇAR REGISTRO NO BANCO DE DADOS (2ª ETAPA)';
            }
        });
    }

    // Tabs e JSON Syntax
    if (tabFormattedBtn && tabJsonBtn) {
        tabFormattedBtn.addEventListener('click', () => {
            tabFormattedBtn.classList.add('active');
            tabJsonBtn.classList.remove('active');
            tabFormatted.classList.add('active');
            tabJson.classList.remove('active');
        });

        tabJsonBtn.addEventListener('click', () => {
            tabJsonBtn.classList.add('active');
            tabFormattedBtn.classList.remove('active');
            tabJson.classList.add('active');
            tabFormatted.classList.remove('active');
        });
    }

    if (btnCopyJson) {
        btnCopyJson.addEventListener('click', () => {
            if (!latestExtractedJson) return;
            navigator.clipboard.writeText(JSON.stringify(latestExtractedJson, null, 2))
                .then(() => showToast('JSON copiado para a área de transferência!', 'success'))
                .catch(() => showToast('Não foi possível copiar o JSON.', 'error'));
        });
    }

    if (btnDownloadJson) {
        btnDownloadJson.addEventListener('click', () => {
            if (!latestExtractedJson) return;
            const blob = new Blob([JSON.stringify(latestExtractedJson, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `extracao-nf-${latestExtractedJson['Número da Nota Fiscal'] || 'documento'}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Download do JSON iniciado.', 'info');
        });
    }

    function syntaxHighlightJson(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    // Modal de API Key
    if (btnConfigModal) btnConfigModal.addEventListener('click', () => apiModal.classList.remove('hidden'));
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => apiModal.classList.add('hidden'));
    if (btnCancelKey) btnCancelKey.addEventListener('click', () => apiModal.classList.add('hidden'));

    if (btnToggleKey && apiKeyInput) {
        btnToggleKey.addEventListener('click', () => {
            const isPassword = apiKeyInput.type === 'password';
            apiKeyInput.type = isPassword ? 'text' : 'password';
            btnToggleKey.querySelector('i').className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        });
    }

    if (btnSaveKey) {
        btnSaveKey.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            if (key) {
                localStorage.setItem('GEMINI_USER_API_KEY', key);
                apiStatusDot.classList.add('active');
                apiStatusText.textContent = 'API Gemini: Conectada';
                showToast('Chave de API salva com sucesso!', 'success');
            } else {
                localStorage.removeItem('GEMINI_USER_API_KEY');
                checkApiStatus();
                showToast('Chave removida. Usando modo demonstrativo.', 'info');
            }
            apiModal.classList.add('hidden');
        });
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-circle-exclamation';
        if (type === 'warning') icon = 'fa-triangle-exclamation';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Sincronização dinâmica de informações do commit GitHub (N2)
    fetch('/api/git-info/')
        .then(r => r.json())
        .then(data => {
            if (data && data.commit) {
                const headerHash = document.getElementById('headerGitHash');
                if (headerHash && (!headerHash.textContent || headerHash.textContent === 'None')) {
                    headerHash.textContent = data.commit;
                }
                const commitCode = document.getElementById('gitCommitCode');
                if (commitCode && (!commitCode.textContent || commitCode.textContent === 'None')) {
                    commitCode.textContent = data.commit;
                }
                const commitDate = document.getElementById('gitCommitDate');
                if (commitDate && (!commitDate.textContent || commitDate.textContent.includes('None'))) {
                    commitDate.innerHTML = `<i class="fa-regular fa-clock"></i> ${data.date}`;
                }
            }
        })
        .catch(() => {});

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('AUTH_TOKEN');
            localStorage.removeItem('AUTH_USER');
            showToast('Sessão encerrada com sucesso.', 'info');
            setTimeout(() => {
                window.location.replace('/login.html');
            }, 400);
        });
    }
});
