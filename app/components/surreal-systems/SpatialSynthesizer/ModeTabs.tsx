import { Tab } from "@headlessui/react";

interface ModeTabsProps {
  modes: { key: string; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function ModeTabs({ modes, activeKey, onChange }: ModeTabsProps) {
  const idx = modes.findIndex(m => m.key === activeKey);
  return (
    <Tab.Group selectedIndex={idx} onChange={i => onChange(modes[i].key)} as="div" className="w-full mb-6">
      <Tab.List className="flex space-x-2 bg-gray-100 rounded-full p-1">
        {modes.map(({ key, label }) => (
          <Tab
            key={key}
            className={({ selected }) =>
              `flex-1 text-sm font-medium py-1 rounded-full text-center cursor-pointer
               ${selected ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-800"}`
            }
          >
            {label}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
}
