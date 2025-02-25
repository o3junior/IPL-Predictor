from ml_model import predict_winner, df

# Example call
team1 = "Kolkata Knight Riders"
team2 = "Mumbai Indians"
venue = "Wankhede Stadium, Mumbai"

print(predict_winner(df, team1, team2, venue))
print(df.head())