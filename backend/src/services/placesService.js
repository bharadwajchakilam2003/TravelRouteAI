const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 86400 });
const config = require('../config/env');

const ATTRACTION_TYPES = [
  'tourism=attraction', 'tourism=museum', 'tourism=monument', 'tourism=viewpoint',
  'tourism=zoo', 'tourism=theme_park', 'tourism=gallery',
  'historic=castle', 'historic=monument', 'historic=ruins', 'historic=fort', 'historic=temple',
  'historic=church', 'historic=mosque', 'historic=memorial', 'historic=palace',
  'leisure=park', 'leisure=garden', 'leisure=water_park',
  'natural=waterfall', 'natural=beach', 'natural=cave',
  'amenity=marketplace'
];

const placesService = {
  async getAttractions(lat, lng, radius = 50000, cityName = '') {
    const cacheKey = `attractions_${lat}_${lng}_${radius}_${cityName}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    let enriched = [];
    try {
      const queries = ATTRACTION_TYPES.map(t => `node["${t.split('=')[0]}"="${t.split('=')[1]}"](around:${radius},${lat},${lng});`).join('\n');
      const overpassQuery = `[out:json];(\n${queries}\n);out body ${Math.min(radius / 1000 * 2, 50)};out;`;
      const { data } = await axios.post('https://overpass-api.de/api/interpreter',
        `data=${encodeURIComponent(overpassQuery)}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 30000 }
      );
      const elements = (data.elements || []).filter(e => e.tags && e.tags.name).slice(0, 30);
      enriched = await Promise.all(elements.map(async (el) => {
        const name = el.tags.name;
        const category = el.tags.tourism || el.tags.historic || el.tags.leisure || el.tags.natural || el.tags.amenity || 'attraction';
        const description = el.tags.description || el.tags.historic || el.tags.tourism || this._categoryDescription(category);
        const images = await this._getPlaceImages(name, cityName);
        return {
          placeId: `${el.type}-${el.id}`,
          name,
          lat: el.lat,
          lng: el.lon,
          description: description || 'Popular tourist attraction',
          image: images[0] || `https://source.unsplash.com/400x300/?${encodeURIComponent(name)},travel,india`,
          rating: parseFloat(el.tags.rating) || parseFloat(el.tags['rating:average']) || 4.0,
          timeRequired: this._estimateTime(category),
          entryFee: el.tags.fee === 'yes' ? (el.tags['fee:amount'] || '₹50 - ₹300') : 'Free',
          bestTimeToVisit: 'October to March',
          category: category.replace(/_/g, ''),
          wikipedia: el.tags.wikipedia || ''
        };
      }));
    } catch (error) {
      console.error('Overpass attractions error:', error.message);
    }
    if (enriched.length < 8 && config.opentripmapKey && config.opentripmapKey !== 'your_opentripmap_key') {
      try {
        const otmRes = await axios.get('https://api.opentripmap.com/0.1/en/places/radius', {
          params: {
            apikey: config.opentripmapKey, radius: Math.min(radius, 50000), lon: lng, lat,
            rate: 2, limit: 15, format: 'json'
          }, timeout: 10000
        });
        const otmData = otmRes.data;
        if (Array.isArray(otmData)) {
          const seenNames = new Set(enriched.map(e => e.name.toLowerCase()));
          for (const item of otmData) {
            const name = item.name || item.properties?.name;
            if (name && !seenNames.has(name.toLowerCase()) && enriched.length < 25) {
              seenNames.add(name.toLowerCase());
              const images = cityName ? await this._getPlaceImages(name, cityName) : [];
              enriched.push({
                placeId: `otm-${item.xid || item.properties?.xid || enriched.length}`,
                name, lat: item.point?.lat || item.geometry?.coordinates?.[1] || lat,
                lng: item.point?.lon || item.geometry?.coordinates?.[0] || lng,
                description: item.properties?.description || item.wikipedia_extract || `${name} is a popular attraction`,
                image: images[0] || '',
                rating: 4.0, category: (item.kind || 'attraction').split(',')[0].replace(/_/g, ' '),
                timeRequired: '1-2 hours', entryFee: 'Free', bestTimeToVisit: 'October to March'
              });
            }
          }
        }
      } catch (e) {
        console.error('OpenTripMap error:', e.message);
      }
    }
    if (enriched.length < 5 && cityName) {
      const wikiAttractions = await this._fetchFamousAttractions(cityName);
      if (wikiAttractions.length > 0) {
        const seen = new Set(enriched.map(e => e.name.toLowerCase()));
        for (const a of wikiAttractions) {
          if (!seen.has(a.name.toLowerCase())) {
            enriched.push(a);
          }
        }
      }
    }
    cache.set(cacheKey, enriched);
    return enriched;
  },

  async _fetchFamousAttractions(cityName) {
    try {
      const { data: pageData } = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query', list: 'search', srsearch: `${cityName} tourist attractions`, srlimit: 10,
          format: 'json', origin: '*'
        }, timeout: 8000
      });
      const results = [];
      for (const page of (pageData?.query?.search || [])) {
        const title = page.title;
        if (!title || title.includes('List of') || title.includes('Wikimedia')) continue;
        const { data: imgData } = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
            action: 'query', titles: title, prop: 'pageimages|extracts',
            pithumbsize: 400, exintro: true, explaintext: true, format: 'json', origin: '*'
          }, timeout: 5000
        });
        const pages = Object.values(imgData?.query?.pages || {});
        const p = pages.find(p => p && p.pageid);
        if (p) {
          results.push({
            placeId: `wiki-${p.pageid}`,
            name: p.title,
            lat: 0, lng: 0,
            description: (p.extract || 'Popular tourist attraction').slice(0, 300),
            image: p.thumbnail?.source || `https://source.unsplash.com/400x300/?${encodeURIComponent(p.title)},india`,
            rating: 4.0,
            category: 'attraction',
            timeRequired: '1-2 hours',
            entryFee: 'Free',
            bestTimeToVisit: 'October to March'
          });
        }
      }
      return results.slice(0, 8);
    } catch { return []; }
  },

  async _getPlaceImages(name, cityName = '') {
    try {
      const { data } = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name), { timeout: 5000 });
      if (data && data.thumbnail && data.thumbnail.source) {
        return [data.thumbnail.source];
      }
    } catch {}
    try {
      const searchTerms = cityName ? `${name} ${cityName}` : name;
      const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query', list: 'search', srsearch: searchTerms, format: 'json', srlimit: 3, origin: '*'
        }, timeout: 5000
      });
      const pages = searchRes?.data?.query?.search || [];
      for (const page of pages) {
        if (page.title) {
          const imgRes = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
              action: 'query', titles: page.title, prop: 'pageimages', pithumbsize: 400, format: 'json', origin: '*'
            }, timeout: 5000
          });
          const imgPages = imgRes?.data?.query?.pages;
          if (imgPages) {
            const thumb = Object.values(imgPages).find(p => p && p.thumbnail && p.thumbnail.source);
            if (thumb) return [thumb.thumbnail.source];
          }
        }
      }
    } catch {}
    return [];
  },

  _categoryDescription(category) {
    const descs = {
      attraction: 'Popular tourist attraction worth visiting',
      museum: 'Museum showcasing art, history, or culture',
      monument: 'Historical monument and landmark',
      viewpoint: 'Scenic viewpoint with panoramic views',
      castle: 'Historic castle with architectural significance',
      ruins: 'Ancient ruins with historical importance',
      fort: 'Historic fort with architectural grandeur',
      temple: 'Ancient temple with religious significance',
      palace: 'Royal palace with exquisite architecture',
      park: 'Public park and recreational area',
      garden: 'Beautiful garden with diverse flora',
      waterfall: 'Scenic waterfall and natural wonder',
      beach: 'Beautiful beach destination',
      cave: 'Natural cave formation',
      memorial: 'War memorial and tribute',
      marketplace: 'Traditional marketplace and shopping area'
    };
    return descs[category] || 'Tourist attraction with cultural significance';
  },

  _estimateTime(category) {
    const times = {
      museum: '2-3 hours', monument: '30 min - 1 hour', viewpoint: '30 min - 1 hour',
      castle: '2-3 hours', ruins: '1-2 hours', fort: '2-3 hours',
      temple: '1-2 hours', palace: '2-3 hours', park: '1-2 hours',
      garden: '1-2 hours', waterfall: '1-2 hours', beach: '2-4 hours',
      cave: '1-2 hours', memorial: '30 min - 1 hour', marketplace: '1-2 hours',
      zoo: '3-4 hours', theme_park: '4-6 hours', gallery: '1-2 hours',
      water_park: '3-4 hours'
    };
    return times[category] || '1-2 hours';
  },

  async findCitiesOnRoute(sourceLat, sourceLng, destLat, destLng) {
    try {
      const midLat = (sourceLat + destLat) / 2;
      const midLng = (sourceLng + destLng) / 2;
      const dist = this._haversineDistance(sourceLat, sourceLng, destLat, destLng);
      const numCities = Math.min(Math.max(Math.floor(dist / 80), 2), 8);
      const cities = [];
      const radius = Math.max(dist / numCities / 2, 20);
      for (let i = 1; i < numCities; i++) {
        const frac = i / numCities;
        const lat = sourceLat + (destLat - sourceLat) * frac + (Math.random() - 0.5) * 0.3;
        const lng = sourceLng + (destLng - sourceLng) * frac + (Math.random() - 0.5) * 0.3;
        const cityName = await this._reverseGeocode(lat, lng);
        if (cityName && !cities.includes(cityName)) cities.push(cityName);
      }
      return cities.slice(0, 8);
    } catch (error) {
      console.error('Cities on route error:', error.message);
      return [];
    }
  },

  async _reverseGeocode(lat, lng) {
    try {
      const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: { lat, lon: lng, format: 'json', 'accept-language': 'en' },
        headers: { 'User-Agent': 'TravelRouteAI/1.0' },
        timeout: 5000
      });
      return data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.state_district || '';
    } catch {
      return '';
    }
  },

  _haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
};

module.exports = placesService;
