interface StatusSelectProps {
  status: string;
  onChange: (status: string) => void;
}

export const StatusSelect = ({ status, onChange }: StatusSelectProps) => {
  return (
    <div className="flex items-center gap-6 mb-6">
      <label htmlFor="status" className="font-semibold text-gray-700">
        Status:
      </label>
      <select
        id="status"
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 px-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        <option value="alive" className="text-green-600 font-medium">
          🟢 Alive
        </option>
        <option value="dead" className="text-red-600 font-medium">
          🔴 Dead
        </option>
        <option value="unknown" className="text-gray-500 font-medium">
          ❔ Unknown
        </option>
      </select>
    </div>
  );
};
