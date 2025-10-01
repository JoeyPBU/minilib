"use client";

import { Book } from "@/components/shelf-sort";
import "../styles/bookDetails.css"
import { useState, useEffect } from "react";

type BookDetailsProps = {
  book: Book | null;
  totalReaders: number;
  onAdd: (book_id: number) => void;
  onRemove: (book_id: number) => void;
  onClose: () => void;
};

/**
 * BookDetails Component
 *
 * Displays detailed information about a selected book, including
 * title, author, series (if available), current reader count, and
 * popularity percentage relative to total readers.
 *
 * Supports adding/removing the book from the user's library and
 * animates sliding in/out when opened or closed.
 *
 * @param {Object} props
 * @param {Book | null} props.book - The currently selected book, or null if none is selected.
 * @param {number} props.totalReaders - Total number of readers across the system (used to calculate popularity).
 * @param {(book_id: number) => void} props.onAdd - Callback for adding the book to the user's library.
 * @param {(book_id: number) => void} props.onRemove - Callback for removing the book from the user's library.
 * @param {() => void} props.onClose - Callback for closing the book details panel.
 * @returns {TSX.Element | null} The rendered book details panel, or null if no book is selected.
 */
export default function BookDetails({ book, totalReaders, onAdd, onRemove, onClose }: BookDetailsProps) {
  const [visibleBook, setVisibleBook] = useState<Book | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handles visibility and sliding animation timing for the book details panel.
   */
  useEffect(() => {
    if (book) {
      setVisibleBook(book);
      const timeout = setTimeout(() => setIsOpen(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setIsOpen(false);
      const timeout = setTimeout(() => setVisibleBook(null), 300);
      return () => clearTimeout(timeout);
    }
  }, [book]);

  if (!visibleBook) return null;

  return (
    <div className={`bookDetailsWrapper ${isOpen ? "open" : ""}`}>
      <div className="bookDetails">
        <div className="bookDetailsClose">
          <button onClick={onClose}>× Close</button>
        </div>

        <h3>{visibleBook.book_name}</h3>
        <p>
          <strong>Author:</strong> {visibleBook.author_name}
        </p>
        {visibleBook.series_name && (
          <p>
            <strong>Series:</strong> {visibleBook.series_name}
          </p>
        )}

        <div className="bookDetailsPanel">
          <div>
            <button className="bg-green-500" onClick={() => onAdd(visibleBook.book_id)}>+</button>
            <button className="bg-red-500" onClick={() => onRemove(visibleBook.book_id)}>-</button>
          </div>
          <div>
            <strong>Readers:</strong> {visibleBook.readers_count}
          </div>
          <div>
            <strong>Popularity:</strong>{" "}
            {totalReaders > 0
              ? `${(((visibleBook.readers_count ?? 0) / totalReaders) * 100).toFixed(1)}%`
              : "N/A"}
          </div>
        </div>

        <div className="descriptionPanel">
          <p>
            In the Beginning there was: 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fringilla, nibh in vehicula placerat, lacus tellus pharetra urna, et mollis erat nisi vitae justo. Sed suscipit urna id enim vehicula commodo. Nam malesuada urna a metus pulvinar suscipit. In eget nunc porttitor, lobortis lacus id, mattis ipsum. Phasellus augue justo, vulputate in massa eu, pretium vehicula nisl. Ut enim eros, feugiat vitae faucibus nec, tincidunt ac nunc. Proin ultricies, nisi ut pretium facilisis, ante urna faucibus ex, ut porta enim massa et mauris.
          </p>
          <p>
            <strong>ISBN:</strong> 978-0-470-08870-8
          </p>
        </div>
      </div>
    </div>
  );
}
