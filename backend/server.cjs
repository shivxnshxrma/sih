const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise for Promise support
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Create a pool of connections
const pool = mysql.createPool({
  host: 'localhost', 
  user: 'root',        
  password: '',        
  database: 'hospital_management',   
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hash the password before storing it in the database
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Error hashing password:', error);
  }
};

app.post('/addUser', async (req, res) => {
  const { user_name, user_email, password, date_of_birth, adhaar_number } = req.body;

  // Validate required fields
  if (!user_name || !user_email || !password || !date_of_birth || !adhaar_number) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert data into MySQL table
    const query = 'INSERT INTO users (user_name, user_email, password, date_of_birth, adhaar_number) VALUES (?, ?, ?, ?, ?)';
    const [results] = await pool.query(query, [user_name, user_email, hashedPassword, date_of_birth, adhaar_number]);
    
    // Success response
    res.status(201).json({ message: 'User added successfully', userId: results.insertId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/getUser', async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = 'SELECT * FROM users WHERE user_email = ?';
    const [results] = await pool.query(query, [user_email]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(user_password, user.password);

    if (isMatch) {
      res.json(user);
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/registerHospital', async (req, res) => {
  const { hospital_name, hospital_email, hospital_password, address, city, state, pincode, contact_number } = req.body;
  const hospitalId = uuidv4(); 

  // Validate required fields
  if (!hospital_name || !hospital_email || !hospital_password || !address || !city || !state || !pincode || !contact_number) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(hospital_password, saltRounds);

      // SQL query to insert hospital data into the database
      const query = 'INSERT INTO hospitals (id, hospital_name, hospital_email, hospital_password, address, city, state, pincode, contact_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [results] = await pool.query(query, [hospitalId, hospital_name, hospital_email, hashedPassword, address, city, state, pincode, contact_number]);

      res.status(201).json({ message: 'Hospital registered successfully', hospitalId: hospitalId });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

// Save initial hospital resources
app.post('/initialResources/:hospitalId', async (req, res) => {
  const hospitalId = req.params.hospitalId;
  const { opd_count, bed_count, blood_quantities } = req.body;

  const opdQuery = 'INSERT INTO hospital_opds (hospital_id, opd_count) VALUES (?, ?)';
  const bedQuery = 'INSERT INTO hospital_beds (hospital_id, bed_count) VALUES (?, ?)';
  
  // Convert blood_quantities object to an array of entries
  const bloodEntries = Object.entries(blood_quantities).map(([blood_type, blood_quantity]) => ({
      blood_type,
      blood_quantity
  }));

  try {
      await pool.query(opdQuery, [hospitalId, opd_count]);
      await pool.query(bedQuery, [hospitalId, bed_count]);

      // Insert blood entries into hospital_blood_bank table
      const bloodQueries = bloodEntries.map(({ blood_type, blood_quantity }) => {
          return pool.query('INSERT INTO hospital_blood_bank (hospital_id, blood_type, blood_quantity) VALUES (?, ?, ?)', [hospitalId, blood_type, blood_quantity]);
      });

      await Promise.all(bloodQueries);
      res.status(201).json({ message: 'Hospital resources saved successfully' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

app.get('/hospitalResources', async (req, res) => {
  const hospitalId = req.query.id;

  if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
  }

  try {
      // Fetch OPD count
      const [opdRows] = await pool.query('SELECT bed_count FROM general_beds WHERE hospital_id = ?', [hospitalId]);

      // Fetch Bed count
      const [bedRows] = await pool.query('SELECT bed_count FROM icu_beds WHERE hospital_id = ?', [hospitalId]);

      const [emergencyRows] = await pool.query('SELECT bed_count FROM emergency_beds WHERE hospital_id = ?', [hospitalId]);


      // Fetch Blood quantities
      const [bloodRows] = await pool.query('SELECT blood_type, blood_quantity FROM hospital_blood_bank WHERE hospital_id = ?', [hospitalId]);

      if (opdRows.length === 0 || bedRows.length === 0) {
          return res.status(404).json({ error: 'Hospital resources not found' });
      }

      // Construct the response
      const response = {
          icu_beds: bedRows[0].bed_count,
          general_beds: opdRows[0].bed_count,
          emergency_beds: emergencyRows[0].bed_count,
          blood_quantities: bloodRows.reduce((acc, row) => {
              acc[row.blood_type] = row.blood_quantity;
              return acc;
          }, {})
      };

      res.json(response);
  } catch (error) {
      console.error('Error fetching hospital resources:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Update hospital resources
app.put('/updateResources', async (req, res) => {
  const hospitalId = req.query.id;
  const { icu_count, general_count,emergency_count } = req.body;

  if (!hospitalId) {
    return res.status(400).json({ error: 'Hospital ID is required' });
  }

  try {
    // Update OPD count
    const icuQuery = 'UPDATE icu_beds SET bed_count = ? WHERE hospital_id = ?';
    await pool.query(icuQuery, [icu_count, hospitalId]);

    // Update Bed count
    const generalQuery = 'UPDATE general_beds SET bed_count = ? WHERE hospital_id = ?';
    await pool.query(generalQuery, [general_count, hospitalId]);

    const emergencyQuery = 'UPDATE emergency_beds SET bed_count = ? WHERE hospital_id = ?';
    await pool.query(emergencyQuery, [emergency_count, hospitalId]);

    res.status(200).json({ message: 'Hospital resources updated successfully' });
  } catch (error) {
    console.error('Error updating hospital resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/admitPatient', async (req, res) => {
  const {
    patient_name,
    patient_id,
    patient_age,
    gender,
    patient_condition,
    bed_type,
    hospital_id
  } = req.body;

  // Check if required fields are present
  if (!patient_name || !patient_id || !patient_age || !gender || !patient_condition || !bed_type || !hospital_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert patient into database
    const insertQuery = `
      INSERT INTO patients (patient_name, patient_id, patient_age, gender, patient_condition, bed_type, hospital_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [patient_name, patient_id, patient_age, gender, patient_condition, bed_type, hospital_id];
    await pool.query(insertQuery, values);

    // Update bed count based on bed type
    if (bed_type === 'general') {
      const updateBedQuery = `
        UPDATE general_beds
        SET bed_count = bed_count - 1
        WHERE hospital_id = ? AND bed_count > 0
      `;
      const updateValues = [hospital_id];
      const [updateResult] = await pool.query(updateBedQuery, updateValues);

      // If no rows were affected, it means there are no general beds available
      if (updateResult.affectedRows === 0) {
        return res.status(400).json({ error: 'No general beds available' });
      }
    } else if (bed_type === 'icu') {
      const updateBedQuery = `
        UPDATE icu_beds
        SET bed_count = bed_count - 1
        WHERE hospital_id = ? AND bed_count > 0
      `;
      const updateValues = [hospital_id];
      const [updateResult] = await pool.query(updateBedQuery, updateValues);

      // If no rows were affected, it means there are no ICU beds available
      if (updateResult.affectedRows === 0) {
        return res.status(400).json({ error: 'No ICU beds available' });
      }
    } else if (bed_type === 'emergency') {
      const updateBedQuery = `
        UPDATE emergency_beds
        SET bed_count = bed_count - 1
        WHERE hospital_id = ? AND bed_count > 0
      `;
      const updateValues = [hospital_id];
      const [updateResult] = await pool.query(updateBedQuery, updateValues);

      // If no rows were affected, it means there are no emergency beds available
      if (updateResult.affectedRows === 0) {
        return res.status(400).json({ error: 'No emergency beds available' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid bed type' });
    }

    res.status(201).json({ message: 'Patient admitted successfully' });
  } catch (error) {
    console.error('Error admitting patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/getHospital', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = 'SELECT * FROM hospitals WHERE hospital_email = ?';
    const [results] = await pool.query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    const Hospital = results[0];
    const isMatch = await bcrypt.compare(password, Hospital.hospital_password);

    if (isMatch) {
      res.json(Hospital);
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/hospitals', async (req, res) => {
  try {
    const query = 'SELECT hospital_name, city, address, state, contact_number FROM hospitals';
    const [hospitals] = await pool.query(query);
    
    // Send the hospital data as JSON
    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospital data:', error);
    res.status(500).json({ error: 'Failed to fetch hospital data' });
  }
});

app.get('/test', (req, res) => {
  res.send('Test route working');
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
