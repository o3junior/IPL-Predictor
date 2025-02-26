import pandas as pd
import pickle

# Load the dataset
df_original = pd.read_csv("Dataset.csv")

# Load the trained model
try:
    with open("ipl_model.pkl", "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully!")
except FileNotFoundError:
    print("❌ Model file not found! Please train the model first.")
    exit(1)

# Load the encoders
try:
    with open("team_encoder.pkl", "rb") as f:
        team_encoder = pickle.load(f)
    with open("venue_encoder.pkl", "rb") as f:
        venue_encoder = pickle.load(f)
    print("✅ Encoders loaded successfully!")
except FileNotFoundError:
    print("❌ Encoder files not found! Please run the training script first.")
    exit(1)

# Create a copy of the original dataframe for statistical calculations
df_stats = df_original.copy()

# Encode the dataset for model-based predictions
df = df_original.copy()
df["team1"] = team_encoder.transform(df["team1"])
df["team2"] = team_encoder.transform(df["team2"])
df["winner"] = team_encoder.transform(df["winner"])
df["venue"] = venue_encoder.transform(df["venue"])

def get_team_success_rate(df):
    team_wins = df['winner'].value_counts()
    team_matches = df['team1'].value_counts() + df['team2'].value_counts()
    team_success_rate = (team_wins / team_matches).fillna(0) * 100
    return team_success_rate

def get_venue_team_success_rate(df):
    venue_team_wins = df.groupby(['venue', 'winner']).size().unstack(fill_value=0)
    venue_team_matches = df.melt(id_vars=['venue'], value_vars=['team1', 'team2']) \
        .groupby(['venue', 'value']).size().unstack(fill_value=0)
    venue_team_wins, venue_team_matches = venue_team_wins.align(venue_team_matches, fill_value=0)
    venue_team_success_rate = (venue_team_wins / venue_team_matches).fillna(0) * 100
    return venue_team_success_rate

# Define a function to predict winner using the statistical approach
def predict_winner(team1, team2, venue):
    """
    Predict match winner based on historical data and venue statistics.
    Returns structured data with win probabilities.
    """
    # Statistical calculations on the original data
    # Overall Success Rate
    team_success_rate = get_team_success_rate(df_stats)
    team1_success = team_success_rate.get(team1, 0)
    team2_success = team_success_rate.get(team2, 0)
    
    # H2H Record
    h2h_matches = df_stats[((df_stats['team1'] == team1) & (df_stats['team2'] == team2)) |
                           ((df_stats['team1'] == team2) & (df_stats['team2'] == team1))]
    total_h2h = len(h2h_matches)
    team1_h2h_wins = (h2h_matches['winner'] == team1).sum()
    team2_h2h_wins = (h2h_matches['winner'] == team2).sum()
    team1_h2h = (team1_h2h_wins / total_h2h * 100) if total_h2h > 0 else 50
    team2_h2h = (team2_h2h_wins / total_h2h * 100) if total_h2h > 0 else 50
    
    # Venue Success Rate
    venue_success_rate = get_venue_team_success_rate(df_stats)
    team1_venue = venue_success_rate.get(venue, {}).get(team1, 50)
    team2_venue = venue_success_rate.get(venue, {}).get(team2, 50)
    
    # H2H at Venue
    venue_h2h_matches = h2h_matches[h2h_matches['venue'] == venue]
    total_h2h_venue = len(venue_h2h_matches)
    team1_h2h_venue_wins = (venue_h2h_matches['winner'] == team1).sum()
    team2_h2h_venue_wins = (venue_h2h_matches['winner'] == team2).sum()
    team1_h2h_venue = (team1_h2h_venue_wins / total_h2h_venue * 100) if total_h2h_venue > 0 else 50
    team2_h2h_venue = (team2_h2h_venue_wins / total_h2h_venue * 100) if total_h2h_venue > 0 else 50
    
    # Final Score Calculation
    team1_score = (0.2 * team1_success) + (0.35 * team1_h2h) + (0.2 * team1_venue) + (0.25 * team1_h2h_venue)
    team2_score = (0.2 * team2_success) + (0.35 * team2_h2h) + (0.2 * team2_venue) + (0.25 * team2_h2h_venue)
    
    # Convert scores to winning probabilities
    if team1_score + team2_score == 0:
        prob_team1 = 50
        prob_team2 = 50
    else:
        prob_team1 = team1_score / (team1_score + team2_score) * 100
        prob_team2 = team2_score / (team1_score + team2_score) * 100
    
    # Return structured data instead of a string
    return {
        "team1": {
            "name": team1,
            "probability": prob_team1
        },
        "team2": {
            "name": team2,
            "probability": prob_team2
        },
        "winner": team1 if prob_team1 > prob_team2 else team2
    }

# Example Test
if __name__ == "__main__":
    team1 = "Royal Challengers Bengaluru"
    team2 = "Kolkata Knight Riders"
    venue = "M Chinnaswamy Stadium, Bengaluru"
    
    print(predict_winner(team1, team2, venue))
