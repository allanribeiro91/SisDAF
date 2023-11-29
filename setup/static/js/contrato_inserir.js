document.addEventListener('DOMContentLoaded', function() {
    const unidadeDafSelect = document.getElementById('inserir_ct_unidade_daf');
    const modalidadeAquisicaoSelect = document.getElementById('inserir_ct_modalidade_aquisicao');

    function toggleModalidadeAquisicao() {
        const unidadeDafValue = unidadeDafSelect.value;
        if (unidadeDafValue !== '' && unidadeDafValue !== 'nao_informado') {
            modalidadeAquisicaoSelect.removeAttribute('disabled');
        } else {
            modalidadeAquisicaoSelect.setAttribute('disabled', 'disabled');
            modalidadeAquisicaoSelect.value='';
        }
    }
    // Evento de mudança para o campo Unidade DAF
    unidadeDafSelect.addEventListener('change', toggleModalidadeAquisicao);

    // Executa a função quando a página é carregada para definir o estado inicial
    toggleModalidadeAquisicao();
});


document.addEventListener('DOMContentLoaded', function() {
    const modalidadeAquisicaoSelect = document.getElementById('inserir_ct_modalidade_aquisicao');
    const arpsSelect = document.getElementById('inserir_ct_arp');
    const unidadeDafSelect = document.getElementById('inserir_ct_unidade_daf');

    function buscarArps(unidadeDaf) {
        const url = `/contratos/buscararps/${unidadeDaf}/`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                arpsSelect.innerHTML = '<option value="">Selecione uma ARP</option>';

                data.arps.forEach(arp => {
                    const option = document.createElement('option');
                    option.value = arp.id;
                    option.textContent = arp.numero_arp;
                    arpsSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao buscar ARPs:', error));
    }

    modalidadeAquisicaoSelect.addEventListener('change', function() {
        if (this.value === 'pregao_comarp') {
            const unidadeDafValue = unidadeDafSelect.value;
            if (unidadeDafValue) {
                buscarArps(unidadeDafValue);
                arpsSelect.removeAttribute('disabled');
                arpsSelect.value='';
            }
        }
    });
});

