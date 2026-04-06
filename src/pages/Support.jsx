// src/pages/Support.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, MessageCircle, HelpCircle, Send, ChevronRight, Clock, Phone, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';

export default function Support() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link in your inbox."
    },
    {
      question: "Why is my email not verified?",
      answer: "After signing up, check your email for a verification link. If you didn't receive it, you can request a new verification email from your dashboard."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "Go to your Dashboard > Settings > Subscription, and click on 'Cancel Subscription'. You'll continue to have access until the end of your billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal."
    },
    {
      question: "How long does it take for orders to process?",
      answer: "Most orders begin processing within 24 hours. Delivery times vary depending on the service purchased."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data. We never share your information with third parties."
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get a response within 24 hours",
      contact: "support@smmbooster.com",
      action: "mailto:prospersamuel100@gmail.com"
    },
    {
      icon: FaWhatsapp,
      title: "Whatsapp Chat",
      description: "Chat with our support team on whatsapp",
      contact: "Available 9AM - 6PM EST",
      action: "https://wa.me/2349133037955?text=Hello%20SMM%20Booster%20Support%2C%20I%20need%20help%20with...",
    },
  ];

  const quickLinks = [
    { title: "Terms of Service / Privacy Policy", icon: FileText, link: "/terms" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 sm:px-6 pb-10 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-md md:text-xl text-gray-600">We're here to help you with any questions or concerns</p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.action}
                target='_blank'
                onClick={method.onClick}
                className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition group cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#00786A]/10 rounded-full group-hover:bg-[#00786A] transition">
                    <Icon className="h-8 w-8 text-[#00786A] group-hover:text-white transition" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                <p className="text-[#00786A] font-medium">{method.contact}</p>
              </a>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className="px-6 py-3 text-[#00786A] text-sm font-medium "
              >
                Frequently Asked Questions
              </button>
            </nav>
          </div>

          {/* FAQ Section */}
            <div className="p-6 divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
              
              <div className="pt-6 mt-2 text-center">
              </div>
            </div>
        </div>

        {/* Quick Links Footer */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.link}
                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-[#00786A] transition"
              >
                <Icon className="h-4 w-4 mr-2" />
                {link.title}
              </a>
            );
          })}
        </div>

        {/* Response Time Note */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-sm truncate text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
            <Clock className="h-4 w-4" />
            <span>Average response time: 2-4 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}