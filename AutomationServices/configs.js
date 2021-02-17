const {
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
} = process.env

module.exports  = {
    imap:{
        user: EMAIL_USERNAME,
        password: EMAIL_PASSWORD,
        host: 'imap.gmail.com',
        port: 993,
        tls: true, 
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    },
}