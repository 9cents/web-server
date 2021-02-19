const registerHandler = (db, bcrypt) => (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('unsuccessful')
    }
    const hash = bcrypt.hashSync(password);

    // SQL Query goes here
    
}

module.exports = {
    registerHandler
}