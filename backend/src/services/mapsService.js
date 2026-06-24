const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config/env');

const cache = new NodeCache({ stdTTL: 3600 });

const CITY_COORDS = {
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'bombay': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.7041, lng: 77.1025 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'madras': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'calcutta': { lat: 22.5726, lng: 88.3639 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'goa': { lat: 15.4909, lng: 73.8278 },
  'kochi': { lat: 9.9312, lng: 76.2673 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'guwahati': { lat: 26.1445, lng: 91.7362 },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
  'trivandrum': { lat: 8.5241, lng: 76.9366 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'bhopal': { lat: 23.2599, lng: 77.4126 },
  'nagpur': { lat: 21.1458, lng: 79.0882 },
  'varanasi': { lat: 25.3176, lng: 82.9739 },
  'agra': { lat: 27.1767, lng: 78.0081 },
  'coimbatore': { lat: 11.0168, lng: 76.9558 },
  'mangalore': { lat: 12.9141, lng: 74.8560 },
  'mangaluru': { lat: 12.9141, lng: 74.8560 },
  'vizag': { lat: 17.6868, lng: 83.2185 },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'patna': { lat: 25.5941, lng: 85.1376 },
  'ranchi': { lat: 23.3441, lng: 85.3096 },
  'raipur': { lat: 21.2514, lng: 81.6296 },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'imphal': { lat: 24.8170, lng: 93.9368 },
  'shillong': { lat: 25.5788, lng: 91.8933 },
  'dehradun': { lat: 30.3165, lng: 78.0322 },
  'srinagar': { lat: 34.0837, lng: 74.7973 },
  'jammu': { lat: 32.7266, lng: 74.8570 },
  'amritsar': { lat: 31.6340, lng: 74.8723 },
  'madurai': { lat: 9.9252, lng: 78.1198 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'vadodara': { lat: 22.3072, lng: 73.1812 },
  'baroda': { lat: 22.3072, lng: 73.1812 },
  'rajkot': { lat: 22.3039, lng: 70.8022 },
  'jodhpur': { lat: 26.2389, lng: 73.0243 },
  'udaipur': { lat: 24.5854, lng: 73.7125 },
  'ajmer': { lat: 26.4499, lng: 74.6399 },
  'kanpur': { lat: 26.4499, lng: 80.3319 },
  'allahabad': { lat: 25.4358, lng: 81.8463 },
  'prayagraj': { lat: 25.4358, lng: 81.8463 },
  'gorakhpur': { lat: 26.7606, lng: 83.3732 },
  'nashik': { lat: 19.9975, lng: 73.7898 },
  'aurangabad': { lat: 19.8762, lng: 75.3433 },
  'kolhapur': { lat: 16.7050, lng: 74.2433 },
  'belgaum': { lat: 15.8497, lng: 74.4977 },
  'hubli': { lat: 15.3647, lng: 75.1240 },
  'mysore': { lat: 12.2958, lng: 76.6394 },
  'mysuru': { lat: 12.2958, lng: 76.6394 },
  'tirupati': { lat: 13.6288, lng: 79.4192 },
  'vijayawada': { lat: 16.5062, lng: 80.6480 },
  'guntur': { lat: 16.3067, lng: 80.4365 },
  'warangal': { lat: 18.0000, lng: 79.5881 },
  'gaya': { lat: 24.7955, lng: 84.9994 },
  'bodh gaya': { lat: 24.6951, lng: 84.9914 },
  'puri': { lat: 19.8134, lng: 85.8315 },
  'konark': { lat: 19.8876, lng: 86.0945 },
  'cuttack': { lat: 20.4625, lng: 85.8830 },
  'rourkela': { lat: 22.2604, lng: 84.8536 },
  'thrissur': { lat: 10.5276, lng: 76.2144 },
  'kozhikode': { lat: 11.2588, lng: 75.7804 },
  'kannur': { lat: 11.8745, lng: 75.3704 },
  'siliguri': { lat: 26.7271, lng: 88.3953 },
  'darjeeling': { lat: 27.0360, lng: 88.2627 },
  'gangtok': { lat: 27.3314, lng: 88.6138 },
  'leh': { lat: 34.1526, lng: 77.5770 },
  'kullu': { lat: 31.9592, lng: 77.1089 },
  'shimla': { lat: 31.1048, lng: 77.1734 },
  'dharamshala': { lat: 32.2190, lng: 76.3234 },
  'mathura': { lat: 27.4924, lng: 77.6737 },
  'vrindavan': { lat: 27.5810, lng: 77.7000 },
  'ayodhya': { lat: 26.7958, lng: 82.1997 },
  'haridwar': { lat: 29.9457, lng: 78.1642 },
  'rishikesh': { lat: 30.0869, lng: 78.2676 },
  'noida': { lat: 28.5355, lng: 77.3910 },
  'gurugram': { lat: 28.4595, lng: 77.0266 },
  'gurgaon': { lat: 28.4595, lng: 77.0266 },
  'faridabad': { lat: 28.4089, lng: 77.3178 },
  'ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'thane': { lat: 19.2183, lng: 72.9781 },
  'navi mumbai': { lat: 19.0330, lng: 73.0297 },
  'kalyan': { lat: 19.2403, lng: 73.1305 },
  'secunderabad': { lat: 17.4399, lng: 78.4983 },
  'howrah': { lat: 22.5958, lng: 88.3106 },
  'salem': { lat: 11.6643, lng: 78.1460 },
  'trichy': { lat: 10.7905, lng: 78.7047 },
  'tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  'vellore': { lat: 12.9165, lng: 79.1325 },
  'nellore': { lat: 14.4426, lng: 79.9865 },
  'kurnool': { lat: 15.8281, lng: 78.0373 },
  'rajahmundry': { lat: 17.0005, lng: 81.8040 },
  'ongole': { lat: 15.5057, lng: 80.0499 },
  'kadapa': { lat: 14.4673, lng: 78.8242 },
  'anantapur': { lat: 14.6819, lng: 77.6006 },
  'karimnagar': { lat: 18.4386, lng: 79.1288 },
  'nizamabad': { lat: 18.6720, lng: 78.0979 },
  'adilabad': { lat: 19.6666, lng: 78.5329 },
  'khammam': { lat: 17.2473, lng: 80.1514 },
  'mahabubnagar': { lat: 16.7335, lng: 77.9830 },
  'davangere': { lat: 14.4643, lng: 75.9213 },
  'bellary': { lat: 15.1394, lng: 76.9214 },
  'ballari': { lat: 15.1394, lng: 76.9214 },
  'shivamogga': { lat: 13.9299, lng: 75.5681 },
  'shimoga': { lat: 13.9299, lng: 75.5681 },
  'tumkur': { lat: 13.3379, lng: 77.1173 },
  'hassan': { lat: 13.0032, lng: 76.1020 },
  'mandya': { lat: 12.5243, lng: 76.8958 },
  'udupi': { lat: 13.3409, lng: 74.7421 },
  'port blair': { lat: 11.6234, lng: 92.7265 },
  'agartala': { lat: 23.8315, lng: 91.2868 },
  'aizawl': { lat: 23.7271, lng: 92.7176 },
  'dibrugarh': { lat: 27.4728, lng: 94.9120 },
  'silchar': { lat: 24.8279, lng: 92.7971 },
  'dimapur': { lat: 25.9137, lng: 93.7217 },
  'bihar sharif': { lat: 25.2008, lng: 85.5242 },
  'muzaffarpur': { lat: 26.1209, lng: 85.3647 },
  'nalanda': { lat: 25.1018, lng: 85.5185 },
  'gwalior': { lat: 26.2183, lng: 78.1828 },
  'jabalpur': { lat: 23.1815, lng: 79.9864 },
  'khajuraho': { lat: 24.8318, lng: 79.9199 },
  'solapur': { lat: 17.6599, lng: 75.9064 },
  'akola': { lat: 20.7030, lng: 77.0025 },
  'amravati': { lat: 20.9271, lng: 77.7522 },
  'nanded': { lat: 19.1383, lng: 77.3210 },
  'jalgaon': { lat: 21.0077, lng: 75.5626 },
  'ratnagiri': { lat: 16.9902, lng: 73.3120 },
  'sindhudurg': { lat: 16.1333, lng: 73.7000 },
  'jamshedpur': { lat: 22.8046, lng: 86.2029 },
  'dhanbad': { lat: 23.7957, lng: 86.4304 },
  'bokaro': { lat: 23.6693, lng: 86.1511 },
  'asansol': { lat: 23.6888, lng: 86.9836 },
  'durgapur': { lat: 23.5204, lng: 87.3119 },
  'bardhaman': { lat: 23.2402, lng: 87.8623 },
  'kharagpur': { lat: 22.3460, lng: 87.2320 },
  'haldia': { lat: 22.0298, lng: 88.0473 },
  'kalyani': { lat: 22.9833, lng: 88.4333 },
  'habra': { lat: 22.8350, lng: 88.6230 },
  'kulti': { lat: 23.7296, lng: 86.8575 },
  'bettiah': { lat: 26.8024, lng: 84.5025 },
  'motihari': { lat: 26.6497, lng: 84.9156 },
  'chhapra': { lat: 25.7768, lng: 84.7491 },
  'siwan': { lat: 26.2215, lng: 84.3587 },
  'gopalganj': { lat: 26.4675, lng: 84.4412 },
  'sasaram': { lat: 24.9498, lng: 84.0313 },
  'deoghar': { lat: 24.4924, lng: 86.6968 },
  'dumka': { lat: 24.2684, lng: 87.2390 },
  'hazaribagh': { lat: 24.0019, lng: 85.3557 },
  'chandil': { lat: 22.9604, lng: 86.0511 },
  'koderma': { lat: 24.4688, lng: 85.5997 },
  'ludhiana': { lat: 30.9010, lng: 75.8573 },
  'jalandhar': { lat: 31.3260, lng: 75.5762 },
  'patiala': { lat: 30.3398, lng: 76.3869 },
  'bathinda': { lat: 30.2110, lng: 74.9455 },
  'mohali': { lat: 30.7200, lng: 76.7200 },
  'panchkula': { lat: 30.6938, lng: 76.8475 },
  'saharanpur': { lat: 29.9687, lng: 77.5452 },
  'muzaffarnagar': { lat: 29.4706, lng: 77.7030 },
  'meerut': { lat: 28.9845, lng: 77.7064 },
  'ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'aligarh': { lat: 27.8974, lng: 78.0760 },
  'bareilly': { lat: 28.3670, lng: 79.4304 },
  'moradabad': { lat: 28.8386, lng: 78.7733 },
  'sambhal': { lat: 28.5848, lng: 78.5698 },
  'firozabad': { lat: 27.1591, lng: 78.3958 },
  'jhansi': { lat: 25.4489, lng: 78.5681 },
  'etawah': { lat: 26.7756, lng: 79.0220 },
  'mathura': { lat: 27.4924, lng: 77.6737 },
  'hapur': { lat: 28.7317, lng: 77.7758 },
  'bulandshahr': { lat: 28.4066, lng: 77.8501 },
  'bahraich': { lat: 27.5740, lng: 81.5964 },
  'sultanpur': { lat: 26.2673, lng: 82.0746 },
  'faizabad': { lat: 26.7744, lng: 82.1457 },
  'basti': { lat: 26.8142, lng: 82.7676 },
  'gonda': { lat: 27.1335, lng: 81.9566 },
  'bijnor': { lat: 29.3720, lng: 78.1361 },
  'hardoi': { lat: 27.3936, lng: 80.1303 },
  'lakhimpur': { lat: 27.9475, lng: 80.7815 },
  'sitapur': { lat: 27.5658, lng: 80.6814 },
  'unnao': { lat: 26.5443, lng: 80.4932 },
  'raebareli': { lat: 26.2235, lng: 81.2384 },
  'bara banki': { lat: 26.9230, lng: 81.2350 },
  'shahjahanpur': { lat: 27.8811, lng: 79.9100 },
  'pilibhit': { lat: 28.6306, lng: 79.8044 },
  'kannauj': { lat: 27.0580, lng: 79.9161 },
  'kaushambi': { lat: 25.5251, lng: 81.3775 },
  'mirzapur': { lat: 25.1362, lng: 82.5641 },
  'sonbhadra': { lat: 24.6879, lng: 83.0656 },
  'deoria': { lat: 26.5011, lng: 83.7803 },
  'kushinagar': { lat: 26.7440, lng: 83.8880 },
  'maharajganj': { lat: 27.1378, lng: 83.5618 },
  'chandauli': { lat: 25.2568, lng: 83.2655 },
  'vindhyachal': { lat: 25.1636, lng: 82.8298 },
};

const mapsService = {
  async geocode(location) {
    const cacheKey = `geocode_${location.toLowerCase()}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    const normalized = location.toLowerCase().trim();
    const local = CITY_COORDS[normalized];
    if (local) {
      cache.set(cacheKey, local);
      return local;
    }
    try {
      const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: location, format: 'json', limit: 1, 'accept-language': 'en' },
        headers: { 'User-Agent': 'TravelRouteAI/1.0' },
        timeout: 4000
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
          timeout: 5000
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
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 6000 }
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
      } catch (e) { console.error('Overpass nearby error:', e.message);
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
    } catch (e) { console.error('Place photo error:', e.message); }
    return '';
  },

  async getPlaceDetails(placeId) {
    return null;
  }
};

module.exports = mapsService;
