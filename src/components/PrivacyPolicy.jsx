import { useEffect } from 'react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Welcome to Vitamin Job",
      content: "Your privacy is of utmost importance to us. This Privacy Policy outlines how we collect, use, store, and protect your personal data when you use our website. By accessing or using our services, you agree to this Privacy Policy. We are committed to transparency and protecting your privacy rights."
    },
    {
      title: "Eligibility",
      content: `• Our website is not intended for users under the age of 16
• During registration, users must confirm they are at least 16 years old through a required checkbox
• We do not knowingly collect or store data from users under 16
• If we discover we have collected data from a user under 16, we will promptly delete it`
    },
    {
      title: "Information We Collect",
      content: `Mandatory Information:
• Email Address:
  - Used for account login and authentication
  - Ensures account uniqueness
  - Required for account-related notifications
• Password:
  - Stored securely using industry-standard hashing algorithms
  - Never stored in plaintext
  - Protected with secure HTTP-only cookies
• Phone Number:
  - Currently collected but not in active use
  - Planned for future account recovery via SMS/WhatsApp
  - Stored with encryption

Optional Information:
• Physical Address:
  - Stored for future personalization features
  - Not currently in active use
  - Can be updated or removed anytime
• Niche Preferences:
  - Select up to three professional niches
  - Used for job recommendations if opted in
  - Can be modified or removed through dashboard

Technical Data:
• Theme preferences (light/dark mode)
• Session information
• Browser type and version
• Device type and operating system
• Anonymous usage statistics
• Geographic location (country/city level)`
    },
    {
      title: "How We Use Your Information",
      content: `Authentication and Security:
• Email address for account authentication
• Password for secure access
• Session management and security

Account Features:
• Phone number reserved for future account recovery
• Address stored for future personalization
• Niche preferences for job recommendations

User Experience:
• Theme preferences for personalized display
• Anonymous analytics to improve website performance
• Session data for security and functionality

Communication:
• Account-related notifications
• Optional job recommendations based on niches
• Important updates about our service`
    },
    {
      title: "User Rights",
      content: `Access Rights:
• View all stored personal data through dashboard
• Export personal data in a machine-readable format
• Request detailed information about data usage

Update Rights:
• Modify personal information through dashboard
• Update preferences and settings
• Change niche selections
• Email address cannot be modified (core identifier)

Delete Rights:
• Permanent account deletion through dashboard
• Immediate removal of all associated data
• No recovery option after deletion
• Option to delete specific data points while maintaining account

Control Rights:
• Manage cookie preferences
• Control email notifications
• Opt out of analytics
• Modify theme preferences`
    },
    {
      title: "Data Retention Policy",
      content: `Active Accounts:
• Data retained as long as account remains active
• Regular reviews of stored data relevance
• Option to manually delete specific data points

Deleted Accounts:
• Immediate permanent deletion of all user data
• No backup retention of deleted account data
• Complete removal from all systems

Technical Data:
• Analytics data retained for max 26 months
• Session data deleted after session ends
• Cookies expire based on their specific purpose

Future Implementations:
• If backups are implemented, deleted data will be removed within 30 days
• Regular data cleanup processes
• Automated data minimization procedures`
    },
    {
      title: "Data Sharing and Third Parties",
      content: `Data Sharing Policy:
• We do not sell user data
• No data trading or commercial sharing
• Limited sharing with essential service providers

Third-Party Services:
• Google Analytics with privacy-focused configuration:
  - IP anonymization enabled
  - Advertising features disabled
  - Limited data retention
  - Strict cookie controls

Data Processing:
• All processing occurs on secure servers
• External processors limited to essential services
• Strict data access controls`
    },
    {
      title: "Cookies and Analytics",
      content: `Essential Cookies:
• Authentication and session management
• Security features
• Theme preferences
• Cookie consent status

Analytics Cookies (Optional):
• User engagement tracking
• Page view statistics
• Navigation patterns
• Performance metrics

Cookie Management:
• Essential cookies are always active
• Analytics cookies require explicit consent
• Preference retention for 365 days
• Regular consent renewal requirements

Analytics Configuration:
• IP anonymization
• Limited data retention
• Secure data transmission`
    },
    {
      title: "Data Security",
      content: `Security Measures:
• Industry-standard password hashing
• JWT-based authentication
• HTTP-only secure cookies
• HTTPS encryption
• Regular security audits
• Access control mechanisms
• Session security
• XSS protection
• CSRF protection

Technical Controls:
• Secure API endpoints
• Rate limiting
• Input validation
• Output encoding
• Error handling
• Logging controls`
    },
    {
      title: "Data Breach Protocol",
      content: `Response Plan:
• Immediate investigation of potential breaches
• Assessment of affected data
• Implementation of containment measures
• Notification to affected users within 72 hours
• Detailed incident documentation

Mitigation Steps:
• Security patch implementation
• System audits
• User password resets if necessary
• Review of security protocols
• Enhanced monitoring

Communication:
• Clear notification of breach scope
• Specific actions users should take
• Contact information for questions
• Regular updates during resolution`
    },
    {
      title: "Account Management",
      content: `Active Accounts:
• Full control over personal data
• Access to all features
• Regular security reviews
• Optional email notifications

Inactive Accounts:
• No automatic deletion
• Maintained until user requests deletion
• All security measures remain active
• Data retained as per active accounts

Account Controls:
• Password changes
• Theme preferences
• Notification settings
• Privacy controls`
    },
    {
      title: "External Links and Services",
      content: `External Links:
• Job application links
• Course provider links
• Resource links

Disclaimer:
• No control over external sites
• Independent privacy policies apply
• User responsibility when leaving site
• Option for external sites to request link removal

Security:
• Regular link validation
• Secure referral methods
• Clear external link marking`
    },
    {
      title: "Policy Updates",
      content: `Communication:
• Visible notification banner for 30 days
• Email notification for significant changes
• In-app notifications
• Update date clearly displayed

User Rights:
• Review updated terms
• Accept or reject changes
• Download previous versions
• Contact support for clarification

Implementation:
• Clear change documentation
• Reasonable notice period
• User-friendly summaries
• Regular policy reviews`
    },
    {
      title: "Contact Information",
      content: `For privacy-related inquiries:
• Use our feedback form
• Email our privacy team
• Response within 48 business hours
• Official support channels listed in footer

For urgent concerns:
• Dedicated privacy contact form
• Priority response for data-related issues
• Clear escalation process
• Documentation requirements`
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

export default PrivacyPolicy;