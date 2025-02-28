import unittest
from unittest.mock import MagicMock
from fastapi import UploadFile
from io import BytesIO
import os
import sys
from PyPDF2 import PdfReader
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../app')))
from backend import PDF_Model

class Test_Backend(unittest.TestCase):
    def setUp(self):
        self.model = PDF_Model()
        self.fixture_dir = os.path.join(os.path.dirname(__file__), 'fixtures')
        self.one_page_pdf = os.path.join(self.fixture_dir, 'OnePage.pdf')
        self.three_page_pdf = os.path.join(self.fixture_dir, 'ThreePages.pdf')

        self.addCleanup(self.cleanup)

    def cleanup(self):
        for file in os.listdir("temp"):
            if file.endswith(".pdf"):
                os.remove(f"temp/{file}")

    def test_add_pdf_file_one_page(self):
        with open(self.one_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='OnePage.pdf', file=BytesIO(file_content))
        file_id = self.model.add_pdf_file(file)
        self.assertEqual(len(self.model.get_pages()), 1,
            msg="Expected 1 page to be added to the model")
        self.assertEqual(self.model.get_pages()[0].file_id, file_id,
            msg="Expected the file_id to be the file_id of original pdf set on the page object")
        self.assertEqual(self.model.get_pages()[0].page_number, 1,
            msg="Expected the page number to be 1")
        self.assertIn('data:image/png;base64,', self.model.get_pages()[0].thumbnail,
            msg="Expected the thumbnail to be set")
        self.assertEqual(self.model.get_pages()[0].checked, True,
            msg="Expected the checked attribute to be True by default")
        
    def test_add_pdf_file_three_pages(self):
        with open(self.three_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='ThreePages.pdf', file=BytesIO(file_content))
        file_id = self.model.add_pdf_file(file)
        self.assertEqual(len(self.model.get_pages()), 3,
            msg="Expected 3 pages to be added to the backend")
        for i in range(3):
            self.assertEqual(self.model.get_pages()[i].file_id, file_id,
                msg=f"Expected the file_id to be the file_id of original pdf set on the page object")
            self.assertEqual(self.model.get_pages()[i].page_number, i + 1,
                msg=f"Expected the page number to be {i + 1}")
            self.assertIn('data:image/png;base64,', self.model.get_pages()[i].thumbnail,
                msg="Expected the thumbnail to be set")
            self.assertEqual(self.model.get_pages()[i].checked, True,
                msg="Expected the checked attribute to be True by default")
            
    def test_add_pdf_file_multiple_files(self):
        with open(self.one_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='OnePage.pdf', file=BytesIO(file_content))
        one_page_file_id = self.model.add_pdf_file(file)

        with open(self.three_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='ThreePages.pdf', file=BytesIO(file_content))
        three_page_file_id = self.model.add_pdf_file(file)

        self.assertEqual(len(self.model.get_pages()), 4,
            msg=f"Expected 4 pages to be added to the backend, got {len(self.model.get_pages())}")
        self.assertEqual(self.model.get_pages()[0].file_id, one_page_file_id,
            msg=f"Expected the file_id to be the file_id of the first file ({one_page_file_id}) uploaded, got {self.model.get_pages()[0].file_id}")
        for i in range(1,4):
            self.assertEqual(self.model.get_pages()[i].file_id, three_page_file_id,
                msg=f"Expected the file_id to be the file_id of the second file ({three_page_file_id}) uploaded, got {self.model.get_pages()[i].file_id}")
            self.assertEqual(self.model.get_pages()[i].page_number, i,
                msg=f"Expected the page number to be {i}, got {self.model.get_pages()[i].page_number}")
            self.assertIn('data:image/png;base64,', self.model.get_pages()[i].thumbnail,
                msg="Expected the thumbnail to be set")
            self.assertEqual(self.model.get_pages()[i].checked, True,
                msg="Expected the checked attribute to be True by default")
            
    def test_remove_pages(self):
        self.model._pages= [MagicMock(), MagicMock(), MagicMock()]
        self.model.remove_pages()
        self.assertEqual(self.model.get_pages(), [],
            msg="Expected the pages to be removed from the model")
        
    def test_add_page(self):
        page = MagicMock()
        self.model.add_page(page)
        self.assertIn(page, self.model.get_pages(),
            msg="Expected the page to be added to the model")
        
    def test_get_pages(self):
        self.assertEqual(self.model.get_pages(), [],
            msg=f"Expected an empty list to be returned when no pages are present in the model, got {self.model.get_pages()}")
        self.model._pages = [MagicMock(), MagicMock(), MagicMock()]
        self.assertEqual(self.model.get_pages(), self.model._pages,
            msg=f"Expected the list of pages to be returned, got {self.model.get_pages()}")
        
    def test_get_thumbnails(self):
        thumbnails = self.model.get_thumbnails(self.one_page_pdf)
        self.assertEqual(len(thumbnails), 1,
            msg=f"Expected 1 thumbnail to be returned, got {len(thumbnails)}")
        
        thumbnails = self.model.get_thumbnails(self.three_page_pdf)
        self.assertEqual(len(thumbnails), 3,
            msg=f"Expected 3 thumbnails to be returned, got {len(thumbnails)}")
        
    def test_merge_selected_pages(self):
        with open(self.three_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='ThreePages.pdf', file=BytesIO(file_content))
        file_id = self.model.add_pdf_file(file)

        with open(self.one_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='OnePage.pdf', file=BytesIO(file_content))
        file_id = self.model.add_pdf_file(file)

        merged_file_id = self.model.merge_selected_pages(self.model.get_pages())

        reader = PdfReader("temp/" + merged_file_id + ".pdf")
        text_pages = []
        for page in reader.pages:
            text_pages.append(page.extract_text())

        self.assertEqual(len(text_pages), 4,
            msg=f"Expected 4 pages to be merged, got {len(text_pages)}")
        self.assertIn("1", text_pages[0],
            msg=f"Expected the first page to contain ones, got {text_pages[0]}")
        self.assertIn("2", text_pages[1],
            msg=f"Expected the second page to contain twos, got {text_pages[1]}")
        self.assertIn("3", text_pages[2],
            msg=f"Expected the third page to contain threes, got {text_pages[2]}")
        self.assertIn("1", text_pages[3],
            msg=f"Expected the fourth page to contain ones, got {text_pages[3]}")
        
    def test_merge_selected_pages_with_selection(self):
        with open(self.three_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='ThreePages.pdf', file=BytesIO(file_content))
        file_id = self.model.add_pdf_file(file)

        with open(self.one_page_pdf, 'rb') as f:
            file_content = f.read()
        file = UploadFile(filename='OnePage.pdf', file=BytesIO(file_content))
        file_id = self.model.add_pdf_file(file)

        self.model.get_pages()[0].checked = False
        merged_file_id = self.model.merge_selected_pages(self.model.get_pages())

        reader = PdfReader("temp/" + merged_file_id + ".pdf")
        text_pages = []
        for page in reader.pages:
            text_pages.append(page.extract_text())

        self.assertEqual(len(text_pages), 3,
            msg=f"Expected 3 pages to be merged, got {len(text_pages)}")
        self.assertNotIn("1", text_pages[0],
            msg=f"Expected the first page to not contain ones, got {text_pages[0]}")
        self.assertIn("2", text_pages[0],
            msg=f"Expected the first page to contain twos, got {text_pages[0]}")
        self.assertIn("3", text_pages[1],
            msg=f"Expected the second page to contain threes, got {text_pages[1]}")
        self.assertIn("1", text_pages[2],
            msg=f"Expected the third page to contain ones, got {text_pages[2]}")
    

if __name__ == '__main__':
    unittest.main()