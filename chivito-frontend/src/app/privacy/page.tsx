"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Privacy</h1>
        <p className="text-gray-600 mt-4">
          We collect basic account information (name, email, phone) and service
          listing details (categories, tags, photos) to power the platform.
        </p>

        <div className="mt-6 space-y-3 text-gray-600">
          <p>
            We use this data to create accounts, display listings, and improve
            the experience. We do not sell your personal information.
          </p>
          <p>
            We may store cookies or local preferences to keep you logged in and
            remember your settings.
          </p>
          <p>
            If you want to update or delete your account data, contact us and
            we will help.
          </p>
        </div>
      </div>
    </div>
  );
}
