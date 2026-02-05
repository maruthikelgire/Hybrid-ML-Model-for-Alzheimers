import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// --- Styling (Combined here for a single file) ---
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
        --primary-blue: #3b82f6;
        --primary-dark-blue: #1e293b; 
        --text-color: #334155; 
        --text-light: #e2e8f0;
        --success-green: #10b981;
        --warning-orange: #f59e0b;
        --danger-red: #ef4444;
        --border-color: rgba(255, 255, 255, 0.2);
        --glow-blue: rgba(59, 130, 246, 0.5);
        --glow-green: rgba(16, 185, 129, 0.5);
        --glow-purple: rgba(139, 92, 246, 0.5);
    }

    html {
        scroll-behavior: smooth;
    }

    body {
        font-family: 'Inter', sans-serif;
        background-color: #f1f5f9;
        color: var(--text-color);
        margin: 0;
        overflow-x: hidden;
    }
    
    section {
        scroll-margin-top: 80px; /* Offset for sticky nav */
    }

    .page-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        overflow: hidden;
    }

    .aurora-shape {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        opacity: 0.3;
    }
    
    .aurora-1 {
        width: 500px;
        height: 500px;
        background: #818cf8;
        top: -150px;
        left: -150px;
        animation: aurora-move 20s infinite alternate;
    }

    .aurora-2 {
        width: 400px;
        height: 400px;
        background: #f472b6;
        bottom: -100px;
        right: -100px;
        animation: aurora-move 25s infinite alternate-reverse;
    }
    
    .aurora-3 {
        width: 300px;
        height: 300px;
        background: #60a5fa;
        bottom: 50%;
        right: 50%;
        animation: aurora-move 15s infinite alternate;
    }

    @keyframes aurora-move {
        from { transform: translate(0, 0) rotate(0deg); }
        to { transform: translate(200px, 100px) rotate(180deg); }
    }


    /* --- Keyframe Animations --- */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
    }

    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
    }

    @keyframes typing {
        from { width: 0 }
        to { width: 100% }
    }

    @keyframes blink-caret {
        from, to { border-color: transparent; }
        50% { border-color: var(--warning-orange); }
    }


    /* --- Navigation --- */
    nav {
        background: rgba(30, 41, 59, 0.8);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 10px -2px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid var(--border-color);
    }

    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        max-width: 1280px;
        margin: auto;
    }

    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        cursor: pointer;
        transition: transform 0.3s ease;
        text-decoration: none;
    }
    .nav-brand:hover {
        transform: scale(1.05);
    }

    .nav-links {
        display: none; /* Hidden by default, shown on larger screens */
    }
    
    .nav-links a, .nav-links button {
        text-decoration: none;
        background: none;
        border: none;
        font-size: 1rem;
        padding: 0.5rem 0;
        margin: 0 1rem;
        cursor: pointer;
        color: #e2e8f0;
        transition: color 0.2s, transform 0.2s ease;
        border-bottom: 2px solid transparent;
        font-family: 'Inter', sans-serif;
    }

    .nav-links a:hover, .nav-links button:hover {
        color: white;
        transform: translateY(-2px);
    }
    
    .nav-links a.active {
        color: var(--warning-orange);
        border-bottom-color: var(--warning-orange);
        font-weight: 600;
    }

    /* --- Mobile Menu Styles --- */
    .mobile-menu-button {
        display: block; /* Shown by default, hidden on larger screens */
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.5rem;
        z-index: 101; /* Ensure it's above other nav elements */
    }
    
    .mobile-nav-links {
        position: fixed;
        top: 65px; /* Position below navbar */
        right: 1rem;
        background: rgba(30, 41, 59, 0.98);
        backdrop-filter: blur(10px);
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        z-index: 100;
        border: 1px solid var(--border-color);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    
    .mobile-nav-links a, .mobile-nav-links button {
        text-decoration: none;
        background: none;
        border: none;
        color: #e2e8f0;
        font-size: 0.9rem;
        text-align: right;
        padding: 0.25rem 0;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
    }

    /* --- Page Content --- */
    .page-container {
        max-width: 1280px;
        margin: 2.5rem auto;
        padding: 0 1.5rem;
    }
    
    .content-card {
        background: rgba(30, 41, 59, 0.9);
        color: var(--text-light);
        backdrop-filter: blur(12px) saturate(150%);
        padding: 2.5rem;
        border-radius: 1rem;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        border: 1px solid var(--border-color);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        margin-bottom: 2.5rem;
        position: relative;
        overflow: hidden;
    }
    .content-card::before {
        content: '';
        position: absolute;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0;
        transition: opacity 0.4s ease, top 0.4s ease, left 0.4s ease;
    }
    .content-card:hover::before {
        opacity: 1;
    }
    
    .content-card-title {
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-size: 1.75rem;
        font-weight: bold;
        text-align: center;
        margin-top: 0;
        margin-bottom: 2rem;
    }
    .content-card p, .content-card ul, .content-card ol, .content-card li {
        line-height: 1.8;
    }
    
    /* --- Home Page Specific Styles --- */
    .hero-section {
        text-align: center;
        background: linear-gradient(45deg, var(--primary-dark-blue), #4a69bd);
        border-radius: 0.75rem;
        padding: 5rem 2rem;
        color: white;
        overflow: hidden;
    }
    
    .hero-content h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }
    .hero-content p {
        font-size: 1.25rem;
        max-width: 600px;
        margin: 0 auto 2rem auto;
        animation: slideInUp 0.8s ease-out 0.2s backwards;
    }
    .hero-cta {
        background-color: var(--primary-blue);
        color: white;
        padding: 0.8rem 2rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
        animation: slideInUp 0.8s ease-out 0.4s backwards;
        text-decoration: none;
    }
    .hero-cta:hover {
        background-color: #2563eb;
        transform: translateY(-2px);
    }
    
    .home-section {
        margin-top: 3rem;
        text-align: center;
    }
    
    .steps-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }
    
    .support-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        gap: 2.5rem;
        background: rgba(30, 41, 59, 0.9);
        backdrop-filter: blur(10px);
        color: white;
        border-radius: 0.75rem;
        padding: 2.5rem;
        text-align: left;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .support-section:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 25px -8px rgba(44, 62, 80, 0.4);
    }

    .support-text-container {
        position: relative;
        z-index: 1;
    }

    .support-image-container {
        border-radius: 0.75rem;
        overflow: hidden;
    }
    .support-image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.4s ease;
    }
    .support-image-container:hover img {
        transform: scale(1.05);
    }
        
    .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: center;
    }
    .info-grid img {
        width: 100%;
        border-radius: 0.5rem;
    }
    
    .myth-buster-card {
        background: linear-gradient(135deg, #1e293b, #334155);
        color: white;
    }
    .myth-buster-card:hover {
        box-shadow: 0 12px 25px -8px rgba(30, 41, 59, 0.4);
    }
    .myth-buster-card h3 {
        color: #f1f5f9;
        font-size: 1.25rem;
    }
    .myth-buster-card p {
        color: #cbd5e1;
    }
    .myth-options {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
    }
    .myth-options button {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        -webkit-tap-highlight-color: transparent; /* Fix for mobile tap highlight */
    }
    .myth-options button:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }
    .myth-feedback {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: 8px;
        animation: fadeIn 0.5s;
    }
    .myth-feedback.correct {
        background-color: rgba(16, 185, 129, 0.2);
        color: #d1fae5;
        border: 1px solid rgba(16, 185, 129, 0.5);
    }
    .myth-feedback.incorrect {
        background-color: rgba(239, 68, 68, 0.2);
        color: #fee2e2;
        border: 1px solid rgba(239, 68, 68, 0.5);
    }
        
    .content-card.home-glow::before { background: radial-gradient(circle, var(--glow-blue) 0%, transparent 60%); }
    .content-card.about-glow::before { background: radial-gradient(circle, var(--glow-green) 0%, transparent 60%); }
    .content-card.alz-glow::before { background: radial-gradient(circle, var(--glow-purple) 0%, transparent 60%); }

    .go-to-top-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: background-color 0.3s, transform 0.3s;
        text-decoration: none;
    }
    .go-to-top-button:hover {
        background-color: #2563eb;
        transform: scale(1.1);
    }

    /* --- Predictor Header --- */
    .predictor-header {
        background-color: var(--primary-dark-blue);
        color: white;
        padding: 3rem 1.5rem;
        text-align: center;
        border-radius: 0.5rem;
        margin-bottom: 2.5rem;
        animation: float 6s ease-in-out infinite;
    }
    .predictor-header h1 {
        font-size: 2.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
    }
    
    .typing-text {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        border-right: .1em solid var(--warning-orange);
        width: 0;
    }

    .typing-home {
        /* "Empowering Early Detection of Alzheimer's" is 41 chars */
        animation: typing 3.5s steps(41, end) forwards, blink-caret .75s step-end infinite;
    }

    .typing-predictor {
        /* "Alzheimer's Diagnosis Predictor" is 32 chars */
        animation: typing 3s steps(32, end) forwards, blink-caret .75s step-end infinite;
    }

    .predictor-header p {
        font-size: 1.125rem;
        color: #bdc3c7;
        margin: 0;
    }

    /* --- Predictor Form --- */
    .form-sections-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }

    .form-section {
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .form-section:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07);
    }

    .form-section h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.125rem;
        font-weight: 600;
        margin-top: 0;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        padding-bottom: 0.75rem;
        transition: color 0.3s ease;
    }

    .form-section:hover h3 {
        color: var(--primary-blue);
    }

    .input-group {
        margin-bottom: 1.5rem;
    }
    
    .label-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .input-group label {
        font-size: 0.875rem;
        font-weight: 500;
    }
    .input-group-stacked label {
        margin-bottom: 0.5rem;
    }

    .styled-input, .slider-container input {
        width: 100%;
        padding: 0.75rem;
        border-radius: 0.375rem;
        border: 1px solid #d1d5db;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box; /* Ensures padding doesn't affect width */
    }
    .styled-input:focus {
        outline: none;
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
    
    .slider-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .slider-value {
        font-weight: 600;
        color: var(--primary-blue);
        min-width: 3rem;
        text-align: right;
        font-size: 0.875rem;
    }

    .button-container {
        display: flex;
        justify-content: center;
    }
    
    .predict-button {
        padding: 0.75rem 2.5rem;
        font-size: 1.125rem;
        font-weight: 600;
        color: white;
        background-color: var(--primary-blue);
        border: none;
        border-radius: 9999px; /* Pill shape */
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        transition: background-color 0.2s, transform 0.2s;
    }
    .predict-button:hover { 
        background-color: #2563eb;
        transform: translateY(-2px);
    }
    .predict-button:disabled { 
        background-color: #9ca3af; 
        cursor: not-allowed;
        transform: none;
    }

    /* --- Result Modal --- */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        animation: fadeIn 0.3s ease;
        padding: 1rem;
    }
    .modal-content {
        background-color: white;
        padding: 1.5rem 2rem;
        border-radius: 0.75rem;
        width: 100%;
        max-width: 500px;
        position: relative;
        text-align: center;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        animation: slideInUp 0.3s ease-out;
    }
    
    .modal-content h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
    }
    
    .modal-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 1.5rem 0;
    }
    .modal-title.Positive { 
        color: var(--danger-red);
        animation: pulse 2s infinite ease-in-out;
    }
    .modal-title.Negative { 
        color: var(--success-green);
        animation: pulse 2s infinite ease-in-out;
    }

    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #f1f5f9;
        color: #64748b;
        border: none;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        font-size: 1.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }
    .close-button:hover { background-color: #e2e8f0; }

    .risk-assessment {
        margin-bottom: 1.5rem;
        animation: pulse-subtle 3s infinite ease-in-out;
    }
    .risk-assessment label {
        display: block;
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 0.75rem;
    }
    .risk-level {
        padding: 0.5rem 2rem;
        border-radius: 9999px;
        font-weight: 700;
        color: white;
        display: inline-block;
    }
    .risk-level.Low { background-color: var(--success-green); }
    .risk-level.Moderate { background-color: var(--warning-orange); }
    .risk-level.High { background-color: var(--danger-red); }

    .summary-box, .recommendation-box {
        text-align: left;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .summary-box:hover, .recommendation-box:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 10px -2px rgba(0,0,0,0.1);
    }

    .summary-box {
        background-color: #f1f5f9;
        border-left: 4px solid var(--primary-blue);
    }
    .recommendation-box {
        background-color: #fffbeb;
        border-left: 4px solid var(--warning-orange);
    }
    .summary-box h3, .recommendation-box h3 {
        margin: 0 0 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        font-weight: 600;
    }
     .summary-box p, .recommendation-box p {
        margin: 0;
        font-size: 0.9rem;
        color: #475569;
    }

    /* --- Auth Page Styles --- */
    .auth-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
    }

    .auth-card {
        background: rgba(30, 41, 59, 0.9);
        color: var(--text-light);
        backdrop-filter: blur(12px) saturate(150%);
        padding: 2.5rem;
        border-radius: 1rem;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        border: 1px solid var(--border-color);
        width: 100%;
        max-width: 400px;
        text-align: center;
        animation: slideInUp 0.5s ease-out;
    }

    .auth-card h1 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
        color: white;
    }

    .auth-card p {
        color: #cbd5e1;
        margin-bottom: 2rem;
    }
    
    .auth-error-field {
        color: var(--danger-red);
        font-size: 0.75rem;
        text-align: left;
        margin: -1rem 0 1rem 0;
    }

    .auth-error {
        color: var(--danger-red);
        background-color: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--danger-red);
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
    }

    .auth-form .input-group {
        text-align: left;
        margin-bottom: 1.5rem;
    }

    .auth-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .auth-form .styled-input {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
    }
    .auth-form .styled-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .auth-button {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        font-weight: 600;
        color: white;
        background-color: var(--primary-blue);
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.2s;
    }

    .auth-button:hover {
        background-color: #2563eb;
        transform: translateY(-2px);
    }
    
    .auth-toggle {
        margin-top: 1.5rem;
        font-size: 0.875rem;
    }
    
    .auth-toggle button {
        background: none;
        border: none;
        color: var(--primary-blue);
        cursor: pointer;
        font-weight: 600;
        padding: 0 0.25rem;
    }

    /* --- FAQ Page Styles --- */
    .faq-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        overflow: hidden;
    }

    .faq-question {
        background: transparent;
        border: none;
        color: white;
        width: 100%;
        text-align: left;
        padding: 1rem 1.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .faq-question span {
        transition: transform 0.3s ease;
    }

    .faq-answer {
        padding: 0 1.5rem;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.5s ease, padding 0.5s ease;
        text-align: left;
        color: #cbd5e1;
    }
    
    .faq-answer p {
        margin: 0;
        padding-bottom: 1.5rem;
    }
    
    .faq-item.open .faq-answer {
        max-height: 500px; /* Adjust as needed */
    }
    
    .faq-item.open .faq-question span {
        transform: rotate(180deg);
    }
    
    /* --- Responsive & Mobile Fixes --- */
    @media (min-width: 769px) {
        .nav-links {
            display: flex;
        }
        .mobile-menu-button {
            display: none;
        }
    }

    @media (max-width: 768px) {
        .support-section, .info-grid {
            grid-template-columns: 1fr;
        }
        .hero-content h1 {
            font-size: 2.5rem;
        }
        .content-card-title {
            font-size: 1.5rem;
        }
        .go-to-top-button {
            width: 45px;
            height: 45px;
        }
        .page-box, .content-card {
            padding: 1.5rem;
        }
        .predictor-header h1 {
            font-size: 1.5rem; /* Adjusted for smaller screens */
            flex-direction: column; /* Stack icon and text */
            gap: 0.5rem;
        }
        .typing-text {
            white-space: normal; /* Allow text to wrap */
            text-align: center;
            border-right: none;
            animation: none; /* Disable typing animation on mobile */
            width: auto;
        }
        .modal-content {
            max-height: 80vh;
            overflow-y: auto;
        }
        .nav-brand {
            font-size: 1.2rem;
        }
    }
`;

// --- Components for Each Page ---

const HomePage = ({ activeSection }) => {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (activeSection === 'home') {
            setAnimationKey(prevKey => prevKey + 1);
        }
    }, [activeSection]);

    return (
        <section id="home">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 key={animationKey}>
                        <span className="typing-text typing-home">Empowering Early Detection of Alzheimer's</span>
                    </h1>
                    <p>Utilize our advanced hybrid AI to analyze key health metrics and gain insights into cognitive health. An educational tool for awareness and understanding.</p>
                    <a href="#predictor" className="hero-cta">
                        Go to the Predictor
                    </a>
                </div>
            </div>

            <div className="page-container">
                <div className="home-section">
                    <h2>How It Works</h2>
                    <p>A simple three-step process to utilize our tool.</p>
                    <div className="steps-container">
                        <div className="content-card home-glow">
                            <h3>1. Input Your Data</h3>
                            <p>Anonymously enter the required health metrics into our secure form. The more accurate the data, the more insightful the analysis.</p>
                        </div>
                        <div className="content-card home-glow">
                            <h3>2. Get a Prediction</h3>
                            <p>Our AI model analyzes the provided data points to generate an instant risk assessment based on patterns learned from thousands of cases.</p>
                        </div>
                        <div className="content-card home-glow">
                            <h3>3. Learn & Understand</h3>
                            <p>Receive a clear explanation of the result and a recommendation. Use this information to facilitate conversations with healthcare professionals.</p>
                        </div>
                    </div>
                </div>
                
                <div className="home-section">
                    <div className="content-card home-glow">
                        <h2>Why Early Detection Matters</h2>
                        <p>Identifying potential cognitive decline at its earliest stages can be crucial. Early detection allows for:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', textAlign: 'left', columns: 2, breakInside: 'avoid-column' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Access to treatment options that can help manage symptoms.</li>
                            <li style={{ marginBottom: '0.5rem' }}>More time to plan for the future, including care and financial decisions.</li>
                            <li style={{ marginBottom: '0.5rem' }}>The opportunity to participate in clinical trials for new treatments.</li>
                            <li>Implementation of lifestyle changes that may help preserve cognitive function.</li>
                        </ul>
                    </div>
                </div>
                
                <div className="home-section">
                     <div className="support-section">
                         <div className="support-text-container">
                            <h2 style={{marginTop: 0}}>Find Hope & Support</h2>
                            <p style={{color: '#bdc3c7'}}>You are not alone. There are vast resources and communities available to provide support, guidance, and hope for patients, families, and caregivers affected by Alzheimer's disease.</p>
                             <button className="hero-cta" style={{marginTop: '1rem'}} onClick={() => window.open('https://www.alz.org/help-support', '_blank')}>
                                 Explore Resources
                             </button>
                         </div>
                         <div className="support-image-container">
                            <img src="https://placehold.co/600x400/e0f2fe/34495e?text=Community" alt="Support group" />
                         </div>
                     </div>
                </div>
            </div>
        </section>
    );
};

const MythBuster = () => {
    const myths = [
        { statement: "Memory loss is a natural part of aging.", answer: 'Myth', explanation: "While some mild forgetfulness can be normal, significant memory loss that disrupts daily life is not a typical part of aging and could be a sign of a serious condition." },
        { statement: "Alzheimer's disease is not fatal.", answer: 'Myth', explanation: "Alzheimer's is a progressive, fatal disease. It eventually affects all aspects of a person's health and leads to death." },
        { statement: "There are treatments available that can slow the progression of Alzheimer's.", answer: 'Fact', explanation: "While there is no cure, several FDA-approved treatments can help manage symptoms and, in some cases, slow the progression of the disease, especially when started early." },
        { statement: "If a close relative has Alzheimer's, I will get it too.", answer: 'Myth', explanation: "While genetics is a risk factor, it's not a guarantee. Lifestyle and environmental factors also play a significant role." },
        { statement: "Alzheimer's only affects old people.", answer: 'Myth', explanation: "Early-onset Alzheimer's can affect people in their 30s, 40s, and 50s, although it is much less common." },
        { statement: "Drinking from aluminum cans can lead to Alzheimer’s disease.", answer: 'Myth', explanation: "This theory was popular in the 1960s but has since been widely debunked by scientific research." },
        { statement: "You can't reduce your risk of Alzheimer's.", answer: 'Fact', explanation: "Managing cardiovascular health, staying physically and socially active, and maintaining a healthy diet can significantly lower your risk." },
        { statement: "A diagnosis of Alzheimer's means life is over.", answer: 'Myth', explanation: "Many people live meaningful, active, and happy lives for years after receiving an Alzheimer's diagnosis." },
        { statement: "All forms of dementia are Alzheimer's.", answer: 'Myth', explanation: "Alzheimer's is the most common cause, but there are many other types, including Vascular dementia and Lewy body dementia." },
        { statement: "Aspartame causes memory loss.", answer: 'Myth', explanation: "Decades of scientific research have found no credible evidence linking aspartame to memory loss or Alzheimer's." },
        { statement: "Supplements like coconut oil or ginkgo biloba can prevent or cure Alzheimer's.", answer: 'Myth', explanation: "There is no scientific evidence to support claims that alternative therapies can cure or prevent Alzheimer's. Always consult a doctor before starting any new supplement." },
        { statement: "Flu shots increase the risk of Alzheimer's.", answer: 'Myth', explanation: "On the contrary, some studies suggest that flu and pneumonia vaccinations may be associated with a reduced risk of Alzheimer's." },
        { statement: "There is a definitive test to diagnose Alzheimer's.", answer: 'Fact', explanation: "While complex, a combination of medical history, neurological exams, cognitive tests, and brain imaging can diagnose Alzheimer's with a high degree of accuracy." },
    ];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const handleAnswer = (userAnswer) => {
        const isCorrect = userAnswer === myths[currentQuestionIndex].answer;
        setFeedback({
            isCorrect,
            text: myths[currentQuestionIndex].explanation
        });
    };

    const handleNext = () => {
        setFeedback(null);
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % myths.length);
    };

    return (
         <div className="content-card myth-buster-card">
            <h2 className="content-card-title">
                Myth vs. Fact
            </h2>
            <h3>{myths[currentQuestionIndex].statement}</h3>

            {!feedback ? (
                 <div className="myth-options">
                    <button onClick={() => handleAnswer('Myth')}>Myth</button>
                    <button onClick={() => handleAnswer('Fact')}>Fact</button>
                </div>
            ) : (
                <div>
                    <div className={`myth-feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                        <b>{feedback.isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</b> {feedback.text}
                    </div>
                    <div className="myth-options">
                        <button onClick={handleNext}>Next Question</button>
                    </div>
                </div>
            )}
        </div>
    )
}

