import { useEffect } from 'react';

const CookiePolicy = () => {
  const sections = [
    {
      title: "Introduction",
      content: "This Cookie Policy explains how Vitamin Job uses cookies and similar tracking technologies when you visit our website. By using our website, you acknowledge our use of essential cookies as described in this policy. For analytics cookies, we'll ask for your explicit consent."
    },
    {
      title: "What Are Cookies?",
      content: `Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit our website. They help us:
• Remember your preferences and settings
• Understand how you use our website
• Improve your browsing experience
• Ensure our website's security`
    },
    {
      title: "Types of Cookies We Use",
      content: `1. Essential Cookies:
• Purpose: These cookies are necessary for the website to function properly
• Usage: Authentication, security, and preferences
• Storage Duration: 7 days
• These cookies are always active

2. Analytics Cookies (Optional):
• Purpose: Help us understand how visitors interact with our website
• Provider: Google Analytics
• Storage Duration: Up to 26 months
• These cookies require your consent`
    },
    {
      title: "Analytics Consent",
      content: `• We ask for explicit consent before setting analytics cookies
• You can change analytics preferences anytime
• Declining analytics will not affect site functionality
• Analytics cookies help us improve our service
• You can withdraw analytics consent at any time`
    },
    {
      title: "Managing Cookies",
      content: `You can manage cookies through your browser settings:

• Chrome: Settings > Privacy and Security > Cookies
• Firefox: Options > Privacy & Security > Cookies
• Safari: Preferences > Privacy > Cookies
• Edge: Settings > Privacy & Security > Cookies

Note: 
• Blocking essential cookies will affect website functionality
• Each device and browser needs separate settings`
    },
    {
      title: "Data Collection and Privacy",
      content: `• Essential cookies are necessary for site functionality
• Analytics data collection requires consent
• We implement standard security measures
• For more details, see our Privacy Policy`
    },
    {
      title: "Updates to This Policy",
      content: `• We may update this policy to reflect:
  - Changes in our practices
  - New features or services
  - Legal requirements
• Updates will be posted on this page
• Significant changes will be notified
• Continued use means acceptance of changes`
    },
    {
      title: "Contact Us",
      content: "If you have questions about our use of cookies or this Cookie Policy, please contact us through our feedback form or via the email provided in the support section of our footer. We aim to respond to all queries within 48 business hours."
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
              Cookie Policy
            </h1>
            
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              Effective Date: January 4, 2025
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;