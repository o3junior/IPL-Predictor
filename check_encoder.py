import pickle

def load_and_check_encoders():
    # Load the encoders
    try:
        with open("venue_encoder.pkl", "rb") as f:
            venue_encoder = pickle.load(f)
        print("\nVenue Encoder loaded successfully!")
        print("Available venues:")
        for i, venue in enumerate(venue_encoder.classes_):
            print(f"{i}: {venue}")
    except FileNotFoundError:
        print("Venue encoder file not found!")
    
    try:
        with open("team_encoder.pkl", "rb") as f:
            team_encoder = pickle.load(f)
        print("\nTeam Encoder loaded successfully!")
        print("Available teams:")
        for i, team in enumerate(team_encoder.classes_):
            print(f"{i}: {team}")
    except FileNotFoundError:
        print("Team encoder file not found!")
    
    try:
        with open("encoder_classes.pkl", "rb") as f:
            encoder_classes = pickle.load(f)
        print("\nEncoder classes loaded successfully!")
        print("\nVenue mappings:")
        for venue, code in encoder_classes["venues"].items():
            print(f"{venue}: {code}")
        print("\nTeam mappings:")
        for team, code in encoder_classes["teams"].items():
            print(f"{team}: {code}")
    except FileNotFoundError:
        print("Encoder classes file not found!")

if __name__ == "__main__":
    load_and_check_encoders()