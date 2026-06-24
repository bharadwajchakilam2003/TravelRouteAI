import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16">
        <div className="container-wide text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            Terms of Service
          </motion.h1>
          <p className="text-blue-200 mt-2">Last updated: June 2026</p>
        </div>
      </div>
      <div className="container-wide py-12 max-w-3xl">
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
            <p>By using TravelRoute AI, you agree to these Terms of Service. If you do not agree, please do not use the site.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">2. Description of Service</h2>
            <p>TravelRoute AI provides travel route planning tools including route distance calculation, weather forecasts, cost estimates, attraction discovery, and cultural heritage information. All information is provided for planning purposes only.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">3. Disclaimer</h2>
            <p>All cost estimates, weather forecasts, and travel information are approximate and for reference only. Actual costs, weather conditions, and travel times may vary. We recommend verifying all information with official sources before making travel decisions.</p>
            <p className="mt-2">We are not responsible for any losses, damages, or inconveniences resulting from the use of this service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">4. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when registering. We reserve the right to terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to disrupt or overload the service</li>
              <li>Scrape or extract data in violation of our rate limits</li>
              <li>Create fake or misleading accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">6. Intellectual Property</h2>
            <p>All content, trademarks, and intellectual property on this site are owned by TravelRoute AI unless otherwise attributed. You may not reproduce, distribute, or modify our content without permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">8. Contact</h2>
            <p>For questions about these terms, contact <a href="mailto:bharadwajchakilam2003@gmail.com" className="text-blue-600 hover:underline">bharadwajchakilam2003@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}