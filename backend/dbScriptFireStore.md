## Project folder structure for database usage
backend/
│── services/
│   ├── userService.js
│   ├── gigService.js
│   ├── transactionService.js
│   ├── aiService.js
│
└── config/
    └── firestore.js

# Database schemas to be used in the firestore 
📌 COLLECTION 1: Users

Stores authentication + skill profile + reputation.

Collection Name: users

Document ID: userId (Firebase UID)

{
  "name": "Priyanshu",
  "email": "priyanshu@example.com",
  "skills": ["React", "Node.js", "Python"],
  "bio": "Frontend dev | Open to gigs",
  "credits": 40,
  "reputationScore": 4.8,
  "reviewsCount": 12,
  "createdAt": 1234567890
}

Used for:

Login / Signup

Matching engine inputs

Credit/barter calculations

Reputation system

📌 COLLECTION 2: Gigs

Stores gig listings for monetary jobs & skill-exchange.

Collection Name: gigs

{
  "gigId": "GIG101",
  "title": "Need React Tutor",
  "description": "Teach me basic React hooks",
  "postedBy": "USER_123",
  "skillsRequired": ["React"],
  "mode": "credit",   // or "paid"
  "budget": 500,      // for paid gigs
  "creditsOffered": 10,
  "status": "open",   // open, assigned, completed
  "createdAt": 12345678
}

Used for:

Homepage listings

Matching algorithm

Skill-exchange pairing

📌 COLLECTION 3: SkillProfiles (For AI Matching)

This is where BERT embeddings can be stored.

Collection Name: skillProfiles

{
  "userId": "USER_123",
  "skills": ["React", "Node", "UI/UX"],
  "embeddingVector": [0.21, 0.98, 0.11, ...]   // stored from AI service
}


Used by:

FastAPI BERT similarity matching

Recommendation engine

📌 COLLECTION 4: Transactions

Stores skill exchanges & gig completions.

Collection Name: transactions

{
  "transactionId": "TXN01",
  "gigId": "GIG101",
  "senderId": "USER_123",
  "receiverId": "USER_450",
  "mode": "credit",
  "creditsExchanged": 10,
  "moneyPaid": null,
  "status": "completed",
  "timestamp": 123456789
}


Used for:

Credit system

Audit logs

Generating reputation scores

📌 COLLECTION 5: Credits

Stores user credit history.

Collection Name: creditHistory

{
  "userId": "USER_123",
  "change": -10,
  "reason": "Took React tutoring gig",
  "timestamp": 123456789
}

📌 COLLECTION 6: Reviews

Stored when a gig is completed.

Collection Name: reviews

{
  "reviewId": "REV23",
  "fromUser": "USER_123",
  "toUser": "USER_450",
  "gigId": "GIG101",
  "rating": 4,
  "text": "Very helpful tutor!",
  "sentimentScore": 0.92,
  "timestamp": 123456789
}


Used for:

Reputation system

NLP sentiment analysis

Fraud detection

📌 COLLECTION 7: FraudReports

NLP identifies suspicious patterns.

Collection Name: fraudReports

{
  "reportId": "FR12",
  "userId": "USER_450",
  "issue": "Spam message detected",
  "riskScore": 0.85,
  "timestamp": 123456789
}


Used for:

Governance

Admin panel monitoring

📌 COLLECTION 8: Leaderboard

Gamification module.

Collection Name: leaderboard

{
  "userId": "USER_123",
  "rank": 1,
  "reputationScore": 4.8,
  "creditsEarned": 80
}