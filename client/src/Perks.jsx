import { useEffect, useState } from "react";

export default function Perks({ selected: parentSelected = [], onChange }) {
  const [selected, setSelected] = useState(parentSelected);
  const [allPerks, setAllPerks] = useState([
    "Expert Staff",
    "Advanced Medical Tech",
    "Clean Facility",
    "Specialized Teams",
    "Emergency Services",
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  const handleCheckboxChange = (e) => {
    const { checked, name } = e.target;
    setSelected((prev) =>
      checked ? [...prev, name] : prev.filter((item) => item !== name)
    );
  };

  const handleAddPerk = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !allPerks.includes(trimmed)) {
      setAllPerks((prev) => [...prev, trimmed]);
    }
    if (!selected.includes(trimmed)) {
      setSelected((prev) => [...prev, trimmed]);
    }
    setInputValue("");
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleAddPerk} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Add a new perk"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-4">
        {allPerks.map((perk) => (
          <label
            key={perk}
            className="flex items-center gap-2 border p-2 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              name={perk}
              checked={selected.includes(perk)}
              onChange={handleCheckboxChange}
            />
            <span>{perk}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
