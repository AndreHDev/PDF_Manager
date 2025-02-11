from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import base64
from io import BytesIO
import os

class PDF():
    def __init__(self, id, path):
        self._id = id
        self._path = path
        self._pages = []
        self._thumbnails = []

    def set_path(self, path):
        self._path = path
    
    def get_path(self):
        return self._path
    
    def add_page(self, page):
        self._pages.append(page)

    def get_pages(self):
        return self._pages
    
    def add_thumbnail(self, thumbnail):
        self._thumbnails.append(thumbnail)

    def get_thumbnails(self):
        return self._thumbnails
    
    def get_id(self):
        return self._id
    

class PDF_Model():
    def __init__(self):
        self._pdfs = []

    def add_pdf_file(self, file_id, file_path):
        new_pdf = PDF(file_id, file_path)
        reader = PdfReader(file_path)
        for page in reader.pages:
            new_pdf.add_page(page)


        thumbnails = self.get_thumbnails(file_path)
        for thumbnail in thumbnails:
            new_pdf.add_thumbnail(thumbnail)

        self.add_pdf(new_pdf)
        print(f"pdfs: {self._pdfs}")

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

    def get_pdf(self, file_id):
        for pdf in self._pdfs:
            if pdf.get_id() == file_id:
                return pdf
        return None
    
    def add_pdf(self, pdf):
        self._pdfs.append(pdf)
    

pdf_model_instance = PDF_Model()