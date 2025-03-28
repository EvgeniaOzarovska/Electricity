/**
 * This class is just a facade for your implementation, the tests below are using the `World` class only.
 * Feel free to add the data and behavior, but don't change the public interface.
 */

const getId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%&!?|+=_-<>*';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export class PowerPlant {
  constructor() {
    this.id = getId();
    this.isAlive = true;
  }
}

export class Households {
  constructor() {
    this.id = getId();
    this.connectedPlants = [];
    this.connectedHouseholds = [];
  }
}

export class World {
  constructor() {
    this.powerPlants = [];
    this.households = [];
  }

  findHouseholdById(id) {
    return this.households.find((household) => household.id === id);
  }

  findPowerPlantById(id) {
    return this.powerPlants.find((powerPlant) => powerPlant.id === id);
  }

  createPowerPlant() {
    const powerPlant = new PowerPlant();
    this.powerPlants.push(powerPlant);

    return powerPlant;
  }

  createHousehold() {
    const household = new Households();
    this.households.push(household);

    return household;
  }

  connectHouseholdToPowerPlant(household, powerPlant) {
    if (!household || !powerPlant) {
      throw new Error('Invalid household or power plant');
    }

    const isConnected = household.connectedPlants.find(
      (plant) => plant === powerPlant.id,
    );
    if (!isConnected) {
      household.connectedPlants.push(powerPlant.id);
    }
  }

  connectHouseholdToHousehold(household1, household2) {
    if (!household1 || !household2) {
      throw new Error('Invalid household1 or household2');
    }

    const isConnected = household1.connectedHouseholds.find(
      (household) => household === household2.id,
    );
    if (!isConnected) {
      household1.connectedHouseholds.push(household2.id);
    }
  }

  disconnectHouseholdFromPowerPlant(household, powerPlant) {
    if (!household || !powerPlant) {
      throw new Error('Invalid household or power plant');
    }

    household.connectedPlants = household.connectedPlants.filter((plant) => {
      return plant !== powerPlant.id;
    });
  }

  killPowerPlant(powerPlant) {
    if (!powerPlant) {
      throw new Error('Invalid powerPlant');
    }
    powerPlant.isAlive = false;
  }

  repairPowerPlant(powerPlant) {
    if (!powerPlant) {
      throw new Error('Invalid powerPlant');
    }
    powerPlant.isAlive = true;
  }

  householdHasElectricity(household, visited = new Set()) {
    if (!household) {
      throw new Error('Invalid household');
    }

    if (visited.has(household.id)) {
      return false;
    }
    visited.add(household.id);

    for (const plantId of household.connectedPlants) {
      const powerPlant = this.findPowerPlantById(plantId);
      if (powerPlant && powerPlant.isAlive) {
        return true;
      }
    }

    for (const householdId of household.connectedHouseholds) {
      const connectedHousehold = this.findHouseholdById(householdId);
      if (
        connectedHousehold &&
        this.householdHasElectricity(connectedHousehold, visited)
      ) {
        return true;
      }
    }

    return false;
  }
}
