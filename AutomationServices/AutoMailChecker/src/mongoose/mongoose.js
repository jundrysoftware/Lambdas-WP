const mongoose = require('mongoose')
const {
    MONGO_HOST,
    MONGO_PORT,
    MONGO_SSL,
    MONGO_USER,
    MONGO_SECRET,
    MONGO_SET,
} = process.env
let connection = null

const connect = () => {
    if (!connection) {
        connection = mongoose.connect(MONGO_HOST, {
            port: MONGO_PORT,
            ssl: !!MONGO_SSL,
            user: MONGO_USER,
            replicaSet: MONGO_SET,
            pass: MONGO_SECRET,
            dbName:'test'
        })
        return connection
    }
    return connection
}

const destroy = () => {
    return mongoose.disconnect()
}

const isConnected = () => {
    return mongoose.isConnected()
}

module.exports = {
    db: mongoose.connection.db,
    connect,
    destroy,
    isConnected
}