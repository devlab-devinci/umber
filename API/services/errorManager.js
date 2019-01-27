let errorManager = {
    handler: function (res, e, messageCustom) {
        if (!messageCustom) {
            messageCustom = "N/A"
        }
        res
            .status(400)
            .json({
                "error": e,
                "message": messageCustom
            })
    },

};

module.exports = errorManager;