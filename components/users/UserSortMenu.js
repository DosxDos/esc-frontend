import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

const UserSortMenu = ({ onSortChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const dropdownRef = useRef(null);

  const options = [
    {
      value: "name",
      icon: sortOrder === "asc" ? <BsSortAlphaDown /> : <BsSortAlphaUp />,
      label: t("sortByName"),
      path: "nombre",
    },
    {
      value: "lastLogin",
      icon: <FiClock />,
      label: t("sortByLastLogin"),
      path: "ultimo_login",
    },
  ];

  const handleSelect = (value) => {
    const newOrder =
      selectedOption === value && sortOrder === "asc" ? "desc" : "asc";

    setSelectedOption(value);
    setSortOrder(newOrder);

    const selectedPath = options.find((opt) => opt.value === value)?.path;
    onSortChange(selectedPath, newOrder);

    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOptionData =
    options.find((opt) => opt.value === selectedOption) || options[0];

  return (
    <div className="relative w-fit z-30" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-custom-dark-blue dark:text-custom-yellow font-secondary px-4 py-2 border-1 border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-custom-yellow focus:ring-opacity-50 transition duration-300"
      >
        <span className="flex items-center gap-2">
          <span className="flex-shrink-0">{selectedOptionData.icon}</span>
          <span className="whitespace-nowrap">{selectedOptionData.label}</span>
        </span>
        <svg
          className={`w-4 h-4 ml-3 flex-shrink-0 text-custom-dark-gray dark:text-custom-light-gray transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white/50 backdrop-blur-sm dark:bg-custom-dark-blue border border-gray-300 dark:border-custom-light-gray rounded-lg shadow-lg min-w-[100%] whitespace-nowrap">
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                selectedOption === option.value
                  ? "bg-gray-100 dark:bg-gray-700"
                  : ""
              } ${index === options.length - 1 ? "rounded-b-lg" : ""} ${
                index === 0 ? "rounded-t-lg" : ""
              }`}
            >
              <span className="flex-shrink-0 dark:text-custom-yellow">
                {option.icon}
              </span>
              <span className="whitespace-nowrap dark:text-custom-yellow flex-1">
                {option.label}
              </span>
              {selectedOption === option.value && (
                <span className="ml-auto flex items-center justify-center dark:text-custom-yellow">
                  {sortOrder === "asc" ? (
                    <TiArrowSortedUp className="text-xl" />
                  ) : (
                    <TiArrowSortedDown className="text-xl" />
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSortMenu;
