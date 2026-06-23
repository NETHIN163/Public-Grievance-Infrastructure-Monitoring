import React, { useState } from 'react';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const faqs = [
    {
      q: "How fast is my complaint routed to an officer?",
      a: "Once registered, our automated routing engine validates the submission, scans for duplicate active complaints, and assigns it to the local department officer in under 5 minutes."
    },
    {
      q: "Can I upload multiple before/after images?",
      a: "Yes, when registering a complaint you can upload images showing the damage. After resolution, the assigned officer will upload resolution photographs visible on your tracking timeline."
    },
    {
      q: "What categories of grievances are supported?",
      a: "Currently, we support Roads & Highways (potholes, cracks), Water Supply & Sanitation (contamination, leakages), Electricity & Power (broken street lamps), Waste Management (dump piling), and Public Safety Hazards."
    },
    {
      q: "Is my personal data shared with third parties?",
      a: "Absolutely not. All reports are secured within government servers, and personal contact numbers are kept masked from non-authorized officials."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
      
      {/* Page Header */}
      <section className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-gradient-indigo">Contact Central Support</h2>
        <p className="text-xs text-govMatte-muted max-w-md mx-auto">Get in touch with department representatives or browse operational FAQs.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-extrabold text-govBlue uppercase tracking-wider mb-4">Submit Query Ticket</h3>
            
            {success && (
              <div className="mb-4">
                <Alert type="success" message="Support ticket registered successfully. A response will be dispatched to your email within 24 hours." />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-govMatte-text">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-govMatte-muted">Your Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-govMatte-muted">Your Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="block text-govMatte-muted">Subject / Department</label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Verification delay, account block issue"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="block text-govMatte-muted">Your Message</label>
                <textarea
                  id="message"
                  required
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your issue or query details here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-govGreen text-black font-bold rounded-xl hover:bg-govGreen-light shadow-lg shadow-govGreen/10 flex items-center justify-center space-x-2 matte-transition text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Submit Query Ticket</span>
              </button>
            </form>
          </Card>

          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-govMatte-card border border-govMatte-border rounded-2xl flex items-center space-x-3">
              <Mail className="w-5 h-5 text-govBlue" />
              <div className="text-[10px] leading-tight">
                <p className="font-bold text-govBlue">Help Desk Email</p>
                <p className="text-govMatte-muted mt-0.5">support@gov.in</p>
              </div>
            </div>
            <div className="p-4 bg-govMatte-card border border-govMatte-border rounded-2xl flex items-center space-x-3">
              <Phone className="w-5 h-5 text-govGreen" />
              <div className="text-[10px] leading-tight">
                <p className="font-bold text-govGreen">National Helpline</p>
                <p className="text-govMatte-muted mt-0.5">1800-11-2026</p>
              </div>
            </div>
            <div className="p-4 bg-govMatte-card border border-govMatte-border rounded-2xl flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-govBlue" />
              <div className="text-[10px] leading-tight">
                <p className="font-bold text-govBlue">Office HQ</p>
                <p className="text-govMatte-muted mt-0.5">Central Secretariat, ND</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="w-5 h-5 text-govBlue" />
              <h3 className="text-sm font-extrabold text-govBlue uppercase tracking-wider">Frequently Asked Questions</h3>
            </div>
            
            <div className="divide-y divide-govMatte-border">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-govGreen transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-govMatte-muted transform transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeFaq === idx && (
                    <p className="text-[11px] text-govMatte-muted leading-relaxed mt-2.5 font-medium animate-slide-up">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
