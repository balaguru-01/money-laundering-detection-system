function validateTransaction(transaction) {
    const { id, amount, sender, receiver } = transaction;

    if (!id || typeof id !== 'string') {
        return { valid: false, message: 'Invalid or missing id' };
    }

    if (amount === undefined || typeof amount !== 'number') {
        return { valid: false, message: 'Invalid or missing amount' };
    }

    if (!sender || typeof sender !== 'string') {
        return { valid: false, message: 'Invalid or missing sender' };
    }

    if (!receiver || typeof receiver !== 'string') {
        return { valid: false, message: 'Invalid or missing receiver' };
    }

    return { valid: true, message: 'Transaction is valid' };
}

module.exports = validateTransaction;