"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/page.module.css";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import BookDetails from "@/components/book-details";

import ShelfSort from "@/components/shelf-sort";
import { Book } from "@/components/shelf-sort";

// To skip a login function, I hardcoded the user to be Sir Readsalot
const USER_ID = 1;

/**
 * Landing and Primary Page for Booknook.
 *
 * Displays the user’s personal library ("Your Library") and the "Open Library".
 * Fetches data from the backend, manages filtering, and allows books
 * to be added/removed from the user's collection.
 *
 * Books may also be selected to view further details, series, and author.
 * 
 * @returns {JSX.Element} The rendered Home component with libraries and book details.
 */
export default function Home(): any {
  const [yourLibrary, setYourLibrary] = useState<Book[]>([]);
  const [openLibrary, setOpenLibrary] = useState<Book[]>([]);
  const [filteredYour, setFilteredYour] = useState<Book[]>([]);
  const [filteredOpen, setFilteredOpen] = useState<Book[]>([]);
  const [authorReaderMap, setAuthorReaderMap] = useState<Record<string, Set<number>>>({});
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [totalReaders, setTotalReaders] = useState<number>(0);


 /**
 * Fetches book and reader data from the backend API,
 * builds reader counts, author-reader mappings, and separates
 * books into "Your Library" and "Open Library" based on
 * whether Sir Readsalot has them.
 *
 * Updates state for libraries, filters, and totalReaders.
 *
 * @returns {Promise<void>}
 */
  const fetchLibraries = async (): Promise<void> => {
    try {
      const resBooks = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);
      const allBooks: Book[] = await resBooks.json();

      const resReaders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/readers`);
      const readers = await resReaders.json();

      setTotalReaders(readers.length);

      const bookReaderMap: Record<number, number> = {};
      const authorMap: Record<string, Set<number>> = {};

      readers.forEach((reader: any) => {
        reader.books.forEach((b: any) => {
          bookReaderMap[b.book_id] = (bookReaderMap[b.book_id] || 0) + 1;
          if (!authorMap[b.author_name]) authorMap[b.author_name] = new Set();
          authorMap[b.author_name].add(reader.reader_id);
        });
      });

      const booksWithCounts = allBooks.map((b) => ({
        ...b,
        readers_count: bookReaderMap[b.book_id] || 0,
        series_name: b.series_name ?? null,
      }));

      const userByID = readers.find((r: any) => r.reader_id === USER_ID);
      const readBookIds = userByID?.books?.map((b: any) => b.book_id) ?? [];

      const your = booksWithCounts.filter((b) => readBookIds.includes(b.book_id));
      const open = booksWithCounts.filter((b) => !readBookIds.includes(b.book_id));

      setYourLibrary(your);
      setOpenLibrary(open);
      setFilteredYour(your);
      setFilteredOpen(open);
      setAuthorReaderMap(authorMap);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  /**
   * Adds a book to the User's Library library by making a POST request to the backend.
   * After updating the backend, refreshes the libraries to reflect the change.
   *
   * @param {number} book_id - The unique identifier of the book to add.
   * @returns {Promise<void>} A promise that resolves when the book is added and state is refreshed.
   */
  const addBook = async (book_id: number): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/readers/${USER_ID}/books/${book_id}/add`, {
      method: "POST",
    });
    fetchLibraries();
  };

  /**
   * Removes a book from the User's library by making a POST request to the backend.
   * After updating the backend, refreshes the libraries to reflect the change.
   *
   * @param {number} book_id - The unique identifier of the book to remove.
   * @returns {Promise<void>} A promise that resolves when the book is removed and state is refreshed.
   */
  const removeBook = async (book_id: number): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/readers/${USER_ID}/books/${book_id}/remove`, {
      method: "POST",
    });
    fetchLibraries();
  };

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        {/* YourLibrary */}
        <div className={styles.sectionRed}>
          <h2 className={styles.sectionTitle}>Your Library</h2>
          <ShelfSort
            items={yourLibrary}
            filterKeys={["book_name", "author_name"]}
            authorReaderMap={authorReaderMap}
            onFiltered={setFilteredYour}
          />
          <div className={styles.cardList}>
            {filteredYour.map((book) => (
              <div key={book.book_id} className={styles.bookCard} onClick={() => setSelectedBook(book)}>
                <span>{book.book_name}</span>
                <button
                  className="bg-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBook(book.book_id);
                  }}>-</button>
              </div>
            ))}
          </div>
        </div>

        {/* OpenLibrary */}
        <div className={styles.sectionGreen}>
          <h2 className={styles.sectionTitle}>Open Library</h2>
          <ShelfSort
            items={openLibrary}
            filterKeys={["book_name", "author_name"]}
            authorReaderMap={authorReaderMap}
            onFiltered={setFilteredOpen}
          />
          <div className={styles.cardList}>
            {filteredOpen.map((book) => (
              <div key={book.book_id} className={styles.bookCard} onClick={() => setSelectedBook(book)}>
                <span>{book.book_name}</span>
                <button 
                  className="bg-green-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    addBook(book.book_id);
                  }}>+</button>
              </div>
            ))}
          </div>
        </div>

        {/* Book Details */}
          <BookDetails
            book={selectedBook}
            totalReaders={totalReaders}
            onAdd={addBook}
            onRemove={removeBook}
            onClose={() => setSelectedBook(null)}
          />
      </main>
      <SiteFooter />
    </div>
  );
}
