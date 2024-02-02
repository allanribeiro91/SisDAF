document.addEventListener('DOMContentLoaded', function() {

    // Seleciona todos os elementos com a classe 'imagem-card'
    const modal_informe = new bootstrap.Modal(document.getElementById('informeModal'))
    var cards = document.querySelectorAll('.imagem-card');
    
    cards.forEach(function(card) {
        card.addEventListener('click', function() {
            
            //log
            $('#informe_id').val(this.getAttribute('data-id'));
            $('#informe_log_data_registro').val(this.getAttribute('data-data-registro'));
            $('#informe_log_responsavel_registro').val(this.getAttribute('data-data-registro'));
            $('#informe_log_ult_atualizacao').val(this.getAttribute('data-data-registro'));
            $('#informe_log_responsavel_atualizacao').val(this.getAttribute('data-data-registro'));
            $('#informe_log_edicoes').val(this.getAttribute('data-data-registro'));

            //dados do informe
            $('#informe_titutlo').val(this.getAttribute('data-titulo'));
            $('#informe_descricao').val(this.getAttribute('data-descricao'));
            $('#informe_link').val(this.getAttribute('data-link'));

            modal_informe.show()


        });
    });


    const areaCards = document.getElementById('area_cards');
    let isDown = false;
    let startX;
    let scrollLeft;

    areaCards.addEventListener('mousedown', (e) => {
        isDown = true;
        areaCards.classList.add('active');
        startX = e.pageX - areaCards.offsetLeft;
        scrollLeft = areaCards.scrollLeft;
    });

    areaCards.addEventListener('mouseleave', () => {
        isDown = false;
        areaCards.classList.remove('active');
    });

    areaCards.addEventListener('mouseup', () => {
        isDown = false;
        areaCards.classList.remove('active');
    });

    areaCards.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - areaCards.offsetLeft;
        const walk = (x - startX) * 1; // Fator de velocidade do arrasto
        areaCards.scrollLeft = scrollLeft - walk;
    });


    document.querySelectorAll('.card-alerta').forEach(card => {
        card.addEventListener('mousedown', function(event) {
            // Interrompe a propagação do evento para evitar que a área de cartões ative o arrasto
            event.stopPropagation();
        });
    });



    


});