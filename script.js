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

    doc.setFontSize(16);
    doc.text("Relatório Semanal de Staff", 105, 10, null, null, "center");

    doc.setFontSize(12);
    let y = 20;

    membros.forEach((membro, index) => {
        const status = membro.pontos >= membro.meta ? "Promovido" : "Não Promovido";
        const novoCargo = status === "Promovido" ? "Novo Cargo" : "Sem Mudança";

        doc.text(
            `${index + 1}. Nome: ${membro.nome}`,
            10,
            y
        );
        doc.text(`Cargo: ${membro.cargo} | Meta: ${membro.meta} | Pontos: ${membro.pontos}`, 10, y + 5);
        doc.text(`Status: ${status} | ${status === "Promovido" ? `Novo Cargo: ${novoCargo}` : ""}`, 10, y + 10);

        y += 20;

        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save("relatorio_semanal.pdf");
});

// Inicializar Lista de Membros
atualizarListaMembros();
