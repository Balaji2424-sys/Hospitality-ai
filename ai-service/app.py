from io import BytesIO
from typing import List, Optional

import numpy as np
from fastapi import FastAPI
from gtts import gTTS
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline


DATASET = [
    ("fever cough headache", "Flu"),
    ("fever body pain fatigue", "Viral Fever"),
    ("cough sneezing runny nose", "Common Cold"),
    ("fever chills sweating", "Malaria"),
    ("fever rash joint pain", "Dengue"),
    ("chest pain shortness of breath", "Heart Disease"),
    ("thirst frequent urination fatigue", "Diabetes"),
    ("headache nausea sensitivity to light", "Migraine"),
    ("stomach pain nausea vomiting", "Food Poisoning"),
    ("sore throat cough fever", "Throat Infection"),
    ("weight loss fatigue cough", "Tuberculosis"),
    ("fever cough breathing difficulty", "COVID-19"),
    ("itching rash redness", "Allergy"),
    ("joint pain stiffness swelling", "Arthritis"),
    ("abdominal pain diarrhea dehydration", "Gastroenteritis"),
    ("back pain leg pain numbness", "Sciatica"),
    ("frequent urination painful urination", "Urinary Tract Infection"),
    ("vomiting diarrhea", "Cholera"),
    ("high blood pressure headache", "Hypertension"),
    ("hair loss fatigue", "Thyroid Disorder"),
    ("chest tightness wheezing", "Asthma"),
    ("nausea heartburn", "Acidity"),
    ("confusion memory loss", "Stroke"),
    ("fatigue joint pain", "Lupus"),
    ("dry skin itching", "Eczema"),
    ("fever chills", "Typhoid"),
    ("weight gain fatigue", "Hypothyroidism"),
    ("weight loss anxiety", "Hyperthyroidism"),
    ("persistent cough blood", "Lung Cancer"),
    ("abdominal swelling jaundice", "Liver Disease"),
]

TRANSLATIONS = {
    "en": {
        "title": "Medical Report",
        "greeting": "Hello, this is your health report.",
        "recommend_1": "Rest well and stay hydrated.",
        "recommend_2": "Consult a doctor if symptoms worsen.",
        "severity_low": "Low",
        "severity_medium": "Medium",
        "severity_high": "High",
    },
    "hi": {
        "title": "\u091a\u093f\u0915\u093f\u0924\u094d\u0938\u093e \u0930\u093f\u092a\u094b\u0930\u094d\u091f",
        "greeting": "\u0928\u092e\u0938\u094d\u0924\u0947, \u092f\u0939 \u0906\u092a\u0915\u0940 \u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0939\u0948\u0964",
        "recommend_1": "\u0906\u0930\u093e\u092e \u0915\u0930\u0947\u0902 \u0914\u0930 \u092a\u0930\u094d\u092f\u093e\u092a\u094d\u0924 \u092a\u093e\u0928\u0940 \u092a\u093f\u090f\u0902\u0964",
        "recommend_2": "\u092f\u0926\u093f \u0932\u0915\u094d\u0937\u0923 \u092c\u0922\u093c\u0947\u0902 \u0924\u094b \u0921\u0949\u0915\u094d\u091f\u0930 \u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964",
        "severity_low": "\u0915\u092e",
        "severity_medium": "\u092e\u0927\u094d\u092f\u092e",
        "severity_high": "\u0909\u091a\u094d\u091a",
    },
    "ta": {
        "title": "\u0bae\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0bb5 \u0b85\u0bb1\u0bbf\u0b95\u0bcd\u0b95\u0bc8",
        "greeting": "\u0bb5\u0ba3\u0b95\u0bcd\u0b95\u0bae\u0bcd, \u0b87\u0ba4\u0bc1 \u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd \u0b89\u0b9f\u0bb2\u0bcd\u0ba8\u0bb2 \u0b85\u0bb1\u0bbf\u0b95\u0bcd\u0b95\u0bc8.",
        "recommend_1": "\u0b93\u0baf\u0bcd\u0bb5\u0bc1 \u0b8e\u0b9f\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1 \u0baa\u0bcb\u0ba4\u0bc1\u0bae\u0bbe\u0ba9 \u0ba4\u0ba3\u0bcd\u0ba3\u0bc0\u0bb0\u0bcd \u0b95\u0bc1\u0b9f\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
        "recommend_2": "\u0b85\u0bb1\u0bbf\u0b95\u0bc1\u0bb1\u0bbf\u0b95\u0bb3\u0bcd \u0bae\u0bcb\u0b9a\u0bae\u0bbe\u0ba9\u0bbe\u0bb2\u0bcd \u0bae\u0bb0\u0bc1\u0ba4\u0bcd\u0ba4\u0bc1\u0bb5\u0bb0\u0bc8 \u0b85\u0ba3\u0bc1\u0b95\u0bb5\u0bc1\u0bae\u0bcd.",
        "severity_low": "\u0b95\u0bc1\u0bb1\u0bc8\u0bb5\u0bc1",
        "severity_medium": "\u0bae\u0bbf\u0ba4\u0bae\u0bbe\u0ba9",
        "severity_high": "\u0b85\u0ba4\u0bbf\u0b95\u0bae\u0bcd",
    },
}

