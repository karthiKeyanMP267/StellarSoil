
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import subprocess
import json
import tempfile
import os

app = FastAPI(title="Farmer Certificate Validator API")

@app.post("/validate-certificate")
async def validate_certificate(file: UploadFile = File(...)):
    """
    Endpoint to validate and score farmer certificates
    """
    try:
        # Read the uploaded PDF file
        pdf_content = await file.read()

        # Process the PDF using the enhanced script
        result = subprocess.run(
            [sys.executable, "enhanced_certificate_processor.py"],
            input=pdf_content,
            capture_output=True
        )

        if result.returncode == 0:
            # Parse the JSON output
            analysis_result = json.loads(result.stdout.decode('utf-8'))
            return JSONResponse(content=analysis_result)
        else:
            raise HTTPException(status_code=500, detail="Certificate processing failed")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/certificate-standards")
async def get_certificate_standards():
    """
    Endpoint to get information about supported certificate standards
    """
    standards = {
        "organic_farming": {
            "npop_certified": {"score_range": "90-95", "description": "National Programme for Organic Production"},
            "pgs_certified": {"score_range": "80-85", "description": "Participatory Guarantee System"},
            "tnocd_certified": {"score_range": "85-90", "description": "Tamil Nadu Organic Certification"}
        },
        "agmark_grading": {
            "grade_1": {"score_range": "85-90", "description": "Highest quality grade"},
            "grade_2": {"score_range": "75-80", "description": "Good quality grade"}
        },
        "good_agricultural_practices": {
            "indgap_certified": {"score_range": "80-85", "description": "India Good Agricultural Practices"},
            "global_gap": {"score_range": "85-90", "description": "Global Good Agricultural Practices"}
        }
    }
    return JSONResponse(content=standards)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
