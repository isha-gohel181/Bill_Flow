/**
 * Invoice PDF Downloader / Print Utility
 */
export function downloadInvoicePdf(invoiceNumber: string) {
  try {
    const documentElement = document.getElementById("invoice-document");
    if (!documentElement) {
      throw new Error("Invoice document element not found");
    }

    // Trigger print dialog (users can save as PDF natively in all modern browsers)
    window.print();
  } catch (err: any) {
    console.error("PDF generation failed:", err);
    throw err;
  }
}
