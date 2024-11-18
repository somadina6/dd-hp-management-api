const characterService = require("../services/characterService");

const characterController = {
    
    getStatus: async (req, res) => {
        try {
            const { filename } = req.params;
            const status = await characterService.getCharacterStatus(filename);
            res.json(status);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    dealDamage: async (req, res) => {
        try {
            const { filename } = req.params;
            const { amount, type } = req.body;
            const result = await characterService.dealDamage(filename, amount, type);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    heal: async (req, res) => {
        try {
            const { filename } = req.params;
            const { amount } = req.body;
            const result = await characterService.heal(filename, amount);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    addTemporaryHP: async (req, res) => {
        try {
            const { filename } = req.params;
            const { amount } = req.body;
            const result = await characterService.addTemporaryHP(filename, amount);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = characterController;