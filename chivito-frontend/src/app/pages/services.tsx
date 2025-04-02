"use client";

import { useState } from "react";
import ServiceCard from "@/app/components/ServiceCard";
import dynamic from "next/dynamic";

// Lazy load ServiceSelect to avoid hydration errors
const ServiceSelect = dynamic(() => import("@/app/components/serviceSelect"), {
  ssr: false,
});

const servicesData = [
  { name: "Plumber", price: "$50", contact: "123-456-7890" },
  { name: "Electrician", price: "$40", contact: "987-654-3210" },
  { name: "Mechanic", price: "$55", contact: "111-222-3333" },
  { name: "Painter", price: "$60", contact: "444-555-6666" },
  { name: "Detailer", price: "$45", contact: "777-888-9999" },
  { name: "Carpenter", price: "$65", contact: "222-333-4444" },
];

export default function Services() {
  const [selectedServices, setSelectedServices] = useState<any[]>([]);

  const filteredServices =
    selectedServices.length === 0
      ? servicesData
      : servicesData.filter((service) =>
          selectedServices.some(
            (selected) =>
              service.name.toLowerCase() === selected.value.toLowerCase()
          )
        );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Available Services
      </h1>

      {/* Service Filter Dropdown */}
      <div className="mb-8 max-w-lg">
        <ServiceSelect onChange={setSelectedServices} />
      </div>

      {/* Grid of filtered services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
}
