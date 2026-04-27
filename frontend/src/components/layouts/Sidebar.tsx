import { useState, useEffect } from "react";

import {
  Home,
  LogIn,
  UserPlus,
  LogOut,
  Heart,
  Filter,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import Avatar from "../../features/auth/Avatar";
import { useAuth } from "../../features/auth/AuthContext";
import { useAuthModal } from "../../features/auth/AuthModalContext";

type Props = {
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<
    React.SetStateAction<string[]>
  >;
};

const GENRES = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Simulation",
  "Sports",
  "Indie",
  "Casual",
];

const NAV_ITEMS = [
  {
    icon: Home,
    label: "Home",
    path: "/",
  },
  {
    icon: Heart,
    label: "Favorites",
    path: "/favorites",
  },
];

const Sidebar = ({
  selectedGenres,
  setSelectedGenres,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const {
    setOpen,
    setMode,
  } = useAuthModal();

  const [
    isCollapsed,
    setIsCollapsed,
  ] = useState(true);

  const [
    width,
    setWidth,
  ] = useState(window.innerWidth);

  useEffect(() => {
    const resize = () =>
      setWidth(window.innerWidth);

    window.addEventListener(
      "resize",
      resize
    );

    return () =>
      window.removeEventListener(
        "resize",
        resize
      );
  }, []);

  /* breakpoints */
  const isMobile = width <= 767;
  const isTablet =
    width >= 768 &&
    width <= 1024;

  /* behavior */
  const collapsed = isMobile
    ? true
    : isCollapsed;

  const openLogin = () => {
    setMode("login");
    setOpen(true);
  };

  const openRegister = () => {
    setMode("register");
    setOpen(true);
  };

  const openSidebar = () =>
    setIsCollapsed(false);

  const closeSidebar = () =>
    setIsCollapsed(true);

  const isActive = (
    path: string
  ) => {
    if (path === "/") {
      return (
        location.pathname === "/"
      );
    }

    return (
      location.pathname === path
    );
  };

  const toggleGenre = (
    genre: string
  ) => {
    const updated =
      selectedGenres.includes(
        genre
      )
        ? selectedGenres.filter(
            (g) => g !== genre
          )
        : [
            ...selectedGenres,
            genre,
          ];

    setSelectedGenres(
      updated
    );
  };

  return (
    <div
      className={`sidebar-root h-screen flex flex-col transition-all duration-300 ${
        collapsed
          ? "w-16"
          : "w-64"
      }`}
    >
      {/* TOP */}
      <div className="sidebar-top sidebar-section">
        {user && (
          <div className="sidebar-profile-section">
            {collapsed ? (
              <div className="sidebar-profile-collapsed">
                <Avatar size="sm" />
              </div>
            ) : (
              <div className="sidebar-profile-display">
                <Avatar size="sm" />

                <div className="sidebar-profile-meta">
                  <div className="sidebar-profile-name">
                    {user.username}
                  </div>

                  <div className="sidebar-profile-sub">
                    SIGNED IN
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NAV */}
        {NAV_ITEMS.map(
          ({
            icon: Icon,
            label,
            path,
          }) => (
            <button
              key={label}
              onClick={() =>
                navigate(path)
              }
              className={`sidebar-nav-btn ${
                isActive(path)
                  ? "active-item glow"
                  : "hover-retro"
              }`}
            >
              <Icon size={20} />

              {!collapsed && (
                <span>
                  {label}
                </span>
              )}
            </button>
          )
        )}
      </div>

      {/* GENRES */}
      <div className="sidebar-section">
        <div
          onClick={() => {
            if (collapsed)
              openSidebar();
          }}
          className="sidebar-genres-trigger cursor-pointer"
        >
          <Filter size={16} />

          {!collapsed && (
            <span>
              GENRES
            </span>
          )}
        </div>

        {!collapsed && (
          <div className="mt-2 space-y-1">
            {GENRES.map(
              (genre) => {
                const checked =
                  selectedGenres.includes(
                    genre
                  );

                return (
                  <label
                    key={genre}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm tracking-wider cursor-pointer hover-retro"
                  >
                    <span>
                      {genre}
                    </span>

                    <input
                      type="checkbox"
                      checked={
                        checked
                      }
                      onChange={() =>
                        toggleGenre(
                          genre
                        )
                      }
                      className="hidden"
                    />

                    <div
                      className={`switch ${
                        checked
                          ? "switch-on"
                          : ""
                      }`}
                    >
                      <div className="switch-thumb" />
                    </div>
                  </label>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        {/* AUTH */}

        {!isTablet && (
          <div className="sidebar-auth">
            {user ? (
              <button
                onClick={logout}
                className="sidebar-nav-btn hover-retro"
              >
                <LogOut size={20} />

                {!collapsed && (
                  <span>
                    Logout
                  </span>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={
                    openLogin
                  }
                  className="sidebar-nav-btn hover-retro"
                >
                  <LogIn size={20} />

                  {!collapsed && (
                    <span>
                      Login
                    </span>
                  )}
                </button>

                <button
                  onClick={
                    openRegister
                  }
                  className="sidebar-nav-btn hover-retro"
                >
                  <UserPlus size={20} />

                  {!collapsed && (
                    <span>
                      Register
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TABLET LOGIN ICON */}
        {isTablet &&
          !user && (
            <button
              onClick={
                openLogin
              }
              className="sidebar-nav-btn hover-retro"
            >
              <LogIn size={20} />
            </button>
          )}

        {/* COLLAPSE */}
        {!isMobile && (
          <div
            className="sidebar-collapse hover-retro"
            onClick={
              collapsed
                ? openSidebar
                : closeSidebar
            }
          >
            {collapsed ? (
              <div className="sidebar-toggle">
                <span className="arrow arrow-right" />
                <span className="arrow arrow-right delay-1" />
                <span className="arrow arrow-right delay-2" />
              </div>
            ) : (
              <>
                <span>
                  Collapse
                </span>

                <div className="sidebar-toggle">
                  <span className="arrow arrow-left" />
                  <span className="arrow arrow-left delay-1" />
                  <span className="arrow arrow-left delay-2" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;