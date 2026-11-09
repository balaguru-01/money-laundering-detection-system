exports.createTransaction = async (req, res) => {
    try {
        const { amount, sender, receiver } = req.body;
        const newTransaction = new Transaction({ amount, sender, receiver });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving transactions', error });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving transaction', error });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { amount, sender, receiver } = req.body;
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, { amount, sender, receiver }, { new: true });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
};