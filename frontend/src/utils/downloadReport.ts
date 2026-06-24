import { formatDistance, formatDuration, formatCurrency, formatDate } from './helpers';

interface ReportData {
  source: string;
  destination: string;
  distance: number;
  duration: number;
  travelDate?: string;
  returnDate?: string;
  travelers: number;
  weather?: any[];
  costEstimates: any;
  hotels?: any[];
  restaurants?: any[];
  citiesOnRoute?: { name: string }[];
}

function weatherHtml(weather: any[]): string {
  if (!weather || weather.length === 0) return '';
  const w = weather[0];
  return `
    <div class="section">
      <h2>🌤 Weather at ${w.city || 'Destination'}</h2>
      <div class="grid-2">
        <div class="stat"><span class="label">Condition</span><span class="value">${w.condition || 'N/A'}</span></div>
        <div class="stat"><span class="label">Temperature</span><span class="value">${w.temperature ?? 'N/A'}°C</span></div>
        <div class="stat"><span class="label">Feels Like</span><span class="value">${w.feelsLike ?? 'N/A'}°C</span></div>
        <div class="stat"><span class="label">Humidity</span><span class="value">${w.humidity ?? 'N/A'}%</span></div>
        <div class="stat"><span class="label">Wind Speed</span><span class="value">${w.windSpeed ?? 'N/A'} km/h</span></div>
        <div class="stat"><span class="label">Visibility</span><span class="value">${w.visibility ?? 'N/A'} km</span></div>
      </div>
    </div>`;
}

function carHtml(car: any, travelers: number): string {
  if (!car) return '';
  const perPerson = Math.round(car.totalCost / travelers);
  return `
    <div class="option-card car">
      <h3>🚗 Car</h3>
      <div class="stat-row"><span>Fuel Cost</span><span>${formatCurrency(car.fuelCost)}</span></div>
      <div class="stat-row"><span>Toll Charges</span><span>${formatCurrency(car.tollCharges)}</span></div>
      <div class="stat-row"><span>Parking</span><span>${formatCurrency(car.parkingCharges)}</span></div>
      <div class="stat-row total"><span>Total (${travelers} pax)</span><span>${formatCurrency(car.totalCost)}</span></div>
      <div class="stat-row"><span>Per Person</span><span>${formatCurrency(perPerson)}</span></div>
      <div class="stat-row"><span>Duration</span><span>${formatDuration(car.duration * 60)}</span></div>
      <div class="stat-row"><span>Fuel Price</span><span>₹${car.fuelPricePerLiter}/L</span></div>
    </div>`;
}

function busHtml(bus: any, travelers: number): string {
  if (!bus) return '';
  return `
    <div class="option-card bus">
      <h3>🚌 Bus</h3>
      <div class="sub-option">
        <strong>${bus.governmentBus.type}</strong> (Budget)
        <div class="stat-row"><span>Per Person</span><span>${formatCurrency(bus.governmentBus.cost)}</span></div>
        <div class="stat-row"><span>Total</span><span>${formatCurrency(bus.governmentBus.cost * travelers)}</span></div>
        <div class="stat-row"><span>Duration</span><span>${formatDuration(bus.governmentBus.duration * 60)}</span></div>
      </div>
      <div class="sub-option">
        <strong>${bus.privateBus.type}</strong> (Comfort)
        <div class="stat-row"><span>Per Person</span><span>${formatCurrency(bus.privateBus.cost)}</span></div>
        <div class="stat-row"><span>Total</span><span>${formatCurrency(bus.privateBus.cost * travelers)}</span></div>
        <div class="stat-row"><span>Duration</span><span>${formatDuration(bus.privateBus.duration * 60)}</span></div>
      </div>
    </div>`;
}

function flightHtml(flight: any, travelers: number): string {
  if (!flight || !flight.flights || flight.flights.length === 0) return '';
  return `
    <div class="option-card flight">
      <h3>✈️ Flight (${flight.flights.length} option${flight.flights.length > 1 ? 's' : ''})</h3>
      ${flight.flights.slice(0, 4).map((f: any) => `
        <div class="flight-item">
          <div class="stat-row"><span>${f.airline} (${f.flightNumber})</span><span>${formatCurrency(f.price)}/person</span></div>
          <div class="stat-row"><span>Time</span><span>${f.departureTime} – ${f.arrivalTime} (${f.duration})</span></div>
          <div class="stat-row"><span>Stops</span><span>${f.stops === 0 ? 'Non-stop' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}</span></div>
          <div class="stat-row total"><span>Total (${travelers} pax)</span><span>${formatCurrency(f.price * travelers)}</span></div>
        </div>
      `).join('')}
    </div>`;
}

function budgetHtml(budget: any): string {
  if (!budget) return '';
  return `
    <div class="section">
      <h2>💰 Budget Estimate</h2>
      <div class="grid-3">
        ${['economy', 'midRange', 'luxury'].map(tier => {
          const b = budget[tier];
          if (!b) return '';
          const label = tier === 'midRange' ? 'Mid-Range' : tier === 'economy' ? 'Economy' : 'Luxury';
          const colors: Record<string, string> = { economy: '#22c55e', midRange: '#f59e0b', luxury: '#ef4444' };
          return `
            <div class="tier-card" style="border-top: 4px solid ${colors[tier] || '#3b82f6'}">
              <h3>${label}</h3>
              <div class="stat-row total"><span>Total</span><span>${formatCurrency(b.total || 0)}</span></div>
              <div class="stat-row"><span>Per Day</span><span>${formatCurrency(b.perDay || 0)}</span></div>
              <div class="stat-row"><span>Fuel</span><span>${formatCurrency(b.fuelCost || 0)}</span></div>
              ${b.accommodation ? `<div class="stat-row"><span>Accommodation</span><span>${formatCurrency(b.accommodation)}</span></div>` : ''}
              ${b.food ? `<div class="stat-row"><span>Food</span><span>${formatCurrency(b.food)}</span></div>` : ''}
              ${b.activities ? `<div class="stat-row"><span>Activities</span><span>${formatCurrency(b.activities)}</span></div>` : ''}
            </div>`;
        }).join('')}
      </div>
      ${budget.fuelPrice ? `<p style="text-align:center;color:#888;font-size:13px;margin-top:12px">⛽ Fuel Price: ₹${budget.fuelPrice}/L • Source: IOCL + Global Crude</p>` : ''}
    </div>`;
}

