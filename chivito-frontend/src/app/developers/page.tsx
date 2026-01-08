"use client";

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">Developers</h1>
        <p className="text-gray-600 mt-4">
          Meet the team behind Brega.
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Luis Colon</h2>
            <p className="text-gray-600">
              Full Stack Software Engineer and UI/UX Designer
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Gabriel Lopez
            </h2>
            <p className="text-gray-600">Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
