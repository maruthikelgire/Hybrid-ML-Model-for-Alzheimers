# Alzheimer's Disease Prediction App

This repository contains a React frontend and a FastAPI backend for an Alzheimer's disease prediction demo. The app collects patient demographic, lifestyle, medical, cholesterol, and cognitive score inputs, sends them to a prediction API, and displays a diagnostic risk result.

> Important: This project is for educational/demo use. It is not a medical diagnosis tool and should not replace professional clinical evaluation.

## Repository Structure

```text
alzheimers-app/
  alzheimers-backend/
    main.py
    requirements.txt
    alzheimers_deployment_assets1.joblib
    alzheimers_deployment_assets.joblib
    alzheimers_hybrid_model.pkl
  alzheimers-frontend/
    package.json
    src/App.js
    public/
```

## Exact Model File Used By Backend

The backend prediction code is in:

```text
alzheimers-backend/main.py
```

The exact model artifact loaded by the backend is:

```text
alzheimers-backend/alzheimers_deployment_assets1.joblib
```

This is loaded in `main.py` with:

```python
assets = joblib.load('alzheimers_deployment_assets1.joblib')
```

Because the path is relative, the backend must be started from inside the `alzheimers-backend` folder unless you change the code to use an absolute path.

Inside `alzheimers_deployment_assets1.joblib`, the backend uses:

- `best_rf_model`: `sklearn.ensemble.RandomForestClassifier`
- `best_xgb_model`: `xgboost.sklearn.XGBClassifier`
- `scaler`: `sklearn.preprocessing.StandardScaler`
- `label_encoder`: `sklearn.preprocessing.LabelEncoder`
- `final_selected_columns`: the ordered list of input features

The final prediction is a hybrid ensemble:

```python
probs_rf = rf_model.predict_proba(scaled_features)
probs_xgb = xgb_model.predict_proba(scaled_features)
hybrid_probs = (probs_rf + probs_xgb) / 2.0
```

So the live backend does not directly use `alzheimers_hybrid_model.pkl` or `alzheimers_deployment_assets.joblib`. Those files exist in the backend folder, but `main.py` currently loads only `alzheimers_deployment_assets1.joblib`.

## Model Input Features

The deployed artifact expects these 19 features in this order:

1. `Age`
2. `Gender`
3. `Ethnicity`
4. `BMI`
5. `AlcoholConsumption`
6. `DietQuality`
7. `SleepQuality`
8. `FamilyHistoryAlzheimers`
9. `Diabetes`
10. `DiastolicBP`
11. `CholesterolLDL`
12. `CholesterolHDL`
13. `CholesterolTriglycerides`
14. `MMSE`
15. `FunctionalAssessment`
16. `MemoryComplaints`
17. `BehavioralProblems`
18. `ADL`
19. `PersonalityChanges`

The loaded label encoder currently contains:

- `Cognitively Normal`
- `MCI`

## Features

- User login/signup screen stored in frontend state.
- Informational sections about Alzheimer's disease.
- FAQ and awareness content.
- Responsive predictor form with 19 clinical/lifestyle inputs.
- FastAPI backend with `/` health endpoint and `/predict` prediction endpoint.
- Hybrid prediction logic using Random Forest and XGBoost probability averaging.
- Confidence score returned from the backend.
- Frontend result modal with risk level, summary, and recommendation text.

## Requirements

Install these before running the project:

- Python 3.10 or newer
- Node.js 18 or newer
- npm

## Backend Setup and Run Commands

Open a terminal from the repository root:

```powershell
cd alzheimers-backend
```

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, run this once in the same terminal:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```powershell
pip install -r requirements.txt
```

Start the backend server:

```powershell
uvicorn main:app --reload
```

The backend should run at:

```text
http://127.0.0.1:8000
```

Check the API health endpoint:

```text
http://127.0.0.1:8000/
```

FastAPI interactive docs:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup and Run Commands

Open another terminal from the repository root:

```powershell
cd alzheimers-frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start the React app:

```powershell
npm start
```

The frontend should open at:

```text
http://localhost:3000
```

## Frontend API URL Note

The current frontend prediction request in `alzheimers-frontend/src/App.js` posts to the hosted backend:

```text
https://hybrid-ml-model-fo-alzheimers.onrender.com/predict
```

If you want the frontend to use your local backend instead, change the Axios URL in `src/App.js` to:

```text
http://127.0.0.1:8000/predict
```

Then run both servers:

```powershell
# Terminal 1
cd alzheimers-backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

```powershell
# Terminal 2
cd alzheimers-frontend
npm start
```

## Build and Test Commands

Run frontend tests:

```powershell
cd alzheimers-frontend
npm test
```

Build the frontend for production:

```powershell
cd alzheimers-frontend
npm run build
```

There are no backend tests currently included in the repository.

## API Endpoints

### `GET /`

Returns a basic health response:

```json
{
  "status": "ok",
  "message": "Alzheimer's Prediction API is running."
}
```

### `POST /predict`

Accepts the 19 model features as JSON and returns:

```json
{
  "predicted_diagnosis": "MCI",
  "diagnosis_key": "MCI",
  "confidence_score": 0.87
}
```

Example request body:

```json
{
  "Age": 72,
  "Gender": 1,
  "Ethnicity": 0,
  "BMI": 24.5,
  "AlcoholConsumption": 3,
  "DietQuality": 7,
  "SleepQuality": 6,
  "FamilyHistoryAlzheimers": 1,
  "Diabetes": 0,
  "DiastolicBP": 80,
  "CholesterolLDL": 130,
  "CholesterolHDL": 55,
  "CholesterolTriglycerides": 150,
  "MMSE": 24,
  "FunctionalAssessment": 6,
  "MemoryComplaints": 1,
  "BehavioralProblems": 0,
  "ADL": 7,
  "PersonalityChanges": 0
}
```

## Demo Login

The frontend contains hardcoded demo users in `src/App.js`. One example login is:

```text
Email: maruthikelgire451@gmail.com
Password: 123456
```

New signups are stored only in React state, so they reset when the page reloads.

## Common Issues

### Backend cannot find the model file

Start the backend from inside `alzheimers-backend`:

```powershell
cd alzheimers-backend
uvicorn main:app --reload
```

The model path in `main.py` is relative to the current terminal location.

### Frontend runs but predictions use the hosted API

Update the Axios URL in `alzheimers-frontend/src/App.js` if you want local predictions:

```text
http://127.0.0.1:8000/predict
```

### CORS errors

The backend currently allows all origins with FastAPI CORS middleware. If CORS errors still appear, confirm the backend is running and that the frontend API URL points to the correct backend address.

## Notes for Future Improvements

- Move the frontend API URL into an environment variable such as `REACT_APP_API_URL`.
- Add backend tests for `/predict`.
- Replace hardcoded frontend users with real authentication.
- Add model metadata/versioning so it is always clear which artifact is deployed.
