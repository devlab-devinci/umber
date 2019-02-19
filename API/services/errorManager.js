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
        if (payload_id) {
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

/**
 * Check ids in array
 * @param array_payload_id
 * @returns {Promise<any>}
 */
function checkPayloadIds(array_payload_id) {
    return new Promise((resolve, reject) => {
        if (array_payload_id) {
            if (array_payload_id instanceof Array) {
                if (array_payload_id.length > 0) {
                    let objectIds = [];
                    for (let i in array_payload_id) {
                        if (typeof array_payload_id[i] !== 'string' || array_payload_id[i].length !== 24) {
                            reject({
                                "error": true,
                                "data": "array given must contains only string length 24"
                            });
                            break;
                        } else {
                            let cond = mongoose.Types.ObjectId(array_payload_id[i]);
                            if (!cond) {
                                reject({
                                    "error": true,
                                    "data": "invalid id in array. Cast objectId failed."
                                });
                                break;
                            } else {
                                objectIds.push(cond)
                            }
                        }
                    }
                    resolve({
                        "error": false,
                        "data": objectIds
                    })

                } else {
                    reject({
                        "error": true,
                        "data": "empty array given"
                    })
                }
            } else {
                reject({
                    "error": true,
                    "data": "payloadsId must be an array"
                })
            }
        } else {
            reject({
                "error": true,
                "data": "array_payloads_id is empty. Array of ids string expected"
            })
        }
    })
}

/**
 *
 * @param array_payload_id
 * @returns {Promise<*>}
 */
async function isValidIds(array_payload_id) {
    try {
        return await checkPayloadIds(array_payload_id)
    } catch (err) {
        return err
    }
}


function checkDuplicateObjectId(objectId, relationField) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < relationField.length; i++) {
            if (relationField[i].toString() === objectId.toString()) { // not === because one string another objectiD NOT SAME TYPE!
                reject({
                    "error": true,
                    "data": "error duplicate objectId for relation"
                });
                break;
            }
        }

        resolve({
            "error": false,
            "data": "success no duplicate, ready for insert"
        })

    })
}

async function checkDuplicated(objectId, relationField) {
    try {
        return await checkDuplicateObjectId(objectId, relationField)
    } catch (err) {
        return err
    }
}


module.exports.isValidId = isValidId;
module.exports.isValidIds = isValidIds;
module.exports.checkDuplicated = checkDuplicated;
