import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const posts = [
  {
    id: 'top-10-road-trips-india',
    title: 'Top 10 Road Trips in India for Every Season',
    excerpt: 'From the Himalayan highways to coastal routes, discover India\'s most scenic road trips that every traveler should experience at least once.',
    author: 'Bharadwaj',
    date: 'June 2026',
    readTime: '5 min read',
    image: 'https://picsum.photos/seed/roadtrip1/800/400',
    tags: ['Road Trips', 'India', 'Travel Tips'],
  },
  {
    id: 'budget-travel-india',
    title: 'How to Plan a Budget-Friendly Trip in India',
    excerpt: 'Learn how to estimate fuel costs, find affordable accommodation, and save money while exploring India\'s diverse destinations.',
    author: 'Bharadwaj',
    date: 'May 2026',
    readTime: '4 min read',
    image: 'https://picsum.photos/seed/budget1/800/400',
    tags: ['Budget', 'Travel Tips', 'India'],
  },
  {
    id: 'monsoon-travel-guide',
    title: 'Monsoon Travel Guide: Best Places to Visit During Rainy Season',
    excerpt: 'Don\'t let the rain stop your travels. Explore India\'s lush green destinations that come alive during the monsoon months.',
    author: 'Bharadwaj',
    date: 'May 2026',
    readTime: '6 min read',
    image: 'https://picsum.photos/seed/monsoon1/800/400',
    tags: ['Monsoon', 'Seasonal', 'Travel Guide'],
  },
  {
    id: 'cultural-heritage-south-india',
    title: 'Exploring the Cultural Heritage of South India',
    excerpt: 'Dive into the rich traditions, ancient temples, classical dance forms, and culinary delights that make South India unique.',
    author: 'Bharadwaj',
    date: 'April 2026',
    readTime: '7 min read',
    image: 'https://picsum.photos/seed/southculture/800/400',
    tags: ['Culture', 'South India', 'Heritage'],
  },
  {
    id: 'north-india-himalayan-travel',
    title: 'Himalayan Travel Guide: Roads, Weather & Best Times to Visit',
    excerpt: 'Planning a trip to the Himalayas? Here\'s everything you need to know about road conditions, weather patterns, and the best seasons.',
    author: 'Bharadwaj',
    date: 'April 2026',
    readTime: '5 min read',
    image: 'https://picsum.photos/seed/himalaya1/800/400',
    tags: ['Himalayas', 'North India', 'Travel Guide'],
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16">
        <div className="container-wide text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            Travel Blog
          </motion.h1>
          <p className="text-blue-200 mt-2">Tips, guides, and stories for your next journey</p>
        </div>
      </div>
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden card-hover"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
                </div>
              </Link>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">{tag}</span>
                  ))}
                </div>
                <Link to={`/blog/${post.id}`}>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <span>{post.author} · {post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export { posts };
export type BlogPost = typeof posts[0];