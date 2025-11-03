// src/hooks/usePhilippineAddress.ts
import { useState, useMemo } from 'react';
import { psgc } from 'ph-locations';

interface LocationOption {
  value: string;
  label: string;
}

export const usePhilippineAddress = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // ✅ Get all provinces
  const provinceOptions: LocationOption[] = useMemo(() => {
    console.log('✅ PSGC Provinces loaded:', psgc.provinces.length);
    console.log('🧩 Sample provinces:', psgc.provinces.slice(0, 3));

    return psgc.provinces
      .map((province) => ({
        value: province.code,
        label: province.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // ✅ Get cities/municipalities based on selected province
  const cityOptions: LocationOption[] = useMemo(() => {
    if (!selectedProvince) {
      console.log('⚠️ No province selected, skipping city loading.');
      return [];
    }

    console.log('🏙️ Selected province code:', selectedProvince);
    const provinceData = psgc.provinces.find((p) => p.code === selectedProvince);
    console.log('🔍 Found province data:', provinceData);

    if (!provinceData) {
      console.log('❌ Province not found with code:', selectedProvince);
      return [];
    }

    // ✅ Filter logic (flexible for NCR & other cases)
    const filteredCities = psgc.citiesMunicipalities.filter((city) => {
      const matchExact = city.province === selectedProvince;
      const matchPartial = city.province.startsWith(selectedProvince.slice(0, 4));
      if (matchExact || matchPartial) {
        console.log(`✅ City matched: ${city.name} (${city.code}) — Province: ${city.province}`);
      }
      return matchExact || matchPartial;
    });

    console.log(`🏙️ Found ${filteredCities.length} cities for ${provinceData.name}`);
    if (filteredCities.length > 0) {
      console.log('🧩 Sample cities:', filteredCities.slice(0, 3));
    } else {
      console.log('⚠️ No cities found — possible province code mismatch.');
    }

    return filteredCities
      .map((city) => ({
        value: city.code,
        label: city.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedProvince]);

  // ✅ Barangays (placeholder)
  const barangayOptions: LocationOption[] = useMemo(() => {
    if (!selectedCity) return [];

    console.log('📍 Selected city code:', selectedCity);
    return [
      { value: 'sample-1', label: 'Sample Barangay 1' },
      { value: 'sample-2', label: 'Sample Barangay 2' },
      { value: 'sample-3', label: 'Sample Barangay 3' },
    ];
  }, [selectedCity]);

  // ✅ Province change
  const handleProvinceChange = (provinceCode: string) => {
    // console.log('🔁 Province changed to code:', provinceCode);
    // const province = psgc.provinces.find((p) => p.code === provinceCode);
    // console.log('📦 Province name:', province?.name);
    setSelectedProvince(provinceCode);
    setSelectedCity(''); // reset city
  };

  // ✅ City change
  const handleCityChange = (cityCode: string) => {
    // console.log('🏙️ City changed to code:', cityCode);
    // const city = psgc.citiesMunicipalities.find((c) => c.code === cityCode);
    // console.log('📦 City name:', city?.name);
    setSelectedCity(cityCode);
  };

  // ✅ Helpers
  const getProvinceName = (code: string) => {
    const province = psgc.provinces.find((p) => p.code === code);
    return province?.name || code;
  };

  const getCityName = (code: string) => {
    const city = psgc.citiesMunicipalities.find((c) => c.code === code);
    return city?.name || code;
  };

  return {
    provinceOptions,
    cityOptions,
    barangayOptions,
    selectedProvince,
    selectedCity,
    selectedProvinceName: getProvinceName(selectedProvince),
    selectedCityName: getCityName(selectedCity),
    handleProvinceChange,
    handleCityChange,
    getProvinceName,
    getCityName,
  };
};
