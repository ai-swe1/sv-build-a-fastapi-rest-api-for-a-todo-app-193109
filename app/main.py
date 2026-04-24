from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Import routers or other modules as needed
# from app import routers

app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Root endpoint serves the UI entry point
@app.get("/")
def root():
    return FileResponse("static/index.html")

# Include additional API routes here if desired
# app.include_router(routers.todo_router)
