// src/pages/PrivacyTerms.jsx
import React, { useState } from 'react';
import { Shield, FileText, AlertCircle, Clock, CreditCard, Globe, Users, Cookie, Lock, Mail, Building, ExternalLink } from 'lucide-react';

export default function PrivacyTerms() {
  const [activeSection, setActiveSection] = useState('privacy');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Privacy Policy & Service Terms</h1>
          <p className="text-md md:text-xl opacity-90">Your trust and privacy are our primary focus</p>
          <div className="mt-4 text-xs md:text-sm opacity-75">
            <p>Last Updated: April 6, 2026 | Effective Date: Immediate</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveSection('privacy')}
            className={`px-6 py-3 font-medium cursor-pointer transition ${
              activeSection === 'privacy'
                ? 'text-[#00786A] border-b-2 border-[#00786A]'
                : 'text-gray-600 hover:text-[#00786A]'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveSection('terms')}
            className={`px-6 py-3 font-medium cursor-pointer
                 transition ${
              activeSection === 'terms'
                ? 'text-[#00786A] border-b-2 border-[#00786A]'
                : 'text-gray-600 hover:text-[#00786A]'
            }`}
          >
            Service Terms
          </button>
        </div>

        {/* Quick Navigation Sidebar */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="hidden lg:block">
            <div className="sticky top-8 bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Navigation</h3>
              <nav className="space-y-2">
                {activeSection === 'privacy' ? (
                  <>
                    <NavLink onClick={() => scrollToSection('data-collection')}>Data Collection & Usage</NavLink>
                    <NavLink onClick={() => scrollToSection('cookies')}>Cookies & Tracking</NavLink>
                    <NavLink onClick={() => scrollToSection('security')}>Data Security & Retention</NavLink>
                    <NavLink onClick={() => scrollToSection('compliance')}>Global Compliance</NavLink>
                    <NavLink onClick={() => scrollToSection('affiliations')}>Business Affiliations</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink onClick={() => scrollToSection('refund')}>Refund & Cancellation Policy</NavLink>
                    <NavLink onClick={() => scrollToSection('non-refundable')}>Non-Refundable Scenarios</NavLink>
                    <NavLink onClick={() => scrollToSection('disputes')}>Cancellations & Disputes</NavLink>
                    <NavLink onClick={() => scrollToSection('updates')}>Updates to Terms</NavLink>
                  </>
                )}
                <NavLink onClick={() => scrollToSection('contact')}>Contact Us</NavLink>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Message */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-800">
                Welcome to <strong>SMM BOOSTER</strong>. This document outlines how Jandura Digital Solutions FZCO ("the Company," "We," "Us") manages your data and the terms governing your purchases.
              </p>
            </div>

            {activeSection === 'privacy' ? (
              <PrivacyPolicyContent />
            ) : (
              <TermsOfServiceContent />
            )}

            {/* Contact Section - Common for both */}
            <div id="contact" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-[#00786A]" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>For questions regarding your data or a specific order, please reach out to our dedicated support team:</p>
                <p className="font-medium">
                  Email: <a href="mailto:prospersamuel100@gmail.com" className="text-[#00786A] hover:underline">support@smmbooster.com</a>
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <Building className="h-5 w-5 text-gray-600 mb-2" />
                  <p className="font-semibold">Jandura Digital Solutions FZCO</p>
                  <p>Building A1, Dubai Digital Park</p>
                  <p>Dubai Silicon Oasis, Dubai, United Arab Emirates</p>
                </div>
              </div>
            </div>

            {/* Last Updated Note */}
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Last Updated: April 6, 2026 | Effective Date: Immediate</p>
              <p className="mt-2">© 2026 SMM BOOSTER. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Link Component
function NavLink({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="block w-full cursor-pointer text-left text-sm text-gray-600 hover:text-[#00786A] py-1 transition"
    >
      {children}
    </button>
  );
}

// Privacy Policy Content
function PrivacyPolicyContent() {
  return (
    <>
      {/* Section 1: Data Collection */}
      <div id="data-collection" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">1. Data Collection & Usage</h2>
        </div>
        <p className="text-gray-700 mb-4">
          We collect information to provide a seamless social media growth experience. By using SMM BOOSTER, you consent to the practices described below.
        </p>
        
        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Types of Information We Collect</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>Personal Identifiers:</strong> Email addresses and phone numbers provided during registration.</li>
          <li><strong>Authentication Data:</strong> Information shared via Third-Party Social Media Services (Google, Facebook, X/Twitter, LinkedIn) when you use them to log in.</li>
          <li><strong>Usage Insights:</strong> Automatically collected data including IP addresses, browser types, device identifiers, and page interaction statistics to help us optimize performance.</li>
        </ul>

        <h3 className="font-semibold text-gray-900 mt-4 mb-2">How We Use Your Data</h3>
        <p className="text-gray-700">We utilize your information to:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
          <li>Maintain your SMM BOOSTER account and process orders.</li>
          <li>Communicate critical service updates or security alerts.</li>
          <li>Provide personalized promotional offers (which you may opt out of at any time).</li>
          <li>Analyze platform trends to improve our delivery algorithms.</li>
        </ul>
      </div>

      {/* Section 2: Cookies */}
      <div id="cookies" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <Cookie className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">2. Cookies & Tracking</h2>
        </div>
        <p className="text-gray-700 mb-4">
          SMM BOOSTER employs "Cookies" and web beacons to enhance your user experience.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Essential Cookies:</strong> Required for secure login and fraud prevention.</li>
          <li><strong>Preference Cookies:</strong> Used to remember your settings (like language or login "Remember Me" features).</li>
          <li><strong>Analytics:</strong> To understand how users navigate our site and where we can improve.</li>
        </ul>
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-sm text-yellow-800">
          <strong>Note:</strong> You can disable cookies in your browser settings, though some features of SMM BOOSTER may lose functionality as a result.
        </div>
      </div>

      {/* Section 3: Data Security */}
      <div id="security" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">3. Data Security & Retention</h2>
        </div>
        <p className="text-gray-700">
          We employ industry-standard encryption to protect your data. While we strive for absolute security, please note that no digital transmission is 100% immune to risk. 
          We retain your data only as long as necessary to fulfill service obligations or comply with UAE legal requirements.
        </p>
      </div>

      {/* Section 4: Global Compliance */}
      <div id="compliance" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">4. Global Compliance & Children's Privacy</h2>
        </div>
        <p className="text-gray-700 mb-3">
          <strong>International Transfers:</strong> Your data may be processed outside your home country. We ensure all transfers meet strict security benchmarks.
        </p>
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-sm text-red-800">
          <strong>Minors:</strong> SMM BOOSTER is not intended for individuals under 13 years of age. We do not knowingly collect data from children.
        </div>
      </div>

      {/* Section 5: Business Affiliations */}
      <div id="affiliations" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <Building className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">5. Business Affiliations</h2>
        </div>
        <p className="text-gray-700 mb-3">
          SMM BOOSTER is a subsidiary and an official operating brand of:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">Jandura Digital Solutions FZCO</p>
          <p>Building A1, Dubai Digital Park</p>
          <p>Dubai Silicon Oasis, Dubai, United Arab Emirates</p>
        </div>
      </div>

      {/* Section 6: Updates */}
      <div id="updates" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">6. Updates to These Terms</h2>
        </div>
        <p className="text-gray-700">
          We reserve the right to modify this policy. Significant changes will be communicated via email or a prominent notification on the SMM BOOSTER dashboard.
        </p>
      </div>
    </>
  );
}

// Terms of Service Content
function TermsOfServiceContent() {
  return (
    <>
      {/* Section 3: Refund Policy */}
      <div id="refund" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">3. Refund & Cancellation Policy</h2>
        </div>
        <p className="text-gray-700 mb-4">
          Due to the nature of digital social media services, all transactions are governed by the following rules:
        </p>
        
        <h3 className="font-semibold text-gray-900 mt-4 mb-2">Refund Eligibility</h3>
        <p className="text-gray-700 mb-2">Refunds are issued at the sole discretion of the Company and are typically reserved for:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>Technical Failures:</strong> If the system fails to initiate your order.</li>
          <li><strong>Non-Delivery:</strong> If the service is not delivered within the specified timeframe.</li>
          <li><strong>Duplicate Billing:</strong> Verified double-charges for the same order.</li>
        </ul>
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
          <strong>Note:</strong> Approved refunds will be credited to your original payment method within 10 to 45 business days.
        </div>
      </div>

      {/* Non-Refundable Scenarios */}
      <div id="non-refundable" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <h3 className="font-semibold text-gray-900 text-xl md:text-2xl mb-3">Non-Refundable Scenarios</h3>
        <p className="text-gray-700 mb-2">Refunds will not be granted for:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Orders placed for private or restricted profiles.</li>
          <li>User errors, such as providing an incorrect link or changing a username mid-delivery.</li>
          <li>Platform-side drops (unfollows/unlikes) after the service is marked as "Completed."</li>
          <li>Orders for services that explicitly state "No Refill/No Guarantee."</li>
        </ul>
      </div>

      {/* Cancellations & Disputes */}
      <div id="disputes" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Cancellations & Disputes</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
            <p className="font-semibold text-yellow-800">Finality:</p>
            <p className="text-yellow-700">Once an order enters the processing stage, it cannot be canceled or modified.</p>
          </div>
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="font-semibold text-red-800">Chargebacks:</p>
            <p className="text-red-700">
              Initiating a payment dispute or chargeback without contacting support first will result in an immediate permanent ban from SMM BOOSTER and the reversal of any delivered services.
            </p>
          </div>
        </div>
      </div>

      {/* Updates */}
      <div id="updates" className="bg-white rounded-lg shadow-sm p-4 scroll-mt-20">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-[#00786A]" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">7. Updates to These Terms</h2>
        </div>
        <p className="text-gray-700">
          We reserve the right to modify this policy. Significant changes will be communicated via email or a prominent notification on the SMM BOOSTER dashboard.
        </p>
      </div>
    </>
  );
}