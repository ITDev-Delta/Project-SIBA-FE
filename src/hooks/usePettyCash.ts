import type { ISettingPettyCash } from "../api/Accounting/types/settingPettyCash.interface";
import { useProfileContext } from "../context/profile_context";

export const usePettyCashPermission = () => {
  const { profile } = useProfileContext();

  const hasPettyCashPermissions = (pettyCashId: string | number): boolean => {
    if (!profile?.petty_cash || !pettyCashId) {
      return false;
    }
    return profile.petty_cash.some(
      (permission) => permission.petty_cash_settings_id === String(pettyCashId)
    );
  };

  const hasAnyPettyCashPermission = (
    pettyCashIds: (string | number)[]
  ): boolean => {
    return pettyCashIds.some((id) => hasPettyCashPermissions(id));
  };

  /**
   * Menyaring sebuah array Petty Cash berdasarkan hak akses user.
   * @param allPettyCash Array berisi semua objek Petty Cash.
   * @returns Array baru yang hanya berisi Petty Cash yang diizinkan untuk user.
   */
  const filterPettyCash = <T extends ISettingPettyCash>(
    allPettyCash: T[]
  ): T[] => {
    if (!Array.isArray(allPettyCash)) {
      return []; // Kembalikan array kosong jika input tidak valid
    }
    return allPettyCash.filter((pettyCash) =>
      hasPettyCashPermissions(pettyCash.id)
    );
  };

  return {
    hasPettyCashPermissions,
    hasAnyPettyCashPermission,
    filterPettyCash,
    locations: profile?.location || [],
  };
};
