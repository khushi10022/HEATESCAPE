import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCities, fetchZones, fetchMaterials, fetchZoneCooling, fetchModelMeta } from '../api/client';

const CityDataContext = createContext(null);

const DEFAULT_CITY_ID = 'delhi-ncr';

export function CityDataProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(DEFAULT_CITY_ID);
  const [zones, setZones] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [modelMeta, setModelMeta] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [cooling, setCooling] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the city list + shared materials table once
  useEffect(() => {
    async function loadGlobal() {
      try {
        const [cityList, materialData] = await Promise.all([fetchCities(), fetchMaterials()]);
        setCities(cityList);
        setMaterials(materialData);
      } catch (err) {
        setLoadError(
          'Could not reach the HEATESCAPE backend. Make sure the API server is running on port 8000.'
        );
      }
    }
    loadGlobal();
  }, []);

  // Load zones + model meta whenever the selected city changes
  useEffect(() => {
    if (!selectedCityId) return;
    setLoading(true);
    async function loadCity() {
      try {
        const [zoneData, meta] = await Promise.all([
          fetchZones(selectedCityId),
          fetchModelMeta(selectedCityId),
        ]);
        setZones(zoneData);
        setModelMeta(meta);
        setSelectedZoneId(zoneData.length > 0 ? zoneData[0].zone_id : null);
        setLoadError(null);
      } catch (err) {
        setLoadError(`Could not load data for "${selectedCityId}".`);
      } finally {
        setLoading(false);
      }
    }
    loadCity();
  }, [selectedCityId]);

  // Load cooling simulation whenever the selected zone changes
  useEffect(() => {
    if (!selectedCityId || !selectedZoneId) {
      setCooling([]);
      return;
    }
    fetchZoneCooling(selectedCityId, selectedZoneId)
      .then(setCooling)
      .catch(() => setCooling([]));
  }, [selectedCityId, selectedZoneId]);

  const selectCity = useCallback((cityId) => {
    setSelectedCityId(cityId);
  }, []);

  const selectZone = useCallback((zoneId) => {
    setSelectedZoneId(zoneId);
  }, []);

  const selectedCity = cities.find((c) => c.city_id === selectedCityId) || null;
  const selectedZone = zones.find((z) => z.zone_id === selectedZoneId) || null;

  const value = {
    cities,
    selectedCity,
    selectedCityId,
    selectCity,
    zones,
    selectedZone,
    selectedZoneId,
    selectZone,
    materials,
    modelMeta,
    cooling,
    loadError,
    loading,
  };

  return <CityDataContext.Provider value={value}>{children}</CityDataContext.Provider>;
}

export function useCityData() {
  const ctx = useContext(CityDataContext);
  if (!ctx) {
    throw new Error('useCityData must be used within a CityDataProvider');
  }
  return ctx;
}
