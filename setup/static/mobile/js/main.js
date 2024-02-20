document.addEventListener('DOMContentLoaded', function() {
    
    // Verifica se a URL atual contém '/mobile/home'
    const path = window.location.pathname;
    const abaInicio = document.getElementById('abaInicio');
    const abaNumeros = document.getElementById('abaNumeros')
    const abaModulos = document.getElementById('abaModulos')
    const abaOpcoes = document.getElementById('abaOpcoes')
    
    if (path.includes('/mobile/home')) {
        abaInicio.classList.add('active');
    }
    if (path.includes('/mobile/numeros')) {
        abaNumeros.classList.add('active');
    }
    if (path.includes('/mobile/modulos')) {
        abaModulos.classList.add('active');
    }
    if (path.includes('/mobile/opcoes')) {
        abaOpcoes.classList.add('active');
    }
    

    abaInicio.addEventListener('click', function() {
        window.location.href = '/mobile/home/'
    })
    abaNumeros.addEventListener('click', function() {
        window.location.href = '/mobile/numeros/'
    })
    abaModulos.addEventListener('click', function() {
        window.location.href = '/mobile/modulos/'
    })
    abaOpcoes.addEventListener('click', function() {
        window.location.href = '/mobile/opcoes/'
    })


    const moduloProdutosDAF = document.getElementById('moduloProdutosDAF')
    moduloProdutosDAF.addEventListener('click', function() {
        window.location.href = '/mobile/modulos/produtosdaf/'
    })


});




