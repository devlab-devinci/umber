const mongoose = require('mongoose');


let errorManager = {
    /**
     * Return query error from mongo
     * @param res
     * @param e
     * @param messageCustom
     */
    handler: function (res, e, messageCustom) {
        if (!messageCustom) {
            messageCustom = "N/A"
        }
        res
            .status(400)
            .json({
                "error": e,
                "help_infos": messageCustom
            })
    }
};

module.exports = errorManager;

/**
 * Check _id send in body POST
 * @param payload_id
 * @returns {Promise<any>}
 */
function checkPayloadId(payload_id) {
    return new Promise((resolve, reject) => {
        if(payload_id){
            if (payload_id.length > 0 && typeof payload_id === 'string') {
                if (payload_id.length === 24) {
                    resolve({
                        "error": false,
                        "data": mongoose.Types.ObjectId(payload_id)
                    })
                } else {
                    reject({
                        "error": true,
                        "data": "payload_id cannot be cast in object id mongo (invalid length, expected 24)"
                    })
                }
            } else {
                reject({
                    "error": true,
                    "data": "payload_id invalid, string expected"
                })
            }
        } else {
            reject({
                "error": true,
                "data": "_id is not defined in body"
            })
        }

    })
}

/**
 * Asynchronous checking _id from POST query
 * @param payload_id
 * @returns {Promise<*>}
 */
async function isValidId(payload_id) {
    try {
        return await checkPayloadId(payload_id)
    } catch (err) {
        return err
    }
}


module.exports.isValidId = isValidId;



