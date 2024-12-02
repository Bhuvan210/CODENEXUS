import { Database } from 'sqlite3';
import { open } from 'sqlite';
const path = require('path');
const fs = require('fs');

// Function to open the database connection
export async function openDB() {
  const dbPath = path.join('/tmp', 'my-database.db'); // Use the /tmp directory in Vercel

  // Check if the directory exists, and create if not
  if (!fs.existsSync(path.dirname(dbPath))) {
    console.log('Directory does not exist, creating it...');
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  console.log('Database path:', dbPath);

  const db = await open({
    filename: dbPath,
    driver: Database,
  });

  console.log('Connected to the SQLite database stored in /tmp.');
  return db;
}

// Function to initialize the database (create tables if not exist)
export async function initializeDb() {
  const db = await openDB(); // Use the openDB function here

  try {
    // Check if the table exists before dropping
    const tableCheckQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name='courses'`;
    const table = await db.get(tableCheckQuery);
    if (table) {
      console.log('Courses table already exists, skipping drop.');
    } else {
      console.log('Creating courses table...');
      // Create the 'courses' table with the new schema
      await db.exec(`
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          videoUrl TEXT NOT NULL,
          thumbnailUrl TEXT DEFAULT 'https://via.placeholder.com/150',
          path TEXT NOT NULL,
          description TEXT
        )
      `);
      console.log('Courses table initialized with updated schema.');
    }
  } catch (error) {
    console.error('Error initializing the database:', error);
  } finally {
    await db.close(); // Ensure the connection is closed
  }
}

// Function to insert dummy data into the database for testing
export async function insertDummyData() {
  const db = await openDB();

  try {
    const dummyCourses = [
      // Full Stack Courses
      ['Full Stack Course 1', 'https://sample-video-url-1.com', 'https://sample-thumbnail-url-1.com', 'Full Stack', 'Introduction to Full Stack Development'],
      ['Full Stack Course 2', 'https://sample-video-url-2.com', 'https://sample-thumbnail-url-2.com', 'Full Stack', 'Front-End Basics'],
      ['Full Stack Course 3', 'https://sample-video-url-3.com', 'https://sample-thumbnail-url-3.com', 'Full Stack', 'Back-End Fundamentals'],
      ['Full Stack Course 4', 'https://sample-video-url-4.com', 'https://sample-thumbnail-url-4.com', 'Full Stack', 'Advanced JavaScript'],
      ['Full Stack Course 5', 'https://sample-video-url-5.com', 'https://sample-thumbnail-url-5.com', 'Full Stack', 'Node.js for Beginners'],
      ['Full Stack Course 6', 'https://sample-video-url-6.com', 'https://sample-thumbnail-url-6.com', 'Full Stack', 'React.js Introduction'],
      ['Full Stack Course 7', 'https://sample-video-url-7.com', 'https://sample-thumbnail-url-7.com', 'Full Stack', 'Database Integration with MongoDB'],
      ['Full Stack Course 8', 'https://sample-video-url-8.com', 'https://sample-thumbnail-url-8.com', 'Full Stack', 'Building RESTful APIs'],

      // DSA Courses
      ['DSA Course 1', 'https://sample-video-url-9.com', 'https://sample-thumbnail-url-9.com', 'DSA', 'Introduction to Data Structures and Algorithms'],
      ['DSA Course 2', 'https://sample-video-url-10.com', 'https://sample-thumbnail-url-10.com', 'DSA', 'Arrays and Linked Lists'],
      ['DSA Course 3', 'https://sample-video-url-11.com', 'https://sample-thumbnail-url-11.com', 'DSA', 'Stacks and Queues'],
      ['DSA Course 4', 'https://sample-video-url-12.com', 'https://sample-thumbnail-url-12.com', 'DSA', 'Trees and Graphs'],
      ['DSA Course 5', 'https://sample-video-url-13.com', 'https://sample-thumbnail-url-13.com', 'DSA', 'Dynamic Programming and Greedy Algorithms'],
      ['DSA Course 6', 'https://sample-video-url-14.com', 'https://sample-thumbnail-url-14.com', 'DSA', 'Backtracking Algorithms'],
      ['DSA Course 7', 'https://sample-video-url-15.com', 'https://sample-thumbnail-url-15.com', 'DSA', 'Binary Search Algorithms'],
      ['DSA Course 8', 'https://sample-video-url-16.com', 'https://sample-thumbnail-url-16.com', 'DSA', 'Advanced Graph Algorithms'],

      // DevOps Courses
      ['DevOps Course 1', 'https://sample-video-url-17.com', 'https://sample-thumbnail-url-17.com', 'DevOps', 'Introduction to DevOps'],
      ['DevOps Course 2', 'https://sample-video-url-18.com', 'https://sample-thumbnail-url-18.com', 'DevOps', 'CI/CD Pipeline Basics'],
      ['DevOps Course 3', 'https://sample-video-url-19.com', 'https://sample-thumbnail-url-19.com', 'DevOps', 'Docker and Kubernetes for Beginners'],
      ['DevOps Course 4', 'https://sample-video-url-20.com', 'https://sample-thumbnail-url-20.com', 'DevOps', 'Automation with Ansible and Terraform'],
      ['DevOps Course 5', 'https://sample-video-url-21.com', 'https://sample-thumbnail-url-21.com', 'DevOps', 'Monitoring and Logging in DevOps'],
      ['DevOps Course 6', 'https://sample-video-url-22.com', 'https://sample-thumbnail-url-22.com', 'DevOps', 'Infrastructure as Code with Terraform'],
      ['DevOps Course 7', 'https://sample-video-url-23.com', 'https://sample-thumbnail-url-23.com', 'DevOps', 'Cloud Infrastructure Automation'],
      ['DevOps Course 8', 'https://sample-video-url-24.com', 'https://sample-thumbnail-url-24.com', 'DevOps', 'Continuous Monitoring and Feedback'],

      // Cloud Computing Courses
      ['Cloud Computing Course 1', 'https://sample-video-url-25.com', 'https://sample-thumbnail-url-25.com', 'Cloud Computing', 'Introduction to Cloud Computing'],
      ['Cloud Computing Course 2', 'https://sample-video-url-26.com', 'https://sample-thumbnail-url-26.com', 'Cloud Computing', 'AWS Fundamentals'],
      ['Cloud Computing Course 3', 'https://sample-video-url-27.com', 'https://sample-thumbnail-url-27.com', 'Cloud Computing', 'Azure Fundamentals'],
      ['Cloud Computing Course 4', 'https://sample-video-url-28.com', 'https://sample-thumbnail-url-28.com', 'Cloud Computing', 'Google Cloud Platform Basics'],
      ['Cloud Computing Course 5', 'https://sample-video-url-29.com', 'https://sample-thumbnail-url-29.com', 'Cloud Computing', 'Serverless Architecture with AWS Lambda'],
      ['Cloud Computing Course 6', 'https://sample-video-url-30.com', 'https://sample-thumbnail-url-30.com', 'Cloud Computing', 'Cloud Security Essentials'],
      ['Cloud Computing Course 7', 'https://sample-video-url-31.com', 'https://sample-thumbnail-url-31.com', 'Cloud Computing', 'AWS EC2 and S3 Basics'],
      ['Cloud Computing Course 8', 'https://sample-video-url-32.com', 'https://sample-thumbnail-url-32.com', 'Cloud Computing', 'Advanced Cloud Architecture'],

      // AI & ML Courses
      ['AI Course 1', 'https://sample-video-url-33.com', 'https://sample-thumbnail-url-33.com', 'AI/ML', 'AI Course 1'],
      ['AI Course 2', 'https://sample-video-url-34.com', 'https://sample-thumbnail-url-34.com', 'AI/ML', 'AI Course 2'],
      ['AI Course 3', 'https://sample-video-url-35.com', 'https://sample-thumbnail-url-35.com', 'AI/ML', 'AI Course 3'],
      ['AI Course 4', 'https://sample-video-url-36.com', 'https://sample-thumbnail-url-36.com', 'AI/ML', 'AI Course 4'],
      ['Machine Learning 1', 'https://sample-video-url-37.com', 'https://sample-thumbnail-url-37.com', 'AI/ML', 'ML Course 5'],
      ['Machine Learning 2', 'https://sample-video-url-38.com', 'https://sample-thumbnail-url-38.com', 'AI/ML', 'ML Course 6'],
      ['Machine Learning 3', 'https://sample-video-url-39.com', 'https://sample-thumbnail-url-39.com', 'AI/ML', 'ML Course 7'],
      ['Machine Learning 4', 'https://sample-video-url-40.com', 'https://sample-thumbnail-url-40.com', 'AI/ML', 'ML Course 8'],

      // Web Development Courses
      ['Web Development Course 1', 'https://sample-video-url-41.com', 'https://sample-thumbnail-url-41.com', 'Web Development', 'Introduction to Web Development'],
      ['Web Development Course 2', 'https://sample-video-url-42.com', 'https://sample-thumbnail-url-42.com', 'Web Development', 'HTML and CSS Basics'],
      ['Web Development Course 3', 'https://sample-video-url-43.com', 'https://sample-thumbnail-url-43.com', 'Web Development', 'JavaScript and DOM Manipulation'],
      ['Web Development Course 4', 'https://sample-video-url-44.com', 'https://sample-thumbnail-url-44.com', 'Web Development', 'Responsive Web Design'],
      ['Web Development Course 5', 'https://sample-video-url-45.com', 'https://sample-thumbnail-url-45.com', 'Web Development', 'React.js Basics'],
      ['Web Development Course 6', 'https://sample-video-url-46.com', 'https://sample-thumbnail-url-46.com', 'Web Development', 'Advanced JavaScript'],
      ['Web Development Course 7', 'https://sample-video-url-47.com', 'https://sample-thumbnail-url-47.com', 'Web Development', 'Node.js for Web Development'],
      ['Web Development Course 8', 'https://sample-video-url-48.com', 'https://sample-thumbnail-url-48.com', 'Web Development', 'Building Full-Stack Applications with MERN'],
      
       // Front-End Development Courses
  ['Front-End Course 1', 'https://sample-video-url-49.com', 'https://sample-thumbnail-url-49.com', 'Front End', 'Introduction to Front-End Development'],
  ['Front-End Course 2', 'https://sample-video-url-50.com', 'https://sample-thumbnail-url-50.com', 'Front End', 'HTML and CSS Basics'],
  ['Front-End Course 3', 'https://sample-video-url-51.com', 'https://sample-thumbnail-url-51.com', 'Front End', 'JavaScript for Front-End Developers'],
  ['Front-End Course 4', 'https://sample-video-url-52.com', 'https://sample-thumbnail-url-52.com', 'Front End', 'Responsive Web Design'],
  ['Front-End Course 5', 'https://sample-video-url-53.com', 'https://sample-thumbnail-url-53.com', 'Front End', 'React.js Basics'],
  ['Front-End Course 6', 'https://sample-video-url-54.com', 'https://sample-thumbnail-url-54.com', 'Front End', 'Vue.js Essentials'],
  ['Front-End Course 7', 'https://sample-video-url-55.com', 'https://sample-thumbnail-url-55.com', 'Front End', 'Building Front-End Applications with Angular'],
  ['Front-End Course 8', 'https://sample-video-url-56.com', 'https://sample-thumbnail-url-56.com', 'Front End', 'Front-End Performance Optimization'],

  // Back-End Development Courses
  ['Back-End Course 1', 'https://sample-video-url-57.com', 'https://sample-thumbnail-url-57.com', 'Back End', 'Introduction to Back-End Development'],
  ['Back-End Course 2', 'https://sample-video-url-58.com', 'https://sample-thumbnail-url-58.com', 'Back End', 'Node.js for Beginners'],
  ['Back-End Course 3', 'https://sample-video-url-59.com', 'https://sample-thumbnail-url-59.com', 'Back End', 'Building APIs with Express.js'],
  ['Back-End Course 4', 'https://sample-video-url-60.com', 'https://sample-thumbnail-url-60.com', 'Back End', 'Database Design with MongoDB'],
  ['Back-End Course 5', 'https://sample-video-url-61.com', 'https://sample-thumbnail-url-61.com', 'Back End', 'Authentication and Authorization Basics'],
  ['Back-End Course 6', 'https://sample-video-url-62.com', 'https://sample-thumbnail-url-62.com', 'Back End', 'Scaling Back-End Systems'],
  ['Back-End Course 7', 'https://sample-video-url-63.com', 'https://sample-thumbnail-url-63.com', 'Back End', 'Serverless Back-End Development'],
  ['Back-End Course 8', 'https://sample-video-url-64.com', 'https://sample-thumbnail-url-64.com', 'Back End', 'Advanced Back-End Security Practices'],

  // Cyber Security Courses
  ['Cyber Security Course 1', 'https://sample-video-url-65.com', 'https://sample-thumbnail-url-65.com', 'Cyber Security', 'Introduction to Cyber Security'],
  ['Cyber Security Course 2', 'https://sample-video-url-66.com', 'https://sample-thumbnail-url-66.com', 'Cyber Security', 'Basics of Network Security'],
  ['Cyber Security Course 3', 'https://sample-video-url-67.com', 'https://sample-thumbnail-url-67.com', 'Cyber Security', 'Ethical Hacking Fundamentals'],
  ['Cyber Security Course 4', 'https://sample-video-url-68.com', 'https://sample-thumbnail-url-68.com', 'Cyber Security', 'Web Application Security'],
  ['Cyber Security Course 5', 'https://sample-video-url-69.com', 'https://sample-thumbnail-url-69.com', 'Cyber Security', 'Understanding Cryptography'],
  ['Cyber Security Course 6', 'https://sample-video-url-70.com', 'https://sample-thumbnail-url-70.com', 'Cyber Security', 'Incident Response and Forensics'],
  ['Cyber Security Course 7', 'https://sample-video-url-71.com', 'https://sample-thumbnail-url-71.com', 'Cyber Security', 'Securing Cloud Environments'],
  ['Cyber Security Course 8', 'https://sample-video-url-72.com', 'https://sample-thumbnail-url-72.com', 'Cyber Security', 'Penetration Testing Advanced Techniques'],
  

];


// Insert sample data for testing in a single query
    const insertQuery = `
      INSERT INTO courses (title, videoUrl, thumbnailUrl, path, description)
      VALUES (?, ?, COALESCE(?, 'https://via.placeholder.com/150'), ?, ?)
    `;

    for (const course of dummyCourses) {
      // Check if the course already exists before inserting
      const checkQuery = `SELECT COUNT(*) FROM courses WHERE title = ?`;
      const count = await db.get(checkQuery, [course[0]]);

      if (count['COUNT(*)'] === 0) {
        console.log('Inserting course:', course[0]);
        await db.run(insertQuery, course);
      } else {
        console.log(`Course "${course[0]}" already exists, skipping.`);
      }
    }

    console.log('Dummy courses added for testing.');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    await db.close(); // Ensure the connection is closed
  }
}

// Function to set up the database (initialize tables and insert dummy data)
export async function setupDatabase() {
  try {
    // Initialize the database and create tables
    await initializeDb();
    console.log('Database initialized successfully.');

    // Insert dummy data into the courses table
    await insertDummyData();
    console.log('Dummy data inserted successfully.');
  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

// Call setupDatabase to initialize and populate the database
setupDatabase();
