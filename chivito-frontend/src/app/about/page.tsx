"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">About</h1>
        <p className="text-gray-600 mt-4">
          Brega connects people with trusted local service providers. Whether
          you need help at home or a specialist for a specific job, you can find
          providers in your area and contact them directly.
        </p>
        <p className="text-gray-600 mt-4">
          Our mission is simple: make it easy for skilled professionals to get
          discovered and for customers to hire with confidence.
        </p>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">How it works</h2>
          <ul className="mt-3 space-y-2 text-gray-600 list-disc list-inside">
            <li>Search for services and filter by area.</li>
            <li>Review provider profiles, tags, and photos.</li>
            <li>Contact providers directly to get hired.</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Note: Brega does not process payments or bookings. All arrangements
          are made directly between customers and providers.
        </p>
      </div>
    </div>
  );
}
