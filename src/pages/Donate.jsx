import { useState } from "react";
import { useSelector } from "react-redux";
import Payment from "../components/Payments.jsx";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { BsLightbulb } from "react-icons/bs";
import { useEffect } from "react";

const Donate = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");

  const donationAmounts = [
    { amount: 500, text: "Supporter" },
    { amount: 1000, text: "Champion" },
    { amount: 2000, text: "Patron" },
    { amount: 5000, text: "Benefactor" },
  ];

  const handlePaymentSuccess = (response) => {
    console.log("Payment successful:", response);
    // Add any success handling logic here
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 1) {
      setCustomAmount(value);
      setSelectedAmount(Number(value));
    }
  };

  return (
    <div className="pt-8">
      <section className="donate bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
        <div className="max-w-7xl mx-auto py-14">
          {/* Donate Header */}
          <div className="donate-header flex justify-center items-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <FaHandHoldingHeart className="text-blue-600" />
                Support Our Mission
              </h1>
              <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                Help us empower more aspiring developers on their journey to success
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Impact Section */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Your Impact</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <GiTeacher className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">Support Quality Education</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your donation helps us create and maintain high-quality learning roadmaps and resources for developers worldwide.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <BsLightbulb className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">Enable Innovation</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Help us develop new features and tools to make learning programming more accessible and effective for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Form */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Make a Donation</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {donationAmounts.map(({ amount, text }) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setCustomAmount("");
                      setSelectedAmount(amount);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAmount === amount && !customAmount
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                        : "border-gray-200 hover:border-blue-400"
                    }`}
                  >
                    <div className="font-medium">₹{amount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{text}</div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Enter custom amount (₹)"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="p-3 border rounded-lg w-full text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                {customAmount && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Custom amount: ₹{customAmount}
                  </span>
                )}
              </div>

              {isAuthenticated ? (
                <div className="flex justify-center">
                  <Payment 
                    amount={selectedAmount} 
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-600 dark:text-gray-300">
                  Please login to make a donation
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                Your donation helps us maintain and improve our platform. 
                We&apos;re committed to providing free resources to help developers grow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
