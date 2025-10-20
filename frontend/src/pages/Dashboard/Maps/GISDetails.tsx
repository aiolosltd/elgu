import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Download,
  Mail,
  Square,
  Image as ImageIcon,
  Calendar,
  Cloud,
  Type,
  Map,
} from "lucide-react";
import { useGoogleMapsLoader } from "@/services/useGoogleMapsLoader";

interface GISDetailsProps {
  onClose: () => void;
}

interface GalleryRef {
  url: string;
  label: string;
}

const GISDetails: React.FC<GISDetailsProps> = ({ onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");
  const [dateFromCompare, setDateFromCompare] = useState("2023-01-01");
  const [dateToCompare, setDateToCompare] = useState("2023-12-31");
  const [cloudPct, setCloudPct] = useState(10);
  const [summaryType, setSummaryType] = useState("vegetation");
  const [galleryImages, setGalleryImages] = useState<GalleryRef[]>([]);
  const [summaryText, setSummaryText] = useState("");
  const [, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(null);

  //   const { isLoaded, loadError } = useGoogleMapsLoader();
  const { isLoaded, error } = useGoogleMapsLoader();

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      loadMapCustom();
    }
  }, [isLoaded]);

  const loadMapCustom = () => {
    if (!mapRef.current || !window.google) return;

    const googleMap = new google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 14.5995, lng: 120.9842 },
      mapTypeId: "hybrid",
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    setMap(googleMap);

    // Initialize drawing manager for rectangles
    const drawingManagerInstance = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.RECTANGLE,
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      rectangleOptions: {
        fillColor: "#FF0000",
        fillOpacity: 0.1,
        strokeWeight: 2,
        strokeColor: "#FF0000",
        clickable: true,
        editable: true,
        draggable: true,
      },
      polygonOptions: {
        fillColor: "#00FF00",
        fillOpacity: 0.1,
        strokeWeight: 2,
        strokeColor: "#00FF00",
        clickable: true,
        editable: true,
        draggable: true,
      },
    });

    drawingManagerInstance.setMap(googleMap);
    setDrawingManager(drawingManagerInstance);

    // Listen for overlay completion
    google.maps.event.addListener(
      drawingManagerInstance,
      "overlaycomplete",
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
          const rectangle = event.overlay as google.maps.Rectangle;
          const bounds = rectangle.getBounds();
          console.log("Rectangle bounds:", bounds?.toJSON());

          localStorage.setItem(
            "selectedBounds",
            JSON.stringify(bounds?.toJSON())
          );
        }

        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const polygon = event.overlay as google.maps.Polygon;
          const path = polygon.getPath();
          const coordinates = path
            .getArray()
            .map((latLng: google.maps.LatLng) => ({
              lat: latLng.lat(),
              lng: latLng.lng(),
            }));
          console.log("Polygon coordinates:", coordinates);

          localStorage.setItem("selectedPolygon", JSON.stringify(coordinates));
        }
      }
    );
  };

  const handleDraw = () => {
    if (drawingManager) {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
    }
  };

  const handleSummary = () => {
    const dummySummary = `
      Value Change: +15.2%
      Summary: Vegetation index shows improvement compared to previous period.
      Insight: The area shows significant regrowth, likely due to recent conservation efforts.
      
      Analysis Parameters:
      - Date Range: ${dateFrom} to ${dateTo}
      - Comparison Range: ${dateFromCompare} to ${dateToCompare}
      - Cloud Coverage: ${cloudPct}%
      - Analysis Type: ${summaryType}
    `;

    const dummyGallery: GalleryRef[] = [
      {
        url: "https://via.placeholder.com/300x200/4CAF50/white?text=NDVI+Map",
        label: "NDVI Analysis",
      },
      {
        url: "https://via.placeholder.com/300x200/2196F3/white?text=Change+Detection",
        label: "Change Detection",
      },
      {
        url: "https://via.placeholder.com/300x200/FF9800/white?text=Land+Cover",
        label: "Land Cover Classification",
      },
    ];

    setSummaryText(dummySummary);
    setGalleryImages(dummyGallery);
  };

  const handleExportPDF = () => {
    const reportData = {
      summary: summaryText,
      parameters: {
        dateFrom,
        dateTo,
        dateFromCompare,
        dateToCompare,
        cloudPct,
        summaryType,
      },
      gallery: galleryImages,
    };

    console.log("Exporting PDF with data:", reportData);
    alert("PDF export functionality would connect to your backend service");
  };

  const handleExportWord = () => {
    console.log("Exporting Word document...");
    alert("Word export functionality would be implemented here");
  };

  const handleEmail = () => {
    console.log("Sending email with report...");
    alert("Email functionality would be implemented here");
  };

  const handleSummaryTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSummaryType(event.target.value);
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Failed to load Google Maps: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            GIS Analysis Details
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Analysis Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Compare Date From
              </label>
              <input
                type="date"
                value={dateFromCompare}
                onChange={(e) => setDateFromCompare(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} />
                Compare Date To
              </label>
              <input
                type="date"
                value={dateToCompare}
                onChange={(e) => setDateToCompare(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Cloud size={16} />
                Cloud Percentage
              </label>
              <input
                type="number"
                value={cloudPct}
                onChange={(e) => setCloudPct(Number(e.target.value))}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Type size={16} />
                Summary Type
              </label>
              <select
                value={summaryType}
                onChange={handleSummaryTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="vegetation">Vegetation</option>
                <option value="water">Water</option>
                <option value="urban">Urban</option>
                <option value="agriculture">Agriculture</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDraw}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Square size={16} />
              Draw AOI
            </button>
            <button
              onClick={handleSummary}
              className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Map size={16} />
              Generate Summary
            </button>
          </div>

          <div className="space-y-2 mt-4">
            <button
              onClick={handleExportPDF}
              disabled={!summaryText}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button
              onClick={handleExportWord}
              disabled={!summaryText}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={16} />
              Export Word
            </button>
            <button
              onClick={handleEmail}
              disabled={!summaryText}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Mail size={16} />
              Email Report
            </button>
          </div>
        </div>

        {/* Right Panel - Map and Results */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Map */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoaded ? (
              <div ref={mapRef} className="w-full h-full min-h-[400px]" />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </div>

          {/* Summary and Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-48 overflow-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Analysis Summary
              </h3>
              {summaryText ? (
                <pre className="text-sm text-gray-700 whitespace-pre-line font-sans">
                  {summaryText}
                </pre>
              ) : (
                <p className="text-gray-500 text-sm">
                  Click "Generate Summary" to see analysis results
                </p>
              )}
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-48 overflow-auto">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <ImageIcon size={18} />
                Gallery
              </h3>
              <div className="flex flex-wrap gap-2">
                {galleryImages.length > 0 ? (
                  galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => window.open(image.url, "_blank")}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors border border-gray-300"
                    >
                      {image.label}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No gallery images available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISDetails;
