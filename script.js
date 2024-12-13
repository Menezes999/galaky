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

// Gerar Relatório
document.getElementById("gerar-relatorio").addEventListener("click", () => {
    const relatorio = membros.map((membro) => {
        const status = membro.pontos >= membro.meta ? "Promovido" : "Não Promovido";
        return `${membro.nome} - Cargo: ${membro.cargo} - Pontos: ${membro.pontos} - Status: ${status}`;
    }).join("\n");

    const blob = new Blob([relatorio], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio_semanal.txt";
    link.click();
});

// Inicializar Lista de Membros
atualizarListaMembros();
