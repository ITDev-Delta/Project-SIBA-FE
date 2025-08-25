import { useProfileContext } from "../context/profile_context";
import { permissionKey } from "../utils/permission_key";

export const usePermission = () => {
  const { profile } = useProfileContext();

  const hasPermission = (key: string): boolean => {
    const permission = permissionKey[key];
    return permission
      ? profile?.permissions?.includes(permission) || false
      : false;
  };

  const hasAnyPermission = (keys: string[]): boolean => {
    return keys.some((key) => hasPermission(key));
  };

  return {
    hasPermission,
    hasAnyPermission,
    permissions: profile?.permissions || [],
  };
};
