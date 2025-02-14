from PyPDF2 import PdfReader, PdfWriter
from pdf2image import convert_from_path
import base64
from io import BytesIO
import os
from typing import List
import uuid
import shutil
from schemas import Page
 

class PDF_Model():
    def __init__(self):
        self._pages:List[Page] = []

    def add_pdf_file(self, file):
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
            self.add_page(new_page)
            response_pages.append(new_page)

        print(f"All currently managed pages: {self.get_pages()}")
        return response_pages

    def get_thumbnails(self, file_path):
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

    
    def merge_selected_pages(self, pages: List[Page] , output_file_path = "merged_output.pdf"):
        writer = PdfWriter()
        
        # Get pdf and needed pages
        for page in pages:
            # Skip unchecked pages
            if not page.checked:
                continue

            new_page = self.get_page_in_pdf_format(page.file_id, page.page_number)
            writer.add_page(new_page)

        with open(output_file_path, "wb") as f:
            writer.write(f)
                

    def get_pages(self):
        return self._pages
    
    def add_page(self, page):
        self._pages.append(page)

    def get_page(self, file_id, page_number):
        for page in self._pages:
            if page.file_id == file_id and page.page_number == page_number:
                return page
        return None
    
    def get_page_in_pdf_format(self, file_id, page_number):
        reader = PdfReader(f"temp/{file_id}.pdf")
        return reader.pages[page_number - 1]

    

pdf_model_instance = PDF_Model()