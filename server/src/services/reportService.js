import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generatePdfReport = async ({ record, user }) => {
  const uploadsDir = path.resolve("uploads");
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const fileName = `report-${record._id}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text("RuralCare AI Medical Report");
    doc.moveDown();
    doc.fontSize(12).text(`Patient: ${user.name}`);
    doc.text(`Language: ${record.reportLanguage}`);
    doc.text(`Symptoms: ${record.symptoms.join(", ")}`);
    doc.text(`Severity: ${record.severity}`);
    doc.moveDown();
    doc.text("Predictions:");
    record.predictions.forEach((prediction, index) => {
      doc.text(`${index + 1}. ${prediction.disease} - ${prediction.confidence}%`);
    });
    doc.moveDown();
    doc.text("Recommendations:");
    record.recommendations.forEach((item) => doc.text(`- ${item}`));
    doc.moveDown();
    doc.text("Nearby Hospitals:");
    record.nearbyHospitals.forEach((item) => {
      doc.text(`- ${item.name} (${item.distanceKm} km)`);
    });
    doc.moveDown();
    doc.text(record.reportText || "");
    doc.end();

    stream.on("finish", () => resolve({ filePath, url: `/uploads/${fileName}` }));
    stream.on("error", reject);
  });
};