function citiesOnRouteHtml(cities: { name: string }[]): string {
  if (!cities || cities.length === 0) return '';
  return `
    <div class="section">
      <h2>📍 Cities on Route</h2>
      <div class="cities-list">
        ${cities.map(c => `<span class="city-tag">${c.name}</span>`).join('')}
      </div>
    </div>`;
}

export function downloadTripReport(data: ReportData) {
  const ct = `Trip Report — ${data.source} → ${data.destination}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ct}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; background: #f3f4f6; padding: 40px 20px; }
    .container { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h1 { font-size: 28px; color: #111; margin-bottom: 4px; }
    .subtitle { color: #888; font-size: 14px; margin-bottom: 24px; }
    .trip-meta { display: flex; flex-wrap: wrap; gap: 16px; padding: 16px 20px; background: #f8fafc; border-radius: 12px; margin-bottom: 28px; }
    .trip-meta span { font-size: 14px; color: #555; }
    .trip-meta strong { color: #111; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .section { margin-bottom: 28px; }
    .section h2 { font-size: 20px; margin-bottom: 14px; color: #111; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .stat { display: flex; justify-content: space-between; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 14px; }
    .stat .label { color: #888; }
    .stat .value { font-weight: 600; color: #111; }
    .stat-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .stat-row.total { font-weight: 700; font-size: 16px; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 4px; }
    .option-card { background: #f9fafb; border-radius: 12px; padding: 16px 20px; margin-bottom: 14px; }
    .option-card h3 { font-size: 16px; margin-bottom: 10px; }
    .option-card.car { border-left: 4px solid #3b82f6; }
    .option-card.bus { border-left: 4px solid #22c55e; }
    .option-card.flight { border-left: 4px solid #f97316; }
    .sub-option { margin-top: 10px; padding: 10px 14px; background: #fff; border-radius: 8px; }
    .sub-option strong { font-size: 14px; }
    .flight-item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .flight-item:last-child { border-bottom: none; }
    .tier-card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .tier-card h3 { font-size: 15px; margin-bottom: 10px; }
    .cities-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .city-tag { padding: 6px 14px; background: #eff6ff; color: #2563eb; border-radius: 20px; font-size: 13px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 8px; }
    th { text-align: left; padding: 10px 12px; color: #888; font-weight: 500; border-bottom: 2px solid #e5e7eb; }
    td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .badge.green { background: #dcfce7; color: #16a34a; }
    .badge.blue { background: #dbeafe; color: #2563eb; }
    .footer { text-align: center; color: #aaa; font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
    @media (max-width: 600px) { .container { padding: 20px; } .grid-2, .grid-3 { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>${data.source} → ${data.destination}</h1>
    <p class="subtitle">Travel Route Report • Generated on ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

    <div class="trip-meta">
      <span>📏 Distance: <strong>${formatDistance(data.distance)}</strong></span>
      <span>⏱️ Duration: <strong>${formatDuration(data.duration)}</strong></span>
      <span>👥 Travelers: <strong>${data.travelers}</strong></span>
      ${data.travelDate ? `<span>📅 Travel Date: <strong>${data.travelDate}</strong></span>` : ''}
      ${data.returnDate ? `<span>🔄 Return: <strong>${data.returnDate}</strong></span>` : ''}
    </div>

    ${citiesOnRouteHtml(data.citiesOnRoute || [])}

    ${data.weather ? weatherHtml(data.weather) : ''}

    <div class="section">
      <h2>🚗 Travel Options</h2>
      ${carHtml(data.costEstimates?.car, data.travelers)}
      ${busHtml(data.costEstimates?.bus, data.travelers)}
      ${flightHtml(data.costEstimates?.flight, data.travelers)}
    </div>

    ${data.costEstimates?.summary ? `
    <div class="section">
      <h2>📊 Cost Comparison</h2>
      <table>
        <thead><tr><th>Mode</th><th>Per Person</th><th>Total</th><th>Time</th><th>Best For</th></tr></thead>
        <tbody>
          ${data.costEstimates.summary.options.map((o: any) => {
            const perPerson = o.mode === 'Car' ? Math.round(o.cost / data.travelers) : o.cost;
            const total = o.mode === 'Car' ? o.cost : o.cost * data.travelers;
            const isBest = data.costEstimates.summary.bestValue?.type === o.type;
            const isFast = data.costEstimates.summary.fastest?.type === o.type;
            return `<tr>
              <td>${o.mode}</td>
              <td>${formatCurrency(perPerson)}</td>
              <td><strong>${formatCurrency(total)}</strong></td>
              <td>${o.time > 0 ? `${o.time}h` : 'N/A'}</td>
              <td>${isBest ? '<span class="badge green">👍 Best Value</span>' : ''} ${isFast ? '<span class="badge blue">⚡ Fastest</span>' : ''}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>` : ''}

    ${data.costEstimates?.budget ? budgetHtml(data.costEstimates.budget) : ''}

    <div class="footer">
      <p>Generated by TravelRoute AI — Developed by Bharadwaj</p>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trip-report_${data.source}-${data.destination}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
