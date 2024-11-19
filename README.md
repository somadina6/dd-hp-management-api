# DD-HP-API Documentation

## GET: Get Character Status

**Endpoint**:  
`GET http://localhost:3000/character/{{filename}}/status`

This endpoint retrieves the status of a specific character.

### Request  
No request body is required for this GET request.

### Response  
The response is a JSON object with the following schema:

```json
{
  "name": "Briv",
  "currentHP": 20,
  "maxHP": 5,
  "temporaryHP": 10
}
```


## POST: Deal Damage To Character

**Endpoint**:  
`POST http://localhost:3000/character/{{filename}}/damage`

This endpoint records damage dealt to a specific character.

### Request Body  
- `type` (string): The type of damage dealt.  
- `amount` (number): The amount of damage dealt.

**Example Request**:

```json
{
  "type": "acid",
  "amount": 5
}
```

### Response Body
- `damageDealt` (number): The total damage dealt.
- `currentHP` (number): The current hit points after damage calculation.
- `temporaryHP` (number): The temporary hit points after damage calculation.

```json
{
  "damageDealt": 5,
  "currentHP": 20,
  "temporaryHP": 0
}
```


## POST: Heal A Character

**Endpoint**:  
`POST http://localhost:3000/character/{{filename}}/heal`

This endpoint heals a specific character by a certain amount.

### Request Body  
- `amount` (number): The amount of healing to be applied.

**Example Request**:
```json
{
  "amount": 5
}
```

### Response Body
- `currentHP` (number): The current hit points after healing calculation.
- `temporaryHP` (number): The temporary hit points after healing calculation.

```json
{
  "currentHP": 10,
  "temporaryHP": 0
}
```

## POST: Add Temporary HP To Character

**Endpoint**:  
`POST http://localhost:3000/character/briv.json/temporary-hp`

This endpoint updates the temporary hit points (HP) of a character.

### Request Body  
The request should include a JSON payload with the following parameter:

- `amount` (number): The amount of temporary hit points to be added or updated.

**Example Request**:

```json
{
  "amount": 15
}
```
### Response Body
Upon successful execution, the server responds with:

- `currentHP` (number): The current hit points after the update.
- `temporaryHP` (number): The updated temporary hit points.
```json
{
  "currentHP": 20,
  "temporaryHP": 15
}
```
