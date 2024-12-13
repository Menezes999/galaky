// Funções Utilitárias
const salvarLocalStorage = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));
const carregarLocalStorage = (chave) => JSON.parse(localStorage.getItem(chave)) || [];

// Inicializar Dados
let membros = carregarLocalStorage("membros");

// Atualizar Lista de Membros no HTML
const atualizarListaMembros = () => {
    const listaDiv = document.getElementById("lista-membros");
    const selectMembros = document.getElementById("membro-pontos");

    listaDiv.innerHTML = "";
    selectMembros.innerHTML = '<option value="">Selecione um membro</option>';

    membros.forEach((membro, index) => {
        listaDiv.innerHTML += `
            <p>${membro.nome} - ${membro.cargo} - Meta: ${membro.meta} pontos - Pontos: ${membro.pontos || 0}</p>
        `;
        selectMembros.innerHTML += `<option value="${index}">${membro.nome}</option>`;
    });
};

// Adicionar Membro
document.getElementById("form-cadastro").addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cargo = document.getElementById("cargo").value;
    const meta = parseInt(document.getElementById("meta").value);

    membros.push({ nome, cargo, meta, pontos: 0 });
    salvarLocalStorage("membros", membros);
    atualizarListaMembros();
    event.target.reset();
});

// Atualizar Pontos
document.getElementById("form-pontos").addEventListener("submit", (event) => {
    event.preventDefault();

    const membroIndex = document.getElementById("membro-pontos").value;
    const pontos = parseInt(document.getElementById("pontos").value);

    if (membroIndex !== "") {
        membros[membroIndex].pontos += pontos;
        salvarLocalStorage("membros", membros);
        atualizarListaMembros();
        event.target.reset();
    }
});

// Gerar Relatório em PDF
document.getElementById("gerar-relatorio").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFontSize(16);
    doc.text("Relatório Semanal de Staff", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(
        "Este relatório contém informações detalhadas sobre o desempenho semanal dos membros da staff, incluindo status de promoção.",
        10,
        30
    );

    // Cabeçalho da Tabela
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(50, 50, 200);
    doc.rect(10, 40, 190, 10, "F");
    doc.text("Nome", 15, 46);
    doc.text("Cargo Atual", 60, 46);
    doc.text("Meta de Pontos", 110, 46);
    doc.text("Pontos Acumulados", 150, 46);
    doc.text("Status", 180, 46);

    // Dados da Tabela
    let y = 56;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    membros.forEach((membro, index) => {
        const status = membro.pontos >= membro.meta ? "Promovido" : "Não Promovido";
        doc.text(membro.nome, 15, y);
        doc.text(membro.cargo, 60, y);
        doc.text(membro.meta.toString(), 115, y, null, null, "right");
        doc.text(membro.pontos.toString(), 155, y, null, null, "right");
        doc.text(status, 180, y, null, null, "right");

        // Adicionar linhas separadoras
        doc.setDrawColor(200, 200, 200);
        doc.line(10, y + 2, 200, y + 2);

        y += 10;

        // Adicionar nova página se necessário
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    // Rodapé
    doc.setFontSize(10);
    doc.text(`Relatório gerado em: ${new Date().toLocaleDateString()}`, 10, 290);
    doc.text("Assinatura do responsável: ____________________________", 105, 290, null, null, "center");

    // Salvar o PDF
    doc.save("relatorio_semanal.pdf");
});

// Inicializar Lista de Membros
atualizarListaMembros();
