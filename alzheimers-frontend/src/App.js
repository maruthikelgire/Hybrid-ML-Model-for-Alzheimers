// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    // State to hold the form data with the new 19 features
    const [formData, setFormData] = useState({
        Age: 75.0,
        Gender: 1,
        Ethnicity: 4,
        BMI: 25.0,
        AlcoholConsumption: 1.0,
        DietQuality: 5.0,
        SleepQuality: 6.0,
        FamilyHistoryAlzheimers: 0,
        Diabetes: 0,
        DiastolicBP: 80.0,
        CholesterolLDL: 130.0,
        CholesterolHDL: 50.0,
        CholesterolTriglycerides: 150.0,
        MMSE: 22.0,
        FunctionalAssessment: 5.0,
        MemoryComplaints: 1,
        BehavioralProblems: 0,
        ADL: 6.0,
        PersonalityChanges: 0,
    });
    
    // State to hold the result, loading status, and any errors
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // A set of feature names that should be treated as integers
    const integerFields = new Set([
        'Gender', 'Ethnicity', 'FamilyHistoryAlzheimers', 'Diabetes', 
        'MemoryComplaints', 'BehavioralProblems', 'PersonalityChanges'
    ]);

    // This function now intelligently handles integers and floats
    const handleChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = integerFields.has(name) ? parseInt(value, 10) : parseFloat(value);
        setFormData({ ...formData, [name]: parsedValue });
    };

    const handlePredict = async () => {
        setLoading(true);
        setResult(null);
        setError('');
        try {
            const response = await axios.post('https://hybrid-ml-model-fo-alzheimers.onrender.com/predict', formData);
            setResult(response.data);
        } catch (err) {
            setError('Prediction failed. Please ensure the backend server is running and accessible.');
            console.error(err);
        }
        setLoading(false);
    };

    // This function now defines a "Risk Level" instead of a confidence score
    const getResultDetails = (resultData) => {
        const key = resultData.diagnosis_key;
        let details = {};

        switch (key) {
            case 'NORMAL':
                details = { status: 'Negative', title: "Alzheimer's: Negative", riskLevel: 'Low', explanation: `The patient's cognitive profile appears stable and does not show signs of significant cognitive decline.`, recommendation: 'Regular cognitive health monitoring is advised.' };
                break;
            case 'MCI':
                details = { status: 'Positive', title: "Alzheimer's Risk: Positive", riskLevel: 'Moderate', explanation: `The model predicts Mild Cognitive Impairment (MCI), which suggests early-stage cognitive decline that is a known risk factor for Alzheimer's.`, recommendation: 'A comprehensive clinical evaluation by a specialist is strongly recommended.' };
                break;
            case 'AD':
                details = { status: 'Positive', title: "Alzheimer's: Positive", riskLevel: 'High', explanation: `The model's analysis suggests a pattern consistent with Alzheimer's Disease.`, recommendation: 'Immediate consultation with a specialist for a full clinical workup is highly advised.' };
                break;
            default:
                details = { status: 'Undetermined', title: 'Prediction Result', riskLevel: 'Unknown', explanation: `The server returned an unhandled diagnosis key ("${resultData.diagnosis_key}").`, recommendation: 'Please check the backend logic in main.py.' };
        }
        return details;
    };
    
    const resultDetails = result ? getResultDetails(result) : null;
    
    // Reusable component for rendering different input types
    const renderInputField = (name, label, { type = 'select', options }) => {
        return (
            <div className="input-group" key={name}>
                <label htmlFor={name}>{label}</label>
                <select id={name} name={name} value={formData[name]} onChange={handleChange} className="styled-input">
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
        );
    };

    const renderRangeField = (name, label, { min, max, step = 1 }) => {
        return (
            <div className="input-group" key={name}>
                 <label htmlFor={name}>{label}</label>
                 <div className="slider-container">
                    <input type="range" id={name} name={name} min={min} max={max} step={step} value={formData[name]} onChange={handleChange} />
                    <span className="slider-value">{formData[name]}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>🧠 Alzheimer's Diagnosis Predictor</h1>
                <p className="subtitle">An advanced tool for early detection using a hybrid AI model.</p>
            </header>
            <main className="main-content">
                <div className="form-sections-container">
                    {/* --- Section 1: Demographics & Vitals --- */}
                    <div className="form-section">
                        <h3>👨‍👩‍👧‍👦 Demographics & Vitals</h3>
                        {renderRangeField('Age', 'Age', { min: 18, max: 105 })}
                        {renderInputField('Gender', 'Gender', { options: [{value: 0, label: 'Male'}, {value: 1, label: 'Female'}] })}
                        {renderInputField('Ethnicity', 'Ethnicity', { options: [{value: 0, label: 'Caucasian'}, {value: 1, label: 'African American'}, {value: 2, 'label': 'Asian'}, {value: 4, label: 'Indian'}, {value: 3, label: 'Other'}] })}
                        {renderRangeField('BMI', 'Body Mass Index (BMI)', { min: 15, max: 40, step: 0.1 })}
                        {renderRangeField('DiastolicBP', 'Diastolic BP', { min: 50, max: 120 })}
                    </div>

                    {/* --- Section 2: Medical History & Cholesterol --- */}
                    <div className="form-section">
                        <h3>🩺 Medical & Cholesterol</h3>
                        {renderInputField('FamilyHistoryAlzheimers', 'Family History of Alzheimer\'s', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                        {renderInputField('Diabetes', 'Diabetes', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                        {renderRangeField('CholesterolLDL', 'Cholesterol LDL', { min: 50, max: 250 })}
                        {renderRangeField('CholesterolHDL', 'Cholesterol HDL', { min: 20, max: 100 })}
                        {renderRangeField('CholesterolTriglycerides', 'Cholesterol Triglycerides', { min: 50, max: 500 })}
                    </div>
                    
                    {/* --- Section 3: Lifestyle & Behavior --- */}
                    <div className="form-section">
                        <h3>📝 Lifestyle & Behavior</h3>
                        {renderRangeField('AlcoholConsumption', 'Alcohol Consumption (units/week)', { min: 0, max: 20 })}
                        {renderRangeField('DietQuality', 'Diet Quality (1-10)', { min: 1, max: 10 })}
                        {renderRangeField('SleepQuality', 'Sleep Quality (1-10)', { min: 1, max: 10 })}
                        {renderInputField('BehavioralProblems', 'Behavioral Problems', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                        {renderInputField('PersonalityChanges', 'Personality Changes', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                    </div>

                    {/* --- Section 4: Clinical Scores & Complaints --- */}
                    <div className="form-section">
                        <h3>📊 Clinical Scores & Complaints</h3>
                        {renderRangeField('MMSE', 'MMSE Score', { min: 0, max: 30, step: 0.5 })}
                        {renderRangeField('ADL', 'Activities of Daily Living (ADL)', { min: 0, max: 10, step: 0.5 })}
                        {renderRangeField('FunctionalAssessment', 'Functional Assessment', { min: 0, max: 10, step: 0.5 })}
                        {renderInputField('MemoryComplaints', 'Memory Complaints', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                    </div>
                </div>

                <button onClick={handlePredict} disabled={loading} className="predict-button">
                    {loading ? 'Analyzing...' : 'Get Diagnosis'}
                </button>
            </main>

            {/* UPDATED: The result pop-up now shows the single Risk Level */}
            {result && (
                <div className="modal-overlay" onClick={() => setResult(null)}>
                    <div className={`modal-content ${resultDetails.status}`} onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setResult(null)}>×</button>
                        <h2>Diagnostic Report</h2>
                        <h3 className="prediction-title">{resultDetails.title}</h3>
                        
                        <div className="risk-level-section">
                            <label>Risk Level Assessment</label>
                            <div className="risk-level-display">
                                <span className={`risk-level ${resultDetails.riskLevel}`}>{resultDetails.riskLevel}</span>
                            </div>
                        </div>

                        <div className="explanation-section">
                            <h3>Summary</h3>
                            <p>{resultDetails.explanation}</p>
                        </div>
                        <div className="recommendation-section">
                            <h3>Recommendation</h3>
                            <p>{resultDetails.recommendation}</p>
                        </div>
                    </div>
                </div>
            )}
            {error && (
                 <div className="modal-overlay" onClick={() => setError('')}>
                    <div className="modal-content Error" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={() => setError('')}></button>
                        <h3 className="prediction-title">Error</h3>
                        <p className="error-text">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;