from fastapi import FastAPI
from routes import traditional, aanf

app = FastAPI(
    title="AANF Banking API",
    description="Simulated backend for Traditional and AANF-based banking",
    version="1.0.0"
)

# Register route modules with path prefixes
app.include_router(traditional.router, prefix="/traditional")
app.include_router(aanf.router, prefix="/aanf")
