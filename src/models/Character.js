class Character {
  constructor(data) {
    this.data = data;
    this.currentHP = data.hitPoints;
    this.temporaryHP = 0;
  }

  // Calculate damage considering resistances and immunities
  calculateDamage(amount, damageType) {
    const defense = this.data.defenses.find((d) => d.type === damageType);

    if (defense) {
      switch (defense.defense) {
        case "immunity":
          return 0;
        case "resistance":
          return Math.floor(amount / 2);
        default:
          return amount;
      }
    }
    return amount;
  }

  // Deal damage to the character
  takeDamage(amount, damageType) {
    const actualDamage = this.calculateDamage(amount, damageType);

    // First apply damage to temporary HP
    if (this.temporaryHP > 0) {
      if (this.temporaryHP >= actualDamage) {
        // Temporary HP is enough to absorb all damage
        this.temporaryHP -= actualDamage;
        return {
          damageDealt: actualDamage,
          currentHP: this.currentHP,
          temporaryHP: this.temporaryHP,
        };
      } else {
        const remainingDamage = actualDamage - this.temporaryHP;
        this.temporaryHP = 0;
        this.currentHP = Math.max(0, this.currentHP - remainingDamage);
        return {
          damageDealt: actualDamage,
          currentHP: this.currentHP,
          temporaryHP: this.temporaryHP,
        };
      }
    }

    // Apply damage directly to current HP if no temporary HP
    this.currentHP = Math.max(0, this.currentHP - actualDamage);
    return {
      damageDealt: actualDamage,
      currentHP: this.currentHP,
      temporaryHP: this.temporaryHP,
    };
  }

  // Heal the character
  heal(amount) {
    const maxHP = this.data.hitPoints;
    this.currentHP = Math.min(maxHP, this.currentHP + amount);
    return {
      currentHP: this.currentHP,
      temporaryHP: this.temporaryHP,
    };
  }

  // Add temporary HP
  addTemporaryHP(amount) {
    this.temporaryHP = Math.max(this.temporaryHP, amount);
    return {
      currentHP: this.currentHP,
      temporaryHP: this.temporaryHP,
    };
  }

  // Get current status
  getStatus() {
    return {
      name: this.data.name,
      currentHP: this.currentHP,
      maxHP: this.data.hitPoints,
      temporaryHP: this.temporaryHP,
    };
  }
}

module.exports = Character;
