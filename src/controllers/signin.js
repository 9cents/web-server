const signinHandler = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json('unsuccessful')
    }

    // Database SQL query goes here
    
}

module.exports = {
    signinHandler
}