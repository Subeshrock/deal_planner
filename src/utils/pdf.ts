import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { DealSummary } from "@/types/deal";

export async function generatePDF(summary: DealSummary, chartImageBase64?: string) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;
  const lineHeight = 20;
  const margin = 50;
  let y = height - margin;

  const drawTitle = (text: string) => {
    page.drawText(text, {
      x: margin,
      y,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0.6),
    });
    y -= lineHeight + 10;
  };

  const drawSection = (label: string, values: { total: number; taxes: number; net: number }) => {
    page.drawText(label, {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.6),
    });
    y -= lineHeight;

    const rows = [
      ["Total", `$${values.total.toLocaleString()}`],
      ["Taxes", `$${values.taxes.toLocaleString()}`],
      ["Net", `$${values.net.toLocaleString()}`],
    ];

    rows.forEach(([key, val]) => {
      page.drawText(key, {
        x: margin + 20,
        y,
        size: fontSize,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
      page.drawText(val, {
        x: width - margin - 100,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    });

    y -= 10;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(0.85, 0.85, 0.85),
    });
    y -= 15;
  };

  drawTitle("Deal Summary");
  drawSection("Earn Out", summary.earnOut);
  drawSection("Seller Financing", summary.sellerFinancing);
  drawSection("All Cash", summary.allCash);

  // Chart
  if (chartImageBase64) {
    const chartImageBytes = Uint8Array.from(atob(chartImageBase64), c => c.charCodeAt(0));
    const image = await doc.embedPng(chartImageBytes);
    const imgDims = image.scale(0.5);
    y = Math.max(y - 20, 40); // Adjust Y position if space is left
    page.drawImage(image, {
      x: (width - imgDims.width) / 2,
      y,
      width: imgDims.width,
      height: imgDims.height,
    });
  }

  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "deal_summary.pdf";
  link.click();
}
