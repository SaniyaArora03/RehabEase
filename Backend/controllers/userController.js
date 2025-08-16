const User=require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
exports.registerUser=async(req,res)=>{
   const { name, email, password, condition } = req.body;
    try{
       const userExists = await User.findOne({ email });
       if (userExists) return res.status(400).json({ msg: "User already exists" }); 
       //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword,condition });
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
    }catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
//login
exports.loginUser=async(req,res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
         if (!user) return res.status(400).json({ msg: "Invalid credentials" });
         //matching password
         const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token,condition: user.condition });
     } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};