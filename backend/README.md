python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt (poppler utils missing?) -> conda install -c conda-forge poppler

uvicorn main:app --reload
python3 generate_openapi.py
