import React, { useEffect, useState } from "react";
import "../styles/userModalStats.css";

interface UserStats {
  reader_id: number;
  reader_name: string;
  total_books: number;
  total_series: number;
  longest_series: string | null;
}

interface UserStatsModalProps {
  readerId: number;
  isOpen: boolean;
  onClose: () => void;
}


/**
 * User Stats Modal Component
 * 
 * Displays statistics about the current user in a modal.
 * 
 * @param {any} {readerId - The current user.
 * @param {any} isOpen - The status of the modal, if true the modal is displayed.
 * @param {any} onClose} - Tells parent element that the modal is now closed.
 * @returns {TSX.Element} The rendered user statistics modal.
 */
const UserStatsModal: React.FC<UserStatsModalProps> = ({ readerId, isOpen, onClose }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles fetching the user Statistics, then displays the Stat Modal
   */
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/readers/${readerId}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [readerId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="stats-overlay">
      <div className="stats-backdrop" onClick={onClose} />
      <div className="stats-modal">
        <h2 className="stats-title">Log Book</h2>

        {loading ? (
          <p className="stats-loading">Loading...</p>
        ) : stats ? (
          <>
            <p><strong>User:</strong> {stats.reader_name}</p>
            <p><strong>Total Books Read:</strong> {stats.total_books}</p>
            <p><strong>Total Series Read:</strong> {stats.total_series}</p>
            <p><strong>Longest Series Read:</strong> {stats.longest_series || "N/A"}</p>
          </>
        ) : (
          <p className="stats-error">Could not load stats.</p>
        )}

        <button className="stats-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserStatsModal;
