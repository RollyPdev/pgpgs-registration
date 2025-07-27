"use client";

import Image from "next/image";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200">
      {/* Header */}
      <header className="w-full flex flex-col items-center py-6 bg-white/80 shadow-md mb-8">
        <div className="flex items-center gap-4">
          <Image
            src="/PGPGS Logo.png"
            alt="PGPGS Logo"
            width={64}
            height={64}
            className="rounded-full border border-yellow-400 shadow-md"
            priority
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-900 tracking-tight">
              Pi Gamma Phi Gamma Sigma
            </h1>
            <h2 className="text-lg sm:text-xl font-medium text-yellow-700">
              Roxas City Capiz Chapter
            </h2>
            <p className="text-sm text-yellow-600 font-semibold mt-1">
              50th Golden Anniversary
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-yellow-900">Terms and Conditions</h1>
            <Link 
              href="/"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              Back to Registration
            </Link>
          </div>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using this online registration form for the Pi Gamma Phi Gamma Sigma Roxas City Capiz Chapter 50th Golden Anniversary, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">2. Registration Eligibility</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Registration is open to all Pi Gamma Phi Gamma Sigma members and alumni from recognized chapters.</li>
                <li>Participants must provide accurate and complete information during registration.</li>
                <li>False or misleading information may result in registration cancellation.</li>
                <li>Registration is subject to verification and approval by the organizing committee.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">3. Payment Terms</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li><strong>Alumni Registration Fee:</strong> ₱100.00 PHP</li>
                <li><strong>Member Registration Fee:</strong> ₱500.00 PHP</li>
                <li>Payment must be completed at the time of registration.</li>
                <li>Registration fees are non-refundable except in cases of event cancellation by the organizers.</li>
                <li>Payment methods and instructions will be provided upon successful registration.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">4. Privacy and Data Protection</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Personal information collected will be used solely for event organization and communication purposes.</li>
                <li>Your data will be handled in accordance with the Data Privacy Act of 2012.</li>
                <li>Information will not be shared with third parties without your explicit consent.</li>
                <li>You have the right to access, correct, or delete your personal information.</li>
                <li>Contact information may be used for future PGPGS events and announcements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">5. Event Participation</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Registered participants must comply with all event rules and regulations.</li>
                <li>The organizing committee reserves the right to modify event details with prior notice.</li>
                <li>Participants are responsible for their own safety and well-being during the event.</li>
                <li>Professional conduct is expected from all participants.</li>
                <li>Photography and video recording may occur during the event for documentation purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">6. Cancellation and Refund Policy</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Cancellation requests must be submitted in writing at least 7 days before the event.</li>
                <li>Refunds will be processed within 30 days of cancellation approval.</li>
                <li>No refunds will be issued for no-shows or late cancellations.</li>
                <li>In case of event cancellation by organizers, full refunds will be provided.</li>
                <li>Force majeure events may affect refund policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">7. Liability and Indemnification</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Participants agree to indemnify and hold harmless PGPGS from any claims arising from their participation.</li>
                <li>The organization is not liable for personal injury, property damage, or other losses during the event.</li>
                <li>Participants are responsible for their personal belongings and valuables.</li>
                <li>Medical emergencies should be reported immediately to event organizers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">8. Code of Conduct</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>All participants must maintain professional and respectful behavior.</li>
                <li>Discrimination, harassment, or inappropriate conduct will not be tolerated.</li>
                <li>Violation of the code of conduct may result in immediate removal from the event.</li>
                <li>Participants should respect the venue and other attendees.</li>
                <li>Alcohol consumption must comply with venue policies and local regulations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">9. Communication</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Event updates and important information will be communicated via email.</li>
                <li>Participants are responsible for checking their email regularly.</li>
                <li>Contact information provided during registration must remain current.</li>
                <li>Organizers may use SMS or phone calls for urgent communications.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">10. Amendments and Updates</h2>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>These terms and conditions may be updated with prior notice to participants.</li>
                <li>Continued participation constitutes acceptance of any amendments.</li>
                <li>Major changes will be communicated via email and website updates.</li>
                <li>Participants are encouraged to review terms periodically.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-800 mb-3">11. Contact Information</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-medium text-yellow-800 mb-2">For questions or concerns regarding these terms:</p>
                <ul className="space-y-1 text-sm">
                  <li><strong>Email:</strong> pgpgs.roxas@gmail.com</li>
                  <li><strong>Phone:</strong> +63 XXX XXX XXXX</li>
                  <li><strong>Address:</strong> Roxas City, Capiz, Philippines</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-yellow-200 pt-6 mt-8">
              <p className="text-sm text-gray-600 text-center">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}<br />
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 