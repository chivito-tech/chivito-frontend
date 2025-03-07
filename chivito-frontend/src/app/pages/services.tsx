import ServiceCard from "@/app/components/ServiceCard";

export default function Services() {
  const services = [
    { name: "Plumber", price: "$50", contact: "123-456-7890" },
    { name: "Electrician", price: "$40", contact: "987-654-3210" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Available Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
}
