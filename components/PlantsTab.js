"use client";

import React, { useEffect, useState } from "react";
import AddPlantForm from "./AddPlantForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import FilterInput from "@/components/FilterInput";
import SortMenu from "@/components/SortMenu";
import Pagination from "@/components/Pagination";
import useFilter from "@/hooks/useFilter";
import useSort from "@/hooks/useSort";
import PlantCard from "@/components/PlantCard";
import PlantsMapModal from "@/components/PlantsMapModal";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import Loading from "./Loading";
import { PiSolarPanelFill, PiSolarPanelThin } from "react-icons/pi";
import PlantStatuses from "./PlantStatuses";
import Image from "next/image";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Texture from "./Texture";

const PlantsTab = () => {
  const { t } = useTranslation();
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 6;

  const { filteredItems: filteredPlants, filterItems } = useFilter(
    plants,
    "name"
  );
  const { sortedItems: sortedPlants, sortItems } = useSort(filteredPlants);

  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        const response = await fetch("/plants.json");
        const data = await response.json();
        setPlants(data.plants);
      } catch (error) {
        console.error("Error fetching the plants data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlantsData();
  }, []);

  useEffect(() => {
    if (!isLoading && plants.length > 0) {
      setIsDataReady(true);
    }
  }, [isLoading, plants]);

  const handleAddPlantClick = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const openMap = () => {
    setIsMapOpen(true);
  };

  const closeMap = () => {
    setIsMapOpen(false);
  };

  const totalPages = Math.ceil(sortedPlants.length / plantsPerPage);
  const startIndex = (currentPage - 1) * plantsPerPage;
  const paginatedPlants = sortedPlants.slice(
    startIndex,
    startIndex + plantsPerPage
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative p-8 md:p-10 h-auto z-10">
      <Texture />
      <div className="flex items-center mb-10 md:mb-2 z-10">
        <Image
          src={companyIcon}
          alt="Company Icon"
          className="w-12 h-12 mr-2 z-10"
        />
        <h2 className="z-10 text-4xl dark:text-custom-yellow text-custom-dark-blue">
          {t("plants")}
        </h2>
      </div>
      <AddPlantForm onClose={closeForm} isOpen={isFormOpen} />
      <PlantsMapModal
        isOpen={isMapOpen}
        onClose={closeMap}
        plants={sortedPlants}
      />
      <FilterInput onFilterChange={filterItems} />
      <div className="flex flex-col md:flex-row md:justify-between z-30">
        <div className="flex gap-4 justify-start mb-6 md:mb-0">
          <SortMenu onSortChange={sortItems} />
          <button
            onClick={openMap}
            className="z-30 bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg flex-shrink-0 button-shadow"
          >
            <FaMapMarkedAlt className="text-2xl" />
          </button>
        </div>
        <PlantStatuses />
      </div>
      {paginatedPlants.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 my-10">
            {paginatedPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>

          {sortedPlants.length > plantsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="h-auto w-full flex flex-col justify-center items-center">
          <PiSolarPanelFill className="mt-24 text-center text-9xl text-custom-dark-blue dark:text-custom-light-gray" />
          <p className="text-center text-lg text-custom-dark-blue dark:text-custom-light-gray">
            {t("noPlantsFound")}
          </p>
        </div>
      )}
      <button
        onClick={handleAddPlantClick}
        className="fixed bottom-20 right-4 md:right-10 w-12 h-12 bg-custom-yellow text-custom-dark-blue rounded-full flex items-center justify-center transition-colors duration-300 button-shadow"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PlantsTab;
