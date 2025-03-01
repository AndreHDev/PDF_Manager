from PyPDF2 import PdfReader, PdfWriter
from pdf2image import convert_from_path
import base64
from io import BytesIO
from typing import List, Optional
import uuid
import shutil
from schemas import Page
from fastapi import UploadFile
import os
from logger import logger

class PDF_Model():
    def __init__(self):
        self._pages: List[Page] = []
    
    def get_pdf(self, pdf_id: str) -> Optional[Page]:
        for pdf in self._pages:
            if pdf.file_id == pdf_id:
                return pdf
        return None
    
    def add_page(self, page: Page):
        logger.debug(f"Adding page {page.page_id} to backend. Type {type(page)}")
        self._pages.append(page)

    def get_pages(self) -> List[Page]:
        logger.debug(f"Getting all pages from backend, Total: {len(self._pages)}, Pages: {self._pages}")
        return self._pages
    
    def remove_pages(self):
        logger.debug(f"Removing all pages from backend")
        self._pages = []

    def add_pdf_file(self, file: UploadFile) -> str: #TODO better name?
        """
        Add a PDF file to the backend and extract all pages from it. Save the file temporarily in /temp.

        Args:
            file (UploadFile): The PDF file to be uploaded.

        Returns:
            str: The id of the uploaded PDF file.
        """
        
        try:
            # Save the file temporarily
            file_id = str(uuid.uuid4())
            file_path = self.generate_file_path(file_id)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                logger.info(f"Saved given pdf file to {file_path}")

            # Get thumbnails for each page
            try:
                thumbnails = self.get_thumbnails(file_path)
            except Exception as e:
                raise Exception(f"Error generating thumbnails: {str(e)}")
            logger.info(f"Generated thumbnails for {len(thumbnails)} pages")

            # Create page objects for each page in the PDF and save them to the backend
            reader = PdfReader(file_path)
            for i in range(len(reader.pages)):
                logger.info(f"Processing page {i + 1}")
                page_id = str(uuid.uuid4())
                new_page = Page(file_id=file_id, page_id=page_id, page_number=i + 1, thumbnail=thumbnails[i])
                self.add_page(new_page)
                # Save the page to the backend
                page_path = self.generate_file_path(page_id)
                with open(page_path, "wb") as f:
                    writer = PdfWriter()
                    writer.add_page(reader.pages[i])
                    writer.write(f)
                    logger.info(f"Saved page to {page_path}")

            # Remove the original file
            os.remove(file_path)
            logger.info(f"Removed original file at {file_path}")

        except Exception as e:
            raise Exception(f"Error processing PDF file: {str(e)}")

        logger.info(f"Done processing PDF file. Pages: {len(self.get_pages())}")
        return file_id
    

    def get_thumbnails(self, file_path: str) -> List[str]:
        """
        Generate a small image to be used as a thumbnail for each page in the given PDF file.

        Args:
            file_path (str): The path to the PDF file.

        Returns:
            List[str]: A list of base64 encoded strings representing the thumbnails.
        """
        logger.debug(f"Generating thumbnails for {file_path}")
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
        
    
    def get_pdf_pages(self, file_id: str) -> List[Page]:
        """
        Get all pages for a specific PDF file.

        Args:
            pdf_id (str): Id of the PDF file.

        Returns:
            List[Page]: List of Page objects.

        Raises:
            FileNotFoundError: Raised if the file is not found.
        """
        logger.debug(f"Getting pages for file {file_id}")
        pages = []
        for page in self.get_pages():
            if page.file_id == file_id:
                pages.append(page)
        if not pages:
            raise FileNotFoundError
        return pages

    
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
        logger.info(f"Merging {len(pages)}")
        logger.debug(f"Pages to be merged: {pages}")
        writer = PdfWriter()

        if not pages:
            raise ValueError("No pages were given.")
        
        for page in pages:
            # Skip unchecked pages
            if not page.checked:
                continue
            
            try:
                pdf_page = self.get_page_in_pdf_format(page.page_id)
                writer.add_page(pdf_page)
            except FileNotFoundError:
                raise FileNotFoundError(f"File {page.page_id} not found.") 
            except IndexError:
                raise IndexError(f"Page {page.page_number} not found in file {page.page_id}.")
            except Exception as e:
                raise Exception(f"Error processing page {page.page_number}: {str(e)}")

        if not writer.pages:
            raise ValueError("No pages were selected for merging.")
        
        file_id = str(uuid.uuid4())
        output_file_path = self.generate_file_path(file_id)

        # Write the merged file
        with open(output_file_path, "wb") as f:
            writer.write(f)

        logger.info(f"Done merging pages. File id of merged file: {file_id}")
        return file_id
    
    
    def get_page_in_pdf_format(self, file_id: str) -> PdfReader:
        """
        Load a page from a PDF file and return it in PdfReader format.

        Args:
            file_id (str): Id of file to load page from.

        Returns:
            PdfReader: The page in PdfReader format.

        Raises:
            FileNotFoundError: Raised if the file is not found.
            IndexError: Raised if the page is not found in the file.
        """
        logger.debug(f"Getting page in PDF format for file {file_id}")
        page_path = self.generate_file_path(file_id)
        try:
            reader = PdfReader(page_path)
        except FileNotFoundError:
            raise FileNotFoundError
        
        try:
            page = reader.pages[0]
        except IndexError:
            raise IndexError
        
        return page
    

    def clean_up(self):
        """
        Clean up the temp folder by removing all PDF files
        """
        logger.info("Cleaning up temp folder")
        try:
            for file in os.listdir("temp"):
                if file.endswith(".pdf"):
                    os.remove(f"temp/{file}")
        except Exception as e:
            raise Exception(f"Error cleaning up temp folder: {str(e)}")
        
        self.remove_pages()

    
    def generate_file_path(self, pdf_id: str) -> str:
        """
        Generate a file path for the given PDF id.
        Args:
            pdf_id (str): The id of the PDF file.

        Returns:
            str: The file path.
        """
        logger.debug(f"Generating file path for {pdf_id}")
        return f"temp/{pdf_id}.pdf"

pdf_model_instance = PDF_Model()