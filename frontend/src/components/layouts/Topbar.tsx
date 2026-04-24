import { useState } from "react";

import {
  Search,
  LogIn,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../features/auth/AuthContext";
import { useAuthModal } from "../../features/auth/AuthModalContext";

import Avatar from "../../features/auth/Avatar";
import ProfileMenu from "../../features/auth/ProfileMenu";
import ProfileSettingsModal from "../../features/auth/ProfileSettingsModal";

interface Props {
  search: string;

  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;
}

const Topbar = ({
  search,
  setSearch,
}: Props) => {
  const { user } =
    useAuth();

  const {
    setOpen,
    setMode,
  } = useAuthModal();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false);

  const openLogin =
    () => {
      setMode("login");
      setOpen(true);
    };

  const toggleMenu =
    () => {
      setMenuOpen(
        (prev) => !prev
      );
    };

  const openSettings =
    () => {
      setSettingsOpen(true);
      setMenuOpen(false);
    };

  const closeSettings =
    () => {
      setSettingsOpen(false);
    };

  return (
    <>
      <div className="topbar">
        <div className="topbar-brand">
          <h1 className="topbar-title">
            STEAM100
          </h1>

          <p className="topbar-subtitle">
            PLAYER ACTIVITY & PERFORMANCE INDEX
          </p>
        </div>

        <div className="topbar-actions">
          <div className="search-box">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="SEARCH..."
              className="search-input"
            />
          </div>

          {user ? (
            <div className="profile-wrap">
              <button
                className="profile-trigger"
                onClick={
                  toggleMenu
                }
              >
                <Avatar size="sm" />

                <span className="profile-trigger-name">
                  {user.username}
                </span>

                <ChevronDown
                  size={16}
                  className={
                    menuOpen
                      ? "rotate"
                      : ""
                  }
                />
              </button>

              {menuOpen && (
                <ProfileMenu
                  onManage={
                    openSettings
                  }
                />
              )}
            </div>
          ) : (
            <button
              onClick={
                openLogin
              }
              className="login-btn"
            >
              <LogIn size={18} />
              LOGIN
            </button>
          )}
        </div>
      </div>

      <ProfileSettingsModal
        isOpen={
          settingsOpen
        }
        onClose={
          closeSettings
        }
      />
    </>
  );
};

export default Topbar;