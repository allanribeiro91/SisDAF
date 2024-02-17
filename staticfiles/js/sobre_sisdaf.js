document.addEventListener('DOMContentLoaded', function() {

    const tabela_pontos_controle = document.getElementById('tabelaPontosControle')
    tabela_pontos_controle.addEventListener('click', function(event) {
        var ponto_controle_id = ''
        const target = event.target;
        
        if (target.tagName === 'TD') {
          const row = target.closest('tr');
          ponto_controle_id = row.dataset.id;
        }

        if (ponto_controle_id == '') {
            sweetAlert('Não há dados!', 'warning')
            return
        }

        var width = 1000;
        var height = 700;
        var left = (window.screen.width / 2) - (width / 2);
        var top = (window.screen.height / 2) - (height / 2);
        
        var url = '/sobre-sisdaf/pontos-de-controle/relatorio/' + ponto_controle_id + '/';

        window.open(url, 'newwindow', 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left);
    });

});