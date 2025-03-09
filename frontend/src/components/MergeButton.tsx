import { api } from "../api/myApi";
import type { Page } from "../api/api";
import log from "../utils/logger";

interface MergeButtonProps {
  pages: Page[];
}

const MergeButton = ({ pages }: MergeButtonProps) => {
  const handleMerge = async () => {
    log.info("Handle merge of pages:", pages);

    // Merge the PDFs
    const mergePdfs = async (pages: Page[]) => {
      try {
        const response = await api.mergePdfs(pages);
        const mergedPdfId = (response.data as { file_id: string }).file_id;
        return mergedPdfId;
      } catch (error) {
        log.error("Error merging PDFs:", error);
        return [];
      }
    };

    const mergedPdfId = await mergePdfs(pages);
    log.info("Merging done. New file_id of merged file:", mergedPdfId);
    if (typeof mergedPdfId !== "string") {
      log.error("Invalid merged file_id:", mergedPdfId);
      return;
    }

    // Get the merged PDF
    const getMergedPdf = async (file_id: string) => {
      log.info("Getting merged PDF:", file_id);
      try {
        const response = await api.downloadPdf(file_id, { responseType: "blob" });
        return response.data;
      } catch (error) {
        log.error("Error getting merged PDF:", error);
        return [];
      }
    };

    const pdfData = await getMergedPdf(mergedPdfId);

    // Create a link and click it to automaticly to download the PDF
    const pdfBlob = new Blob([pdfData], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "merged_output.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={handleMerge}>Merge Files</button>;
};

export default MergeButton;
