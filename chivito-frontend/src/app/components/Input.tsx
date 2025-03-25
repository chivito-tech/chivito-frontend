interface InputProps {
  label: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function Input({
  label,
  type = "text",
  required = false,
  value = "",
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div className="relative w-full mt-4">
      <input
        type={type}
        value={value}
        required={required}
        onChange={onChange}
        placeholder=" "
        className="peer w-full text-black border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder-transparent"
      />
      <label
        className="absolute left-3 top-2 text-gray-500 text-sm transition-all 
          peer-placeholder-shown:top-3.5 
          peer-placeholder-shown:text-base 
          peer-placeholder-shown:text-gray-400 
          peer-focus:top-2 
          peer-focus:text-sm 
          peer-focus:text-purple-600"
      >
        {label}
      </label>
    </div>
  );
}
