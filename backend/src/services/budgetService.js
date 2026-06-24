const BASE_PETROL_PRICE = 105;
const BASE_DIESEL_PRICE = 90;
const AVERAGE_MILEAGE_PETROL = 15;
const AVERAGE_MILEAGE_DIESEL = 18;
const ANNUAL_INFLATION_RATE = 0.06;
const DAILY_TRAVEL_DISTANCE = 500;
const ACCOMMODATION_BUDGET = { budget: 1000, midRange: 2500, luxury: 6000 };
const FOOD_PER_PERSON_DAY = { budget: 400, midRange: 700, luxury: 1500 };
const MISC_PERCENTAGE = 0.1;

function getInflationMultiplier(baseYear = 2024, currentYear = 2026) {
  const years = currentYear - baseYear;
  return Math.pow(1 + ANNUAL_INFLATION_RATE, years);
}

const DEFAULT_CRUDE_OIL_PRICE = 75;

function getDaysOnRoad(distanceKm) {
  return Math.max(1, Math.ceil(distanceKm / DAILY_TRAVEL_DISTANCE));
}

const budgetService = {
  calculateBudget(distanceKm, travelers) {
    const days = getDaysOnRoad(distanceKm);
    const crudeOilPrice = DEFAULT_CRUDE_OIL_PRICE;
    const inflationMultiplier = getInflationMultiplier();
    const fuelPriceAdjustment = 1 + (crudeOilPrice - 75) / 75 * 0.5;
    const effectivePetrolPrice = Math.round(BASE_PETROL_PRICE * inflationMultiplier * fuelPriceAdjustment);
    const effectiveDieselPrice = Math.round(BASE_DIESEL_PRICE * inflationMultiplier * fuelPriceAdjustment);

    const fuelPetrol = Math.round(distanceKm / AVERAGE_MILEAGE_PETROL * effectivePetrolPrice);
    const fuelDiesel = Math.round(distanceKm / AVERAGE_MILEAGE_DIESEL * effectiveDieselPrice);
    const fuelCNG = Math.round(distanceKm / 22 * 55);

    const tollEstimate = Math.round(distanceKm * 1.2 + 50);
    const parkingEstimate = Math.round(200 + distanceKm * 0.5);

    function calcTier(tier) {
      const accommodationTotal = days * ACCOMMODATION_BUDGET[tier];
      const foodTotal = days * travelers * FOOD_PER_PERSON_DAY[tier];
      const transportFuel = tier === 'luxury' ? fuelPetrol : tier === 'budget' ? fuelCNG : fuelDiesel;
      const transportTotal = transportFuel + tollEstimate + parkingEstimate;
      const subtotal = accommodationTotal + foodTotal + transportTotal;
      const miscellaneous = Math.round(subtotal * MISC_PERCENTAGE);
      return {
        accommodation: accommodationTotal,
        food: foodTotal,
        transport: transportTotal,
        fuel: transportFuel,
        tollsAndParking: tollEstimate + parkingEstimate,
        miscellaneous,
        total: subtotal + miscellaneous,
        perPerson: Math.round((subtotal + miscellaneous) / travelers)
      };
    }

    return {
      distanceKm,
      travelers,
      daysOnRoad: days,
      fuelPrices: {
        petrol: effectivePetrolPrice,
        diesel: effectiveDieselPrice,
        crudeOil: Math.round(crudeOilPrice * 100) / 100
      },
      economy: calcTier('budget'),
      midRange: calcTier('midRange'),
      luxury: calcTier('luxury'),
      factors: {
        inflationRate: ANNUAL_INFLATION_RATE,
        crudeOilPrice: Math.round(crudeOilPrice * 100) / 100,
        dailyTravelDistance: DAILY_TRAVEL_DISTANCE
      },
      disclaimer: 'Budget estimates include fuel (adjusted for crude oil & inflation), accommodation, food, tolls, parking, and miscellaneous. Actual costs may vary.'
    };
  }
};

module.exports = budgetService;
