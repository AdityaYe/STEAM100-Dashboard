import { useEffect, useState } from "react";

import {
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../features/auth/AuthContext";

interface Props {
  onManage: () => void;
}

const ProfileMenu = ({
  onManage,
}: Props) => {
  const { user, logout } =
    useAuth();

  const [
    isCompact,
    setIsCompact,
  ] = useState(
    window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize =
      () => {
        setIsCompact(
          window.innerWidth <=
            1024
        );
      };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return (
    <div className="profile-dropdown">
      {isCompact && user && (
        <div className="profile-dropdown-user">
          {user.username}
        </div>
      )}

      <button
        className="profile-dropdown-item"
        onClick={onManage}
      >
        <Settings size={16} />
        Manage Profile
      </button>

      <button
        className="profile-dropdown-item"
        onClick={logout}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;