const access = {}

const rateLimit = (req, res, next) => { 
    if (access[req.session.id]) {
        if (access[req.session.id] < new Date()) {
        access[req.session.id] = new Date()
        next()
        } else {
        res.status(429).send('Too many requests')
        }
    } else {
        access[req.session.id] = new Date()
        next()
    }
}

module.exports = rateLimit
