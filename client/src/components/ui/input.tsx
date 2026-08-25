interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: InputProps) {
  return (
    <div className="input-group">
      <label>{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {error && <span className="input-error">{error}</span>}
    </div>
  );
}