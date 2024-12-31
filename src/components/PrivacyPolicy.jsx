import { useEffect } from 'react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Welcome to Vitamin Job",
      content: "Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, store, and protect your personal data when you use our website. By accessing or using our services, you agree to this Privacy Policy."
    },
    {
      title: "Eligibility",
      content: "Our website is not intended for users under the age of 16. During registration, users must confirm that they are at least 16 years old by checking a required checkbox."
    },
    {
      title: "Information We Collect",
      content: `Mandatory Information:
• Email: Used solely for login purposes and to ensure account uniqueness.
• Password: Stored securely using hashing algorithms.
• Phone Number: Currently unused but planned for a future "Forgot Password" feature involving SMS or WhatsApp notifications.

Optional Information:
• Address: Collected for user personalization and stored in the dashboard. It has no immediate use.
• Niche Preferences: Users can select up to three niches to receive future job-related emails if opted in.`
    },
    {
      title: "How We Use Your Information",
      content: `• Email: For account login and verification.
• Phone Number: Planned for account recovery in the future.
• Niche Preferences: To send job-related emails based on user consent when relevant jobs are added.
• Optional Data (e.g., Address): Stored for personalization but not actively used.`
    },
    {
      title: "User Rights",
      content: `Update Profile:
• Users can update their profile information through the "Update Profile" section in the dashboard, except for their email address (used for login purposes).

Delete Account:
• Users can delete their accounts through the "Delete Account" option in the dashboard. Upon deletion, all user data is permanently removed from our database without recovery.`
    },
    {
      title: "Data Retention Policy",
      content: `• We retain user data as long as the account remains active.
• If a user deletes their account, all associated data is permanently deleted immediately.
• Currently, no backups are maintained. If backups are implemented in the future, deleted user data will also be removed from backups within a reasonable period.`
    },
    {
      title: "Data Sharing and Third Parties",
      content: `• We do not share user data with any third parties
• We use Google Analytics with IP anonymization enabled
• No personal data is used for advertising purposes`
    },
    {
      title: "Cookies and Analytics",
      content: `We use cookies and similar technologies on our website for the following purposes:

Essential Cookies:
• Authentication: To keep you logged in and secure your session
• Website Functionality: To remember your preferences and settings

Analytics Cookies (Optional):
• We use Google Analytics to understand how visitors interact with our website
• This helps us improve our services and user experience
• Analytics cookies collect information such as:
  - Pages you visit
  - Time spent on each page
  - Technical information (browser type, device type)
  - General location data (country/city level only)

Cookie Consent:
• We will ask for your explicit consent before setting non-essential cookies
• You can change your cookie preferences at any time
• If you decline analytics cookies, you can still use our website fully
• Your cookie preferences are saved for 365 days

Data Collection and Storage:
• Analytics data is processed by Google Analytics
• We have configured Google Analytics to anonymize IP addresses
• Data is retained for a maximum of 26 months
• We do not use cookies for advertising purposes`
    },
    {
      title: "Third-Party Services",
      content: `We use the following third-party service:

Google Analytics:
• Purpose: Website analytics and user experience improvement
• Data Collected: Page views, session duration, navigation paths
• Privacy Policy: https://policies.google.com/privacy
• We have enabled IP anonymization and disabled data sharing for advertising`
    },
    {
      title: "Notifications and Emails",
      content: `• Users must provide explicit consent to receive marketing or job-related emails.
• Users can opt-out of receiving emails at any time.
• Job-related emails will only be sent based on niche preferences selected by the user.`
    },
    {
      title: "Data Security",
      content: `• Passwords are securely hashed before storage.
• JWT-based authentication is used for secure access, and HTTP-only cookies store tokens.
• Secure HTTPS API calls are enforced.`
    },
    {
      title: "Data Breach Protocol",
      content: `While we take extensive measures to secure user data, in the event of a breach:
• We will investigate the cause and take corrective actions.
• Affected users will be promptly informed.`
    },
    {
      title: "Inactivity and Account Deletion",
      content: `• We do not automatically delete inactive accounts.
• Users have full control over deleting their accounts manually.`
    },
    {
      title: "Links to External Sites",
      content: `• Our website contains links to external sites (e.g., job applications, courses). We are not responsible for the privacy practices of these external sites.
• If any external site linked on our website has concerns regarding the shared links, they can contact us via email. We will review and take appropriate actions as needed.`
    },
    {
      title: "Future Updates",
      content: `• Any updates to this Privacy Policy will be communicated through a banner or scrolling message under the navbar for 15-30 days.
• Users are encouraged to review the updated policy.`
    },
    {
      title: "Contact Us",
      content: "For any privacy concerns or inquiries, users can contact us through our feedback form or directly via the email mentioned in the support section of our footer."
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
              Effective Date: December 31, 2024
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