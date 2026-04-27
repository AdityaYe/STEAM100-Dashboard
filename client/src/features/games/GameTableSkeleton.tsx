const ROW_COUNT = 8;

const GameTableSkeleton =
  () => {
    return (
      <div className="panel dashboard-skeleton animate-pulse">
        <div className="dashboard-skeleton-header">
          <div className="dashboard-skeleton-title" />

          <div className="dashboard-skeleton-subtitle" />
        </div>

        <div className="dashboard-skeleton-body">
          {Array.from({
            length: ROW_COUNT,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="dashboard-skeleton-row"
              >
                <div className="dashboard-skeleton-thumb" />

                <div className="dashboard-skeleton-meta">
                  <div className="dashboard-skeleton-line dashboard-skeleton-line-main" />

                  <div className="dashboard-skeleton-line dashboard-skeleton-line-sub" />
                </div>

                <div className="dashboard-skeleton-stat" />
              </div>
            )
          )}
        </div>
      </div>
    );
  };

export default GameTableSkeleton;