const AboutPage = () => (
    <section id="about">
        <div className="page-container">
            <div className="content-card about-glow">
                <h2 className="content-card-title">
                    About This Project
                </h2>
                <p style={{textAlign: 'left', marginBottom: '1rem'}}>This project is dedicated to leveraging machine learning to assist in the early detection of Alzheimer's disease. It's built upon a hybrid AI model that analyzes various health factors to identify potential risks. Our system processes user-provided, anonymous data points through a sophisticated algorithm to generate a preliminary risk assessment.</p>
                <p style={{textAlign: 'left'}}>Our primary goal is to provide an accessible, educational tool that can help individuals understand the complex factors associated with the disease. We believe technology, when used responsibly, can be a powerful ally in health awareness and education, empowering users to take proactive steps towards managing their cognitive health.</p>
            </div>
            <div className="content-card about-glow">
                <h2 className="content-card-title">
                    Our Mission
                </h2>
                <p style={{textAlign: 'left'}}>Our mission is to empower individuals and families with accessible information and innovative tools. We aim to foster proactive conversations about cognitive health and contribute to the global effort in understanding and combating Alzheimer's disease through technology and data-driven insights.</p>
            </div>
            <MythBuster />
        </div>
    </section>
);

const WhatIsAlzheimersPage = () => (
    <section id="what-is-alzheimers">
        <div className="page-container">
            <div className="content-card alz-glow">
                <h2 className="content-card-title">What is Alzheimer's Disease?</h2>
                <div className="info-grid">
                    <div>
                        <p>Alzheimer's is a progressive brain disorder and the most common cause of dementia. It slowly destroys memory, thinking skills, and the ability to carry out simple tasks. Symptoms usually develop slowly and get worse over time, becoming severe enough to interfere with daily tasks.</p>
                        <p>The disease is characterized by the buildup of abnormal proteins in the brain, forming plaques and tangles that disrupt communication between brain cells.</p>
                    </div>
                    <img src="https://placehold.co/600x400/cbd5e1/1e293b?text=Brain+Scan" alt="Illustration of brain scan"/>
                </div>
            </div>
            <div className="content-card alz-glow">
                <h2 className="content-card-title">Common Symptoms</h2>
                <p>While symptoms can vary, some common early signs include:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', columns: 2, breakInside: 'avoid-column' }}>
                    <li>Memory loss that disrupts daily life</li>
                    <li>Challenges in planning or problem-solving</li>
                    <li>Difficulty completing familiar tasks</li>
                    <li>Confusion with time or place</li>
                    <li>Trouble with words or writing</li>
                    <li>Misplacing things</li>
                    <li>Poor judgment or decision-making</li>
                    <li>Withdrawal from social activities</li>
                    <li>Changes in mood and personality</li>
                </ul>
            </div>
             <div className="content-card alz-glow">
                <h2 className="content-card-title">Stages of the Disease</h2>
                <div className="info-grid">
                     <img src="https://placehold.co/600x400/dbeafe/1e293b?text=Progression" alt="Graph showing disease progression"/>
                    <div>
                        <p>Alzheimer's typically progresses through several stages:</p>
                        <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
                            <li style={{marginBottom: '0.5rem'}}><b>Early Stage:</b> Mild memory loss and cognitive difficulties may appear, but the person can still function independently.</li>
                            <li style={{marginBottom: '0.5rem'}}><b>Middle Stage:</b> This is often the longest stage. Damage to the brain can make it difficult to express thoughts and perform routine tasks. Personality and behavioral changes may also occur.</li>
                            <li><b>Late Stage:</b> In the final stage, individuals lose the ability to respond to their environment, carry on a conversation, and, eventually, control movement.</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className="content-card alz-glow">
                <h2 className="content-card-title">Prevention & Lifestyle</h2>
                <p>While there is no guaranteed way to prevent Alzheimer's, research suggests that a combination of healthy habits can help reduce the risk of cognitive decline:</p>
                 <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li><b>Regular Physical Exercise:</b> Staying active can help increase blood flow to the brain.</li>
                    <li><b>Heart-Healthy Diet:</b> A diet rich in fruits, vegetables, and whole grains is beneficial.</li>
                    <li><b>Lifelong Learning & Social Engagement:</b> Keeping the brain active and maintaining social connections are key.</li>
                </ul>
            </div>
        </div>
    </section>
);

