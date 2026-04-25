import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  return (
    <div
      className="flex w-full overflow-hidden crt relative min-h-screen"
      style={{ height: "100dvh" }}
    >
      <Sidebar
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />

      <div className="flex-1 flex flex-col relative crt min-w-0 w-full">
        <div className="px-5 pt-5 shrink-0">
          <Topbar search={search} setSearch={setSearch} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4 min-w-0 w-full">
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