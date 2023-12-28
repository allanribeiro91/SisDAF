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
    