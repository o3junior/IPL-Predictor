import React, { useState } from "react";
import { sendMatchData } from "./api";

const venues = [
  { name: "M Chinnaswamy Stadium, Bengaluru" },
  { name: "Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur" },
  { name: "Arun Jaitley Stadium, Delhi" },
  { name: "Wankhede Stadium, Mumbai" },
  { name: "Eden Gardens, Kolkata" },
  { name: "Sawai Mansingh Stadium, Jaipur" },
  { name: "Rajiv Gandhi International Stadium, Hyderabad" },
  { name: "MA Chidambaram Stadium, Chennai" },
  { name: "Narendra Modi Stadium, Ahmedabad" },
  { name: "Himachal Pradesh Cricket Association, Dharmasala" },
  { name: "Holkar Cricket Stadium, Indore" },
  { name: "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam" },
  { name: "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow" },
  { name: "Barsapara Cricket Stadium, Guwahati" }
];

const teamStadiums = {
  "CSK": "Chepauk.png",
  "MI": "Wankhede.png",
  "RCB": "Chinnaswamy.png",
  "KKR": "Eden_Gardens.png",
  "PBKS": "Mohali.png",
  "SRH": "Rajiv_Gandhi.png",
  "DC": "Arun_Jaitley.png",
  "RR": "Jaipur.png",
  "LSG": "Ekana.png",
  "GT": "Motera.png"
};

const teamFullNames = {
  "KKR": "Kolkata Knight Riders",
  "CSK": "Chennai Super Kings",
  "MI": "Mumbai Indians",
  "RCB": "Royal Challengers Bengaluru",
  "PBKS": "Punjab Kings",
  "SRH": "Sunrisers Hyderabad",
  "DC": "Delhi Capitals",
  "RR": "Rajasthan Royals",
  "LSG": "Lucknow Super Giants",
  "GT": "Gujarat Titans"
};


const teams = Object.keys(teamStadiums);

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  body: {
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "'Arial', sans-serif",
    backgroundrepeat: "no-repeat",
    backgroundsize: "100% 100%",
    backgroundattachment: "fixed",
  },
  background: {
    position: "fixed",
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.7)",
    zIndex: -1,
    transition: "background-image 0.5s ease",
  },
  mainContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    padding: "40px 0",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  },
  teamLogo: {
    width: "250px",
    height: "250px",
    objectFit: "contain",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },
  teamLogoHover: {
    transform: "scale(1.1)",
  },
  vsText: {
    fontSize: "48px",
    color: "white",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.3)",
    zIndex: -1,
  },
  venueSelector: {
    marginTop: "40px",
    width: "80%",
    maxWidth: "800px",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    color: "white",
  },
  venueLabel: {
    display: "block",
    fontSize: "24px",
    marginBottom: "15px",
    color: "#FFD700",
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },
  venueSelect: {
    width: "100%",
    padding: "15px",
    fontSize: "18px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    border: "2px solid #FFD700",
    borderRadius: "10px",
    cursor: "pointer",
    outline: "none",
  },
  predictButton: {
    marginTop: "30px",
    padding: "20px 60px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#1e90ff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  predictButtonHover: {
    backgroundColor: "#007bff",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
  }
};

