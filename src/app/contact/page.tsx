"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("support");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required.";
    if (!message.trim() || message.length < 10) newErrors.message = "Message must be at least 10 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setIsSuccessModalOpen(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light-base dark:bg-bg-dark-base text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-4 items-start">
        {/* Info Col */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Get in touch</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">We&apos;d Love to Hear from You</h1>
            <p className="text-sm text-zinc-550 leading-relaxed max-w-md mt-2">
              Have questions about university pricing, need platform support, or want to suggest new features? Reach out and our team will reply within 24 hours.
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="text-xs font-bold">Email support</p>
                <p className="text-xs text-zinc-500">support@careeros.ai</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">🏢</span>
              <div>
                <p className="text-xs font-bold">HQ Office</p>
                <p className="text-xs text-zinc-500">100 Innovation Way, Suite 400, Boston, MA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
              <Input
                label="University Email"
                placeholder="jane.doe@university.edu"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Topic of Query
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all duration-200 text-foreground"
                >
                  <option value="support">Student Platform Support</option>
                  <option value="sales">University Licensing & Sales</option>
                  <option value="feedback">General Feedback & Ideas</option>
                </select>
              </div>
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  Message Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us how we can help you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl glass-effect bg-white/40 dark:bg-bg-dark-surface/40 border border-card-border focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/30 outline-none transition-all duration-200 text-foreground"
                />
                {errors.message && (
                  <span className="text-xs text-brand-accent font-medium">
                    {errors.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full mt-2">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Message Sent Successfully!"
      >
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <span className="text-4xl text-brand-success">✅</span>
          <p className="text-sm font-semibold">Thank you for contacting CareerOS AI!</p>
          <p className="text-xs text-zinc-550 max-w-sm">
            We have received your message and will review it. A member of our academic support team will reach out to you shortly.
          </p>
          <Button onClick={() => setIsSuccessModalOpen(false)} className="mt-4">
            Close Panel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
