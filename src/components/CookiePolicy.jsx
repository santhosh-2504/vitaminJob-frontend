import { useEffect } from 'react';

const CookiePolicy = () => {
  const sections = [
    {
      title: "Introduction",
      content: "This Cookie Policy explains how Vitamin Job uses cookies and similar tracking technologies when you visit our website. By continuing to browse our site after accepting our cookie consent banner, you are agreeing to our use of cookies as described in this policy."
    },
    {
      title: "What Are Cookies?",
      content: `Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit our website. They help us:
• Remember your preferences and settings
• Understand how you use our website
• Improve your browsing experience
• Ensure our website's security and proper functioning
• Provide a personalized user experience`
    },
    {
      title: "Types of Cookies We Use",
      content: `1. Essential Cookies:
• Purpose: These cookies are necessary for the website to function properly
• Usage: JWT-based authentication, security, and theme preferences
• Storage Duration: 7 days for authentication tokens (HTTP-only cookies)
• Can be Disabled?: No, these are required for the website to work properly

2. Analytics Cookies (Optional):
• Purpose: Help us understand how visitors interact with our website
• Provider: Google Analytics
• Information Collected:
  - Pages visited and viewing duration
  - Navigation paths and user engagement metrics
  - User interactions and events
  - Theme preferences
  - Technical information (browser type, device type)
  - Approximate location (country/city level only)
• Storage Duration: Up to 26 months
• Can be Disabled?: Yes, through our cookie consent banner
• Privacy Measures:
  - IP address anonymization
  - No personal data collection
  - Strict data retention limits
  - No advertising tracking`
    },
    {
      title: "Cookie Consent",
      content: `• We require explicit consent before setting any non-essential cookies
• Your consent preferences are stored for 365 days
• You can change your preferences at any time by:
  - Using the cookie consent banner
  - Clearing cookies through your browser settings
• Declining analytics cookies will not affect your ability to use our website
• Consent can be withdrawn at any time
• All tracking activities cease immediately upon consent withdrawal`
    },
    {
      title: "How We Use Cookies",
      content: `Essential Cookies:
• Maintaining your session when logged in
• Storing your authentication status
• Ensuring secure browsing experience
• Remembering your theme preferences
• Managing cookie consent status

Analytics Cookies (When Consented):
• Understanding user engagement patterns
• Measuring time spent on different pages
• Tracking user navigation flows
• Analyzing feature usage and preferences
• Identifying technical issues and performance problems
• Improving website structure and content
• Understanding theme preference patterns`
    },
    {
      title: "Third-Party Cookies",
      content: `We use Google Analytics (GA4), which sets cookies to:
• Track page views and user behavior
• Generate anonymous usage statistics
• Measure user engagement
• Track theme preferences
• Help us improve our website

We have configured Google Analytics with strict privacy measures:
• IP address anonymization enabled
• Advertising features disabled
• Data sharing limitations enforced
• 26-month data retention limit
• Secure data transmission
• Cookie flags set to secure and same-site strict
• No cross-site tracking enabled`
    },
    {
      title: "Managing Cookies",
      content: `You can manage cookies through:

1. Our Cookie Consent Banner:
• Accept all cookies
• Decline non-essential cookies
• Modify preferences at any time
• Withdraw previous consent

2. Browser Settings:
• Chrome: Settings > Privacy and Security > Cookies
• Firefox: Options > Privacy & Security > Cookies
• Safari: Preferences > Privacy > Cookies
• Edge: Settings > Privacy & Security > Cookies

Note: 
• Blocking essential cookies will affect website functionality
• You can delete cookies at any time through your browser settings
• Each device and browser needs separate cookie management`
    },
    {
      title: "Data Collection and Privacy",
      content: `• We do not collect or store personally identifiable information through cookies
• All analytics data is anonymized before processing
• We do not share cookie data with third parties except Google Analytics
• We do not use cookies for:
  - Advertising purposes
  - User profiling
  - Cross-site tracking
  - Marketing campaigns
• Analytics data is processed in accordance with GDPR principles
• We implement secure cookie flags and same-site restrictions
• For more information about how we protect your privacy, please see our Privacy Policy`
    },
    {
      title: "Updates to This Policy",
      content: `• We may update this Cookie Policy to reflect changes in:
  - Our cookie usage practices
  - Analytics implementation
  - Privacy requirements
  - Technical features
• Significant changes will be notified through:
  - Website banners
  - Notifications under the navbar
  - Updates to the effective date of this policy
• Continued use of our website after changes constitutes acceptance of the updated policy
• Major changes may require renewed cookie consent`
    },
    {
      title: "Contact Us",
      content: "If you have questions about our use of cookies or this Cookie Policy, please contact us through our feedback form or via the email provided in the support section of our footer. We aim to respond to all cookie-related queries within 48 business hours."
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