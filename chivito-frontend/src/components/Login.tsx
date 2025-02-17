export default function Login() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <div className="mt-4">
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />

        <label className="block text-gray-700 font-medium mt-4 mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />

        <button className="bg-purple-600 text-white px-5 py-2 rounded-lg mt-6 w-full hover:bg-purple-500 transition">
          Login
        </button>
      </div>
    </div>
  );
}
