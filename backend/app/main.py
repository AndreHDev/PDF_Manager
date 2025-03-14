from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils import openapi
from backend_services import PDF_Model
from router import fileRouter

app = FastAPI()

model = PDF_Model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fileRouter)


openapi.simplify_operation_ids(app)