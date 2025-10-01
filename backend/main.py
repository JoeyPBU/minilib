from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Author, Book, BookSeries, Reader
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

app = FastAPI(title="Library API")

def get_db():
    """Dependency that yields a database session for API requests."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- API Endpoints --------------

@app.get("/api/authors")
def get_authors(db: Session = Depends(get_db)):
    """ Returns JSON list of all authors with IDs and names."""
    return [{"author_id": a.author_id, "author_name": a.author_name} for a in db.query(Author).all()]


@app.get("/api/series")
def get_series(db: Session = Depends(get_db)):
    """Returns JSON list of all book series with IDs and names."""
    return [{"series_id": s.series_id, "series_name": s.series_name} for s in db.query(BookSeries).all()]


@app.get("/api/books")
def get_books(db: Session = Depends(get_db)):
    """Returns JSON list of all books, including the reader count per book and per author attached."""
    result = []
    for b in db.query(Book).all():
        reader_count = len(b.readers)
        author_reader_count = len({r.reader_id for book in b.author.books for r in book.readers})

        result.append({
            "book_id": b.book_id,
            "book_name": b.book_name,
            "author_name": b.author.author_name,
            "series_name": b.series.series_name if b.series else None,
            "reader_count": reader_count,
            "author_reader_count": author_reader_count,
        })
    return result


@app.get("/api/readers")
def get_readers(db: Session = Depends(get_db)):
    """Returns JSON list of readers with their IDs, names, and owned books."""
    result = []
    for r in db.query(Reader).all():
        result.append({
            "reader_id": r.reader_id,
            "reader_name": r.reader_name,
            "books": [{"book_id": b.book_id, "book_name": b.book_name} for b in r.books]
        })
    return result


@app.get("/test-books")
def test_books(db: Session = Depends(get_db)):
    """Returns JSON list of book IDs and names (debug/testing route)."""
    books = db.query(Book).all()
    return [{"book_id": b.book_id, "book_name": b.book_name} for b in books]


@app.post("/api/readers/{reader_id}/books/{book_id}/add")
def add_book_to_reader(reader_id: int, book_id: int, db: Session = Depends(get_db)):
    """Adds a book to a reader`s library and returns confirmation."""
    reader = db.query(Reader).filter(Reader.reader_id == reader_id).first()
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not reader or not book:
        raise HTTPException(status_code=404, detail="Reader or Book not found")

    if book not in reader.books:
        reader.books.append(book)
        db.commit()
    return {"message": f"Book {book.book_name} added to reader {reader.reader_name}"}


@app.post("/api/readers/{reader_id}/books/{book_id}/remove")
def remove_book_from_reader(reader_id: int, book_id: int, db: Session = Depends(get_db)):
    """Removes a book to from reader`s library and returns confirmation."""
    reader = db.query(Reader).filter(Reader.reader_id == reader_id).first()
    book = db.query(Book).filter(Book.book_id == book_id).first()
    if not reader or not book:
        raise HTTPException(status_code=404, detail="Reader or Book not found")

    if book in reader.books:
        reader.books.remove(book)
        db.commit()
    return {"message": f"Book {book.book_name} removed from reader {reader.reader_name}"}
