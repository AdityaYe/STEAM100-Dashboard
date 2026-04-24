import { useState } from "react";

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
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const { user, logout } =
    useAuth();

  const {
    setOpen,
    setMode,
  } = useAuthModal();

  const [
    isCollapsed,
    setIsCollapsed,
  ] = useState(true);

  const rowClass = `
w-full h-12 flex items-center
text-sm font-medium tracking-wider
`;

  const getAlignClass =
    () =>
      isCollapsed
        ? "justify-center"
        : "gap-3 px-3";

  const openLogin =
    () => {
      setMode("login");
      setOpen(true);
    };

  const openRegister =
    () => {
      setMode("register");
      setOpen(true);
    };

  const openSidebar =
    () =>
      setIsCollapsed(
        false
      );

  const closeSidebar =
    () =>
      setIsCollapsed(
        true
      );

  const isActive = (
    path: string
  ) => {
    if (path === "/") {
      return (
        location.pathname === path
      );
    }

    if (
      path ===
      "/?sortBy=favorites"
    ) {
      return location.search.includes(
        "sortBy=favorites"
      );
    }

    return (
      location.pathname ===
      path
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
            (item) =>
              item !==
              genre
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
      className={`h-screen flex flex-col panel transition-all duration-300 ${
        isCollapsed
          ? "w-16"
          : "w-64"
      }`}
      style={{
        borderRight:
          "1px solid var(--border)",
      }}
    >
      <div
        className="px-3 py-4 border-b"
        style={{
          borderColor:
            "var(--border)",
        }}
      >
        {user && (
          <div
            className="sidebar-profile-section border-b"
            style={{
              borderColor:
                "var(--border)",
            }}
          >
            {isCollapsed ? (
              <div className="sidebar-profile-collapsed">
                <Avatar size="sm" />
              </div>
            ) : (
              <div className="sidebar-profile-display">
                <Avatar size="sm" />

                <div className="sidebar-profile-meta">
                  <div className="sidebar-profile-name">
                    {
                      user.username
                    }
                  </div>

                  <div className="sidebar-profile-sub">
                    SIGNED
                    IN
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {NAV_ITEMS.map(
          ({
            icon: Icon,
            label,
            path,
          }) => {
            const active =
              isActive(
                path
              );

            return (
              <button
                key={label}
                onClick={() =>
                  navigate(
                    path
                  )
                }
                className={`${rowClass} ${getAlignClass()} relative ${
                  active
                    ? "active-item glow"
                    : "hover-retro"
                }`}
              >
                {active && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w:2px"
                    style={{
                      backgroundColor:
                        "var(--accent)",
                    }}
                  />
                )}

                <Icon size={20} />

                {!isCollapsed && (
                  <span>
                    {
                      label
                    }
                  </span>
                )}
              </button>
            );
          }
        )}
      </div>

      <div
        className="px-3 py-4 border-b"
        style={{
          borderColor:
            "var(--border)",
        }}
      >
        <div
          onClick={() => {
            if (
              isCollapsed
            ) {
              openSidebar();
            }
          }}
          className={`flex items-center cursor-pointer select-none transition-opacity ${
            isCollapsed
              ? "justify-center"
              : "gap-2 px-2"
          } text-sm font-medium tracking-wider opacity-70 hover:opacity-100`}
          title={
            isCollapsed
              ? "Open Genres"
              : "Genres"
          }
        >
          <Filter size={16} />

          {!isCollapsed && (
            <span>
              GENRES
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 space-y-1">
            {GENRES.map(
              (
                genre
              ) => {
                const checked =
                  selectedGenres.includes(
                    genre
                  );

                return (
                  <label
                    key={
                      genre
                    }
                    className="w-full flex items-center justify-between px-3 py-2 text-sm tracking-wider cursor-pointer hover-retro"
                  >
                    <span>
                      {
                        genre
                      }
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

      <div className="mt-auto flex flex-col">
        <div
          className="px-3 py-4 border-b"
          style={{
            borderColor:
              "var(--border)",
          }}
        >
          {user ? (
            <button
              onClick={
                logout
              }
              className={`${rowClass} ${getAlignClass()} hover-retro`}
            >
              <LogOut size={20} />

              {!isCollapsed && (
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
                className={`${rowClass} ${getAlignClass()} hover-retro`}
              >
                <LogIn size={20} />

                {!isCollapsed && (
                  <span>
                    Login
                  </span>
                )}
              </button>

              <button
                onClick={
                  openRegister
                }
                className={`${rowClass} ${getAlignClass()} hover-retro`}
              >
                <UserPlus size={20} />

                {!isCollapsed && (
                  <span>
                    Register
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        <div
          className="border-t"
          style={{
            borderColor:
              "var(--border)",
          }}
        >
          {isCollapsed ? (
            <div
              onClick={
                openSidebar
              }
              className="w-full h-13 flex items-center justify-center cursor-pointer"
            >
              <div className="flex gap-1 sidebar-toggle">
                <span
                  className="arrow arrow-right"
                  style={{
                    "--dir":
                      "45deg",
                  } as any}
                />

                <span
                  className="arrow arrow-right delay-1"
                  style={{
                    "--dir":
                      "45deg",
                  } as any}
                />

                <span
                  className="arrow arrow-right delay-2"
                  style={{
                    "--dir":
                      "45deg",
                  } as any}
                />
              </div>
            </div>
          ) : (
            <div
              onClick={
                closeSidebar
              }
              className="w-full h-13 px-4 py-3 flex items-center justify-between cursor-pointer hover-retro"
            >
              <span className="text-sm font-medium tracking-wider">
                Collapse
              </span>

              <div className="flex gap-1 sidebar-toggle">
                <span
                  className="arrow arrow-left"
                  style={{
                    "--dir":
                      "-135deg",
                  } as any}
                />

                <span
                  className="arrow arrow-left delay-1"
                  style={{
                    "--dir":
                      "-135deg",
                  } as any}
                />

                <span
                  className="arrow arrow-left delay-2"
                  style={{
                    "--dir":
                      "-135deg",
                  } as any}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;