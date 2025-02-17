const express = require('express');
const cors = require('cors');
const userlist = require('./Models/userlist');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const reportlost = require('./Models/reportlost');
const postfound = require('./Models/postfound');
const upload = require('./multerconfig')
const path = require('path');

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's origin
  credentials: true, // Allow credentials (cookies)
}));
app.use(bodyparser.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to check if the user is logged in
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token; // Get the token from cookies

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "mahee"); // Replace "mahee" with your secret key
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

app.post('/signup', async (req, res) => {
  let { name, email, password, mobile, address } = req.body;
  let isuser = await userlist.findOne({email:email});
  if(isuser){
    return res.status(400).json({success : false, message : "Email already registered"});
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let person = await userlist.create({
        name, email, password: hash, mobile, address,
      });
      res.json({ success: true, message: 'Sign Up successfully' });
    });
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let user = await userlist.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }
  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      var token = jwt.sign({ email: user.email }, 'mahee');
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      res.json({ success: true, user: { name: user.name, email: user.email } });
    } else {
      res.status(400).json({ success: false, message: 'Invalid password' });
    }
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the cookie
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/validate', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false, message: 'No token found' });
  }
  try {
    const decoded = jwt.verify(token, 'mahee');
    const user = await userlist.findOne({ email: decoded.email });
    if (user) {
      res.json({ 
        success: true, 
        user: { 
          name: user.name, 
          email: user.email,
          id : user._id,
          mobile: user.mobile, 
          address: user.address 
        } 
      });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.json({ success: false, message: 'Invalid token' });
  }
});


//Report Lost
app.post('/reportlost',authenticateUser, upload.single('photo'), async (req, res) => {
  const { name,item,location,date,description,contact } = req.body;

  // Determine the photo path
  let photo;
  if (req.file) {
    photo = `uploads/${req.file.filename}`; // Prioritize file upload
  } else {
    return res.status(400).json({ success: false, message: 'Please provide either an image.' });
  }

  try {
    let product = await reportlost.create({
      name,
      item,
      location,
      date,
      description,
      photo,
      contact // Save the photo path or URL in the database
    });
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Fetch all lost posts
app.get("/alllostpost", async (req, res) => {
  try {
    const lostPosts = await reportlost.find().sort({ date: -1 }); // Sort by date (newest first)
    res.json({ success: true, posts: lostPosts });
  } catch (error) {
    console.error("Error fetching lost posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lost posts" });
  }
});

// Fetch all found posts
app.get("/allfoundpost", async (req, res) => {
  try {
    const foundPosts = await postfound.find().sort({ date: -1 }); // Sort by date (newest first)
    res.json({ success: true, posts: foundPosts });
  } catch (error) {
    console.error("Error fetching found posts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch found posts" });
  }
});


//Post Found
app.post('/postfound',authenticateUser, upload.single('photo'), async (req, res) => {
  const { name,item,location,date,description,contact } = req.body;

  // Determine the photo path
  let photo;
  if (req.file) {
    photo = `uploads/${req.file.filename}`; // Prioritize file upload
  } else {
    return res.status(400).json({ success: false, message: 'Please provide either an image.' });
  }

  try {
    let product = await postfound.create({
      name,
      item,
      location,
      date,
      description,
      photo,
      contact // Save the photo path or URL in the database
    });
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await userlist.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});


app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await userlist.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

app.get("/protected", authenticateUser, (req, res) => {
  res.json({ success: true, message: "You are authenticated!", user: req.user });
});



// Delete a lost post
app.delete("/alllostpost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await reportlost.findByIdAndDelete(id);
    res.json({ success: true, message: "Lost post deleted successfully" });
  } catch (error) {
    console.error("Error deleting lost post:", error);
    res.status(500).json({ success: false, message: "Failed to delete lost post" });
  }
});


// Delete a found post
app.delete("/allfoundpost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await postfound.findByIdAndDelete(id);
    res.json({ success: true, message: "Found post deleted successfully" });
  } catch (error) {
    console.error("Error deleting found post:", error);
    res.status(500).json({ success: false, message: "Failed to delete found post" });
  }
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});