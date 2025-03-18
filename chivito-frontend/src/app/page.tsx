"use client";
import { useState } from "react";

export default function Home() {
  const categories = ["All", "Cleaning", "Repairing", "Painting", "Plumbing"];
  const services = [
    {
      name: "Santos Daniel",
      service: [
        "Construction",
        "Plumbing",
        "Electrician",
        "Painting",
        "Mechanic",
      ],
      price: "$25",
      rating: 4.8,
      reviews: "8,289",
      location: ["Norte", "Sur", "Metro"],
      image: "/cleaning-1.jpg",
    },
    {
      name: "Joel Colon",
      service: ["Painting", "Construction", "Electrician", "Detailer"],
      price: "$20",
      rating: 4.9,
      reviews: "6,182",
      location: ["Norte", "Sur", "metro", "Este"],
      image: "/cleaning-2.jpg",
    },
    {
      name: "Luis Colon",
      service: ["Nah"],
      price: "$22",
      rating: 4.7,
      reviews: "7,938",
      location: ["Sur"],
      image: "/cleaning-3.jpg",
    },
    {
      name: "Angel Tomas",
      service: ["Plumber"],
      price: "$24",
      rating: 4.9,
      location: ["Metro"],
      reviews: "6,182",
      image: "/cleaning-4.jpg",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 md:px-12">
      <div className="flex justify-between items-center w-full max-w-5xl mt-8 mb-8 px-4 md:px-0">
        <h3 className="text-xl font-semibold text-gray-900">Services</h3>
        <p className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition">
          See All
        </p>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-6 w-full max-w-5xl">
        {[
          "Mechanic",
          "Electrician",
          "Detailer",
          "Painter",
          "Plumber",
          "Constructor",
          "Carpenter",
          "More",
        ].map((service, index) => (
          <button key={index} className="flex flex-col items-center group">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md transition-transform duration-300 group-hover:scale-105">
              <img
                src="/broom.png"
                alt={service}
                className="w-10 h-10 object-contain"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-black">{service}</p>
          </button>
        ))}
      </div>
      <div className="w-full h-px mt-8 bg-gray-200"></div>
      <div className="flex justify-between items-center w-full max-w-5xl mt-8 mb-3 px-4 md:px-0">
        <h3 className="text-xl font-semibold text-gray-900">
          Most Popular Services
        </h3>
        <p className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition">
          See All
        </p>
      </div>
      <div className="w-full">
        <div className="flex justify-center md:justify-center mb-6 overflow-x-auto">
          <div className="flex space-x-4 px-4 md:px-0 py-2 max-w-5xl">
            {[
              "Mechanic",
              "Electrician",
              "Detailer",
              "Painter",
              "Plumber",
              "Constructor",
              "Carpenter",
              "Detailer",
            ].map((service, index) => (
              <button
                key={index}
                className="whitespace-nowrap rounded-full bg-white shadow-md px-6 py-2 text-sm font-medium text-gray-700 border-gray-300 transition hover:bg-gray-100 hover:shadow-lg"
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {services.map((provider, index) => (
          <div
            key={index}
            className="flex items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden">
              <img
                src={provider.image}
                alt="pfp"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Service Details */}
            <div className="ml-4 flex-1">
              <h3 className="text-black font-semibold">{provider.name}</h3>
              <p className="text-black">
                Starting at:{" "}
                <span className="text-purple-600 font-semibold">
                  {provider.price}
                </span>
              </p>
              {/* Tags for Multiple Services */}
              <div className="flex flex-wrap gap-2 mt-2">
                {provider.service.map((service, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
              <div className="w-full h-px mt-2 bg-gray-200"></div>

              {/* Location Chips - Styled Differently */}
              <div className="mt-2 flex flex-wrap gap-2">
                {provider.location.length > 3 ? (
                  <span className="bg-red-200 text-red-800 text-sm font-semibold px-1.5 py-0 rounded-full">
                    Isla
                  </span>
                ) : (
                  provider.location.map((location, i) => (
                    <span
                      key={i}
                      className="bg-blue-200 text-blue-900 text-sm font-semibold px-1.5 py-0 rounded-full"
                    >
                      {location}
                    </span>
                  ))
                )}
              </div>
              <div className="flex items-center text-gray-600 text-sm mt-2">
                ⭐ {provider.rating} | {provider.reviews} reviews
              </div>
            </div>

            {/* Bookmark Icon */}
            <button className="ml-auto text-purple-600">📌</button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 flex justify-center items-center">
          Hello, Chivito! 🚀
        </h1>
        <p className="text-lg text-red-500 mt-4">Tailwind is working!</p>
      </div>
    </div>
  );
}
