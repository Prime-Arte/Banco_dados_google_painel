const token = process.env.TOKEN

module.exports = async (req, res, next) => {
    const auth = req.headers.authorization

    if (auth !== token) {
        return res.status(401).send("Voce não tem autorização")
    }
    next();
}