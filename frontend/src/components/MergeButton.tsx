import { api } from '../api/myApi';
import type { Page } from '../api/api';

interface MergeButtonProps {
    pages: Page[];
}

const MergeButton = ({ pages }: MergeButtonProps) => {
    
    const handleMerge = async () => {
        // Merge the PDFs
        const mergePdfs = async (pages: Page[]) => {
            try {
                const response = await api.mergePdfs(pages);
                const mergedPdfId = (response.data as { file_id: string }).file_id;
                return mergedPdfId;
            }
            catch (error) {
                console.error('Error merging PDFs:', error);
                return [];
            }
        };

        const mergedPdfId = await mergePdfs(pages);
        console.log("New file_id of merged file:", mergedPdfId);
        if (typeof mergedPdfId !== 'string') return;

        // Get the merged PDF
        const getMergedPdf = async (file_id: string) => {
            try {
                const response = await api.downloadPdf(file_id, { responseType: 'blob' });
                return response.data;
            }
            catch (error) {
                console.error('Error getting merged PDF:', error);
                return [];
            }
        };

        const pdfData = await getMergedPdf(mergedPdfId);
        const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create a link and click it automaticly to download the PDF
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'merged_output.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button onClick={handleMerge}>Merge Files</button>
    );
}

export default MergeButton;