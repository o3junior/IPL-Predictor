export const sendMatchData = async (team1, team2, venue) => {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ team1, team2, venue }),
    });
  
    return response.json();
  };
  