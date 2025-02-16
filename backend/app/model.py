from PyPDF2 import PdfReader, PdfWriter
from pdf2image import convert_from_path
import base64
from io import BytesIO
from typing import List
import uuid
import shutil
from schemas import Page
from fastapi import UploadFile
 

class PDF_Model():

    def add_pdf_file(self, file: UploadFile) -> List[Page]:
        """
        Add a PDF file to the backend and extract all pages from it. Save the file temporarily in /temp.

        Args:
            file (UploadFile): The PDF file to be uploaded.

        Returns:
            List[Page]: A list of page objects.
        """
        response_pages:List[Page] = []

        file_id = str(uuid.uuid4())
        # Save the file temporarily
        file_path = f"temp/{file_id}.pdf"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            print(f"Saved file to {file_path}")

        # Get thumbnails for each page
        thumbnails = self.get_thumbnails(file_path)

        # Create page for response
        reader = PdfReader(file_path)
        for i in range(len(reader.pages)):
            new_page = Page(file_id=file_id, page_number=i + 1, thumbnail=thumbnails[i])
            response_pages.append(new_page)


        return response_pages


    def get_thumbnails(self, file_path: str) -> List[str]:
        """
        Geneare a small image to be used as a thumbnail for each page in the PDF file.

        Args:
            file_path (str): The path to the PDF file.

        Returns:
            List[str]: A list of base64 encoded strings representing the thumbnails.
        """
        try:
            all_pages = convert_from_path(file_path, size=(150, 200))
            thumbnails = []
            for page in all_pages:
                buffered = BytesIO()
                page.save(buffered, format="PNG")
                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                thumbnails.append(f"data:image/png;base64,{img_str}")
            return thumbnails
        except Exception as e:
            print(f"An error occurred while trying to make the thumbnails: {e}")

    
    def merge_selected_pages(self, pages: List[Page] , output_file_path = "merged_output.pdf") -> str:
        """
        Merge a list of pages into a single PDF file. Only pages with checked=True will be merged.

        Args:
            pages (List[Page]): List of pages to merge.
            output_file_path (str, optional): Path to the final merged file. Defaults to "merged_output.pdf".

        Returns:
            str: Path to the merged file.
        """
        writer = PdfWriter()
        
        for page in pages:
            # Skip unchecked pages
            if not page.checked:
                continue
            
            # Get the page in pdf format for writer
            new_page = self.get_page_in_pdf_format(page.file_id, page.page_number)
            writer.add_page(new_page)

        # Write the merged file
        with open(output_file_path, "wb") as f:
            writer.write(f)

        return output_file_path
    
    
    def get_page_in_pdf_format(self, file_id: str, page_number: int) -> PdfReader:
        """
        Load a page from a PDF file and return it in PdfReader format.

        Args:
            file_id (str): Id of file to load page from.
            page_number (int): What page to load. Starts at 1.

        Returns:
            PdfReader: The page in PdfReader format.
        """
        reader = PdfReader(f"temp/{file_id}.pdf")
        return reader.pages[page_number - 1]


pdf_model_instance = PDF_Model()