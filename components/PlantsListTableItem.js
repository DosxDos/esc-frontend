import React from "react";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { PiSolarPanelFill } from "react-icons/pi";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import useDeviceType from "@/hooks/useDeviceType";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import {
  BsBatteryCharging,
  BsBatteryFull,
  BsBatteryHalf,
} from "react-icons/bs";

const PlantsListTableItem = ({ plant }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const { isMobile } = useDeviceType();
  const provider = plant.organization?.toLowerCase();

  const statusColors = {
    working: "bg-green-500",
    error: "bg-red-500",
    waiting: "bg-yellow-500",
    disconnected: "bg-gray-500",
  };

  const batteryStateIcons = {
    cargando: {
      icon: BsBatteryCharging,
      color: "text-green-500",
      size: "text-xl",
    },
    descargando: {
      icon: BsBatteryHalf,
      color: "text-red-500",
      size: "text-xl",
    },
    "en reposo": {
      icon: BsBatteryFull,
      color: "text-gray-400",
      size: "text-xl",
    },
  };

  const getBatteryStateLabel = (state) => {
    switch (state) {
      case "Cargando":
        return t("status.Cargando");
      case "Descargando":
        return t("status.Descargando");
      case "En reposo":
        return t("status.En reposo");
      default:
        return "";
    }
  };

  const handleClick = () => {
    router.push(`/dashboard/${userId}/plants/${provider}/${plant.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  // const getInstallationDate = () => {
  //   if (provider === "victronenergy") {
  //     return formatDate(plant.installation_date);
  //   }
  //   return "-";
  // };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "working":
        return t("status.working");
      case "error":
        return t("status.error");
      case "waiting":
        return t("status.waiting");
      case "disconnected":
        return t("status.disconnected");
      case "cargando":
        return t("Charging");
      case "descargando":
        return t("Discharging");
      case "en reposo":
        return t("Resting");
      default:
        return "";
    }
  };

  const statusTextColors = {
    working: "text-green-500",
    error: "text-red-500",
    waiting: "text-yellow-500",
    disconnected: "text-gray-500",
  };

  const parseAddress = (address) => {
    try {
      const parsed = JSON.parse(address);
      if (parsed?.center?.lat && parsed?.center?.lng) {
        return `Lat: ${parsed.center.lat.toFixed(
          2
        )}, Lng: ${parsed.center.lng.toFixed(2)}`;
      }
      if (parsed?.type === "circle" && parsed?.radius) {
        return `Radius: ${parsed.radius.toFixed(2)}m`;
      }
      return "N/A";
    } catch {
      return address || "N/A";
    }
  };

  const capitalize = (value) => {
    if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    return value;
  };

  return (
    <div className="overflow-hidden w-full mb-3 max-w-[85vw] md:max-w-[92vw] mx-auto">
      <div
        onClick={handleClick}
        className="bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 cursor-pointer"
      >
        <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 gap-3">
          {/* Left Side - Icon and Name */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-custom-yellow/10 rounded-full flex items-center justify-center">
                <PiSolarPanelFill className="text-xl sm:text-2xl text-custom-yellow drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-custom-dark-blue dark:text-custom-yellow truncate">
                {capitalizeWords(plant.name)}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                <FaLocationDot className="text-custom-yellow flex-shrink-0" />
                <p className="truncate max-w-full break-words">
                  {parseAddress(plant.address)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Status */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {provider === "victronenergy" ? (
              <div className="flex items-center gap-2 justify-center">
                {!isMobile && (
                  <span
                    className={`text-sm font-medium ${
                      batteryStateIcons[plant.status.toLowerCase()].color
                    }`}
                  >
                    {getBatteryStateLabel(plant.status)}
                  </span>
                )}
                {React.createElement(
                  batteryStateIcons[plant.status.toLowerCase()].icon,
                  {
                    className: `${
                      batteryStateIcons[plant.status.toLowerCase()].color
                    } ${batteryStateIcons[plant.status.toLowerCase()].size}`,
                  }
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <span
                    className={`text-sm font-medium ${
                      statusTextColors[plant.status.toLowerCase()] ||
                      "text-gray-500"
                    }`}
                  >
                    {getStatusText(plant.status)}
                  </span>
                )}
                <div
                  className={`w-3 h-3 rounded-full ${
                    statusColors[plant.status.toLowerCase()] || "bg-gray-500"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantsListTableItem;
