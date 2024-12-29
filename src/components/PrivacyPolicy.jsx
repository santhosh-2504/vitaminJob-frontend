import  { useEffect } from 'react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Introduction",
      content: "At VitaminJob, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website."
    },
    {
      title: "Information We Collect",
      content: `We collect the following information:

Required Information:
• Email address - Used for account creation and authentication
• Phone number - Used for account security and future SMS verification

Optional Information:
• Address
• Professional niche/interests
• Other profile details

This information is collected only when you voluntarily provide it during registration or when updating your profile in the Dashboard.`
    },
    {
      title: "How We Use Your Information",
      content: `We use your information for:
• Account creation and management
• Authentication and security
• Communication regarding your account
• Future SMS verification for password reset and account deletion (planned feature)
• Marketing emails (only if you opt-in during registration)

Optional information like address and niche are currently stored but not actively used in our services.`
    },
    {
      title: "Data Storage and Security",
      content: `Your data is securely stored in our MongoDB database. We retain your data for as long as your account remains active. Upon account deletion, all associated data is permanently removed from our systems.

[RECOMMENDED ADDITION - Security Measures]:
• Data encryption in transit and at rest
• Regular security audits
• Limited staff access to personal data
• Regular backup procedures`
    },
    {
      title: "Cookies and Authentication",
      content: `We use essential cookies for authentication purposes:
• JWT (JSON Web Token) cookies for secure user sessions
• Token expiration: 7 days
• These cookies are mandatory for site functionality

[RECOMMENDED ADDITION - Cookie Consent]:
Consider implementing a cookie consent banner that explains:
• Essential cookies cannot be rejected as they're required for site functionality
• Future analytical cookies (if implemented) can be optional`
    },
    {
      title: "Third-Party Services",
      content: `We use the following third-party services:
• Razorpay for payment processing
• Render for backend hosting
• Vercel for frontend hosting

These services may collect additional information according to their own privacy policies.

[FUTURE ADDITION]:
• Google Analytics (planned implementation)
When implemented, this section will be updated with details about data collection and usage.`
    },
    {
      title: "Age Restrictions",
      content: `[RECOMMENDED POLICY]:
This website is intended for users who are 18 years or older. We do not knowingly collect information from individuals under the age of 18. If you are under 18, please do not create an account or provide any personal information.`
    },
    {
      title: "International Users and GDPR",
      content: `[RECOMMENDED POLICY]:
Our services are accessible worldwide. For users from the European Union (EU), we are committed to complying with the General Data Protection Regulation (GDPR).

Under GDPR, you have the right to:
• Access your personal data
• Correct inaccurate personal data
• Request deletion of your personal data
• Object to processing of your personal data
• Data portability

[DECISION NEEDED]: Full GDPR compliance implementation strategy`
    },
    {
      title: "Data Breaches",
      content: `[RECOMMENDED POLICY]:
In the event of a data breach that affects your personal information, we will:
• Notify affected users via email within 72 hours
• Provide information about what data was compromised
• Explain steps taken to address the breach
• Outline measures implemented to prevent future breaches`
    },
    {
      title: "User Rights",
      content: `You have the right to:
• Access your personal data through your Dashboard
• Update your information at any time
• Delete your account and associated data
• Opt-out of marketing communications

All data deletion requests are permanent and cannot be reversed.`
    },
    {
      title: "Contact Information",
      content: `For privacy-related concerns:
• Email: placeholder@gmail.com
• Use our website's feedback section

[RECOMMENDED ADDITION]:
• Dedicated privacy contact form
• Response time expectations
• Process for escalating privacy concerns`
    },
    {
      title: "Updates to Privacy Policy",
      content: `We may update this Privacy Policy as needed. Users will be notified of significant changes through:
• Website notifications
• Alerts
• Prompts

Continued use of the website after such notifications constitutes acceptance of the updated policy.`
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
              Privacy Policy
            </h1>
            
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              Last Updated: 23/12/2024
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

export default PrivacyPolicy;