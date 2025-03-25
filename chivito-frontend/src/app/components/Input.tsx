// import "../app/globals.css"; // Ensure this line is present

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
}

export default function Input({
  label,
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="border p-2 rounded-sm mt-1"
      />
    </div>
  );
}
