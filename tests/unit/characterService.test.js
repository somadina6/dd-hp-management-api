const characterService = require("../../src/services/characterService");
const Character = require("../../src/models/Character");
const {
  CharacterNotFoundError,
  InvalidDamageTypeError,
  ValidationError,
} = require("../../src/utils/errors");

const filehelper = require("../../src/utils/filehelper");
const e = require("express");
jest.mock("../../src/utils/filehelper", () => ({
  readCharacterData: jest.fn(), // Mocked function
}));

describe("Character Service", () => {
  const mockCharacterData = {
    name: "Briv",
    hitPoints: 20,
    defenses: [
      { type: "fire", defense: "immunity" },
      { type: "slashing", defense: "resistance" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    filehelper.readCharacterData.mockResolvedValue(mockCharacterData);
  });

  describe("initializeCharacter", () => {
    it("should initialize a character from file data", async () => {
      const character = await characterService.initializeCharacter("briv.json");
      expect(character).toBeInstanceOf(Character);
      expect(character.currentHP).toBe(20);
    });

    it("should handle file reading errors", async () => {
      require("../../src/utils/filehelper").readCharacterData.mockRejectedValue(
        new Error("File not found")
      );

      await expect(
        characterService.initializeCharacter("nonexistent.json")
      ).rejects.toThrow("File not found");
    });
  });

  describe("getOrCreateCharacter", () => {
    it("should return existing character if already initialized", async () => {
      const firstCall = await characterService.getOrCreateCharacter(
        "briv.json"
      );
      const secondCall = await characterService.getOrCreateCharacter(
        "briv.json"
      );

      expect(firstCall).toBe(secondCall);
    });

    it("should create new character if not found", async () => {
      const character = await characterService.getOrCreateCharacter(
        "briv.json"
      );
      expect(character).toBeInstanceOf(Character);
    });

    it("should throw CharacterNotFoundError for invalid file", async () => {
      require("../../src/utils/filehelper").readCharacterData.mockRejectedValue(
        new Error("Invalid file")
      );

      await expect(
        characterService.getOrCreateCharacter("invalid.json")
      ).rejects.toThrow(CharacterNotFoundError);
    });
  });

  describe("getCharacterStatus", () => {
    it("should return current character status", async () => {
      const status = await characterService.getCharacterStatus("briv.json");

      expect(status).toEqual({
        name: "Briv",
        currentHP: 20,
        maxHP: 20,
        temporaryHP: 0,
      });
    });

    it("should throw error for non-existent character", async () => {
      require("../../src/utils/filehelper").readCharacterData.mockRejectedValue(
        new Error("File not found")
      );

      await expect(
        characterService.getCharacterStatus("nonexistent.json")
      ).rejects.toEqual(
        new CharacterNotFoundError(
          "Character file nonexistent.json not found or invalid"
        )
      );
    });
  });

  describe("dealDamage", () => {
    beforeEach(async () => {
      await characterService.initializeCharacter("briv.json");
    });

    it("should deal damage to character correctly", async () => {
      const result = await characterService.dealDamage(
        "briv.json",
        10,
        "piercing"
      );
      expect(result.currentHP).toBe(10);
    });

    it("should handle immune damage type", async () => {
      const result = await characterService.dealDamage("briv.json", 10, "fire");
      expect(result.currentHP).toBe(20); // No damage due to immunity
    });

    it("should handle resistant damage type", async () => {
      const result = await characterService.dealDamage(
        "briv.json",
        10,
        "slashing"
      );
      expect(result.currentHP).toBe(15); // Half damage due to resistance
    });

    it("should throw error for damge type undefined", async () => {
      await expect(
        characterService.dealDamage("briv.json", 10, undefined)
      ).rejects.toThrow(ValidationError);
      await expect(
        characterService.dealDamage("briv.json", 10, "")
      ).rejects.toEqual(new ValidationError("Damage type must be provided"));
    });

    it("should throw error for missing damage type", async () => {
      await expect(
        characterService.dealDamage("briv.json", 10)
      ).rejects.toEqual(new ValidationError("Damage type must be provided"));
    });

    it("should throw error for invalid damage type", async () => {
      await expect(
        characterService.dealDamage("briv.json", 10, "invalidType")
      ).rejects.toThrow(InvalidDamageTypeError);
    });

    it("should throw error for invalid damage amount", async () => {
      await expect(
        characterService.dealDamage("briv.json", -5, "piercing")
      ).rejects.toEqual(
        new ValidationError("Damage amount must be a positive number")
      );
    });

    it("should handle damage with temporary HP", async () => {
      await characterService.addTemporaryHP("briv.json", 5);
      const result = await characterService.dealDamage(
        "briv.json",
        10,
        "piercing"
      );

      expect(result.currentHP).toBe(15);
      expect(result.temporaryHP).toBe(0);
    });
  });

  describe("heal", () => {
    beforeEach(async () => {
      await characterService.initializeCharacter("briv.json");
      await characterService.dealDamage("briv.json", 15, "piercing"); // Set HP to 5
    });

    it("should heal character correctly", async () => {
      const result = await characterService.heal("briv.json", 10);
      expect(result.currentHP).toBe(15);
    });

    it("should not heal beyond max HP", async () => {
      const result = await characterService.heal("briv.json", 20);
      expect(result.currentHP).toBe(20);
    });

    it("should throw error for invalid heal amount", async () => {
      await expect(characterService.heal("briv.json", -5)).rejects.toEqual(
        new ValidationError("Heal amount must be a positive number")
      );
    });

    it("should throw error for numbers as strings", async () => {
      await expect(characterService.heal("briv.json", "5")).rejects.toEqual(
        new ValidationError("Heal amount must be a number")
      );
    });

    it("should throw error for invalid string input", async () => {
      await expect(
        characterService.heal("briv.json", "invalid")
      ).rejects.toEqual(
        new ValidationError("Heal amount must be a number")
      );
    });
  });

  describe("addTemporaryHP", () => {
    beforeEach(async () => {
      await characterService.initializeCharacter("briv.json");
    });

    it("should add temporary HP correctly", async () => {
      const result = await characterService.addTemporaryHP("briv.json", 10);
      expect(result.temporaryHP).toBe(10);
    });

    it("should not stack temporary HP, use highest value", async () => {
      await characterService.addTemporaryHP("briv.json", 10);
      const result = await characterService.addTemporaryHP("briv.json", 5);
      expect(result.temporaryHP).toBe(10);
    });

    it("should throw error for invalid temporary HP amount", async () => {
      await expect(
        characterService.addTemporaryHP("briv.json", -5)
      ).rejects.toEqual(new ValidationError("Temporary HP amount must be a positive number"));
    });

    it("should throw error for numbers as strings", async () => {
      await expect(
        characterService.addTemporaryHP("briv.json", "5")
      ).rejects.toEqual(new ValidationError("Temporary HP amount must be a number"));
    });
  });

  describe("resetCharacter", () => {
    it("should reset character to initial state", async () => {
      await characterService.initializeCharacter("briv.json");
      await characterService.dealDamage("briv.json", 10, "piercing");
      await characterService.addTemporaryHP("briv.json", 5);

      const result = await characterService.resetCharacter("briv.json");

      expect(result).toEqual({
        name: "Briv",
        currentHP: 20,
        maxHP: 20,
        temporaryHP: 0,
      });
    });
  });

  describe("isAlive", () => {
    beforeEach(async () => {
      await characterService.initializeCharacter("briv.json");
    });

    it("should return true when character has positive HP", async () => {
      const isAlive = await characterService.isAlive("briv.json");
      expect(isAlive).toBe(true);
    });

    it("should return false when character has 0 HP", async () => {
      await characterService.dealDamage("briv.json", 20, "piercing");
      const isAlive = await characterService.isAlive("briv.json");
      expect(isAlive).toBe(false);
    });
  });
});
