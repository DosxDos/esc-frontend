"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  fetchGoodweWeatherData,
  selectWeatherData,
  selectWeatherLoading,
  selectWeatherError,
  fetchSolarEdgeWeatherData,
  fetchVictronEnergyWeatherData,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import {
  BsSun,
  BsCloudSun,
  BsCloud,
  BsCloudRain,
  BsCloudRainHeavy,
  BsCloudDrizzle,
  BsCloudSnow,
  BsSnow,
  BsCloudLightningRain,
  BsCloudFog,
} from "react-icons/bs";
import { WiDayFog, WiNightAltThunderstorm } from "react-icons/wi";
import useDeviceType from "@/hooks/useDeviceType";
import WeatherSkeleton from "@/components/loadingSkeletons/WeatherSkeleton";
import { selectTheme } from "@/store/slices/themeSlice";

const WEATHER_ICONS = {
  0: BsSun, // Clear sky
  1: BsSun, // Mainly clear
  2: BsCloudSun, // Partly cloudy
  3: BsCloudSun, // Overcast
  45: WiDayFog, // Fog
  48: WiDayFog, // Depositing rime fog
  51: BsCloudDrizzle, // Light drizzle
  53: BsCloudDrizzle, // Moderate drizzle
  55: BsCloudDrizzle, // Dense drizzle
  56: BsCloudRain, // Light freezing drizzle
  57: BsCloudRain, // Dense freezing drizzle
  61: BsCloudRain, // Slight rain
  63: BsCloudRainHeavy, // Moderate rain
  65: BsCloudRainHeavy, // Heavy rain
  66: BsCloudRain, // Light freezing rain
  67: BsCloudRainHeavy, // Heavy freezing rain
  71: BsSnow, // Slight snowfall
  73: BsCloudSnow, // Moderate snowfall
  75: BsCloudSnow, // Heavy snowfall
  77: BsSnow, // Snow grains
  80: BsCloudRain, // Slight rain showers
  81: BsCloudRainHeavy, // Moderate rain showers
  82: BsCloudLightningRain, // Violent rain showers
  85: BsCloudSnow, // Slight snow showers
  86: BsCloudSnow, // Heavy snow showers
  95: WiNightAltThunderstorm, // Thunderstorm
  96: WiNightAltThunderstorm, // Thunderstorm with light hail
  99: WiNightAltThunderstorm, // Thunderstorm with heavy hail
};

const MAX_RETRY_COUNT = 5;
const RETRY_DELAY = 2000;

const WeatherWidget = ({ plant, address, provider, lat, lng }) => {
  const dispatch = useDispatch();
  const weatherData = useSelector(selectWeatherData);
  const weatherLoading = useSelector(selectWeatherLoading);
  const weatherError = useSelector(selectWeatherError);
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const token = useMemo(() => user?.tokenIdentificador, [user]);
  const theme = useSelector(selectTheme);
  const { isDesktop } = useDeviceType();
  const [retryCount, setRetryCount] = useState(0);

  const fetchWeatherData = useCallback(() => {
    if (
      (provider === "victronenergy" && (!lat || !lng || !token)) ||
      (provider !== "victronenergy" && (!address || !provider || !token))
    ) {
      console.warn("Missing required data. Waiting for user data...");
      return;
    }

    switch (provider.toLowerCase()) {
      case "goodwe":
      case "energia y calor solar del atlantico sl":
        dispatch(fetchGoodweWeatherData({ name: address, token }));
        break;
      case "solaredge":
        dispatch(fetchSolarEdgeWeatherData({ name: address, token }));
        break;
      case "victronenergy":
        dispatch(fetchVictronEnergyWeatherData({ lat, lng, token }));
        break;
      default:
        console.warn(`Unsupported provider: ${provider}`);
    }
  }, [dispatch, address, token, provider, lat, lng]);

  // Initial fetch
  useEffect(() => {
    if (retryCount === 0) fetchWeatherData();
  }, [fetchWeatherData, retryCount]);

  // Retry logic
  useEffect(() => {
    let retryTimeout;
    if (weatherError && retryCount < MAX_RETRY_COUNT) {
      retryTimeout = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        fetchWeatherData();
      }, RETRY_DELAY);
    }
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [weatherError, retryCount, fetchWeatherData]);

  // Reset retry count when dependencies change
  useEffect(() => {
    setRetryCount(0);
  }, [address, token, provider, lat, lng]);

  const getWeatherIcon = useCallback((code, isToday = false) => {
    const sizeClass = isToday
      ? "text-8xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]"
      : "text-4xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]";
    const commonClass = `${sizeClass} text-custom-dark-blue dark:text-custom-yellow`;

    const IconComponent = WEATHER_ICONS[code] || BsCloud;

    return <IconComponent className={commonClass} />;
  }, []);

  if (weatherLoading) {
    return <WeatherSkeleton theme={theme} />;
  }

  return (
    <div className="relative bg-white/50 dark:bg-custom-dark-blue/50 shadow-lg rounded-lg p-4 md:p-6 transition-all duration-300 backdrop-blur-sm flex flex-col h-full flex-1 2xl:min-w-[40vw]">
      <h2 className="text-xl font-semibold text-custom-dark-blue dark:text-custom-yellow mb-4">
        {t("weatherForecast")}
      </h2>

      {weatherError ? (
        <p className="text-center text-red-500">{t("failedToFetchWeather")}</p>
      ) : (
        weatherData && (
          <div className="flex flex-1 flex-col">
            {/* Today's Weather */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md flex items-center justify-between flex-1 relative group overflow-hidden">
              <div className="absolute inset-0 z-0 overflow-hidden rounded-lg pointer-events-none">
                <div
                  className="absolute w-full h-full blur-2xl transition-opacity duration-700"
                  style={{
                    background:
                      theme === "dark"
                        ? "linear-gradient(45deg, rgba(255, 213, 122, 0.2), rgba(0, 44, 63, 0.1))"
                        : "linear-gradient(45deg, rgba(0, 44, 63, 0.1), rgba(255, 213, 122, 0.2))",
                  }}
                />
              </div>

              <div className="flex relative z-10">
                <p className="text-xl text-left text-slate-600 dark:text-slate-300">
                  {t("today")}
                </p>
                <div className="flex justify-center h-full items-center">
                  {getWeatherIcon(weatherData?.daily?.weather_code?.[0], true)}
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-4xl font-bold text-custom-dark-blue dark:text-custom-yellow">
                  {Math.round(weatherData?.current?.temperature_2m || 0)}°C
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  {t("wind")}:{" "}
                  {Math.round(weatherData?.current?.wind_speed_10m)} km/h
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {t("humidity")}:{" "}
                  {Math.round(weatherData?.current?.relative_humidity_2m)}%
                </p>
              </div>
            </div>

            {/* Forecast */}
            <div className="flex-1 grid grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
              {weatherData?.daily?.time
                ?.slice(1, isDesktop ? 4 : 3)
                .map((date, index) => (
                  <div
                    key={date}
                    className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center shadow-md flex-1"
                  >
                    <div className="flex flex-col">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {new Date(date).toLocaleDateString("es-ES", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-md font-semibold text-custom-dark-blue dark:text-custom-yellow">
                        {Math.round(
                          weatherData?.daily?.temperature_2m_min?.[index + 1] ||
                            0
                        )}
                        °/
                        {Math.round(
                          weatherData?.daily?.temperature_2m_max?.[index + 1] ||
                            0
                        )}
                        °C
                      </p>
                    </div>
                    <div className="flex justify-center mt-2">
                      {getWeatherIcon(
                        weatherData?.daily?.weather_code?.[index + 1]
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherWidget;
