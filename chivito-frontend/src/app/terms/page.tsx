"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Terms</h1>
        <p className="text-gray-600 mt-4">
          By using Brega, you agree that provider listings are supplied by
          third-party professionals. You are responsible for evaluating and
          contacting providers directly.
        </p>

        <div className="mt-6 space-y-3 text-gray-600">
          <p>
            Brega does not guarantee service quality, pricing, or availability.
          </p>
          <p>
            You may not post misleading, illegal, or harmful content on the
            platform.
          </p>
          <p>
            We reserve the right to remove listings or accounts that violate
            these terms.
          </p>
          <p>
            Brega is not liable for disputes, damages, or losses resulting from
            services arranged through the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
