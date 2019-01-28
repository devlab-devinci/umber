let errorManager = {
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
    },

};

module.exports = errorManager;