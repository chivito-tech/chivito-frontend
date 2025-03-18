export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-1.5 md:px-12">
      <div className="flex justify-between items-center w-full mt-8 mb-8 py-3 m px-6 h-0">
        <h3 className="text-lg font-bold text-black">Services</h3>
        <p className="text-sm text-gray-500">See All</p>
      </div>
      <div className=" justify-between items-center w-full grid grid-cols-3 grid-rows-2 gap-20 place-items-center">
        <button>
          <div className=" rounded-full bg-white p-2 shadow-md">
            <img
              src="/broom.png"
              alt="Mechanic"
              className="w-12 h-12  border-1"
            />
          </div>
        </button>
        <button>
          <div className="rounded-full bg-white p-2 shadow-md">
            <img
              src="/broom.png"
              alt="Electrician"
              className="w-12 h-12 border-1"
            />
          </div>
        </button>
        <button>
          <div className="rounded-full bg-white p-2 shadow-md">
            <img
              src="/broom.png"
              alt="Detailer"
              className="w-12 h-12 border-1"
            />
          </div>
        </button>
        <button>
          <div className="rounded-full bg-white p-2 shadow-md">
            <img
              src="/broom.png"
              alt="Painter"
              className="w-12 h-12 border-1"
            />
          </div>
        </button>
        <button>
          <div className="rounded-full bg-white p-2 shadow-md">
            <img
              src="/broom.png"
              alt="Plumber"
              className="w-12 h-12 border-1"
            />
          </div>
        </button>
        <button>
          <div className="rounded-full bg-white p-2 shadow-md">
            <img
              src="/broom.png"
              alt="Constructor"
              className="w-12 h-12 border-1"
            />
          </div>
        </button>
      </div>
      <h1 className="text-6xl font-extrabold text-blue-600 flex items-center space-x-2">
        Hello, Chivito! 🚀
      </h1>
      <p className="text-lg text-red-500 mt-3">Tailwind is working!</p>
      <div className="mt-6 w-full max-w-md"></div>
    </div>
  );
}
