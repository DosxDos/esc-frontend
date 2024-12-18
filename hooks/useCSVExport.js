import { useCallback } from "react";

const useCSVExport = () => {
  const downloadCSV = useCallback((data, filename = "data.csv") => {
    if (!data || data.length === 0) return;

    // Use the first row to get headers if they exist
    const headers = Object.keys(data[0]);

    // Create rows with consistent order of values
    const rows = data.map((row) =>
      headers.map((fieldName) => `"${row[fieldName] || 0}"`).join(",")
    );

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create a Blob with BOM for Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Create a link and trigger the download
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, []);

  return { downloadCSV };
};

export default useCSVExport;