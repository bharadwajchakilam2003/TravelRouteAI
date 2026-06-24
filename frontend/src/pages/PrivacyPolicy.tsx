import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16">
        <div className="container-wide text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            Privacy Policy
          </motion.h1>
          <p className="text-blue-200 mt-2">Last updated: June 2026</p>
        </div>
      </div>
      <div className="container-wide py-12 max-w-3xl">
        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">1. Information We Collect</h2>
            <p>When you use TravelRoute AI, we may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Search queries</strong> — source and destination cities you enter for route planning</li>
              <li><strong>Account information</strong> — email address and name if you register an account</li>
              <li><strong>Usage data</strong> — pages visited, features used, interactions with the site</li>
              <li><strong>Device information</strong> — browser type, operating system, screen resolution</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide route planning, weather, cost estimates, and attraction recommendations</li>
              <li>Improve our services and user experience</li>
              <li>Analyze site traffic and usage patterns via Google Analytics</li>
              <li>Communicate with you about your account or inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">3. Third-Party Services</h2>
            <p>We use the following third-party services that may collect data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics</strong> (GA4) — tracks page views and user interactions. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a></li>
              <li><strong>OpenRouteService</strong> — route calculation (no personal data shared)</li>
              <li><strong>Open-Meteo</strong> — weather forecasts (no personal data shared)</li>
              <li><strong>Wikipedia API</strong> — attraction and heritage data (no personal data shared)</li>
              <li><strong>AviationStack</strong> — flight data (no personal data shared)</li>
              <li><strong>OpenTripMap</strong> — attraction data (no personal data shared)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">4. Cookies</h2>
            <p>We use cookies and similar technologies for analytics and site functionality. You can control cookie preferences through your browser settings. Google Analytics uses cookies to collect anonymous usage data. By using this site, you consent to the use of cookies as described in this policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">5. Data Security</h2>
            <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure. Account passwords are hashed and not stored in plain text.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data held by us</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of Google Analytics tracking</li>
              <li>Delete your account at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">7. Contact</h2>
            <p>For privacy-related inquiries, contact us at <a href="mailto:bharadwajchakilam2003@gmail.com" className="text-blue-600 hover:underline">bharadwajchakilam2003@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}