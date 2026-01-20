--🟦 1. USERS TABLE
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    bio TEXT,
    credits INT DEFAULT 0,
    reputation_score NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    role VARCHAR(20) DEFAULT 'student'
        CHECK (role IN ('student', 'admin')),
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--🟩 2. SKILLS TABLE
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--🟧 3. USER_SKILLS TABLE (Many-to-Many)
CREATE TABLE user_skills (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (user_id, skill_id)
);


--🟨 4. GIGS TABLE
CREATE TABLE gigs (
    gig_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    -- money | skill (barter)
    type VARCHAR(20) NOT NULL
        CHECK (type IN ('money', 'skill')),
    budget NUMERIC(10,2) DEFAULT 0,
    created_by INTEGER NOT NULL
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('open', 'assigned', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--gig application table
CREATE TABLE gig_applications (
    application_id SERIAL PRIMARY KEY,

    gig_id INT NOT NULL,
    applicant_id INT NOT NULL,

    status VARCHAR(20) DEFAULT 'applied'
        CHECK (status IN ('applied', 'accepted', 'rejected')),

    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_gig
        FOREIGN KEY (gig_id)
        REFERENCES gigs(gig_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_gig_applicant
        UNIQUE (gig_id, applicant_id)
);


--🟫 5. GIG_SKILLS TABLE (Gig Requirements)
CREATE TABLE gig_skills (
    gig_id INT REFERENCES gigs(gig_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    proficiency_level INT CHECK (proficiency_level BETWEEN 1 AND 5),
    PRIMARY KEY (gig_id, skill_id)
);

--🟥 6. TRANSACTIONS TABLE (Money + Credit Exchange)
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    gig_id INT NOT NULL,
    sender_id REFERENCES user(user_id) ON DELETE CASCADE,
    receiver_id REFERENCES user(user_id) ON DELETE CASCADE,
    mode VARCHAR(20) NOT NULL
        CHECK (mode IN ('paid', 'credit')),
    credits_exchanged INT,
    amount_paid NUMERIC(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'completed'
        CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_gig
        FOREIGN KEY (gig_id)
        REFERENCES gigs(gig_id)
        ON DELETE CASCADE,
    CONSTRAINT check_transaction_logic
        CHECK (
            (mode = 'credit' AND credits_exchanged IS NOT NULL AND amount_paid IS NULL)
         OR (mode = 'paid' AND amount_paid IS NOT NULL AND credits_exchanged IS NULL)
        )
);


--🟪 7. REVIEWS TABLE
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,

    gig_id INT NOT NULL REFERENCES gigs(gig_id) ON DELETE CASCADE,
    reviewer_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reviewed_user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    rating INT CHECK (rating BETWEEN 1 AND 5),
    review TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_review_per_gig
        UNIQUE (gig_id, reviewer_id)
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