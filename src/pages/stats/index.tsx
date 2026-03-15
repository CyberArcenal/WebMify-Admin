// src/pages/stats/index.tsx
import React, { useState } from "react";
import { Edit, RefreshCw, BarChart3 } from "lucide-react";
import Button from "../../components/UI/Button";
import { showSuccess, showError } from "../../utils/notification";

import useStats from "./hooks/useStats";
import StatsDisplay from "./components/StatsDisplay";
import StatsFormDialog from "./components/StatsFormDialog";

const StatsPage: React.FC = () => {
  const { stats, loading, error, reload, updateStats } = useStats();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFormSuccess = async (data: any) => {
    try {
      await updateStats(data);
      showSuccess("Stats updated successfully");
      setIsFormOpen(false);
    } catch (err: any) {
      showError(err.message || "Failed to update stats");
    }
  };

  return (
    <div
      className="compact-card rounded-md shadow-md border"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-4">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--sidebar-text)" }}
          >
            Statistics
          </h2>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage your portfolio statistics
          </p>
        </div>
        <div className="flex flex-wrap gap-xs w-full sm:w-auto">
          <button
            onClick={reload}
            disabled={loading}
            className="btn btn-secondary btn-sm rounded-md flex items-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md disabled:opacity-50"
          >
            <RefreshCw
              className={`icon-sm mr-1 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <Button
            onClick={handleEdit}
            variant="primary"
            size="sm"
            icon={Edit}
            iconPosition="left"
            disabled={!stats && !loading}
          >
            Edit Stats
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "var(--accent-blue)" }}
          ></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      )}

      {/* Stats Display */}
      {!loading && !error && stats && (
        <StatsDisplay stats={stats} />
      )}

      {/* Empty State (if no stats yet) */}
      {!loading && !error && !stats && (
        <div
          className="text-center py-8 border rounded-md"
          style={{ borderColor: "var(--border-color)" }}
        >
          <BarChart3
            className="icon-xl mx-auto mb-2"
            style={{ color: "var(--text-secondary)" }}
          />
          <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
            No statistics found.
          </p>
          <p
            className="mt-xs text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            Click the Edit button to create your first stats.
          </p>
          <div className="mt-2">
            <Button
              onClick={handleEdit}
              variant="primary"
              size="sm"
              icon={Edit}
              iconPosition="left"
            >
              Create Stats
            </Button>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      {isFormOpen && (
        <StatsFormDialog
          isOpen={isFormOpen}
          initialData={stats}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default StatsPage;