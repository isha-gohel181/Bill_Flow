/**
 * Invoice PDF Generator & Downloader Utility
 */
export async function downloadInvoicePdf(invoiceNumber: string) {
  try {
    const element = document.getElementById("invoice-document");
    if (!element) {
      throw new Error("Invoice document element not found");
    }

    // Import html2pdf dynamically on client side
    const html2pdf = (await import("html2pdf.js")).default;

    const filename = `Invoice_${invoiceNumber || "document"}.pdf`;

    const opt = {
      margin: 0.4,
      filename: filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "in" as const, format: "a4", orientation: "portrait" as const },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    // Fallback to window.print if client PDF rendering encounters any canvas restriction
    window.print();
  }
}
