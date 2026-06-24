const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 86400 });

const FAMOUS_CITIES = [
  { name: 'Agra', state: 'Uttar Pradesh', category: 'city', tags: ['taj mahal', 'monument', 'history'] },
  { name: 'Jaipur', state: 'Rajasthan', category: 'city', tags: ['pink city', 'palace', 'heritage'] },
  { name: 'Varanasi', state: 'Uttar Pradesh', category: 'city', tags: ['temple', 'ganges', 'spiritual'] },
  { name: 'Delhi', state: 'Delhi', category: 'city', tags: ['capital', 'monument', 'historic'] },
  { name: 'Mumbai', state: 'Maharashtra', category: 'city', tags: ['gateway', 'coastal', 'financial'] },
  { name: 'Hampi', state: 'Karnataka', category: 'city', tags: ['ruins', 'temple', 'UNESCO'] },
  { name: 'Udaipur', state: 'Rajasthan', category: 'city', tags: ['lake', 'palace', 'romantic'] },
  { name: 'Chennai', state: 'Tamil Nadu', category: 'city', tags: ['beach', 'temple', 'colonial'] },
  { name: 'Kolkata', state: 'West Bengal', category: 'city', tags: ['colonial', 'culture', 'river'] },
  { name: 'Hyderabad', state: 'Telangana', category: 'city', tags: ['pearls', 'nawab', 'history'] },
  { name: 'Bengaluru', state: 'Karnataka', category: 'city', tags: ['garden', 'tech', 'cosmopolitan'] },
  { name: 'Amritsar', state: 'Punjab', category: 'city', tags: ['golden temple', 'sikh', 'spiritual'] },
];

const FAMOUS_MONUMENTS = [
  { name: 'Taj Mahal', city: 'Agra', category: 'monument', tags: ['mausoleum', 'UNESCO', 'wonder'] },
  { name: 'Qutub Minar', city: 'Delhi', category: 'monument', tags: ['minaret', 'UNESCO', 'medieval'] },
  { name: 'Red Fort', city: 'Delhi', category: 'monument', tags: ['fort', 'UNESCO', 'mughal'] },
  { name: 'Gateway of India', city: 'Mumbai', category: 'monument', tags: ['arch', 'colonial', 'waterfront'] },
  { name: 'Hawa Mahal', city: 'Jaipur', category: 'monument', tags: ['palace', 'architecture', 'pink'] },
  { name: 'Mysore Palace', city: 'Mysore', category: 'monument', tags: ['palace', 'illuminated', 'royal'] },
  { name: 'Charminar', city: 'Hyderabad', category: 'monument', tags: ['minaret', 'old city', 'iconic'] },
  { name: 'Golden Temple', city: 'Amritsar', category: 'monument', tags: ['gurdwara', 'golden', 'sikh'] },
  { name: 'India Gate', city: 'Delhi', category: 'monument', tags: ['war memorial', 'arch'] },
  { name: 'Sanchi Stupa', city: 'Sanchi', category: 'monument', tags: ['buddhist', 'UNESCO', 'ancient'] },
  { name: 'Khajuraho Group of Monuments', city: 'Khajuraho', category: 'monument', tags: ['temple', 'UNESCO', 'sculpture'] },
  { name: 'Hampi', city: 'Hampi', category: 'monument', tags: ['ruins', 'UNESCO', 'vijayanagara'] },
];

const service = {
  async getAllFamousPlaces() {
    const cacheKey = 'famous_indian_places';
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    const all = await Promise.all([
      ...FAMOUS_CITIES.map(c => this._fetchWikipediaInfo(c)),
      ...FAMOUS_MONUMENTS.map(m => this._fetchWikipediaInfo(m)),
    ]);
    cache.set(cacheKey, all);
    return all;
  },

  async _fetchWikipediaInfo(place) {
    try {
      const ua = 'TravelRouteAI/1.0 (travelrouteai@example.com)';
      const { data: searchData } = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query', list: 'search', srsearch: place.name,
          srlimit: 1, format: 'json', origin: '*'
        }, headers: { 'User-Agent': ua }, timeout: 8000
      });
      const title = searchData?.query?.search?.[0]?.title;
      if (!title) return this._fallbackPlace(place);
      const { data: pageData } = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title), {
        timeout: 8000, headers: { 'User-Agent': ua }
      });
      if (!pageData) return this._fallbackPlace(place);
      const { data: geoData } = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query', titles: title, prop: 'coordinates', format: 'json', origin: '*'
        }, headers: { 'User-Agent': ua }, timeout: 5000
      });
      const pages = geoData?.query?.pages ? Object.values(geoData.query.pages) : [];
      const coords = pages.find(p => p && p.coordinates && p.coordinates[0]);
      const lat = coords ? coords.coordinates[0].lat : null;
      const lng = coords ? coords.coordinates[0].lon : null;
      return {
        title: pageData.title || title || place.name,
        pageTitle: pageData.display_title || pageData.title || place.name,
        description: pageData.extract || '',
        image: pageData.thumbnail?.source || pageData.originalimage?.source || '',
        url: pageData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title || place.name)}`,
        lat, lng,
        extract: pageData.extract || '',
        category: place.category || 'place',
        tags: place.tags || [],
        city: place.city || null,
        state: place.state || null,
      };
    } catch (err) {
      console.error(`Wikipedia fetch error for ${place.name}:`, err.message);
      return this._fallbackPlace(place);
    }
  },

  _fallbackPlace(place) {
    return {
      title: place.name,
      pageTitle: place.name,
      description: `${place.name} is a famous ${place.category} in India. Learn more about its history and significance.`,
      image: `https://picsum.photos/seed/${encodeURIComponent(place.name)}/600/400`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(place.name)}`,
      lat: null, lng: null,
      extract: '',
      category: place.category || 'place',
      tags: place.tags || [],
      city: place.city || null,
      state: place.state || null,
    };
  },

  async searchFamousPlaces(query) {
    const all = await this.getAllFamousPlaces();
    const q = query.toLowerCase();
    return all.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.includes(q))) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.state && p.state.toLowerCase().includes(q))
    );
  }
};

module.exports = service;
