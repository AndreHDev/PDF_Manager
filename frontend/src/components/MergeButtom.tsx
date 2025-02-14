import { api } from '../api/myApi';
import type {Page} from "./ThumbnailGrid"
import type { FilePages, MergePDFRequest } from '../api/api';

interface MergeButtonProps {
    pages: Page[]; // Adjust the type according to your state structure
}

const MergeButton = ({ pages }: MergeButtonProps) => {

    const handleMerge = async () => {
        const files: FilePages[] = pages.reduce((acc, page) => {
            if (page.checked) {
                const file = acc.find(f => f.file_id === page.fileId);
                if (file) {
                    file.pages.push(page.pageNumber);
                } else {
                    acc.push({ file_id: page.fileId, pages: [page.pageNumber] });
                }
            }
            return acc;
        }, [] as FilePages[]);

        console.log("Merging files", files);

        try {
            const mergeRequest: MergePDFRequest = { files };
            const response = await api.mergePdfsMergePost(mergeRequest);
            console.log("Merged files", response.data);
        } catch (error) {
            console.error("Failed to merge files", error);
        }
    };

    return (
        <button onClick={handleMerge}>Merge Files</button>
    );
}

export default MergeButton;