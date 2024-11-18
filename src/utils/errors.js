class CharacterNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CharacterNotFoundError';
    }
}

class InvalidDamageTypeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidDamageTypeError';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

module.exports = {
    CharacterNotFoundError,
    InvalidDamageTypeError,
    ValidationError
};