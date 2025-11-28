import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment/moment";

export default async function exportPdf(data, qrcode, company) {
  const currentYear = new Date().getFullYear();

  // Numérotation du document
  let documentNumber = localStorage.getItem("documentNumber") || 0;
  let lastYear = localStorage.getItem("lastYear") || currentYear;

  if (lastYear !== currentYear.toString()) {
    documentNumber = 1;
    localStorage.setItem("lastYear", currentYear);
  } else {
    documentNumber = parseInt(documentNumber) + 1;
  }
  localStorage.setItem("documentNumber", documentNumber);

  const factureNumber = String(documentNumber).padStart(4, "0");
  const factureCode = `FAC-${factureNumber}/${currentYear}`;

  // Création du document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  });

  try {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;

    // ====== HEADER ======
    doc.setDrawColor(0);
    doc.setFillColor(41, 128, 185); // Bleu pro
    doc.rect(0, 0, pageWidth, 25, "F"); // Bande bleue en haut

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(company.name.toUpperCase(), margin, 15);

    doc.setFontSize(12);
    doc.text("FACTURE", pageWidth - margin - 30, 15);

    // ====== INFO FACTURE ======
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Facture N° : ${factureCode}`, margin, 35);
    doc.text(`Date : ${moment().format("DD/MM/YYYY")}`, margin, 40);

    // ====== VENDEUR ======
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("1. Identification du vendeur", margin, 50);

    doc.setFont("helvetica", "normal");
    // doc.text(`Raison sociale : ${company.name}`, margin, 55);
    doc.text(wrapText(doc, `Raison sociale : ${company.name}`, 85), margin, 55);

    doc.text(`NIF : ${company.tp_TIN}`, margin, 60);
    doc.text(`Registre de commerce : ${company.tp_trade_number}`, margin, 65);
    doc.text(`Adresse : ${company.tp_address_commune}, ${company.tp_address_avenue}`, margin, 70);
    doc.text(`Centre fiscal : ${company.tp_fiscal_center}`, margin, 75);
    doc.text(`Secteur d’activités : ${company.tp_activity_sector}`, margin, 80);

    // ====== CLIENT ======
    const rightX = 110;
    doc.setFont("helvetica", "bold");
    doc.text("2. Le client", rightX, 50);

    doc.setFont("helvetica", "normal");
    doc.text(`Raison sociale : ${data[0].customer_name}`, rightX, 55);
    doc.text(`NIF : ${data[0].customer_TIN}`, rightX, 60);
    doc.text(`Adresse : ${data[0].customer_address}`, rightX, 65);

    // Ligne de séparation
    doc.setDrawColor(200);
    doc.line(margin, 85, pageWidth - margin, 85);

    // ====== TABLEAU DES ARTICLES ======
    autoTable(doc, {
      startY: 90,
      head: [["Désignation", "Quantité", "Prix Unit. (FBU)", "Montant HT (FBU)"]],
      body: data.map((item) => [
        item.Produit,
        item.Quantite,
        item.Prix.toLocaleString(),
        (item.Prix * item.Quantite).toLocaleString(),
      ]),
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 3,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // ====== TOTAUX ======
    doc.setFont("helvetica", "bold");
    doc.text("RÉSUMÉ", margin, finalY);

    doc.setFont("helvetica", "normal");
    doc.text(`TVA payable : ${data[0].vat.toLocaleString()} FBU`, margin, finalY + 7);
    doc.text(`Net à payer : ${data[0].payable.toLocaleString()} FBU`, margin, finalY + 14);

    // // ====== QR CODE (si fourni) ======
    // if (qrcode && qrcode.result && qrcode.result[0]?.qrCodeFileName) {
    //   const qrCodePath = qrcode.result[0].qrCodeFileName;
    //   const qrCodeX = pageWidth - margin - 40;
    //   const qrCodeY = finalY - 5;
    //   doc.addImage(qrCodePath, "PNG", qrCodeX, qrCodeY, 35, 35);
    // }

    // ====== FOOTER ======
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);

    doc.text(`Fait à Bujumbura, le ${moment().format("DD/MM/YYYY")}`, margin, pageHeight - 25);
    doc.text("Signature et cachet :", margin, pageHeight - 15);

    // Ligne décorative en bas
    doc.setDrawColor(41, 128, 185);
    doc.line(0, pageHeight - 10, pageWidth, pageHeight - 10);

    // Mention légale ou slogan
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text(company.slogan || "Merci pour votre confiance.", pageWidth / 2, pageHeight - 6, {
      align: "center",
    });

    // ====== OUVERTURE ======
    doc.output("dataurlnewwindow");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
  }
}

function wrapText(doc, text, maxWidth) {
  return doc.splitTextToSize(text || "", maxWidth);
}
