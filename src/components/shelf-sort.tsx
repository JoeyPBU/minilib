"use client";

import { useState, useEffect, useRef } from "react";
import "../styles/shelfSort.css";

export type Book = {
  book_id: number;
  book_name: string;
  author_name: string;
  series_name?: string | null;
  readers_count?: number;
};

type ShelfSortProps = {
  items: Book[];
  filterKeys: (keyof Book)[];
  authorReaderMap: Record<string, Set<number>>;
  onFiltered: (filtered: Book[]) => void;
};

/**
 * ShelfSort component
 *
 * Provides search, name-based sorting, and popularity-based sorting
 * for the lists of books.
 *
 * @component
 * @param {Object} props
 * @param {Book[]} props.items - Array of book items to display and sort
 * @param {(keyof Book)[]} props.filterKeys - Keys of 'Book' used when filtering by search term
 * @param {Record<string, Set<number>>} props.authorReaderMap - Maps author names to sets of reader IDs (used for popularity sorting)
 * @param {(filtered: Book[])} props.onFiltered - Callback fired whenever the filtered/sorted book list changes
 * @returns {TSX.Element} The rendered ShelfSort component
 */
export default function ShelfSort({
  items,
  filterKeys,
  authorReaderMap,
  onFiltered,
}: ShelfSortProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayItems, setDisplayItems] = useState<Book[]>(items);
  const [originalItems, setOriginalItems] = useState<Book[]>(items);
  const [showNameSort, setShowNameSort] = useState(false);
  const [showPopularitySort, setShowPopularitySort] = useState(false);

  const nameButtonRef = useRef<HTMLButtonElement | null>(null);
  const popButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setOriginalItems(items);
    setDisplayItems(items);
  }, [items]);

  /**
   * Filters the books based on what the user has entered, filtering either by Author or by Title.
   *
   * @param {string} search - The search term entered by the user
   * @returns {void}
   */
  const handleFilter = (search: string): void => {
    setSearchTerm(search);
    const searchLower = search.toLowerCase();
    const filtered = search
      ? originalItems.filter((item) =>
          filterKeys.some((key) =>
            String(item[key] ?? "").toLowerCase().includes(searchLower)
          )
        )
      : originalItems;
    setDisplayItems(filtered);
    onFiltered(filtered);
  };

  /**
   * Sorts the currently displayed books alphabetically by title or author.
   *
   * @param {"title-asc" | "title-desc" | "author-asc" | "author-desc"} sortKey - The sort type
   * @returns {void}
   */
  const handleNameSort = (sortKey: string): void => {
    const sorted = [...displayItems].sort((a, b) => {
      switch (sortKey) {
        case "title-asc":
          return a.book_name.localeCompare(b.book_name);
        case "title-desc":
          return b.book_name.localeCompare(a.book_name);
        case "author-asc":
          return a.author_name.localeCompare(b.author_name);
        case "author-desc":
          return b.author_name.localeCompare(a.author_name);
        default:
          return 0;
      }
    });
    setDisplayItems(sorted);
    onFiltered(sorted);
    setShowNameSort(false);
  };


  /**
   * Sorts the currently displayed books by popularity (either book or author).
   *
   * - "book-popularity": Sorts descending by the number of readers of each book.
   * - "author-popularity": Sorts descending by the number of unique readers for each author.
   *
   * @param {"book-popularity" | "author-popularity"} popKey - The popularity sort type
   * @returns {void}
   */
  const handlePopularitySort = (popKey: string): void => {
    const sorted = [...displayItems].sort((a, b) => {
      if (popKey === "book-popularity") {
        return (b.readers_count || 0) - (a.readers_count || 0);
      }
      if (popKey === "author-popularity") {
        const aCount = authorReaderMap[a.author_name]?.size || 0;
        const bCount = authorReaderMap[b.author_name]?.size || 0;
        if (bCount !== aCount) return bCount - aCount;
        return a.book_name.localeCompare(b.book_name);
      }
      return 0;
    });
    setDisplayItems(sorted);
    onFiltered(sorted);
    setShowPopularitySort(false);
  };

  return (
    <div className="shelf-sort">
      <div className="shelf-sort-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleFilter(e.target.value)}
          placeholder="Search by Author or Title"
          className="shelf-sort-search"
        />
        <button
          ref={nameButtonRef}
          className="shelf-sort-btn"
          onClick={() => {
            setShowNameSort((prev) => !prev);
            setShowPopularitySort(false);
          }}
        >
          🔖
        </button>
        <button
          ref={popButtonRef}
          className="shelf-sort-btn"
          onClick={() => {
            setShowPopularitySort((prev) => !prev);
            setShowNameSort(false);
          }}
        >
          📈
        </button>
      </div>

      {showNameSort && (
        <div
          className="shelf-sort-dropdown floating"
          style={{
            position: "fixed",
            top: nameButtonRef.current
              ? nameButtonRef.current.getBoundingClientRect().bottom
              : 0,
            left: nameButtonRef.current
              ? nameButtonRef.current.getBoundingClientRect().left
              : 0,
          }}
        > 
          <button onClick={() => handleNameSort("title-asc")}>Title A-Z</button>
          <button onClick={() => handleNameSort("title-desc")}>Title Z-A</button>
          <button onClick={() => handleNameSort("author-asc")}>Author A-Z</button>
          <button onClick={() => handleNameSort("author-desc")}>Author Z-A</button>
        </div>
      )}

      {showPopularitySort && (
        <div
          className="shelf-sort-dropdown floating"
          style={{
            position: "fixed",
            top: popButtonRef.current
              ? popButtonRef.current.getBoundingClientRect().bottom
              : 0,
            left: popButtonRef.current
              ? popButtonRef.current.getBoundingClientRect().left
              : 0,
          }}
        >
          <button onClick={() => handlePopularitySort("book-popularity")}>
            Book Popularity
          </button>
          <button onClick={() => handlePopularitySort("author-popularity")}>
            Author Popularity
          </button>
        </div>
      )}
    </div>
  );
}
