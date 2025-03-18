export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 md:px-12">
      <div className="flex justify-between items-center w-full max-w-5xl mt-8 mb-6 px-4 md:px-0">
        <h3 className="text-xl font-semibold text-gray-900">Services</h3>
        <p className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition">
          See All
        </p>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-6 w-full max-w-5xl">
        {[
          "Mechanic",
          "Electrician",
          "Detailer",
          "Painter",
          "Plumber",
          "Constructor",
        ].map((service, index) => (
          <button key={index} className="flex flex-col items-center group">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md transition-transform duration-300 group-hover:scale-105">
              <img
                src="/broom.png"
                alt={service}
                className="w-10 h-10 object-contain"
              />
            </div>
          </button>
        ))}
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 flex items-center mt-12">
        Hello, Chivito! 🚀
      </h1>

      <p className="text-lg text-red-500 mt-4">Tailwind is working!</p>
    </div>
  );
}
