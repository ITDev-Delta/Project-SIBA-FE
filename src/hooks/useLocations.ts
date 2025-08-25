import type { ILocation } from "../api/Master/types/location.interface";
import { useProfileContext } from "../context/profile_context";

export const useLocationPermission = () => {
  const { profile } = useProfileContext();

  const hasLocationPermission = (locationId: string | number): boolean => {
    if (!profile?.location || !locationId) {
      return false;
    }
    return profile.location.some(
      (permission) => permission.master_warehouse_id === String(locationId)
    );
  };

  const hasAnyLocationPermission = (
    locationIds: (string | number)[]
  ): boolean => {
    return locationIds.some((id) => hasLocationPermission(id));
  };

  /**
   * Menyaring sebuah array lokasi berdasarkan hak akses user.
   * @param allLocations Array berisi semua objek lokasi.
   * @returns Array baru yang hanya berisi lokasi yang diizinkan untuk user.
   */
  const filterLocations = <T extends ILocation>(allLocations: T[]): T[] => {
    if (!Array.isArray(allLocations)) {
      return []; // Kembalikan array kosong jika input tidak valid
    }
    return allLocations.filter((location) =>
      hasLocationPermission(location.id)
    );
  };

  return {
    hasLocationPermission,
    hasAnyLocationPermission,
    filterLocations,
    locations: profile?.location || [],
  };
};
