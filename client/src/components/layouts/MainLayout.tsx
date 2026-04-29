import { useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Heart,
  Home,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  mobileThemeSwitcher?: React.ReactNode;
}

const MainLayout = ({
  mobileThemeSwitcher,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [
    selectedGenres,
    setSelectedGenres,
  ] = useState<string[]>(
    []
  );

  const [search, setSearch] =
    useState("");

  const isActive = (
    path: string
  ) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path;

  return (
    <div className="flex w-full h-screen overflow-hidden crt relative min-h-screen">
      <Sidebar
        selectedGenres={
          selectedGenres
        }
        setSelectedGenres={
          setSelectedGenres
        }
      />

      <div className="flex-1 flex flex-col relative crt min-w-0 w-full">
        <div className="px-5 pt-5">
          <Topbar
            search={search}
            setSearch={
              setSearch
            }
            mobileThemeSwitcher={
              mobileThemeSwitcher
            }
          />

          <div className="mobile-route-tabs">
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className={`mobile-route-tab ${
                isActive("/")
                  ? "active-item glow"
                  : "hover-retro"
              }`}
            >
              <Home size={18} />
              Home
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/favorites")
              }
              className={`mobile-route-tab ${
                isActive("/favorites")
                  ? "active-item glow"
                  : "hover-retro"
              }`}
            >
              <Heart size={18} />
              Favorite
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4 min-w-0 w-full mobile-content-wrap">
          <Outlet
            context={{
              selectedGenres,
              setSelectedGenres,
              search,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
