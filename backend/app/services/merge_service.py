from model import pdf_model_instance
from model import MergePDFRequest

#TODO: Openapi spec and look up the @ thing

async def merge_pdfs(request: MergePDFRequest):
    print("Received request to merge PDFs!", request)

    pdf_model_instance.merge_selected_pages(request.files)
    pass
