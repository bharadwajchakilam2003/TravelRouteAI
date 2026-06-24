import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { posts } from './Blog';

const fullContent: Record<string, { sections: { heading: string; body: string }[] }> = {
  'top-10-road-trips-india': {
    sections: [
      {
        heading: '1. Manali to Leh Highway',
        body: 'One of the most iconic road trips in India, the Manali-Leh highway stretches 490 km through the mighty Himalayas. Best attempted between June and September, this route offers breathtaking views of snow-capped peaks, high-altitude passes like Rohtang La and Tanglang La, and the stunning landscapes of Ladakh. The journey takes 2-3 days with stops at Keylong, Sarchu, and Upshi.',
      },
      {
        heading: '2. Chennai to Pondicherry (East Coast Road)',
        body: 'A scenic 170 km drive along the Bay of Bengal, the East Coast Road from Chennai to Pondicherry is perfect for a weekend getaway. The road passes through fishing villages, temples, and offers stunning sea views. Stop at Mahabalipuram\'s ancient rock-cut temples, enjoy fresh seafood at Mamallapuram, and end your trip with the French-colonial vibes of Pondicherry.',
      },
      {
        heading: '3. Mumbai to Goa (NH66)',
        body: 'The 580 km Mumbai-Goa highway takes you along the Konkan coast with lush greenery, waterfalls (in monsoon), and beautiful coastal towns. Drive through Chiplun, Ratnagiri, and Sawantwadi. The journey takes about 10-12 hours and is best enjoyed as a road trip with multiple stops at Konkan\'s pristine beaches and seafood shacks.',
      },
      {
        heading: '4. Guwahati to Tawang',
        body: 'This 480 km journey in Northeast India takes you through the breathtaking landscapes of Arunachal Pradesh. The route passes through dense forests, high mountain passes (Sela Pass at 13,700 ft), and offers views of the Eastern Himalayas. Tawang itself is home to the famous Tawang Monastery, the second-largest Buddhist monastery in the world.',
      },
      {
        heading: '5. Bangalore to Coorg',
        body: 'A 260 km drive from India\'s silicon valley to the Scotland of India. The route passes through lush coffee plantations, misty hills, and winding roads. Coorg (Kodagu) is famous for its coffee, spices, and scenic beauty. Stop at Dubare Elephant Camp, Abbey Falls, and taste authentic Coorgi cuisine.',
      },
    ],
  },
  'budget-travel-india': {
    sections: [
      {
        heading: 'Use TravelRoute AI for Cost Estimates',
        body: 'Before any trip, use our cost estimator tool to get a realistic budget. Enter your source and destination, and we\'ll calculate fuel costs based on current petrol/diesel prices, accommodation estimates, food costs, and miscellaneous expenses. This helps you plan ahead and avoid surprises.',
      },
      {
        heading: 'Choose the Right Season',
        body: 'Traveling during the off-season (monsoon or summer in most regions) can save you 30-50% on accommodation. For example, hill stations are cheaper during monsoon, while coastal areas are more affordable in summer. Use our weather feature to check conditions before booking.',
      },
      {
        heading: 'Optimize Fuel Costs',
        body: 'Fuel is often the biggest expense on road trips. Use our route planner to find the shortest or most fuel-efficient route. Travel with a full carpool to split costs. Avoid idling and maintain steady speeds on highways. Our cost estimator uses real-time fuel prices to give you accurate estimates.',
      },
      {
        heading: 'Eat Local, Stay Local',
        body: 'Skip expensive restaurants and try local dhabas and street food — you\'ll save money and get authentic flavors. For accommodation, consider budget hotels, hostels, or homestays. Our budget estimator breaks down economy, mid-range, and luxury options so you can choose what works for you.',
      },
    ],
  },
  'monsoon-travel-guide': {
    sections: [
      {
        heading: 'Why Travel in Monsoon?',
        body: 'Monsoon (June to September) transforms India into a lush green paradise. Waterfalls come alive, hill stations are covered in mist, and the crowds are thinner. It\'s also the most affordable time to travel, with heavy discounts on hotels and flights.',
      },
      {
        heading: 'Best Monsoon Destinations',
        body: 'Kerala\'s backwaters and hill stations (Munnar, Wayanad) are at their most beautiful during monsoon. The Western Ghats, including Mahabaleshwar, Lonavala, and Matheran, offer spectacular views. Udaipur in Rajasthan looks magical under cloudy skies. The Northeast (Meghalaya, Sikkim) is stunning but requires caution due to landslides.',
      },
      {
        heading: 'Road Trip Tips for Rainy Season',
        body: 'Check weather forecasts on our site before starting your journey. Carry raincoats, umbrellas, and waterproof bags for luggage. Ensure your vehicle has good wiper blades, tire tread, and working defoggers. Avoid driving through waterlogged areas. Plan shorter driving days as rain can slow you down significantly.',
      },
    ],
  },
  'cultural-heritage-south-india': {
    sections: [
      {
        heading: 'Ancient Temples of Tamil Nadu',
        body: 'Tamil Nadu is home to some of India\'s most magnificent temples. The Brihadeeswarar Temple in Thanjavur, Meenakshi Temple in Madurai, and the Shore Temple in Mahabalipuram are UNESCO World Heritage sites. These architectural marvels date back over 1,000 years and showcase the incredible Dravidian style of architecture.',
      },
      {
        heading: 'Classical Dance & Music',
        body: 'South India is the birthplace of classical dance forms like Bharatanatyam (Tamil Nadu), Kathakali (Kerala), Kuchipudi (Andhra Pradesh), and Yakshagana (Karnataka). Carnatic music, one of the oldest musical traditions in the world, originates from here. Visit during the Margazhi season (December-January) for the famous Chennai Music Season.',
      },
      {
        heading: 'Cuisine of the South',
        body: 'South Indian cuisine is diverse and flavorful. From Kerala\'s coconut-based curries and seafood to Andhra\'s spicy biryanis, from Tamil Nadu\'s traditional dosa-idli-sambar to Karnataka\'s aromatic bisi bele bath. Each state has unique specialties. Use our BharatCulture section to explore the culinary heritage of each region.',
      },
    ],
  },
  'north-india-himalayan-travel': {
    sections: [
      {
        heading: 'Best Time to Visit',
        body: 'The ideal time for Himalayan road trips is May to October. Summer (May-June) offers clear skies and pleasant weather. Monsoon (July-September) brings landslides in some areas but lush greenery. Post-monsoon (October) is perfect with crisp air and clear mountain views. Winter (November-April) sees heavy snow and many roads close.',
      },
      {
        heading: 'Road Conditions',
        body: 'Himalayan roads vary greatly. Major highways like the Manali-Leh road and Srinagar-Leh highway are generally well-maintained but can be challenging due to high altitudes, narrow sections, and unpredictable weather. Always check road conditions before starting your journey. Carry spare tires, basic tools, and emergency supplies.',
      },
      {
        heading: 'Weather & Preparation',
        body: 'Weather in the Himalayas can change rapidly. Carry layers — even in summer, temperatures can drop near freezing at high passes. Use our weather feature to get forecasts for your entire route. Stay hydrated, carry oxygen for high-altitude passes (above 12,000 ft), and acclimatize properly to avoid altitude sickness.',
      },
    ],
  },
  'delhi-jaipur-road-trip': {
    sections: [
      {
        heading: 'The Route: NH48 via Neemrana',
        body: 'The Delhi-Jaipur journey via NH48 spans approximately 280 km and takes about 4-5 hours. The highway is well-maintained with multiple toll plazas. Start early morning to avoid Delhi traffic. The first major stop is Neemrana (120 km), home to the magnificent Neemrana Fort Palace, a 15th-century hill fortress turned heritage hotel. Further down, stop at Alwar (150 km) to visit the Sariska Tiger Reserve or the stunning Siliserh Lake Palace.',
      },
      {
        heading: 'Must-Visit Stops Along the Way',
        body: 'Neemrana Fort Palace — take a guided tour even if you\'re not staying overnight. Alwar\'s City Palace and Moosi Maharani ki Chhatri are architectural gems. At Shahpura (220 km), you\'ll find excellent dhabas serving authentic Rajasthani thalis. For a unique detour, visit the abandoned Bhangarh Fort (30 km off the highway), known as one of India\'s most haunted locations.',
      },
      {
        heading: 'Exploring Jaipur: The Pink City',
        body: 'Once in Jaipur, the UNESCO World Heritage City offers endless exploration. Visit the majestic Amber Fort, the intricate Hawa Mahal (Palace of Winds), and the astronomical Jantar Mantar. Don\'t miss the City Palace and the colorful bazaars of Johari Bazaar and Bapu Bazaar for traditional Rajasthani textiles and jewelry. End your day with a traditional Rajasthani dinner at Chokhi Dhani.',
      },
    ],
  },
  'hyderabad-vizag-road-trip': {
    sections: [
      {
        heading: 'Route Overview: Hyderabad to Vizag',
        body: 'The 620 km journey from Hyderabad to Visakhapatnam via NH65 takes approximately 9-10 hours. The route cuts through the Eastern Ghats and the fertile coastal plains of Andhra Pradesh. Major towns along the way include Warangal, Khammam, Vijayawada, and Guntur. The diverse landscape changes from the Deccan Plateau to lush green forests and finally the Bay of Bengal coastline.',
      },
      {
        heading: 'Key Stops: Warangal, Vijayawada & Araku Valley',
        body: 'Warangal (150 km from Hyderabad) is famous for the Thousand Pillar Temple and the Warangal Fort built by the Kakatiya dynasty. Vijayawada (270 km) offers the Prakasam Barrage, Kanaka Durga Temple, and stunning views from Indrakeeladri Hill. For a scenic detour, take the branch road from Visakhapatnam to Araku Valley (115 km), a hill station surrounded by coffee plantations and the magnificent Borra Caves.',
      },
      {
        heading: 'Vizag: The City of Destiny',
        body: 'Visakhapatnam is a coastal paradise with pristine beaches, hills, and a rich maritime history. Visit the INS Kursura Submarine Museum, the iconic RK Beach, and the Kailasagiri Hill Park with panoramic views of the Bay of Bengal. The nearby Borra Caves, formed over millions of years, are a must-see. Don\'t leave without trying Andhra\'s famous seafood and the fiery Andhra biryani.',
      },
    ],
  },
  'pune-munnar-road-trip': {
    sections: [
      {
        heading: 'The Long Drive: Pune to Munnar Overview',
        body: 'This epic 1,200 km road trip from Pune to Munnar takes you through three states — Maharashtra, Karnataka, and Kerala. Plan for 2-3 days with overnight stops. The route passes through the Western Ghats, a UNESCO World Heritage Site, offering some of the most dramatic landscapes in India. The best time for this trip is October to March when the weather is pleasant throughout.',
      },
      {
        heading: 'Overnight Stop: Chikmagalur or Mysore',
        body: 'A good halfway stop is Chikmagalur (700 km from Pune), Karnataka\'s coffee country. Stay overnight on a coffee estate, visit the Mullayanagiri peak (the highest in Karnataka), and taste fresh coffee. Alternatively, stop at Mysore (840 km) to explore the magnificent Mysore Palace, Chamundi Hills, and the Brindavan Gardens with their musical fountain show.',
      },
      {
        heading: 'Munnar: The Kashmir of South India',
        body: 'Munnar, at 1,600 meters above sea level, is a paradise of rolling tea plantations, misty hills, and cool climate. Visit the Tea Museum to learn about the region\'s tea-growing history, trek to Anamudi Peak (the highest peak in South India at 2,695 m), and explore the Eravikulam National Park home to the endangered Nilgiri Tahr. The Mattupetty Dam and Echo Point offer serene picnic spots.',
      },
    ],
  },
  'packing-checklist': {
    sections: [
      {
        heading: 'Essential Documents',
        body: 'Always carry your driving license, vehicle registration (RC), insurance papers, and Pollution Under Control (PUC) certificate. Keep multiple photocopies and digital copies on your phone. For interstate travel, carry your passport-size photos and ID proof. If traveling to border areas like Ladakh or North-East, carry inner line permits if required. A digital copy of your itinerary and hotel bookings is always handy.',
      },
      {
        heading: 'Seasonal Clothing Guide',
        body: 'Summer (March-June): Light cotton clothes, sunglasses, caps, sunscreen (SPF 50+), and a light jacket for air-conditioned spaces. Monsoon (July-September): Waterproof jackets, quick-dry clothing, umbrellas, and waterproof footwear. Winter (November-February): Thermals, woolen sweaters, fleece jackets, gloves, mufflers, and woolen socks. For hill stations, carry layers even in summer as evenings can be cold.',
      },
      {
        heading: 'Vehicle Emergency Kit',
        body: 'Carry a spare tire, jack, wheel wrench, jumper cables, flashlight with extra batteries, basic tool kit, reflective warning triangle, and a first-aid kit. For long trips, add engine oil, coolant, brake fluid, and a fuel can. A portable tire inflator and a power bank for your phone are lifesavers. Before starting, check tire pressure, coolant level, brake fluid, and wiper fluid.',
      },
      {
        heading: 'Health & Comfort Items',
        body: 'Put together a first-aid kit with bandages, antiseptic, pain relievers, anti-diarrheal medication, motion sickness pills, and any personal prescription medicines. Carry ORS packets, water bottles, energy bars, and dry snacks for the road. Wet wipes, hand sanitizer, garbage bags, and travel pillows make the journey more comfortable. For high-altitude trips, include Diamox (for altitude sickness) and oxygen cans.',
      },
    ],
  },
  'highway-navigation-tips': {
    sections: [
      {
        heading: 'Understanding NH and SH Numbering',
        body: 'India\'s National Highways (NH) are numbered systematically. North-South highways have even numbers (NH44 runs from Srinagar to Kanyakumari), while East-West highways have odd numbers (NH27 from Porbandar to Silchar). State Highways (SH) are maintained by state governments and connect district headquarters. The new numbering system (introduced in 2010) makes navigation easier once you understand the pattern.',
      },
      {
        heading: 'Toll Plazas and FASTag',
        body: 'Almost all National Highways in India have toll plazas every 50-70 km. Use FASTag for cashless payment — it\'s mandatory and saves significant time at toll booths. Keep your FASTag account recharged and ensure the tag is properly affixed to your windshield. Toll rates vary based on vehicle type and distance. You can check toll rates online at the NHAI website before starting your journey.',
      },
      {
        heading: 'Navigating City Bypasses',
        body: 'Most major cities have bypass roads that allow you to avoid city traffic when passing through. Look for "Bypass" or "Ring Road" signs well before the city limits. Google Maps and other navigation apps are reliable but can sometimes take you through narrow or congested routes. Use apps like Highway Navigator that specialize in truck-driver routes which often avoid city congestion.',
      },
      {
        heading: 'Reading Highway Signs',
        body: 'Indian highway signs follow international standards with some local variations. Green signs indicate directions and distances, blue signs indicate tourist facilities, and red/white signs indicate prohibitions. Pay attention to yellow boards with black text — these are temporary construction or detour signs. When in doubt, look for the distance to the next major city in kilometers — this is the most reliable way to confirm you\'re on the right road.',
      },
    ],
  },
  'winter-hill-stations': {
    sections: [
      {
        heading: 'Shimla & Manali: Classic Himalayan Winter',
        body: 'Shimla, the former summer capital of British India, transforms into a winter wonderland from December to February. The Mall Road, Ridge, and Jakhoo Temple are covered in snow. Manali, 250 km further, offers skiing at Solang Valley, snow tubing, and breathtaking views of snow-capped peaks. The Rohtang Pass typically opens by May, but Manali itself has plenty of winter activities. temperatures range from -2°C to 10°C.',
      },
      {
        heading: 'Darjeeling: Queen of the Hills in Winter',
        body: 'Darjeeling in winter offers clear views of Kanchenjunga, the world\'s third-highest peak. The famous Darjeeling Himalayan Railway (toy train) runs through misty hills covered with snow-dusted tea gardens. Visit the Tiger Hill viewpoint at sunrise for an unforgettable view of the Himalayan range. Temperatures range from 2°C to 10°C. Pack heavy woolens as the wind chill can be significant.',
      },
      {
        heading: 'Ooty & Coorg: Southern Winter Retreats',
        body: 'Ooty (Udhagamandalam) in Tamil Nadu offers a unique winter experience with its botanical gardens, Ooty Lake, and the Nilgiri Mountain Railway. Temperatures range from 5°C to 20°C — cooler but not freezing. Coorg (Kodagu) in Karnataka is perfect for those who prefer milder winters. Coffee plantations, misty mornings, and cozy homestays make it ideal for a relaxing winter getaway. Don\'t miss the Abbey Falls and Dubare Elephant Camp.',
      },
    ],
  },
  'summer-road-trip-guide': {
    sections: [
      {
        heading: 'Hill Stations: Best Escape from the Heat',
        body: 'When temperatures cross 40°C in the plains, hill stations provide a cool refuge. Head to the Himalayas — destinations like Shimla, Manali, Dharamshala, and Nainital offer pleasant 15-25°C weather. In the south, Kodaikanal, Ooty, Munnar, and Coorg remain cool and green. The Western Ghats stations like Mahabaleshwar, Lonavala, and Matheran are perfect weekend getaways from Mumbai and Pune.',
      },
      {
        heading: 'Monsoon Road Trips: Chase the Rain',
        body: 'Summer is also the onset of monsoon in many parts of India. The Konkan coast comes alive with waterfalls and lush greenery. Drive from Mumbai to Goa along NH66 for dramatic coastal views, waterfall crossings, and fresh seafood. Kerala\'s backwaters are at their most beautiful. The Northeast, especially Meghalaya with its living root bridges and Cherrapunji\'s waterfalls, is spectacular — but check road conditions before going.',
      },
      {
        heading: 'Summer Driving Tips',
        body: 'Avoid driving between 12 PM and 4 PM when the sun is strongest. Start your journey early (by 6 AM) to cover maximum distance before the heat peaks. Carry plenty of water, keep your vehicle\'s AC serviced, and monitor coolant temperature. Sunscreen, sunglasses, and caps are essential. Use our weather feature to check temperatures along your route. Plan more frequent breaks — every 2 hours — to stay alert and hydrated.',
      },
    ],
  },
  'weekend-road-trips': {
    sections: [
      {
        heading: 'From Delhi: Weekend Getaways',
        body: 'Delhi offers excellent weekend road trip options. Jaipur (280 km, 5 hrs) — explore the Pink City\'s palaces and forts. Agra (230 km, 4 hrs) — visit the Taj Mahal at sunrise. Rishikesh (240 km, 5 hrs) — river rafting and yoga by the Ganges. Jim Corbett National Park (260 km, 5 hrs) — wildlife safari. For a shorter drive, head to Neemrana (120 km, 2 hrs) for the heritage fort experience or Bharatpur Bird Sanctuary (180 km, 3 hrs).',
      },
      {
        heading: 'From Mumbai: Weekend Escapes',
        body: 'Mumbai has some fantastic nearby destinations. Lonavala-Khandala (85 km, 2 hrs) — hill stations with beautiful viewpoints. Mahabaleshwar (260 km, 5 hrs) — strawberries, viewpoints, and cool climate. Matheran (110 km, 3 hrs) — Asia\'s only automobile-free hill station. Goa (580 km, 10 hrs) — for a longer weekend, the coastal paradise awaits. For a quick beach getaway, Alibaug (95 km, 2 hrs) offers seaside resorts and water sports.',
      },
      {
        heading: 'From Bangalore: Quick Road Trips',
        body: 'Bangalore\'s central location makes it perfect for weekend road trips. Coorg (260 km, 5 hrs) — coffee plantations and misty hills. Mysore (150 km, 3 hrs) — magnificent palace and gardens. Chikmagalur (250 km, 5 hrs) — coffee country with mountain treks. Hampi (350 km, 6 hrs) — UNESCO World Heritage ruins. Wayanad (280 km, 6 hrs) — lush green landscapes and wildlife. For a short drive, Nandi Hills (60 km, 1.5 hrs) offers sunrise views and weekend brunch spots.',
      },
    ],
  },
};

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = posts.find(p => p.id === id);
  const content = id ? fullContent[id] : null;

  if (!post || !content) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="h-64 md:h-96 overflow-hidden relative">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-wide">
            <Link to="/blog" className="text-white/70 hover:text-white text-sm mb-2 inline-block">← Back to Blog</Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white mt-2">{post.title}</h1>
            <p className="text-white/60 text-sm mt-2">{post.author} · {post.date} · {post.readTime}</p>
          </div>
        </div>
      </div>
      <div className="container-wide py-8 max-w-3xl">
        <article className="space-y-8">
          {content.sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3">{section.heading}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.body}</p>
            </motion.section>
          ))}
        </article>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link to="/blog" className="text-blue-600 hover:underline">← Back to all articles</Link>
        </div>
      </div>
    </div>
  );
}