from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import predict_winner, df

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        print(df.head())
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        team1 = data.get("team1")
        team2 = data.get("team2")
        venue = data.get("venue")
        
        if not team1 or not team2 or not venue:
            return jsonify({"error": "Missing parameters"}), 400
            
        print(f"Received request for: {team1} vs {team2} at {venue}")  # Debug log
        
        # Get prediction
        prediction = predict_winner(team1, team2, venue)
        print(f"ML model prediction: {prediction}")  # Debug log
        
        return jsonify({"prediction": prediction})
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    return "IPL Prediction Server is running!"

if __name__ == "__main__":
    app.run(debug=True)