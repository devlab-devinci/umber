'use strict';

const db_conf = {
    dev: {
        db_name: "umberdev",
        hostname:"127.0.0.1",
        port: ""
    },
    production: {
        db_name: "",
        hostname: "",
        port: ""
    }
}

module.exports = db_conf ;

