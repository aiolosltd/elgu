// components/GISDetails.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  Mail,
  Square,
  Image as ImageIcon,
  Calendar,
  Cloud,
  Type,
  Map,
  BarChart3,
  Home
} from "lucide-react";
import { useGoogleMapsLoader } from "@/services/api/useGoogleMapsLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface GISDetailsProps {
  onClose?: () => void;
}

interface GalleryRef {
  url: string;
  label: string;
}

const GISDetails: React.FC<GISDetailsProps> = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");
  const [dateFromCompare, setDateFromCompare] = useState("2023-01-01");
  const [dateToCompare, setDateToCompare] = useState("2023-12-31");
  const [cloudPct, setCloudPct] = useState(10);
  const [summaryType, setSummaryType] = useState("vegetation");
  const [galleryImages, setGalleryImages] = useState<GalleryRef[]>([]);
  const [summaryText, setSummaryText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  const { isLoaded, error } = useGoogleMapsLoader();

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      loadMapCustom();
    }
  }, [isLoaded]);

  const loadMapCustom = () => {
    if (!mapRef.current || !window.google) return;

    const googleMap = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 10.7868, lng: 122.5894 }, // Leganes coordinates
      mapTypeId: "hybrid",
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
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
          localStorage.setItem("selectedBounds", JSON.stringify(bounds?.toJSON()));
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

  const handleSummary = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dummySummary = `
🌿 **Vegetation Analysis Report**
📍 **Area of Interest**: Leganes, Iloilo
📅 **Analysis Period**: ${dateFrom} to ${dateTo}
📊 **Comparison Period**: ${dateFromCompare} to ${dateToCompare}

**Key Findings:**
✅ **Vegetation Health**: +15.2% improvement
✅ **Green Coverage**: Increased by 8.7%
⚠️ **Areas of Concern**: 2 locations showing decline

**Detailed Analysis:**
• NDVI Index: 0.65 (Healthy)
• Change Detection: Positive trend in 85% of area
• Cloud Coverage: ${cloudPct}% (Optimal)

**Recommendations:**
1. Continue current conservation efforts
2. Monitor areas showing decline
3. Consider reforestation in identified zones
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
    setIsGenerating(false);
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



  const handleGoToMainMap = () => {
    window.location.href = '/satelite-map';
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
            Failed to load Google Maps: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">GIS Analysis Dashboard</h1>
              <p className="text-muted-foreground">Complete spatial analysis and reporting tools for Leganes Business Map</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleGoToMainMap}>
              <Home className="h-4 w-4 mr-2" />
              Main Map
            </Button>
           
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Parameters</CardTitle>
                <CardDescription>Configure your GIS analysis settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date From
                  </Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateTo" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date To
                  </Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFromCompare" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Compare Date From
                  </Label>
                  <Input
                    id="dateFromCompare"
                    type="date"
                    value={dateFromCompare}
                    onChange={(e) => setDateFromCompare(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateToCompare" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Compare Date To
                  </Label>
                  <Input
                    id="dateToCompare"
                    type="date"
                    value={dateToCompare}
                    onChange={(e) => setDateToCompare(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cloudPct" className="flex items-center gap-2">
                    <Cloud className="h-4 w-4" />
                    Cloud Percentage
                  </Label>
                  <Input
                    id="cloudPct"
                    type="number"
                    value={cloudPct}
                    onChange={(e) => setCloudPct(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summaryType" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Analysis Type
                  </Label>
                  <Select value={summaryType} onValueChange={setSummaryType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetation">Vegetation Analysis</SelectItem>
                      <SelectItem value="water">Water Bodies</SelectItem>
                      <SelectItem value="urban">Urban Development</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="business">Business Density</SelectItem>
                      <SelectItem value="compliance">Compliance Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <Button onClick={handleDraw} variant="outline" className="flex-1">
                    <Square className="h-4 w-4 mr-2" />
                    Draw AOI
                  </Button>
                  <Button 
                    onClick={handleSummary} 
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Map className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <Progress value={65} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Processing satellite imagery and business data...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {summaryText && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportWord}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Word Document
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Map and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Analysis Map - Leganes, Iloilo
                </CardTitle>
                <CardDescription>Draw areas of interest on the map for spatial analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div ref={mapRef} className="w-full h-96 rounded-b-lg" />
              </CardContent>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-1 gap-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summaryText ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge variant="default">Analysis Complete</Badge>
                        <Badge variant="secondary">{summaryType}</Badge>
                        <Badge variant="outline">Leganes Area</Badge>
                      </div>
                      <pre className="text-sm whitespace-pre-line font-sans bg-muted/50 p-4 rounded-lg">
                        {summaryText}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No Analysis Generated</p>
                      <p className="text-sm">Configure parameters and click "Generate Report" to see analysis results</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gallery */}
              {galleryImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Analysis Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {galleryImages.map((image, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                          <div className="aspect-video bg-muted flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-center">{image.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISDetails;