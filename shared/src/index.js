// ── SOrvReign MotoLift — Shared Constants & Utilities ──────────

export const PLATFORMS = ['Bolt', 'Glovo', 'Uber', 'Faras'];

export const BIKE_CATALOG = [
  { id: 'boxer',  name: 'Boxer Motorcycle',         type: 'petrol',   deposit: 20000, dailyInstallment: 450,  totalMonths: 12 },
  { id: 'tvs',    name: 'TVS Motorcycle',            type: 'petrol',   deposit: 25000, dailyInstallment: 500,  totalMonths: 12 },
  { id: 'ranger', name: 'Ranger Motorcycle',         type: 'petrol',   deposit: 18000, dailyInstallment: 420,  totalMonths: 12 },
  { id: 'spiro',  name: 'Spiro Electric',            type: 'electric', deposit: 30000, dailyInstallment: 350,  totalMonths: 18 },
  { id: 'cheche', name: 'Cheche Electric Motorcycle',type: 'electric', deposit: 28000, dailyInstallment: 480,  totalMonths: 15 },
  { id: 'std-ev', name: 'Standard Electric Bike',    type: 'electric', deposit: 15000, dailyInstallment: 350,  totalMonths: 12 },
];

export const RIDER_STATUSES = {
  PENDING:    'pending',
  APPROVED:   'approved',
  ACTIVE:     'active',
  COMPLETED:  'completed',
  DEFAULTED:  'defaulted',
};

export const LANGUAGES = ['en', 'sw', 'fr'];

/**
 * Calculate outstanding balance given a bike and number of days paid
 * @param {string} bikeId
 * @param {number} daysPaid
 */
export function calcBalance(bikeId, daysPaid) {
  const bike = BIKE_CATALOG.find(b => b.id === bikeId);
  if (!bike) return null;
  const totalDays = bike.totalMonths * 30;
  const totalOwed = bike.dailyInstallment * totalDays;
  const paid      = bike.dailyInstallment * daysPaid;
  return Math.max(0, totalOwed - paid);
}

/**
 * Format KES amounts e.g. 32500 → "KES 32,500"
 */
export function formatKES(amount) {
  return `KES ${Number(amount).toLocaleString('en-KE')}`;
}

/**
 * Returns the M-Pesa paybill reference for a rider
 */
export function mpesaRef(riderId) {
  return `ML-${String(riderId).toUpperCase().padStart(6, '0')}`;
}
