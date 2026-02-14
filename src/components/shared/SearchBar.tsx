interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: '6px 10px',
        border: '1px solid var(--aws-border-dark)',
        borderRadius: 'var(--border-radius)',
        fontSize: 'var(--font-size-md)',
        width: '250px',
      }}
    />
  );
}
