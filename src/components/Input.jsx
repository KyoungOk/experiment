export default function Input({ className = "", ...props }) {
	const base =
		"w-full px-5 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-black transition";

	return <input className={`${base} ${className}`} {...props} />;
}
