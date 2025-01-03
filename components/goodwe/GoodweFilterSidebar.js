import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";
import { RotateCcw } from "lucide-react";

const INITIAL_FILTERS = {
  status: [],
  type: [],
  search: "",
  capacity: { min: 0, max: 1000 },
};

const GOODWE_TYPES = {
  Residential: "Residential",
  "Commercial rooftop": "Commercial Rooftop",
  "Battery Storage": "Battery Storage",
};

const GoodweFilterSidebar = ({
  plants,
  onFilterChange,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { t } = useTranslation();
  const { isMobile, isTablet } = useDeviceType();
  const sidebarRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const filterPlants = useCallback(
    (currentFilters) => {
      if (!plants) return [];

      let filtered = [...plants];

      if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filtered = filtered.filter(
          (plant) =>
            plant?.name?.toLowerCase().includes(searchTerm) ||
            plant?.address?.toLowerCase().includes(searchTerm)
        );
      }

      if (currentFilters.status.length > 0) {
        filtered = filtered.filter((plant) =>
          currentFilters.status.includes(plant.status)
        );
      }

      if (currentFilters.type.length > 0) {
        filtered = filtered.filter((plant) =>
          currentFilters.type.includes(plant.type)
        );
      }

      if (currentFilters.capacity.min || currentFilters.capacity.max) {
        filtered = filtered.filter(
          (plant) =>
            (currentFilters.capacity.min
              ? plant.capacity >= currentFilters.capacity.min
              : true) &&
            (currentFilters.capacity.max
              ? plant.capacity <= currentFilters.capacity.max
              : true)
        );
      }

      return filtered;
    },
    [plants]
  );

  useEffect(() => {
    if (plants?.length > 0 && !isInitialized) {
      setIsInitialized(true);
      onFilterChange(plants);
    }
  }, [plants, isInitialized, onFilterChange]);

  const handleCheckboxChange = useCallback(
    (filterType, value) => {
      setFilters((prevFilters) => {
        const updatedFilter = [...prevFilters[filterType]];
        const index = updatedFilter.indexOf(value);

        if (index > -1) {
          updatedFilter.splice(index, 1);
        } else {
          updatedFilter.push(value);
        }

        const updatedFilters = {
          ...prevFilters,
          [filterType]: updatedFilter,
        };

        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleSearchChange = useCallback(
    (event) => {
      const searchTerm = event.target.value;
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          search: searchTerm,
        };
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleCapacityChange = useCallback(
    (type, value) => {
      if (!value || isNaN(value)) return;

      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          capacity: {
            ...prevFilters.capacity,
            [type]: Number(value),
          },
        };

        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    onFilterChange(filterPlants(INITIAL_FILTERS));
  }, [filterPlants, onFilterChange]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={`overflow-auto pb-16 fixed z-50 top-0 left-0 h-screen xl:h-full transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 backdrop-blur-sm backdrop-filter p-4 rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow">
          {t("filter")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="p-2 text-custom-dark-blue dark:text-custom-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            title={t("reset_filters")}
          >
            <span>{t("reset")}</span> <RotateCcw className="w-5 h-5" />
          </button>
          {(isMobile || isTablet) && (
            <button
              onClick={closeSidebar}
              className="text-custom-dark-blue dark:text-custom-yellow text-xl"
            >
              <IoMdClose />
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("filterPlaceholder")}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("plantStatus")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {["working", "error", "waiting", "disconnected"].map((status) => (
            <CustomCheckbox
              key={status}
              label={t(`status.${status}`)}
              checked={filters.status.includes(status)}
              onChange={() => handleCheckboxChange("status", status)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("type")}
        </h3>
        <div className="flex flex-col gap-1 text-custom-dark-blue dark:text-custom-light-gray">
          {Object.keys(GOODWE_TYPES).map((type) => (
            <CustomCheckbox
              key={type}
              label={t(GOODWE_TYPES[type])}
              checked={filters.type.includes(type)}
              onChange={() => handleCheckboxChange("type", type)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("capacity")} (kw)
        </h3>
        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="text-sm text-custom-dark-blue dark:text-custom-light-gray mb-1">
              {t("min")}
            </label>
            <input
              type="number"
              value={filters.capacity.min}
              onChange={(e) => handleCapacityChange("min", e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
              placeholder={t("min")}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="text-sm text-custom-dark-blue dark:text-custom-light-gray mb-1">
              {t("max")}
            </label>
            <input
              type="number"
              value={filters.capacity.max}
              onChange={(e) => handleCapacityChange("max", e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:bg-gray-800 dark:text-custom-yellow transition duration-300"
              placeholder={t("max")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodweFilterSidebar;
