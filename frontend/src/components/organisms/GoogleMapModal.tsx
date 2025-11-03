import { useEffect, useRef, useState } from "react";
import { useGoogleMapsLoader } from "@/services/api/useGoogleMapsLoader";
import { Button } from "@/components/atoms/button";
import { Input } from '@/components/atoms/input';

export function GoogleMapModal({ 
  onClose, 
  onSelectLocation,
  initialAddress = ""
}: { 
  onClose: () => void; 
  onSelectLocation: (lat: number, lng: number, address: string) => void;
  initialAddress?: string;
}) {
    const { isLoaded, error } = useGoogleMapsLoader();
    const mapRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string>("");

    // Function to get address from coordinates
    const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
        if (!window.google) return "";
        
        try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat, lng } });
            
            if (response.results && response.results[0]) {
                return response.results[0].formatted_address;
            }
            return "";
        } catch (error) {
            console.error("Geocoding error:", error);
            return "";
        }
    };

    // Function to handle map click
    const handleMapClick = (mapInstance: google.maps.Map) => {
        mapInstance.addListener("click", async (mapsMouseEvent: google.maps.MapMouseEvent) => {
            if (!mapsMouseEvent.latLng) return;
            
            const lat = mapsMouseEvent.latLng.lat();
            const lng = mapsMouseEvent.latLng.lng();
            
            setCoords({ lat, lng });

            // Get address from coordinates
            const address = await getAddressFromCoords(lat, lng);
            setSelectedAddress(address);

            // Update marker
            if (marker) marker.setMap(null);
            const newMarker = new google.maps.Marker({
                position: { lat, lng },
                map: mapInstance,
            });
            setMarker(newMarker);
        });
    };

    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 10.7868, lng: 122.5894 }, // Leganes, Iloilo
            zoom: 14,
        });
        setMap(mapInstance);

        // Add click listener to map
        handleMapClick(mapInstance);

        if (searchInputRef.current) {
            const searchBox = new google.maps.places.SearchBox(searchInputRef.current);

            // Attach search box to top center of map
            mapInstance.controls[google.maps.ControlPosition.TOP_CENTER].push(
                searchInputRef.current
            );

            searchBox.addListener("places_changed", async () => {
                const places = searchBox.getPlaces();
                if (!places || places.length === 0) return;

                const place = places[0];
                if (!place.geometry?.location) return;

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                setCoords({ lat, lng });

                // Get address from the selected place
                const address = place.formatted_address || "";
                setSelectedAddress(address);

                if (marker) marker.setMap(null);
                const newMarker = new google.maps.Marker({
                    position: { lat, lng },
                    map: mapInstance,
                });
                setMarker(newMarker);
                mapInstance.setCenter({ lat, lng });
                mapInstance.setZoom(16);
            });
        }
    }, [isLoaded]);

    const handleSave = async () => {
        if (coords) {
            let finalAddress = selectedAddress;
            
            // If no address from search/click, try to get one from coordinates
            if (!finalAddress) {
                finalAddress = await getAddressFromCoords(coords.lat, coords.lng);
            }
            
            onSelectLocation(coords.lat, coords.lng, finalAddress);
            onClose();
        }
    };

    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white w-full h-full flex flex-col relative rounded-none">
                {/* Header with Search Bar */}
                <div className="absolute top-0 left-0 w-full bg-white z-20 p-4 shadow-md">
                    <div className="flex justify-center">
                        <Input
                            ref={searchInputRef}
                            id="search-box"
                            placeholder="Search for places..."
                            className="p-3 rounded-lg shadow-md bg-white focus:outline-none border border-gray-300"
                            style={{
                                width: "700px", 
                                maxWidth: "90%", 
                            }}
                        />
                    </div>
                </div>

                {/* Map */}
                <div ref={mapRef} className="flex-1 w-full h-full mt-16" />

                {/* Footer with Buttons at Bottom */}
                <div className="absolute bottom-0 left-0 w-full bg-white z-20 p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex-1">
                            {selectedAddress && (
                                <div className="text-sm text-gray-600">
                                    <strong>Selected Location:</strong> {selectedAddress}
                                </div>
                            )}
                            {coords && (
                                <div className="text-xs text-gray-500">
                                    Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="bg-gray-200 hover:bg-gray-300 px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={!coords}
                                className="px-6"
                            >
                                Save Location
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}