--🟦 1. USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash TEXT, -- if using custom login instead of Firebase
    bio TEXT,
    credits INT DEFAULT 0,
    reputation_score FLOAT DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

--🟩 2. SKILLS TABLE
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL
);

--🟧 3. USER_SKILLS TABLE (Many-to-Many)
CREATE TABLE user_skills (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

--🟨 4. GIGS TABLE
CREATE TABLE gigs (
    gig_id SERIAL PRIMARY KEY,
    posted_by INT REFERENCES users(user_id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    mode VARCHAR(20) NOT NULL, -- 'paid' or 'credit'
    budget INT,
    credits_offered INT,
    status VARCHAR(20) DEFAULT 'open', -- open, assigned, completed
    created_at TIMESTAMP DEFAULT NOW()
);

--🟫 5. GIG_SKILLS TABLE (Gig Requirements)
CREATE TABLE gig_skills (
    gig_id INT REFERENCES gigs(gig_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (gig_id, skill_id)
);

--🟥 6. TRANSACTIONS TABLE (Money + Credit Exchange)
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    gig_id INT REFERENCES gigs(gig_id),
    sender_id INT REFERENCES users(user_id),
    receiver_id INT REFERENCES users(user_id),
    mode VARCHAR(20), -- paid / credit
    credits_exchanged INT,
    amount_paid INT,
    status VARCHAR(20) DEFAULT 'completed',
    timestamp TIMESTAMP DEFAULT NOW()
);

--🟪 7. REVIEWS TABLE
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    from_user INT REFERENCES users(user_id),
    to_user INT REFERENCES users(user_id),
    gig_id INT REFERENCES gigs(gig_id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    sentiment_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

--🟨 8. CREDIT_HISTORY TABLE
CREATE TABLE credit_history (
    history_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    change_amount INT,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

--🟦 9. REPUTATION_LOGS TABLE
CREATE TABLE reputation_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    change_value FLOAT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

--🟧 10. FRAUD_REPORTS TABLE
CREATE TABLE fraud_reports (
    report_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    issue TEXT,
    risk_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

--🟫 11. LEADERBOARD TABLE
CREATE TABLE leaderboard (
    user_id INT REFERENCES users(user_id),
    rank_position INT,
    reputation_score FLOAT,
    credits_earned INT,
    PRIMARY KEY (user_id)
);

--🟥 12. AI_LOGS TABLE (Embeddings, Similarity Scores, etc.)
CREATE TABLE ai_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    gig_id INT REFERENCES gigs(gig_id),
    similarity_score FLOAT,
    match_feedback TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);