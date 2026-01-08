"use client";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
        <p className="text-gray-600 mt-4">
          Need help or have a question? Reach out and we’ll get back to you.
        </p>

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
