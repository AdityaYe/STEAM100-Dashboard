import {
  Settings,
  LogOut,
} from "lucide-react";

import { useAuth } from "./AuthContext";

interface Props {
  onManage: () => void;
}

const ProfileMenu = ({
  onManage,
}: Props) => {
  const { logout } =
    useAuth();

  return (
    <div className="profile-dropdown">
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