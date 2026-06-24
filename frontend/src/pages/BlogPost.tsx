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