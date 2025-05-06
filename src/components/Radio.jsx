// components/Radio.jsx
export default function Radio({ label, name, value, checked, onChange }) {
	return (
		<label className="inline-flex items-center gap-2 text-[16px] font-medium cursor-pointer">
			<input
				type="radio"
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				className="w-4 h-4 accent-black"
			/>
			{label}
		</label>
	);
}
