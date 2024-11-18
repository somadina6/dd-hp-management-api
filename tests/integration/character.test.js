const request = require('supertest');
const app = require('../../src/app');
const characterService = require('../../src/services/characterService');

describe('Character API Integration Tests', () => {
  beforeEach(async () => {
    await characterService.initializeCharacter('briv.json');
  });

  describe('GET /character/:filename/status', () => {
    it('should return character status', async () => {
      const response = await request(app)
        .get('/character/briv.json/status');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('currentHP');
      expect(response.body).toHaveProperty('maxHP');
      expect(response.body).toHaveProperty('temporaryHP');
    });

    it('should return 404 for non-existent character', async () => {
      const response = await request(app)
        .get('/character/nonexistentchar/status');
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST /character/:filename/damage', () => {
    it('should deal damage correctly', async () => {
      const response = await request(app)
        .post('/character/briv.json/damage')
        .send({
          amount: 10,
          type: 'piercing'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.currentHP).toBe(15);
    });

    it('should handle resistance correctly', async () => {
      const response = await request(app)
        .post('/character/briv.json/damage')
        .send({
          amount: 10,
          type: 'slashing'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.currentHP).toBe(20);
    });

    it('should validate damage input', async () => {
      const response = await request(app)
        .post('/character/briv.json/damage')
        .send({
          amount: -10,
          type: 'piercing'
        });
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /character/:filename/heal', () => {
    it('should heal character correctly', async () => {
      // First deal damage
      await request(app)
        .post('/character/briv.json/damage')
        .send({ amount: 10, type: 'piercing' });

      // Then heal
      const response = await request(app)
        .post('/character/briv.json/heal')
        .send({ amount: 5 });
      
      expect(response.status).toBe(200);
      expect(response.body.currentHP).toBe(20);
    });

    it('should not heal beyond max HP', async () => {
      const response = await request(app)
        .post('/character/briv.json/heal')
        .send({ amount: 10 });
      
      expect(response.status).toBe(200);
      expect(response.body.currentHP).toBe(25);
    });

    it('should validate heal input', async () => {
        const response = await request(app)
            .post('/character/briv.json/heal')
            .send({ amount: -5 });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /character/:filename/temporary-hp', () => {
    it('should add temporary HP correctly', async () => {
      const response = await request(app)
        .post('/character/briv.json/temporary-hp')
        .send({ amount: 10 });
      
      expect(response.status).toBe(200);
      expect(response.body.temporaryHP).toBe(10);
    });

    it('should keep higher temporary HP value', async () => {
      // First add 10 temporary HP
      await request(app)
        .post('/character/briv.json/temporary-hp')
        .send({ amount: 10 });

      // Then try to add 5 temporary HP
      const response = await request(app)
        .post('/character/briv.json/temporary-hp')
        .send({ amount: 5 });
      
      expect(response.status).toBe(200);
      expect(response.body.temporaryHP).toBe(10);
    });

    it('should validate temporary HP input', async () => {
      const response = await request(app)
        .post('/character/briv.json/temporary-hp')
        .send({ amount: -5 });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});