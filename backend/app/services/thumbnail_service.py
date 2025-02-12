from model import pdf_model_instance

async def get_all_thumbnails_for_file(file_id: str):
    print(f"Got request to get all thumbnails for file: {file_id}")
    return {"thumbnails": pdf_model_instance.get_pdf(file_id).get_thumbnails()}