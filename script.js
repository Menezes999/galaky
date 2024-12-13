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

    // Configurações gerais
    const pageWidth = 190;
    const startX = 10;
    let startY = 20;
    const lineHeight = 10;

    // Cabeçalho do PDF
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório Semanal de Staff", pageWidth / 2, startY, null, null, "center");
    startY += lineHeight;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
        "Este relatório apresenta informações detalhadas sobre o desempenho semanal dos membros da staff, incluindo\nstatus de promoção, pontos acumulados e metas atingidas.",
        startX,
        startY
    );
    startY += lineHeight * 2;

    // Legenda de status
    doc.setFontSize(10);
    doc.setFillColor(230, 230, 230);
    doc.rect(startX, startY, pageWidth, lineHeight, "F");
    doc.text("Legenda: Promovido = Atingiu a meta; Não Promovido = Meta não atingida.", startX + 5, startY + 7);
    startY += lineHeight + 5;

    // Cabeçalho da Tabela
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(50, 50, 200);
    doc.rect(startX, startY, pageWidth, lineHeight, "F");
    doc.text("Nome", startX + 5, startY + 7);
    doc.text("Cargo", startX + 50, startY + 7);
    doc.text("Meta", startX + 90, startY + 7);
    doc.text("Pontos", startX + 120, startY + 7);
    doc.text("Status", startX + 160, startY + 7);
    startY += lineHeight;

    // Dados da Tabela
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    membros.forEach((membro, index) => {
        const status = membro.pontos >= membro.meta ? "Promovido" : "Não Promovido";
        const rowColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];

        // Fundo alternado
        doc.setFillColor(...rowColor);
        doc.rect(startX, startY, pageWidth, lineHeight, "F");

        // Dados do membro
        doc.text(membro.nome, startX + 5, startY + 7);
        doc.text(membro.cargo, startX + 50, startY + 7);
        doc.text(`${membro.meta}`, startX + 90, startY + 7);
        doc.text(`${membro.pontos}`, startX + 120, startY + 7);
        doc.text(status, startX + 160, startY + 7);

        // Próxima linha
        startY += lineHeight;

        // Verificar se precisa de nova página
        if (startY > 270) {
            doc.addPage();
            startY = 20;

            // Repetir cabeçalho da tabela na nova página
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(50, 50, 200);
            doc.rect(startX, startY, pageWidth, lineHeight, "F");
            doc.text("Nome", startX + 5, startY + 7);
            doc.text("Cargo", startX + 50, startY + 7);
            doc.text("Meta", startX + 90, startY + 7);
            doc.text("Pontos", startX + 120, startY + 7);
            doc.text("Status", startX + 160, startY + 7);
            startY += lineHeight;
        }
    });

    // Rodapé
    const currentDate = new Date().toLocaleDateString();
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 40, 290);
        doc.text(`Data: ${currentDate}`, startX, 290);
        doc.text("Assinatura do responsável: ____________________________", pageWidth / 2, 290, null, null, "center");
    }

    // Salvar o PDF
    doc.save("relatorio_semanal.pdf");
});

// Inicializar Lista de Membros
atualizarListaMembros();
