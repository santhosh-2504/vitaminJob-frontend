import  { useEffect } from 'react';

const TermsOfService = () => {
  const terms = [
    {
      title: "About Us",
      content: "VitaminJob.com is an individual business operated from Andhra Pradesh, India. Our mission is to provide students with a centralized platform to access job updates, free online courses, certifications, and roadmaps to streamline their learning and job search efforts."
    },
    {
      title: "User Accounts",
      content: "Users can access the Jobs and Courses pages without logging in. However, features like bookmarking job listings, starring roadmaps, or downloading roadmaps require an account. During registration, users are required to provide an email and phone number. Additional details, such as address or niche, are optional and can be filled later. Account Deletion: Users can delete their accounts at any time. Once deleted, the account data is permanently erased and cannot be recovered."
    },
    {
      title: "Acceptable Use",
      content: "By using VitaminJob, you agree not to use the site for any illegal, harmful, or malicious activities, not to post content that is misleading, offensive, or infringes on the rights of others, and to use the site for its intended purpose of accessing jobs, courses, and roadmaps for personal or educational purposes. VitaminJob reserves the right to limit access to certain features for unverified accounts."
    },
    {
      title: "Links to External Websites",
      content: "Our website includes links to third-party websites, such as job postings, courses, and certifications. These links are provided for informational purposes only. VitaminJob does not own or control the content of these external websites and is not responsible for any inaccuracies, harm, or issues arising from their use. We prohibit linking to our website from harmful, illegal, or inappropriate pages. Using our trademarks, logos, or copyrighted content as links without prior written permission is not allowed."
    },
    {
      title: "Intellectual Property",
      content: "VitaminJob does not own the external content linked on the site, including job listings or course details. Users may use the site's content for educational purposes but are prohibited from using it for malicious or illegal activities."
    },
    {
      title: "Privacy and Data Collection",
      content: "VitaminJob collects basic information (email and phone) during user registration for account creation and authentication. Additional details are optional. The website uses cookies to store JWT tokens for secure user authentication. We respect your privacy and do not sell or misuse user data."
    },
    {
      title: "Payments and Refunds",
      content: "Currently, all features on VitaminJob are free. In the future, VitaminJob may offer paid courses for a nominal fee (less than $0.50). Payments will be processed via Razorpay. Refund Policy: All payments are final, and no refunds or cancellations will be issued once a transaction is completed."
    },
    {
      title: "Disclaimer",
      content: "VitaminJob strives to provide accurate and helpful information for users. However, we do not guarantee the accuracy, completeness, or reliability of external content linked on our site. We are not liable for any losses or issues arising from inaccuracies or misuse of the information provided on our website. If you find any content that does not comply with our terms, notify us, and we will take appropriate action, including removal of the content."
    },
    {
      title: "Governing Law",
      content: "These Terms and Conditions are governed by the laws of Andhra Pradesh, India. In case of disputes, users are encouraged to contact us first for resolution."
    },
    {
      title: "Modifications to Terms",
      content: "VitaminJob reserves the right to update or modify these Terms and Conditions at any time. Users will be notified of changes through in-site notifications, alerts, or prompts. Continued use of the site after such notifications constitutes acceptance of the updated terms."
    },
    {
      title: "Contact Information",
      content: "If you have any questions or concerns regarding these Terms and Conditions or wish to report a violation, please contact us via the feedback section on our website."
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
              Terms and Conditions
            </h1>
            
            <div className="text-gray-600 dark:text-gray-300 mb-8">
              Welcome to VitaminJob! By accessing and using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully. If you do not agree with any part of these terms, you must discontinue use of our website.
            </div>

            <div className="space-y-8">
              {terms.map((term, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {index + 1}. {term.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {term.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;