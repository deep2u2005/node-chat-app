var generateMessage = (from, msg) => {
    return {
        from,
        msg,
        createdAt: new Date().getTime()
    }
};

module.exports = { generateMessage };