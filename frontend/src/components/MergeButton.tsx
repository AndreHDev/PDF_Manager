import { api } from '../api/myApi';
import type { Page } from '../api/api';

interface MergeButtonProps {
    pages: Page[];
}

const MergeButton = ({ pages }: MergeButtonProps) => {

    const handleMerge = async () => {
        // Merge pages and get the merged PDF in response
        const response = await api.mergePdfsMergePost(pages, { responseType: 'blob' });
        console.log("Merge response:", response);

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
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