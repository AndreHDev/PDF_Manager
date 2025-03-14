from fastapi.openapi.utils import get_openapi
from main import app
import json


with open("../../openapi/openapi.json", "w") as file:
    json.dump(
        get_openapi(
            title=app.title,
            version=app.version,
            openapi_version=app.openapi_version,
            description=app.description,
            routes=app.routes,
        ),
        file,
        indent=True,
    )

print("OpenAPI schema generated!")
