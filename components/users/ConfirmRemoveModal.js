import React from "react";
import { AlertTriangle } from "lucide-react";
import Texture from "@/components/Texture";
import Modal from "@/components/ui/Modal";

const ConfirmRemoveModal = ({ isOpen, plant, onClose, onConfirm, t }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="relative max-w-md rounded-2xl bg-gradient-to-br from-white/90 to-white/50 
      dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 backdrop-blur-lg shadow-xl"
    >
      <Texture className="opacity-30" />
      <div className="relative z-10 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full 
        bg-red-100 dark:bg-red-900/30"
        >
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-200" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-custom-dark-blue dark:text-custom-yellow">
          {t("confirmRemovePlant")}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t("removePlantConfirmText", { plantName: plant?.name })}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 
            dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
            transition-colors"
          >
            {t("remove")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmRemoveModal;
