import { api } from '../api/myApi';
import type { Page } from '../api/api';

interface MergeButtonProps {
    pages: Page[];
}

const MergeButton = ({ pages }: MergeButtonProps) => {

    const handleMerge = async () => {
        const response = await api.mergePdfsMergePost(pages);
        console.log("Merge response:", response);
    };

    return (
        <button onClick={handleMerge}>Merge Files</button>
    );
}

export default MergeButton;