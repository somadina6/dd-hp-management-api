const Character = require("../../src/models/Character");

describe("Character Class", () => {
  let character;
  const mockCharacterData = {
    name: "Briv",
    hitPoints: 25,
    defenses: [
      { type: "fire", defense: "immunity" },
      { type: "slashing", defense: "resistance" },
    ],
  };

  beforeEach(() => {
    character = new Character(mockCharacterData);
  });

  describe("initialization", () => {
    it("should initialize with correct HP and no temporary HP", () => {
      expect(character.currentHP).toBe(25);
      expect(character.temporaryHP).toBe(0);
    });

    it("should store character data", () => {
      expect(character.data).toEqual(mockCharacterData);
    });
  });

  describe("damage calculation", () => {
    it("should calculate normal damage correctly", () => {
      const damage = character.calculateDamage(10, "piercing");
      expect(damage).toBe(10);
    });

    it("should calculate resistance damage correctly", () => {
      const damage = character.calculateDamage(10, "slashing");
      expect(damage).toBe(5);
    });

    it("should calculate immunity damage correctly", () => {
      const damage = character.calculateDamage(10, "fire");
      expect(damage).toBe(0);
    });
  });

  describe("takeDamage", () => {
    it("should reduce HP when taking damage", () => {
      const result = character.takeDamage(10, "piercing");
      expect(result.currentHP).toBe(15);
      expect(result.temporaryHP).toBe(0);
    });

    it("should handle temporary HP correctly", () => {
      character.addTemporaryHP(8);
      const result = character.takeDamage(10, "piercing");
      expect(result.currentHP).toBe(23);
      expect(result.temporaryHP).toBe(0);
    });

    it("should not reduce HP below 0", () => {
      const result = character.takeDamage(30, "piercing");
      expect(result.currentHP).toBe(0);
    });
  });

  describe("heal", () => {
    it("should heal up to max HP", () => {
      character.currentHP = 10;
      const result = character.heal(10);
      expect(result.currentHP).toBe(20);
    });

    it("should not heal beyond max HP", () => {
      character.currentHP = 20;
      const result = character.heal(10);
      expect(result.currentHP).toBe(25);
    });
  });

  describe("temporary HP", () => {
    it("should add temporary HP", () => {
      const result = character.addTemporaryHP(10);
      expect(result.temporaryHP).toBe(10);
    });

    it("should keep higher temporary HP value", () => {
      character.addTemporaryHP(10);
      const result = character.addTemporaryHP(8);
      expect(result.temporaryHP).toBe(10);
    });
  });
});
