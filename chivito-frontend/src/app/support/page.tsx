"use client";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Support</h1>
        <p className="text-gray-600 mt-4">
          Need help? Reach out and we will get back to you.
        </p>
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-900">
                How do I post a service?
              </span>{" "}
              Go to “Register your service” and complete the form.
            </p>
            <p>
              <span className="font-medium text-gray-900">
                How do I edit my listing?
              </span>{" "}
              Open My Services, select a listing, and click Edit.
            </p>
            <p>
              <span className="font-medium text-gray-900">
                How do I contact a provider?
              </span>{" "}
              Open the provider profile and tap the phone number.
            </p>
          </div>
        </div>
        <div className="mt-6 text-gray-700">
          <p className="font-medium">Email</p>
          <a
            href="mailto:support@brega.com"
            className="text-purple-600 hover:underline"
          >
            support@brega.com
          </a>
        </div>
      </div>
    </div>
  );
}
