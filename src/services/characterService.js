const Character = require("../models/Character");
const filehelper  = require("../utils/filehelper");
const { DamageTypes } = require("../utils/constants");
const { InvalidDamageTypeError, CharacterNotFoundError, ValidationError } = require("../utils/errors");

// In-memory store for character data
const characterStore = new Map();

const characterService = {
    /**
     * Initialize a character from file data and store in memory
     * @param {string} filename - Character data filename
     * @returns {Promise<Character>} Initialized character instance
     */
    async initializeCharacter(filename) {
        const data = await filehelper.readCharacterData(filename);
        const character = new Character(data);
        characterStore.set(filename, character);
        return character;
    },

    /**
     * Get or create a character instance
     * @param {string} filename - Character data filename
     * @returns {Promise<Character>} Character instance
     * @throws {CharacterNotFoundError} If character cannot be initialized
     */
    async getOrCreateCharacter(filename) {
        // Check if character exists in cache
    if (characterStore.has(filename)) {
        return characterStore.get(filename);
      }
  
      try {
        // Initialize new character
        const character = await this.initializeCharacter(filename);
        // Store in map
        characterStore.set(filename, character);
        return character;
      } catch (error) {
        throw new CharacterNotFoundError(`Character file ${filename} not found or invalid`);
      }
    },

    /**
     * Get current status of a character
     * @param {string} filename - Character data filename
     * @returns {Promise<Object>} Character status
     */
    async getCharacterStatus(filename) {
        const character = await this.getOrCreateCharacter(filename);
        return character.getStatus();
    },

    /**
     * Deal damage to a character
     * @param {string} filename - Character data filename
     * @param {number} amount - Amount of damage
     * @param {string} type - Type of damage
     * @returns {Promise<Object>} Updated character status
     * @throws {ValidationError} If damage amount is invalid
     * @throws {InvalidDamageTypeError} If damage type is invalid
     */
    async dealDamage(filename, amount, type) {
        // Validate input
        if (!amount || amount <= 0) {
            throw new ValidationError('Damage amount must be a positive number');
        }

        const damageType = type.toLowerCase();
        if (!Object.values(DamageTypes).includes(damageType)) {
            throw new InvalidDamageTypeError(`Invalid damage type: ${type}`);
        }

        const character = await this.getOrCreateCharacter(filename);
        return character.takeDamage(amount, damageType);
    },

    /**
     * Heal a character
     * @param {string} filename - Character data filename
     * @param {number} amount - Amount to heal
     * @returns {Promise<Object>} Updated character status
     * @throws {ValidationError} If heal amount is invalid
     */
    async heal(filename, amount) {
        if (!amount || amount <= 0) {
            throw new ValidationError('Heal amount must be a positive number');
        }

        const character = await this.getOrCreateCharacter(filename);
        return character.heal(amount);
    },

    /**
     * Add temporary HP to a character
     * @param {string} filename - Character data filename
     * @param {number} amount - Amount of temporary HP
     * @returns {Promise<Object>} Updated character status
     * @throws {ValidationError} If temporary HP amount is invalid
     */
    async addTemporaryHP(filename, amount) {
        if (!amount || amount <= 0) {
            throw new ValidationError('Temporary HP amount must be a positive number');
        }

        const character = await this.getOrCreateCharacter(filename);
        return character.addTemporaryHP(amount);
    },

    /**
     * Reset a character to their initial state
     * @param {string} filename - Character data filename
     * @returns {Promise<Object>} Reset character status
     */
    async resetCharacter(filename) {
        await this.initializeCharacter(filename);
        return this.getCharacterStatus(filename);
    },

    /**
     * Check if a character is currently alive
     * @param {string} filename - Character data filename
     * @returns {Promise<boolean>} Whether the character is alive
     */
    async isAlive(filename) {
        const status = await this.getCharacterStatus(filename);
        return status.currentHP > 0;
    }
};

module.exports = characterService;