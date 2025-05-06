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
		"flex justify-center items-center gap-3 w-full px-6 rounded-[12px] font-suit transition duration-200";

	const variants = {
		primary: "border border-black bg-black text-white hover:bg-gray-800",
		secondary:
			"text-white bg-brandPurple  hover:bg-purple-700 hover:text-white",
		tertiary: "text-black bg-gray-100 hover:bg-gray-200 hover:text-black",
	};

	const sizes = {
		sm: "w-[240px] py-2 text-sm font-bold",
		md: "w-full h-[46px]  text-[13px] font-bold",
		lg: "w-full py-4 text-base font-bold",
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
