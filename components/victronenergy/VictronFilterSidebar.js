import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "next-i18next";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import useDeviceType from "@/hooks/useDeviceType";
import { IoMdClose } from "react-icons/io";
import { RotateCcw, X } from "lucide-react";
import DateSelector from "@/components/DateSelector";
import { BsCalendar3 } from "react-icons/bs";
import { parseISO, isValid, isAfter, isBefore, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { selectActiveVictronNotifications } from "@/store/slices/notificationsSlice";
import { useSelector } from "react-redux";
import useTouchDevice from "@/hooks/useTouchDevice";

const VictronFilterSidebar = ({
  plants,
  onFilterChange,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { t } = useTranslation();
  const minDateInputRef = useRef(null);
  const maxDateInputRef = useRef(null);

  const initialFilters = {
    status: [],
    type: [],
    search: "",
    installationDate: { min: "", max: "" },
    hasAlerts: false,
  };

  const [filters, setFilters] = useState(initialFilters);
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const sidebarRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMinDateSelectorOpen, setIsMinDateSelectorOpen] = useState(false);
  const [isMaxDateSelectorOpen, setIsMaxDateSelectorOpen] = useState(false);
  const activeVictronAlerts = useSelector(selectActiveVictronNotifications);
  const isTouchDevice = useTouchDevice();

  const VICTRON_TYPES = {
    solar: "type_Solar",
    generator: "type_Generator",
    battery: "type_Battery",
    grid: "type_Grid",
  };

  const BATTERY_STATES = {
    charging: "Cargando",
    discharging: "Descargando",
    resting: "En reposo",
  };

  useEffect(() => {
    if (plants?.length > 0 && !isInitialized) {
      setIsInitialized(true);
      setTimeout(() => {
        onFilterChange(plants);
      }, 0);
    }
  }, [plants, isInitialized, onFilterChange]);

  const isDateValid = (dateString) => {
    if (!dateString) return false;
    const date = parseISO(dateString);
    return isValid(date);
  };

  const filterPlants = useCallback(
    (currentFilters) => {
      if (!plants) return [];

      // console.log("Current filters:", currentFilters);

      return plants.filter((plant) => {
        // console.log(
        //   "Checking plant:",
        //   plant.name,
        //   "Alert quantity:",
        //   plant.alert_quantity
        // );

        // Alert Filter
        const hasActiveAlerts = activeVictronAlerts.some(
          (alert) => alert.plantId === plant.id
        );

        if (currentFilters.hasAlerts) {
          console.log(
            `🔍 Checking plant ${plant.name}, Alerts:`,
            hasActiveAlerts
          );
          if (!hasActiveAlerts) {
            console.log(`❌ Excluding ${plant.name} (No active alerts)`);
            return false;
          }
        }

        // Search Filter
        if (currentFilters.search.trim()) {
          const searchTerm = currentFilters.search.toLowerCase().trim();
          const name = (plant.name || "").toLowerCase();
          const address = (plant.address || "").toLowerCase();
          if (!name.includes(searchTerm) && !address.includes(searchTerm)) {
            return false;
          }
        }

        // Type Filter
        if (currentFilters.type.length > 0) {
          if (!currentFilters.type.includes(plant.type)) {
            return false;
          }
        }

        // Battery Status Filter
        if (currentFilters.status.length > 0) {
          const plantStatus = plant.status;
          const matchingStatus = currentFilters.status.some(
            (filterStatus) => BATTERY_STATES[filterStatus] === plantStatus
          );
          if (!matchingStatus) {
            return false;
          }
        }

        // Installation Date Filter
        const installationDate = parseISO(plant.installation_date);

        if (isDateValid(currentFilters.installationDate.min)) {
          const minDate = parseISO(currentFilters.installationDate.min);
          if (isBefore(installationDate, startOfDay(minDate))) {
            return false;
          }
        }

        if (isDateValid(currentFilters.installationDate.max)) {
          const maxDate = parseISO(currentFilters.installationDate.max);
          if (isAfter(installationDate, startOfDay(maxDate))) {
            return false;
          }
        }

        return true;
      });
    },
    [plants]
  );

  const handleCheckboxChange = useCallback(
    (filterType, value) => {
      setFilters((prevFilters) => {
        let updatedFilters;

        if (filterType === "hasAlerts") {
          const newHasAlerts = !prevFilters.hasAlerts; // Toggle the value
          updatedFilters = { ...prevFilters, hasAlerts: newHasAlerts };

          console.log("✅ Alert filter toggled:", newHasAlerts);
        } else {
          updatedFilters = {
            ...prevFilters,
            [filterType]: prevFilters[filterType].includes(value)
              ? prevFilters[filterType].filter((item) => item !== value)
              : [...prevFilters[filterType], value],
          };
        }

        const filteredPlants = filterPlants(updatedFilters);
        console.log("✅ Filtered plants after change:", filteredPlants);

        onFilterChange(filteredPlants); // Ensure UI updates
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleSearchChange = useCallback(
    (event) => {
      const searchTerm = event.target.value;
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, search: searchTerm };
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleDateChange = useCallback(
    (type, value) => {
      setFilters((prevFilters) => {
        const updatedFilters = {
          ...prevFilters,
          installationDate: { ...prevFilters.installationDate, [type]: value },
        };
        onFilterChange(filterPlants(updatedFilters));
        return updatedFilters;
      });
    },
    [filterPlants, onFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    onFilterChange(filterPlants(initialFilters));
    setIsMinDateSelectorOpen(false);
    setIsMaxDateSelectorOpen(false);
  }, [filterPlants, onFilterChange]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        (isMobile || isTablet)
      ) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSidebar, isMobile, isTablet]);

  return (
    <div
      ref={sidebarRef}
      className={`p-4 min-w-80 h-[100dvh] xl:h-auto flex flex-col fixed z-600 top-0 left-0 transform transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } xl:static xl:block xl:translate-x-0 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm backdrop-filter rounded-r-lg xl:rounded-lg shadow-lg max-w-xs w-full md:w-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
          {t("filter")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="p-2 text-custom-dark-blue dark:text-custom-yellow hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
            title={t("reset_filters")}
          >
            {isDesktop && <span>{t("reset")}</span>}{" "}
            <RotateCcw className="w-7 h-7" />
          </button>
          {isTouchDevice && (
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeSidebar}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-9 w-9 text-custom-dark-blue dark:text-custom-yellow " />
            </motion.button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder={t("filterPlaceholder")}
          className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow dark:text-custom-yellow transition duration-300"
        />
      </div>

      {/* Alert Filter */}
      <div className="mb-6">
        <div className="flex flex-col gap-3 text-custom-dark-blue dark:text-custom-light-gray">
          <CustomCheckbox
            label={t("show_only_plants_with_alerts")}
            checked={filters.hasAlerts}
            onChange={() => handleCheckboxChange("hasAlerts")}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("type")}
        </h3>
        <div className="grid grid-cols-2 space-y-2 text-custom-dark-blue dark:text-custom-light-gray">
          {Object.keys(VICTRON_TYPES).map((type) => (
            <CustomCheckbox
              key={type}
              label={t(VICTRON_TYPES[type])}
              checked={filters.type.includes(type)}
              onChange={() => handleCheckboxChange("type", type)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("batteryStatusTitle")}
        </h3>
        <div className="flex flex-col gap-2 text-custom-dark-blue dark:text-custom-light-gray">
          {Object.entries(BATTERY_STATES).map(([status]) => (
            <CustomCheckbox
              key={status}
              label={t(status)}
              checked={filters.status.includes(status)}
              onChange={() => handleCheckboxChange("status", status)}
            />
          ))}
        </div>
      </div>

      {/* Installation Date Pickers */}
      <div className="mb-6 relative">
        <h3 className="text-lg text-custom-dark-blue dark:text-custom-yellow mb-2">
          {t("installationDate")}
        </h3>
        <div className="flex space-x-2">
          {/* From Date Picker */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-custom-dark-blue dark:text-custom-light-gray mb-1">
              {t("from")}
            </label>
            <div className="relative" ref={minDateInputRef}>
              <button
                onClick={() => {
                  setIsMaxDateSelectorOpen(false);
                  setIsMinDateSelectorOpen(!isMinDateSelectorOpen);
                }}
                className="w-full p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue dark:text-white flex items-center justify-between focus:ring-2 focus:ring-custom-yellow"
                type="button"
              >
                <span className="text-custom-dark-blue dark:text-custom-light-gray">
                  {filters.installationDate.min
                    ? new Date(
                        filters.installationDate.min
                      ).toLocaleDateString()
                    : t("selectDate")}
                </span>
                <BsCalendar3 className="text-custom-dark-blue dark:text-custom-light-gray" />
              </button>
              {isMinDateSelectorOpen && (
                <DateSelector
                  isOpen={isMinDateSelectorOpen}
                  onClose={() => setIsMinDateSelectorOpen(false)}
                  onSelect={(date) => handleDateChange("min", date)}
                  value={filters.installationDate.min}
                  parentRef={minDateInputRef}
                />
              )}
            </div>
          </div>

          {/* To Date Picker */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("to")}
            </label>
            <div className="relative" ref={maxDateInputRef}>
              <button
                onClick={() => {
                  setIsMinDateSelectorOpen(false);
                  setIsMaxDateSelectorOpen(!isMaxDateSelectorOpen);
                }}
                className="w-full p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-light-gray flex items-center justify-between focus:ring-2 focus:ring-custom-yellow"
                type="button"
              >
                <span className="text-custom-dark-blue dark:text-custom-light-gray">
                  {filters.installationDate.max
                    ? new Date(
                        filters.installationDate.max
                      ).toLocaleDateString()
                    : t("selectDate")}
                </span>
                <BsCalendar3 />
              </button>
              {isMaxDateSelectorOpen && (
                <DateSelector
                  isOpen={isMaxDateSelectorOpen}
                  onClose={() => setIsMaxDateSelectorOpen(false)}
                  onSelect={(date) => handleDateChange("max", date)}
                  value={filters.installationDate.max}
                  parentRef={maxDateInputRef}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictronFilterSidebar;
