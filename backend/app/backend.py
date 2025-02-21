from PyPDF2 import PdfReader, PdfWriter
from pdf2image import convert_from_path
import base64
from io import BytesIO
from typing import List
import uuid
import shutil
from schemas import Page, Pdf
from fastapi import UploadFile
import os
 

class PDF_Model():
    def __init__(self):
        self._pdfs: List[Pdf] = []
    
    def get_pdf(self, pdf_id: str) -> Page:
        for pdf in self._pdfs:
            if pdf.file_id == pdf_id:
                return pdf
        return None
    
    def add_pdf(self, pdf: Pdf):
        print(f"Adding PDF file {pdf.file_id} to backend. {len(pdf.pages)} pages. {type(pdf)}")
        self._pdfs.append(pdf)

    def add_pdf_file(self, file: UploadFile) -> str: #TODO better name?
        """
        Add a PDF file to the backend and extract all pages from it. Save the file temporarily in /temp.

        Args:
            file (UploadFile): The PDF file to be uploaded.

        Returns:
            str: The id of the uploaded PDF file.
        """
        pages:List[Page] = []
        file_id = str(uuid.uuid4())

        try:
            # Save the file temporarily
            file_path = self.get_pdf_path(file_id)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                print(f"Saved file to {file_path}")

            # Get thumbnails for each page
            try:
                thumbnails = self.get_thumbnails(file_path)
            except Exception as e:
                raise Exception(f"Error generating thumbnails: {str(e)}")

            # Create page for response
            reader = PdfReader(file_path)
            for i in range(len(reader.pages)):
                new_page = Page(file_id=file_id, page_number=i + 1, thumbnail=thumbnails[i])
                pages.append(new_page)
            print(f"Extracted {len(pages)} pages from PDF file.")

        except Exception as e:
            raise Exception(f"Error processing PDF file: {str(e)}")
        
        self.add_pdf(Pdf(file_id=file_id, pages=pages))

        print(f"Added PDF file {file_id} to backend.")
        return file_id
    

    def get_pdf_pages(self, pdf_id: str) -> List[Page]:
        """
        Get all pages for a specific PDF file.

        Args:
            pdf_id (str): Id of the PDF file.

        Returns:
            List[Page]: List of Page objects.

        Raises:
            FileNotFoundError: Raised if the file is not found.
        """
        pdf = self.get_pdf(pdf_id)
        if not pdf:
            raise FileNotFoundError
        
        return pdf.pages


    def get_thumbnails(self, file_path: str) -> List[str]:
        """
        Generate a small image to be used as a thumbnail for each page in the PDF file.

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
            raise Exception (f"Error generating thumbnails: {str(e)}")

    
    def merge_selected_pages(self, pages: List[Page]) -> str:
        """
        Merge a list of pages into a single PDF file. Only pages with checked=True will be merged.

        Args:
            pages (List[Page]): List of pages to merge.

        Returns:
            str: The id of the merged file.

        Raises:
            FileNotFoundError: Raised if a file is not found.
            IndexError: Raised if a page is not found in a file.
            ValueError: Raised if no pages are selected for merging.
            RuntimeError: Raised if an error occurs while merging the pages.
        """

        writer = PdfWriter()

        if not pages:
            raise ValueError("No pages were given.")
        
        for page in pages:
            # Skip unchecked pages
            if not page.checked:
                continue
            
            try:
                pdf_page = self.get_page_in_pdf_format(page.file_id, page.page_number)
                writer.add_page(pdf_page)
            except FileNotFoundError:
                raise FileNotFoundError(f"File {page.file_id} not found.") 
            except IndexError:
                raise IndexError(f"Page {page.page_number} not found in file {page.file_id}.")
            except Exception as e:
                raise Exception(f"Error processing page {page.page_number}: {str(e)}")

        if not writer.pages:
            raise ValueError("No pages were selected for merging.")
        
        file_id = str(uuid.uuid4())
        output_file_path = self.get_pdf_path(file_id)

        # Write the merged file
        with open(output_file_path, "wb") as f:
            writer.write(f)

        return file_id
    
    
    def get_page_in_pdf_format(self, file_id: str, page_number: int) -> PdfReader:
        """
        Load a page from a PDF file and return it in PdfReader format.

        Args:
            file_id (str): Id of file to load page from.
            page_number (int): What page to load. Starts at 1.

        Returns:
            PdfReader: The page in PdfReader format.

        Raises:
            FileNotFoundError: Raised if the file is not found.
            IndexError: Raised if the page is not found in the file.
        """
        file_path = self.get_pdf_path(file_id)
        try:
            reader = PdfReader(file_path)
        except FileNotFoundError:
            raise FileNotFoundError
        
        try:
            page = reader.pages[page_number - 1]
        except IndexError:
            raise IndexError
        
        return page
    

    def clean_up(self):
        # Clean up all pdf files in temp folder
        try:
            for file in os.listdir("temp"):
                if file.endswith(".pdf"):
                    os.remove(f"temp/{file}")
        except Exception as e:
            raise Exception(f"Error cleaning up temp folder: {str(e)}")

    
    def get_pdf_path(self, pdf_id: str) -> str:
        return f"temp/{pdf_id}.pdf"

pdf_model_instance = PDF_Model()