SEVERITY_KEYWORDS = {
    "High": {"chest pain", "shortness of breath", "blood", "stroke", "breathing difficulty", "jaundice"},
    "Medium": {"fever", "vomiting", "painful urination", "wheezing", "fatigue"},
}

texts = [text for text, _ in DATASET]
labels = [label for _, label in DATASET]

pipeline = Pipeline(
    [
        ("vectorizer", TfidfVectorizer()),
        ("classifier", MultinomialNB()),
    ]
)
pipeline.fit(texts, labels)

app = FastAPI(title="RuralCare AI Service")


class HistoryItem(BaseModel):
    symptoms: List[str] = []
    predictions: List[dict] = []


class PredictRequest(BaseModel):
    symptoms: List[str]
    language: str = "en"
    history: List[HistoryItem] = []
    patient_details: Optional[dict] = None


def get_locale(language: str) -> dict:
    return TRANSLATIONS.get(language, TRANSLATIONS["en"])


def compute_severity(symptoms: List[str]) -> str:
    normalized = " ".join(symptoms).lower()
    for level, words in SEVERITY_KEYWORDS.items():
        if any(word in normalized for word in words):
            return level
    return "Low"


def localize_severity(language: str, severity: str) -> str:
    locale = get_locale(language)
    return locale[f"severity_{severity.lower()}"]


def apply_history_boost(predictions: List[dict], history: List[HistoryItem]) -> List[dict]:
    if not history:
        return predictions

    boost_map = {}
    for item in history:
        for prediction in item.predictions[:1]:
            disease = prediction.get("disease")
            if disease:
                boost_map[disease] = boost_map.get(disease, 0) + 5

    boosted = []
    for prediction in predictions:
        boosted.append(
            {
                **prediction,
                "confidence": min(99.0, prediction["confidence"] + boost_map.get(prediction["disease"], 0)),
            }
        )
    return sorted(boosted, key=lambda item: item["confidence"], reverse=True)


def build_report(language: str, symptoms: List[str], predictions: List[dict], severity: str) -> str:
    locale = get_locale(language)
    prediction_lines = "; ".join([f'{item["disease"]} ({item["confidence"]}%)' for item in predictions])
    return (
        f"{locale['title']}\n"
        f"Symptoms: {', '.join(symptoms)}\n"
        f"Top Predictions: {prediction_lines}\n"
        f"Severity: {localize_severity(language, severity)}\n"
        f"Advice: {locale['recommend_1']} {locale['recommend_2']}"
    )


def get_prediction_response(payload: PredictRequest) -> dict:
    symptom_text = " ".join(payload.symptoms)
    probabilities = pipeline.predict_proba([symptom_text])[0]
    indices = np.argsort(probabilities)[::-1][:3]
    predictions = [
        {
            "disease": pipeline.classes_[index],
            "confidence": round(float(probabilities[index] * 100), 2),
        }
        for index in indices
    ]
    predictions = apply_history_boost(predictions, payload.history)
    severity = compute_severity(payload.symptoms)
    locale = get_locale(payload.language)

    return {
        "predictions": predictions,
        "severity": severity,
        "localized_severity": localize_severity(payload.language, severity),
        "recommendations": [locale["recommend_1"], locale["recommend_2"]],
        "report_text": build_report(payload.language, payload.symptoms, predictions, severity),
        "confidence_average": round(sum(item["confidence"] for item in predictions) / len(predictions), 2),
    }


@app.get("/health")
def health():
    return {"success": True, "service": "ai-service"}


@app.post("/predict")
def predict(payload: PredictRequest):
    return get_prediction_response(payload)


@app.post("/voice-report")
def voice_report(payload: PredictRequest):
    diagnosis = get_prediction_response(payload)
    locale = get_locale(payload.language)
    speech_text = f"{locale['greeting']} {diagnosis['report_text']}"
    buffer = BytesIO()
    tts = gTTS(text=speech_text, lang={"en": "en", "hi": "hi", "ta": "ta"}.get(payload.language, "en"))
    tts.write_to_fp(buffer)
    return {
        "speech_text": speech_text,
        "audio_base64_length": len(buffer.getvalue()),
    }
