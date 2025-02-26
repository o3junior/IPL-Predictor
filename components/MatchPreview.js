import React, { useState, useEffect } from "react";

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
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundAttachment: "fixed",
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
  },
  progressBarContainer: {
    width: "100%",
    height: "40px",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "20px",
    position: "relative",
    overflow: "hidden",
    marginTop: "10px",
  },
  teamLabel: {
    position: "absolute",
    padding: "0 15px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: "bold",
    zIndex: 2,
  },
  teamLeftLabel: {
    left: 0,
    color: "white",
  },
  teamRightLabel: {
    right: 0,
    color: "white",
  },
  percentageLabel: {
    position: "absolute",
    height: "100%",
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: "bold",
    zIndex: 2,
  },
  leftPercentage: {
    left: "25%",
    color: "white",
  },
  rightPercentage: {
    right: "25%",
    color: "white",
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
  useEffect(() => {
    if (team1 === team2) {
      const availableTeams = teams.filter(t => t !== team1);
      setTeam2(availableTeams[0]);
    }
  }, [team1]);

  useEffect(() => {
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
      console.log("Prediction response:", data);
      setPrediction(data);

    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to fetch prediction. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render the prediction result with a Google-style probability bar
  const renderPredictionResult = () => {
    if (!prediction) return null;
  
    // Team abbreviations for display (reverse lookup from full names)
    const getTeamAbbr = (fullName) => {
      return Object.keys(teamFullNames).find(abbr => teamFullNames[abbr] === fullName) || fullName;
    };
  
    const team1Data = prediction.team1;
    const team2Data = prediction.team2;
    const team1Abbr = getTeamAbbr(team1Data.name);
    const team2Abbr = getTeamAbbr(team2Data.name);
    const team1Percentage = Math.round(team1Data.probability);
    const team2Percentage = Math.round(team2Data.probability);
    const winner = prediction.winner;
    const winnerAbbr = getTeamAbbr(winner);
    
    return (
      <div style={{
        marginTop: "20px", // Changed from 30px to 20px
        width: "80%",
        maxWidth: "800px",
        padding: "20px", // Changed from 25px to 20px
        background: "rgba(30, 144, 255, 0.15)",
        borderRadius: "15px",
        backdropFilter: "blur(10px)",
        border: "2px solid #1e90ff",
        color: "white",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "24px", // Changed from 28px to 24px
          color: "#FFD700",
          marginBottom: "10px", // Changed from 15px to 10px
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          fontWeight: "bold"
        }}>
          Match Prediction
        </div>
        
        <div style={{
          fontSize: "16px", // Changed from 18px to 16px
          marginTop: "15px", // Changed from 20px to 15px
          marginBottom: "8px", // Changed from 10px to 8px
          fontWeight: "bold"
        }}>
          Win Probability
        </div>
        
        {/* Google-style probability bar */}
        <div style={styles.progressBarContainer}>
          {/* Team 1 side */}
          <div style={{
            position: "absolute",
            width: `${team1Percentage}%`,
            height: "100%",
            background: "linear-gradient(90deg, #1e90ff, #4169E1)",
            borderRadius: team1Percentage > 90 ? "20px" : "20px 0 0 20px",
            transition: "width 0.5s ease-in-out"
          }} />
          
          {/* Team 2 side */}
          <div style={{
            position: "absolute",
            width: `${team2Percentage}%`,
            height: "100%",
            right: 0,
            background: "linear-gradient(90deg, #4169E1, #1e90ff)",
            borderRadius: team2Percentage > 90 ? "20px" : "0 20px 20px 0",
            transition: "width 0.5s ease-in-out"
          }} />
          
          {/* Team labels */}
          <div style={{...styles.teamLabel, ...styles.teamLeftLabel}}>
            {team1Abbr}
          </div>
          <div style={{...styles.teamLabel, ...styles.teamRightLabel}}>
            {team2Abbr}
          </div>
          
          {/* Percentage labels */}
          {team1Percentage > 20 && (
            <div style={{...styles.percentageLabel, ...styles.leftPercentage}}>
              {team1Percentage}%
            </div>
          )}
          {team2Percentage > 20 && (
            <div style={{...styles.percentageLabel, ...styles.rightPercentage}}>
              {team2Percentage}%
            </div>
          )}
        </div>
        
        {/* Winner declaration */}
        <div style={{ 
          marginTop: "25px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1e90ff",
          padding: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "10px"
        }}>
          Predicted Winner: {winnerAbbr}
        </div>
      </div>
    );
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
        <TeamSelector team={team1} setTeam={setTeam1} />
        <span style={styles.vsText}>VS</span>
        <TeamSelector team={team2} setTeam={setTeam2} />
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
              {venue.name}
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

      {prediction && renderPredictionResult()}
    </div>
  );
};

export default MatchPreview;
