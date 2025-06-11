const db = require('./DB'); // adjust path if needed
const User = require('./models/user'); // adjust path to User model

const createAdmin = async () => {
    

    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log("✅ Admin already exists. No action taken.");
            return ;
        }

        const admin = new User({
            name: 'Kamlesh Satpute',
            age: 20,
            aadharnumber: 888888888888,
            password: 'kamlesh@2025',
            role: 'admin'
        });

        await admin.save();
        console.log("✅ Admin created successfully.");
        process.exit();
    } catch (err) {
        console.error("❌ Failed to create admin:", err.message);
        process.exit(1);
    }

   
};

module.exports=createAdmin
