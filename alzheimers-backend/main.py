# main.py

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# --- 1. Initialize the FastAPI App ---
app = FastAPI(title="Alzheimer's Prediction API")

# --- 2. Add CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Load Your Saved Project Assets ---
try:
    # Ensure this is the correct filename for your newly trained model
    assets = joblib.load('alzheimers_deployment_assets1.joblib')
    rf_model = assets['best_rf_model']
    xgb_model = assets['best_xgb_model']
    scaler = assets['scaler']
    label_encoder = assets['label_encoder']
    selected_features = list(assets['final_selected_columns'])
    print("✅ Assets loaded successfully.")
    print(f"Model expects these {len(selected_features)} features.")
except Exception as e:
    print(f"❌ Error loading assets: {e}")
    selected_features = [] 

# --- 4. Define an Optional Root Endpoint ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Alzheimer's Prediction API is running."}

# --- 5. Define the API Input Model (Pydantic) ---
# UPDATED: This class now matches your new list of 19 features.
class PatientFeatures(BaseModel):
    Age: float
    Gender: int
    Ethnicity: int
    BMI: float
    AlcoholConsumption: float
    DietQuality: float
    SleepQuality: float
    FamilyHistoryAlzheimers: int
    Diabetes: int
    DiastolicBP: float
    CholesterolLDL: float
    CholesterolHDL: float
    CholesterolTriglycerides: float
    MMSE: float
    FunctionalAssessment: float
    MemoryComplaints: int
    BehavioralProblems: int
    ADL: float
    PersonalityChanges: int

# --- 6. Create the Prediction API Endpoint ---
@app.post("/predict")
def predict(features: PatientFeatures):
    # Convert the incoming Pydantic model to a dictionary, then to a DataFrame
    input_df = pd.DataFrame([features.dict()])
    
    # This will automatically use the correct 19 features loaded from your joblib file
    input_df = input_df[selected_features]
    
    # Scale the data using the loaded scaler
    scaled_features = scaler.transform(input_df)
    
    # Make prediction using the hybrid model logic
    probs_rf = rf_model.predict_proba(scaled_features)
    probs_xgb = xgb_model.predict_proba(scaled_features)
    hybrid_probs = (probs_rf + probs_xgb) / 2.0
    
    prediction_index = np.argmax(hybrid_probs, axis=1)
    confidence_score = hybrid_probs[0][prediction_index[0]]
    diagnosis = label_encoder.inverse_transform(prediction_index)[0]
    
    # Create a clean, reliable key for the frontend to use
    diagnosis_key = "UNDETERMINED"
    clean_diagnosis_text = str(diagnosis).strip().lower()

    if 'cognitively normal' in clean_diagnosis_text:
        diagnosis_key = 'NORMAL'
    elif 'mci' in clean_diagnosis_text:
        diagnosis_key = 'MCI'
    elif 'alzheimer' in clean_diagnosis_text:
        diagnosis_key = 'AD'
    
    return {
        "predicted_diagnosis": str(diagnosis),
        "diagnosis_key": diagnosis_key,
        "confidence_score": float(confidence_score)
    }

# To run this server, navigate to this folder in your terminal and run:
# uvicorn main:app --reload