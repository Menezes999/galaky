document.getElementById("gerar-relatorio").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // Configurações gerais
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 10;
    const contentWidth = pageWidth - marginX * 2;
    let cursorY = 20;

    // Cabeçalho do PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Relatório Semanal de Staff", pageWidth / 2, cursorY, { align: "center" });
    cursorY += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
        "Este relatório detalha o desempenho semanal da equipe, incluindo pontos acumulados, metas atingidas e promoções.",
        marginX,
        cursorY,
        { maxWidth: contentWidth }
    );
    cursorY += 15;

    // Tabela de membros
    const tableHeaders = ["Nome", "Cargo", "Meta", "Pontos", "Status"];
    const colWidths = [50, 40, 30, 30, 40];
    const rowHeight = 10;

    // Cabeçalho da tabela
    doc.setFillColor(60, 60, 200);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let currentX = marginX;

    tableHeaders.forEach((header, index) => {
        doc.rect(currentX, cursorY, colWidths[index], rowHeight, "F");
        doc.text(header, currentX + 2, cursorY + 7);
        currentX += colWidths[index];
    });

    cursorY += rowHeight;

    // Dados da tabela
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    membros.forEach((membro, index) => {
        if (cursorY + rowHeight > pageHeight - 20) {
            // Adiciona nova página
            doc.addPage();
            cursorY = 20;

            // Repetir cabeçalho
            currentX = marginX;
            doc.setFillColor(60, 60, 200);
            doc.setTextColor(255, 255, 255);
            tableHeaders.forEach((header, idx) => {
                doc.rect(currentX, cursorY, colWidths[idx], rowHeight, "F");
                doc.text(header, currentX + 2, cursorY + 7);
                currentX += colWidths[idx];
            });
            cursorY += rowHeight;
        }

        const status = membro.pontos >= membro.meta ? "Promovido" : "Não Promovido";
        currentX = marginX;

        // Alternância de cores para linhas
        const fillColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
        doc.setFillColor(...fillColor);

        colWidths.forEach((colWidth, idx) => {
            doc.rect(currentX, cursorY, colWidth, rowHeight, "F");
            currentX += colWidth;
        });

        // Dados do membro
        doc.text(membro.nome, marginX + 2, cursorY + 7);
        doc.text(membro.cargo, marginX + 52, cursorY + 7);
        doc.text(`${membro.meta}`, marginX + 92, cursorY + 7);
        doc.text(`${membro.pontos}`, marginX + 122, cursorY + 7);
        doc.text(status, marginX + 152, cursorY + 7);

        cursorY += rowHeight;
    });

    // Rodapé
    const currentDate = new Date().toLocaleDateString();
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 40, pageHeight - 10);
        doc.text(`Data: ${currentDate}`, marginX, pageHeight - 10);
        doc.text("Assinatura do responsável: ____________________________", pageWidth / 2, pageHeight - 10, {
            align: "center",
        });
    }

    // Salvar o PDF
    doc.save("relatorio_semanal.pdf");
});
