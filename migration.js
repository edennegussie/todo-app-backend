const pool = require('./database');

const createTable = async () => {
  const queryText = `
        CREATE TABLE  IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          user_email VARCHAR(100) NOT NULL,
          status VARCHAR(20) CHECK (status IN ('TODO', 'IN_PROGRESS', 'COMPLETED')) NOT NULL,
          description TEXT,
          due_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
  `;

  const insertDataQuery = `
        INSERT INTO tasks (title, user_email, status, description, due_date)
        VALUES
        ('Task 1', 'user1@example.com', 'TODO', 'Description for task 1', '2025-03-01'),
        ('Task 2', 'user2@example.com', 'COMPLETED', 'Description for task 2', '2025-03-05'),
        ('Task 3', 'user3@example.com', 'COMPLETED', 'Description for task 3', '2025-03-10'),
        ('Task 4', 'user1@example.com', 'COMPLETED', 'Description for task 4', '2025-03-01'),
        ('Task 5', 'user2@example.com', 'IN_PROGRESS', 'Description for task 5', '2025-03-05'),
        ('Task 6', 'user3@example.com', 'COMPLETED', 'Description for task 6', '2025-03-10'),        
        ('Task 7', 'user1@example.com', 'TODO', 'Description for task 7', '2025-03-01')
      `;

  try {
    await pool.query(queryText);
    await pool.query(insertDataQuery);
    console.log('Tasks table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    pool.end();
  }
};

module.exports = createTable;
