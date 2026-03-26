
import React from "react";
import styles from "../../styles/admin-dashboard.module.css";

interface ImportCsvModalFooterProps {
  isLoading: boolean;
  onImport: () => void;
  onCancel: () => void;
}

export const ImportCsvModalFooter: React.FC<ImportCsvModalFooterProps> = ({ isLoading, onImport, onCancel }) => (
  <div className="flex justify-end gap-2 mt-6">
    <button
      type="button"
      className={styles.adminButtonSmallRed}
      onClick={onCancel}
      disabled={isLoading}
    >
      Cancel
    </button>
    <button
      type="button"
      className={styles.adminButtonSmall}
      onClick={onImport}
      disabled={isLoading}
    >
      {isLoading ? "Importing..." : "Import"}
    </button>
  </div>
);