// --- FAQ Page Component ---
const FAQPage = () => {
    const faqs = [
        { q: "What is the difference between Alzheimer's and dementia?", a: "Dementia is a general term for a decline in mental ability severe enough to interfere with daily life. Alzheimer's is the most common cause of dementia, accounting for 60-80% of cases." },
        { q: "Is Alzheimer's a normal part of aging?", a: "No. While age is the biggest risk factor, Alzheimer's is a progressive brain disease, not a normal part of aging. Significant memory loss is not a typical sign of aging." },
        { q: "What are the early signs of Alzheimer's?", a: "Early signs often include memory loss that disrupts daily life, challenges in planning or solving problems, difficulty completing familiar tasks, and confusion with time or place." },
        { q: "Can Alzheimer's be prevented?", a: "There is no guaranteed way to prevent Alzheimer's, but research suggests that a healthy lifestyle—including a balanced diet, regular exercise, social engagement, and mental stimulation—can help reduce the risk." },
        { q: "Is Alzheimer's genetic?", a: "Genetics can play a role, especially in early-onset Alzheimer's. However, for the more common late-onset form, a combination of genetic, environmental, and lifestyle factors is believed to be involved." },
        { q: "How is Alzheimer's diagnosed?", a: "There is no single test. Diagnosis is made through a complete medical assessment, including medical history, mental status tests, neurological exams, and sometimes brain imaging." },
        { q: "Is there a cure for Alzheimer's?", a: "Currently, there is no cure for Alzheimer's disease. However, there are treatments available that can help manage symptoms and temporarily slow the progression of the disease." },
        { q: "What are the stages of Alzheimer's?", a: "Alzheimer's typically progresses through three main stages: early (mild), middle (moderate), and late (severe). Each stage brings a greater decline in cognitive and functional abilities." },
        { q: "What is 'sundowning'?", a: "Sundowning is a state of confusion and agitation that can occur in the late afternoon and evening in individuals with Alzheimer's. The exact cause is unknown but may be related to fatigue and changes in the body's internal clock." },
        { q: "Can stress cause Alzheimer's?", a: "While chronic stress is not a direct cause, it can impact overall brain health and may be a contributing risk factor. Managing stress is part of a brain-healthy lifestyle." },
        { q: "Does diet affect Alzheimer's risk?", a: "Yes. Diets rich in fruits, vegetables, whole grains, and lean proteins, like the Mediterranean diet, have been associated with a lower risk of cognitive decline." },
        { q: "What is the life expectancy after an Alzheimer's diagnosis?", a: "It varies greatly from person to person. On average, a person with Alzheimer's lives four to eight years after diagnosis, but some can live as long as 20 years." },
        { q: "How can I support someone with Alzheimer's?", a: "Patience, understanding, and establishing a routine are key. Help them stay active and engaged, ensure a safe environment, and seek support for yourself as a caregiver." },
        { q: "Are there clinical trials for Alzheimer's treatments?", a: "Yes, many clinical trials are underway to find better ways to treat, prevent, and diagnose Alzheimer's. Participating in a trial can be a way to access new treatments and contribute to research." },
        { q: "What is Mild Cognitive Impairment (MCI)?", a: "MCI is an intermediate stage between the expected cognitive decline of normal aging and the more serious decline of dementia. People with MCI are at an increased risk of developing Alzheimer's." },
        { q: "Does sleep have an impact on Alzheimer's?", a: "Yes, a growing body of research suggests that poor sleep or sleep disorders may be linked to an increased risk of developing Alzheimer's. Good sleep hygiene is important for brain health." },
        { q: "Can head injuries increase the risk of Alzheimer's?", a: "There appears to be a strong link between serious head injury and future risk of Alzheimer's, especially for moderate to severe traumatic brain injuries." },
        { q: "What's the difference between forgetfulness and dementia?", a: "Normal age-related forgetfulness doesn't significantly interfere with your ability to carry out daily activities. Dementia, on the other hand, involves a decline in cognitive functions that is severe enough to impact daily life." },
        { q: "Can you have more than one type of dementia?", a: "Yes, it's possible to have 'mixed dementia,' where changes representing more than one type of dementia occur in the brain simultaneously. The most common combination is Alzheimer's disease with vascular dementia." },
        { q: "What is early-onset Alzheimer's?", a: "Early-onset (or younger-onset) Alzheimer's affects people younger than age 65. It is much less common than the late-onset form and can have a stronger genetic link." }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq">
            <div className="page-container">
                <div className="content-card">
                    <h2 className="content-card-title">Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                                <button className="faq-question" onClick={() => toggleFAQ(index)}>
                                    {faq.q}
                                    <span>&#9660;</span>
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


// --- Predictor Page Component ---

const PredictorPage = ({ activeSection }) => {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (activeSection === 'predictor') {
            setAnimationKey(prevKey => prevKey + 1);
        }
    }, [activeSection]);

    const [formData, setFormData] = useState({
        Age: 75.0, Gender: 1, Ethnicity: 4, BMI: 25.0, AlcoholConsumption: 1.0, DietQuality: 5.0,
        SleepQuality: 6.0, FamilyHistoryAlzheimers: 0, Diabetes: 0, DiastolicBP: 80.0,
        CholesterolLDL: 130.0, CholesterolHDL: 50.0, CholesterolTriglycerides: 150.0,
        MMSE: 22.0, FunctionalAssessment: 5.0, MemoryComplaints: 1, BehavioralProblems: 0,
        ADL: 6.0, PersonalityChanges: 0,
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const integerFields = new Set(['Gender', 'Ethnicity', 'FamilyHistoryAlzheimers', 'Diabetes', 'MemoryComplaints', 'BehavioralProblems', 'PersonalityChanges']);

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
    
    const renderInputField = (name, label, { options }) => (
        <div className="input-group input-group-stacked" key={name}>
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name} value={formData[name]} onChange={handleChange} className="styled-input">
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );

    const renderRangeField = (name, label, { min, max, step = 1 }) => (
        <div className="input-group" key={name}>
             <div className="label-container">
                <label htmlFor={name}>{label}</label>
                <span className="slider-value">{formData[name]}</span>
             </div>
             <div className="slider-container">
                 <input type="range" id={name} name={name} min={min} max={max} step={step} value={formData[name]} onChange={handleChange} />
             </div>
        </div>
    );

    return (
        <section id="predictor">
            <div className="page-container">
                <header className="predictor-header">
                    <h1 key={animationKey}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="white" strokeWidth="1.5">
                            <path d="M9.96313 2.32715C10.7936 2.06834 11.6919 2 12.6667 2C16.9427 2 20.5 5.5134 20.5 9.75C20.5 11.6441 19.7423 13.3615 18.5 14.65M3.5 9.75C3.5 5.5134 7.05731 2 11.3333 2C11.7133 2 12.0837 2.02904 12.4418 2.08447M12.5 14.25C12.5 14.25 12.5 16.5 12.5 18C12.5 19.6569 11.1569 21 9.5 21C7.84315 21 6.5 19.6569 6.5 18C6.5 16.5 6.5 14.25 6.5 14.25M17 17.5C17.7974 18.0107 18.5 19.3333 18.5 20C18.5 21.1046 17.6046 22 16.5 22C15.3954 22 14.5 21.1046 14.5 20C14.5 19.3333 15.2026 18.0107 16 17.5M12.5 14.25C13.25 12.5 14.5 10 17 8.5M6.5 14.25C5.75 12.5 4.5 10 2 8.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="typing-text typing-predictor">Alzheimer's Disease Predictor</span>
                    </h1>
                    <p>An advanced tool for early detection using a hybrid AI model.</p>
                </header>
                <main className="main-content">
                    <div className="form-sections-container">
                           <div className="form-section">
                                <h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    Demographics & Vitals
                                </h3>
                                {renderRangeField('Age', 'Age', { min: 18, max: 105 })}
                                {renderInputField('Gender', 'Gender', { options: [{value: 0, label: 'Male'}, {value: 1, label: 'Female'}] })}
                                {renderInputField('Ethnicity', 'Ethnicity', { options: [{value: 0, label: 'Caucasian'}, {value: 1, label: 'African American'}, {value: 2, 'label': 'Asian'}, {value: 4, label: 'Indian'}, {value: 3, label: 'Other'}] })}
                                {renderRangeField('BMI', 'Body Mass Index (BMI)', { min: 15, max: 40, step: 0.1 })}
                                {renderRangeField('DiastolicBP', 'Diastolic BP', { min: 50, max: 120 })}
                            </div>
                            <div className="form-section">
                                <h3>
                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 2a10 10 0 0 0-10 10" /><path d="M12 2v20" /><path d="M12 2a10 10 0 0 1 10 10" /><path d="m16 8-4-4-4 4" /></svg>
                                     Medical & Cholesterol
                                </h3>
                                {renderInputField('FamilyHistoryAlzheimers', 'Family History', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                                {renderInputField('Diabetes', 'Diabetes', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                                {renderRangeField('CholesterolLDL', 'Cholesterol LDL', { min: 50, max: 250 })}
                                {renderRangeField('CholesterolHDL', 'Cholesterol HDL', { min: 20, max: 100 })}
                                {renderRangeField('CholesterolTriglycerides', 'Cholesterol Triglycerides', { min: 50, max: 500 })}
                            </div>
                            <div className="form-section">
                                <h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                                    Lifestyle & Behavior
                                </h3>
                                {renderRangeField('AlcoholConsumption', 'Alcohol (units/week)', { min: 0, max: 20 })}
                                {renderRangeField('DietQuality', 'Diet Quality (1-10)', { min: 1, max: 10 })}
                                {renderRangeField('SleepQuality', 'Sleep Quality (1-10)', { min: 1, max: 10 })}
                                {renderInputField('BehavioralProblems', 'Behavioral Problems', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                                {renderInputField('PersonalityChanges', 'Personality Changes', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                            </div>
                             <div className="form-section">
                                <h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
                                    Clinical Scores & Complaints
                                </h3>
                                {renderRangeField('MMSE', 'MMSE Score', { min: 0, max: 30, step: 0.5 })}
                                {renderRangeField('ADL', 'Activities of Daily Living', { min: 0, max: 10, step: 0.5 })}
                                {renderRangeField('FunctionalAssessment', 'Functional Assessment', { min: 0, max: 10, step: 0.5 })}
                                {renderInputField('MemoryComplaints', 'Memory Complaints', { options: [{value: 0, label: 'No'}, {value: 1, label: 'Yes'}] })}
                            </div>
                    </div>
                    <div className="button-container">
                        <button onClick={handlePredict} disabled={loading} className="predict-button">
                            {loading ? 'Analyzing...' : 'Get Diagnosis'}
                        </button>
                    </div>
                </main>
                {result && (
                    <div className="modal-overlay" onClick={() => setResult(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-button" onClick={() => setResult(null)}>×</button>
                            <h2>Diagnostic Report</h2>
                            <h3 className={`modal-title ${resultDetails.status}`}>{resultDetails.title}</h3>
                            
                            <div className="risk-assessment">
                                <label>Risk Level Assessment</label>
                                <span className={`risk-level ${resultDetails.riskLevel}`}>{resultDetails.riskLevel}</span>
                            </div>

                            <div className="summary-box">
                                  <h3>
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m12 16-4-4 1.4-1.4 2.6 2.6 4.6-4.6L18 10z"></path></svg>
                                     Summary
                                  </h3>
                                <p>{resultDetails.explanation}</p>
                            </div>

                            <div className="recommendation-box">
                                <h3>
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                                     Recommendation
                                </h3>
                                <p>{resultDetails.recommendation}</p>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="modal-overlay" onClick={() => setError('')}>
                        <div className="modal-content Error" onClick={e => e.stopPropagation()}>
                            <button className="close-button" onClick={() => setError('')}>×</button>
                            <h3 className="prediction-title">Error</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// --- Auth Page Component ---
const AuthPage = ({ onLogin, users, setUsers }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        if (!isLoginMode && !name) {
            newErrors.name = 'Name is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (isLoginMode) {
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                onLogin();
            } else {
                setErrors({ general: 'Invalid email or password. Please try again.' });
            }
        } else {
            // Sign-up logic
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                setErrors({ email: 'An account with this email already exists.' });
            } else {
                setUsers([...users, { name, email, password }]);
                onLogin();
            }
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
                <p>{isLoginMode ? "Sign in to access Alzheimer's Insights" : "Sign up to get started"}</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {errors.general && <p className="auth-error">{errors.general}</p>}
                    {!isLoginMode && (
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" className="styled-input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name && <p className="auth-error-field">{errors.name}</p>}
                        </div>
                    )}
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="styled-input" 
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="auth-error-field">{errors.email}</p>}
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="styled-input" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="auth-error-field">{errors.password}</p>}
                    </div>
                    <button type="submit" className="auth-button">
                        {isLoginMode ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                 <div className="auth-toggle">
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLoginMode(!isLoginMode); setErrors({}); }}>
                        {isLoginMode ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [users, setUsers] = useState([
        { email: "maruthikelgire451@gmail.com", password: "123456", name: "Maruthi" },
        { email: "maruthikelgire590@gmail.com", password: "123456", name: "Maruthi" },
        { email: "kelgiremaruthi12@gmail.com", password: "123456", name: "Maruthi" },
        { email: "maruthikelgire28@gmail.com", password: "123456", name: "Maruthi" },
    ]);
    
    useEffect(() => {
        if (!isLoggedIn) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -70% 0px',
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            sections.forEach((section) => {
                observer.unobserve(section);
            });
        };
    }, [isLoggedIn]);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setActiveSection('home');
    };

    return (
        <div>
            <style>{styles}</style>
            <div className="page-background">
                <div className="aurora-shape aurora-1"></div>
                <div className="aurora-shape aurora-2"></div>
                <div className="aurora-shape aurora-3"></div>
            </div>

            {!isLoggedIn ? (
                <AuthPage onLogin={handleLogin} users={users} setUsers={setUsers} />
            ) : (
                <>
                    <nav>
                        <div className="nav-container">
                            <a href="#home" className="nav-brand">Alzheimer's Insights</a>
                            
                            <div className="nav-links">
                                <a href="#home" className={activeSection === 'home' ? 'active' : ''}>Home</a>
                                <a href="#about" className={activeSection === 'about' ? 'active' : ''}>About</a>
                                <a href="#what-is-alzheimers" className={activeSection === 'what-is-alzheimers' ? 'active' : ''}>What is Alzheimer's</a>
                                <a href="#faq" className={activeSection === 'faq' ? 'active' : ''}>FAQ</a>
                                <a href="#predictor" className={activeSection === 'predictor' ? 'active' : ''}>Predictor</a>
                                <button onClick={handleLogout}>Log Out</button>
                            </div>

                            <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                            
                            {isMobileMenuOpen && (
                                <div className="mobile-nav-links">
                                    <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
                                    <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
                                    <a href="#what-is-alzheimers" onClick={() => setMobileMenuOpen(false)}>What is Alzheimer's</a>
                                    <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                                    <a href="#predictor" onClick={() => setMobileMenuOpen(false)}>Predictor</a>
                                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Log Out</button>
                                </div>
                            )}
                        </div>
                    </nav>
                    
                    <main>
                        <HomePage activeSection={activeSection} />
                        <AboutPage />
                        <WhatIsAlzheimersPage />
                        <FAQPage />
                        <PredictorPage activeSection={activeSection} />
                    </main>

                    <a href="#home" className="go-to-top-button" title="Go to top">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 15l-6-6-6 6"/>
                        </svg>
                    </a>
                </>
            )}
        </div>
    );
}

export default App;

