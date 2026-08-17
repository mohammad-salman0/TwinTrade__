

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)
import joblib
import time


# ============================================================
# STEP 1 — GENERATE DATASET
# ============================================================

print("\n" + "="*60)
print("  TwinTrade — Final Model Training")
print("="*60)

np.random.seed(42)
rows = 10_000

print(f"\n[1/5] Generating dataset ({rows:,} rows, seed=42)...")

data = {
    "volatility":      np.random.uniform(5,   80,  rows),
    "momentum":        np.random.uniform(-20,  40,  rows),
    "return_30d":      np.random.uniform(-15,  35,  rows),
    "growth_score":    np.random.uniform(40,  100,  rows),
    "halal_score":     np.random.uniform(50,  100,  rows),
    "sector_strength": np.random.uniform(30,  100,  rows),
}

df = pd.DataFrame(data)

df["market_score"] = (
      df["momentum"]        * 0.30
    + df["return_30d"]      * 0.25
    + df["growth_score"]    * 0.20
    + df["halal_score"]     * 0.15
    + df["sector_strength"] * 0.10
    - df["volatility"]      * 0.25
    + np.random.normal(0, 6, rows)   # std=6 instead of 12
)

df["label"] = (df["market_score"] > 25).astype(int)

print(f"    Bullish (1) : {df['label'].sum():,}  ({df['label'].mean()*100:.1f}%)")
print(f"    Bearish (0) : {(df['label']==0).sum():,}  ({(1-df['label'].mean())*100:.1f}%)")


# ============================================================
# STEP 2 — FEATURE ENGINEERING
# ============================================================

print("\n[2/5] Engineering features...")

df["sharpe_like"]        = df["return_30d"] / (df["volatility"] + 1e-6)
df["momentum_strength"]  = df["momentum"] * df["sector_strength"] / 100
df["halal_quality"]      = df["halal_score"] * df["growth_score"] / 100
df["risk_adj_momentum"]  = df["momentum"] / (df["volatility"] + 1e-6)

FEATURES = [
    "volatility",
    "momentum",
    "return_30d",
    "growth_score",
    "halal_score",
    "sector_strength",
    "sharpe_like",
    "momentum_strength",
    "halal_quality",
    "risk_adj_momentum",
]

X = df[FEATURES]
y = df["label"]

print(f"    Total features : {len(FEATURES)} (6 original + 4 engineered)")


# ============================================================
# STEP 3 — TRAIN / TEST SPLIT
# ============================================================

print("\n[3/5] Splitting dataset (80% train / 20% test)...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"    Train : {len(X_train):,}  |  Test : {len(X_test):,}")


# ============================================================
# STEP 4 — TRAIN MODEL
# ============================================================

print("\n[4/5] Training Random Forest...")

t0 = time.perf_counter()

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    max_features="sqrt",
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)

model.fit(X_train, y_train)
train_time = time.perf_counter() - t0

print(f"    Done in {train_time:.2f}s")


# ============================================================
# STEP 5 — EVALUATE
# ============================================================

print("\n[5/5] Evaluating on test set...\n")

preds = model.predict(X_test)

acc  = accuracy_score(y_test, preds)
prec = precision_score(y_test, preds, zero_division=0)
rec  = recall_score(y_test, preds, zero_division=0)
f1   = f1_score(y_test, preds, zero_division=0)

print(f"  Accuracy  : {acc*100:.2f}%")
print(f"  Precision : {prec:.3f}")
print(f"  Recall    : {rec:.3f}")
print(f"  F1 Score  : {f1:.3f}")
print()
print("  Classification Report:")
print(classification_report(
    y_test, preds,
    target_names=["Bearish (0)", "Bullish (1)"]
))

print("  Confusion Matrix:")
cm = confusion_matrix(y_test, preds)
print(f"                  Pred Bearish  Pred Bullish")
print(f"  Actual Bearish     {cm[0][0]:>6}        {cm[0][1]:>6}")
print(f"  Actual Bullish     {cm[1][0]:>6}        {cm[1][1]:>6}")

print("\n  Feature Importances (top 5):")
importances = pd.Series(model.feature_importances_, index=FEATURES)
for feat, imp in importances.sort_values(ascending=False).head(5).items():
    bar = "█" * int(imp * 60)
    print(f"    {feat:<22} {imp:.3f}  {bar}")


# ============================================================
# SAVE
# ============================================================

joblib.dump(model, "model.pkl")

print("\n" + "="*60)
print("  model.pkl saved successfully.")
print("  Copy this into your ai-service/ folder.")
print("="*60 + "\n")