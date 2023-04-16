var mysql = require('mysql2');
var db_info = {
    host: '',
    port: '',
    user: '',
    password: '',
    database: ''
}

module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}