const TeamSelector = ({ team, setTeam }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    const index = teams.indexOf(team);
    setTeam(teams[(index + 1) % teams.length]);
  };

  return (
    <img
      src={`/IPL/${team}.png`}
      alt={`${team}`}
      style={{
        ...styles.teamLogo,
        ...(isHovered ? styles.teamLogoHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNext}
    />
  );
};

const MatchPreview = () => {
  const [team1, setTeam1] = useState("KKR");
  const [team2, setTeam2] = useState("RCB");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [isPredictHovered, setIsPredictHovered] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // If teams are the same, adjust team2
  React.useEffect(() => {
    if (team1 === team2) {
      const availableTeams = teams.filter(t => t !== team1);
      setTeam2(availableTeams[0]);
    }
  }, [team1]);

  React.useEffect(() => {
    if (team1 === team2) {
      const availableTeams = teams.filter(t => t !== team2);
      setTeam1(availableTeams[0]);
    }
  }, [team2]);

  const handlePredict = async () => {
    if (!selectedVenue) {
      alert("Please select a venue first!");
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          team1: teamFullNames[team1],
          team2: teamFullNames[team2],
          venue: selectedVenue
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw prediction response:", data);

      // Process the prediction data
      const predictionLines = data.prediction.split('\n');
      const processedPrediction = {};

      predictionLines.forEach(line => {
        const teamMatch = line.match(/(.*?) Score: ([\d.]+) \(([\d.]+)%\)/);
        if (teamMatch) {
          const [_, teamName, score, probability] = teamMatch;
          processedPrediction[teamName.trim()] = {
            score: parseFloat(score),
            probability: parseFloat(probability)
          };
        }
      });

      console.log("Processed prediction:", processedPrediction);
      setPrediction(processedPrediction);

    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to fetch prediction. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };



return (
  <div style={styles.body}>
    {/* Background */}
    <div
      style={{
        ...styles.background,
        backgroundImage: `url(/IPL/${teamStadiums[team1]})`,
      }}
    />
    
    {/* Overlay */}
    <div style={styles.overlay} />
    
    {/* Main Content */}
    <div style={styles.container}>
        <TeamSelector team={team1} setTeam={setTeam1} otherTeam={team2} />
        <span style={styles.vsText}>VS</span>
        <TeamSelector team={team2} setTeam={setTeam2} otherTeam={team1} />
      </div>

      <div style={styles.venueSelector}>
        <label style={styles.venueLabel}>Select Venue</label>
        <select 
          style={styles.venueSelect}
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="">Choose a venue</option>
          {venues.map((venue) => (
            <option key={venue.name} value={venue.name}>
              {venue.name}, {venue.city}
            </option>
          ))}
        </select>
      </div>

      <button
        style={{
          ...styles.predictButton,
          ...(isPredictHovered ? styles.predictButtonHover : {})
        }}
        onMouseEnter={() => setIsPredictHovered(true)}
        onMouseLeave={() => setIsPredictHovered(false)}
        onClick={handlePredict}
      >
        Predict Winner
      </button>

      {isLoading && (
        <div style={{
          marginTop: "20px",
          color: "white",
          fontSize: "20px"
        }}>
          Loading prediction...
        </div>
      )}

      {prediction && (
        <div style={{
          marginTop: "30px",
          width: "80%",
          maxWidth: "800px",
          padding: "25px",
          background: "rgba(30, 144, 255, 0.15)",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          border: "2px solid #1e90ff",
          color: "white",
          textAlign: "center",
          animation: "fadeIn 0.5s ease-in-out"
        }}>
          <div style={{
            fontSize: "28px",
            color: "#FFD700",
            marginBottom: "15px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            fontWeight: "bold"
          }}>
            Match Prediction
          </div>
          <div style={{
            fontSize: "22px",
            lineHeight: "1.5",
            padding: "10px"
          }}>
            {Object.entries(prediction).map(([team, data]) => (
              <div key={team} style={{
                margin: "15px 0",
                padding: "15px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "10px"
              }}>
                <div style={{ color: "#FFD700", fontWeight: "bold", marginBottom: "10px" }}>
                  {team}
                </div>
                <div style={{ fontSize: "20px" }}>
                  Score: {data.score.toFixed(2)}
                  <br />
                  Win Probability: {data.probability.toFixed(2)}%
                </div>
              </div>
            ))}
            
            <div style={{ 
              marginTop: "25px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#1e90ff",
              padding: "15px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "10px"
            }}>
              Predicted Winner: {
                Object.entries(prediction).reduce((a, b) => 
                  prediction[a[0]].probability > prediction[b[0]].probability ? a : b
                )[0]
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchPreview;