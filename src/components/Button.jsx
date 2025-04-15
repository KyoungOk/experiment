import React from "react";

// components/Button.jsx
export default function Button({
	children,
	type = "primary",
	size = "md",
	className = "",
	buttonType = "button", // ← submit, button, reset 등
	...props
}) {
	const base =
		"flex justify-center items-center gap-3 w-full px-6 rounded-full text-base font-bold font-suit transition duration-200";

	const variants = {
		primary: "border border-black bg-black text-white hover:bg-gray-800",
		secondary:
			"border-2 border-black text-black bg-white hover:bg-black hover:text-white",
		tertiary:
			"border border-gray-500 text-black bg-white hover:bg-black hover:text-white",
	};

	const sizes = {
		sm: "w-[240px] py-3",
		md: "w-full md:max-w-[400px] py-3",
		lg: "w-full md:max-w-[480px] py-4",
	};

	return (
		<button
			type={buttonType}
			className={`${base} ${variants[type]} ${sizes[size]} ${className}`}
			{...props}>
			{children}
		</button>
	);
}
