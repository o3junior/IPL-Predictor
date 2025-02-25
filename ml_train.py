import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load data
df = pd.read_csv("Dataset.csv")

# Create and fit encoders
venue_encoder = LabelEncoder()
team_encoder = LabelEncoder()

# Get all unique teams
all_teams = sorted(set(list(df["team1"].unique()) + 
                      list(df["team2"].unique()) + 
                      list(df["winner"].unique())))

# Fit encoders
venue_encoder.fit(df["venue"].unique())
team_encoder.fit(all_teams)

# Transform the data
df_encoded = df.copy()
df_encoded["venue"] = venue_encoder.transform(df["venue"])
df_encoded["team1"] = team_encoder.transform(df["team1"])
df_encoded["team2"] = team_encoder.transform(df["team2"])
df_encoded["winner"] = team_encoder.transform(df["winner"])

# Train the model
X = df_encoded[["team1", "team2", "venue"]]
y = df_encoded["winner"]

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save encoders and model
with open("venue_encoder.pkl", "wb") as f:
    pickle.dump(venue_encoder, f)
with open("team_encoder.pkl", "wb") as f:
    pickle.dump(team_encoder, f)
with open("ipl_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Training complete! Encoders and model saved successfully.")

# Print mappings for verification
print("\nVenue mappings:")
for i, venue in enumerate(venue_encoder.classes_):
    print(f"{venue}: {i}")

print("\nTeam mappings:")
for i, team in enumerate(team_encoder.classes_):
    print(f"{team}: {i}")