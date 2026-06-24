const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config/env');

const cache = new NodeCache({ stdTTL: 3600 });

const mapsService = {
  async geocode(location) {
    const cacheKey = `geocode_${location.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    try {
      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: location, format: 'json', limit: 1, 'accept-language': 'en' },
        headers: { 'User-Agent': 'TravelRouteAI/1.0' },
        timeout: 8000
      });
      if (data && data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          formattedAddress: data[0].display_name
        };
        cache.set(cacheKey, result);
        return result;
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Nominatim geocode error:', error.message);
      throw new Error('Failed to geocode location');
    }
  },

  async getRoute(sourceCoords, destCoords) {
    const cacheKey = `route_${sourceCoords.lat}_${sourceCoords.lng}_${destCoords.lat}_${destCoords.lng}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    try {
      if (config.openrouteApiKey && config.openrouteApiKey !== 'your_openroute_api_key') {
        const { data } = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car', {
          coordinates: [[sourceCoords.lng, sourceCoords.lat], [destCoords.lng, destCoords.lat]],
          format: 'json',
          alternative_routes: { target_count: 2, share_factor: 0.6 }
        }, {
          headers: {
            'Authorization': config.openrouteApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry?.coordinates || [];
          const polyline = coords.map(c => `${c[1]},${c[0]}`).join(';');
          const result = {
            distance: Math.round((route.summary?.distance || 0) / 1000),
            duration: Math.round((route.summary?.duration || 0) / 60),
            polyline,
            alternativeRoutes: (data.routes.slice(1) || []).map((alt, i) => ({
              distance: Math.round((alt.summary?.distance || 0) / 1000),
              duration: Math.round((alt.summary?.duration || 0) / 60),
              polyline: (alt.geometry?.coordinates || []).map(c => `${c[1]},${c[0]}`).join(';'),
              summary: `Alternative ${i + 1}`
            }))
          };
          cache.set(cacheKey, result);
          return result;
        }
      }
      return await this._fallbackRoute(sourceCoords, destCoords);
    } catch (error) {
      console.error('OpenRouteService error:', error.message);
      return await this._fallbackRoute(sourceCoords, destCoords);
    }
  },

  async _fallbackRoute(sourceCoords, destCoords) {
    const R = 6371;
    const dLat = (destCoords.lat - sourceCoords.lat) * Math.PI / 180;
    const dLon = (destCoords.lng - sourceCoords.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(sourceCoords.lat * Math.PI / 180) * Math.cos(destCoords.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const numPoints = 20;
    const polyline = [];
    for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints;
      const lat = sourceCoords.lat + (destCoords.lat - sourceCoords.lat) * f;
      const lng = sourceCoords.lng + (destCoords.lng - sourceCoords.lng) * f;
      polyline.push(`${lat},${lng}`);
    }
    return {
      distance: Math.round(distance),
      duration: Math.round(distance / 50 * 60),
      polyline: polyline.join(';'),
      alternativeRoutes: []
    };
  },

  async findNearbyPlaces(lat, lng, radius = 5000, type = 'tourism') {
    const cacheKey = `nearby_${lat}_${lng}_${radius}_${type}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    try {
      const tag = type === 'restaurant' ? 'amenity=restaurant' :
                  type === 'hotel' ? 'tourism=hotel' :
                  type === 'fuel' ? 'amenity=fuel' :
                  'tourism=attraction';
      const query = `[out:json];node["${tag.split('=')[0]}"="${tag.split('=')[1]}"](around:${radius},${lat},${lng});out 20;`;
      const { data } = await axios.post('https://overpass-api.de/api/interpreter',
        `data=${encodeURIComponent(query)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000 }
      );
      const results = (data.elements || []).filter(e => e.tags && e.tags.name).map(el => ({
        placeId: `${el.type}-${el.id}`,
        name: el.tags.name,
        lat: el.lat,
        lng: el.lon,
        rating: parseFloat(el.tags.rating) || 0,
        vicinity: el.tags['addr:street'] || el.tags['addr:city'] || '',
        types: [el.tags.tourism || el.tags.amenity || type]
      }));
      cache.set(cacheKey, results);
      return results;
    } catch {
      return [];
    }
  },

  async getPlacePhoto(photoReference, maxWidth = 400) {
    if (!photoReference) return '';
    try {
      const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(photoReference)}`, { timeout: 5000, headers: { 'User-Agent': 'TravelRouteAI/1.0' } });
      if (data && data.thumbnail && data.thumbnail.source) {
        return data.thumbnail.source;
      }
    } catch {}
    return '';
  },

  async getPlaceDetails(placeId) {
    return null;
  }
};

module.exports = mapsService;
