interface ServiceCardProps {
  name: string;
  price: string;
  contact: string;
  category?: string;
}

export default function ServiceCard({
  name,
  price,
  contact,
  category,
}: ServiceCardProps) {
  return (
    <div className="border p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 bg-white">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">Price: {price}</p>
      <p className="text-gray-600">Contact: {contact}</p>
      {category && (
        <span className="mt-2 inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {category}
        </span>
      )}
    </div>
  );
}
