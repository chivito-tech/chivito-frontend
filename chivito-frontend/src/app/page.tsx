export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-around bg-gray-50 px-1.5 md:px-12">
      <div className="flex justify-between items-center w-full py-3 px-6 h-0">
        <h3 className="text-lg font-bold text-black">Services</h3>
        <p className="text-sm text-gray-500">See All</p>
      </div>
      <h1 className="text-6xl font-extrabold text-blue-600 flex items-center space-x-2">
        Hello, Chivito! 🚀
      </h1>
      <p className="text-lg text-red-500 mt-3">Tailwind is working!</p>
      <div className="mt-6 w-full max-w-md">
        <label className="block text-gray-700 font-medium mb-2 text-lg">
          Email
        </label>
      </div>
    </div>
  );
}
