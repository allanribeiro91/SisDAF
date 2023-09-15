//Abas do módulo Produtos DAF
document.addEventListener("DOMContentLoaded", function() {
    console.log("Script carregado!");
    let denominacaoSelect = document.getElementById("denominacao");
    let concentracaoInput = document.getElementById("concentracao");
    let formaFarmaceuticaSelect = document.getElementById("forma_farmaceutica");
    let concentracaoTipoSelect = document.getElementById("concetracao_tipo");
    let produtoInput = document.getElementById("produto_farmaceutico"); // Este é o campo "Produto Farmacêutico"

    function updateProduto() {
        let denominacao = denominacaoSelect.options[denominacaoSelect.selectedIndex].text;
        let concentracao = (concentracaoTipoSelect.value === "mostrar_nome") ? concentracaoInput.value : "";
        let formaFarmaceutica = formaFarmaceuticaSelect.options[formaFarmaceuticaSelect.selectedIndex].text;

        produtoInput.value = `${denominacao} ${concentracao} (${formaFarmaceutica})`.trim();
    }

    denominacaoSelect.addEventListener("change", updateProduto);
    concentracaoInput.addEventListener("input", updateProduto);
    formaFarmaceuticaSelect.addEventListener("change", updateProduto);
    concentracaoTipoSelect.addEventListener("change", updateProduto);
});

document.addEventListener("DOMContentLoaded", function() {
    let concentracaoTipoSelect = document.getElementById("concetracao_tipo");
    let concentracaoInput = document.getElementById("concentracao");

    function updateConcentracaoReadonly() {
        if (concentracaoTipoSelect.value === "mostrar_nome" || concentracaoTipoSelect.value === "mostrar_nao") {
            concentracaoInput.removeAttribute("readonly");
        } else {
            concentracaoInput.setAttribute("readonly", "");
            concentracaoInput.value = "";
        }
    }

    // Chama a função para definir o estado inicial
    updateConcentracaoReadonly();

    // Adiciona um ouvinte de evento para atualizar o atributo readonly sempre que o valor do dropdown mudar
    concentracaoTipoSelect.addEventListener("change", updateConcentracaoReadonly);
});



document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.tab-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove o atributo "active" de todos os botões
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Adiciona o atributo "active" ao botão clicado
            this.classList.add('active');
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('.auto-expand');

    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto'; // Reset height to auto
            this.style.height = this.scrollHeight + 'px'; // Set height to scrollHeight
        });
    });
});



document.addEventListener("DOMContentLoaded", function() {
    function toggleReadonly(checkboxId, inputId) {
        let checkbox = document.getElementById(checkboxId);
        let input = document.getElementById(inputId);

        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                input.removeAttribute("readonly");
            } else {
                input.setAttribute("readonly", "");
                input.value = "";
            }
        });
    }

    toggleReadonly("unidade_basico", "unidade_basico_programa");
    toggleReadonly("unidade_especializado", "unidade_especializado_grupo");
    toggleReadonly("unidade_estrategico", "unidade_estrategico_programa");
});


document.addEventListener("DOMContentLoaded", function() {
    function toggleReadonly(checkboxId, inputId1, inputId2) {
        let checkbox = document.getElementById(checkboxId);
        let input1 = document.getElementById(inputId1);
        let input2 = document.getElementById(inputId2);

        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                input1.setAttribute("readonly", "");
                input2.setAttribute("readonly", "");
                input1.value = "";
                input2.value = "";
            } else {
                input1.removeAttribute("readonly");
                input2.removeAttribute("readonly");
            }
        });
    }

    toggleReadonly("sigtap_possui", "sigtap_codigo", "sigtap_nome");
    toggleReadonly("sismat_possui", "sismat_codigo", "sismat_nome");
    toggleReadonly("catmat_possui", "catmat_codigo", "catmat_nome");
    toggleReadonly("obm_possui", "obm_codigo", "obm_nome");
});


