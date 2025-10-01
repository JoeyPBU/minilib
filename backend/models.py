from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

reader_books = Table(
    "reader_books",
    Base.metadata,
    Column("reader_id", Integer, ForeignKey("readers.reader_id"), primary_key=True),
    Column("book_id", Integer, ForeignKey("books.book_id"), primary_key=True),
)
"""Association table for many-to-many relationship between readers and books."""

class Author(Base):
    """SQLAlchemy model for the `authors` table.  
    Links to all books written by an author."""
    __tablename__ = "authors"
    author_id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String, nullable=False)
    total_books = Column(Integer)

    books = relationship("Book", back_populates="author")


class BookSeries(Base):
    """SQLAlchemy model for the `book_series` table.  
    Represents a named series containing multiple books."""
    __tablename__ = "book_series"
    series_id = Column(Integer, primary_key=True, index=True)
    series_name = Column(String, nullable=False)

    books = relationship("Book", back_populates="series")


class Book(Base):
    """SQLAlchemy model for the `books` table.  
    Connects a book to its author, optional series, and the readers who have it."""
    __tablename__ = "books"
    book_id = Column(Integer, primary_key=True, index=True)
    book_name = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("authors.author_id"), nullable=False)
    series_id = Column(Integer, ForeignKey("book_series.series_id"))

    author = relationship("Author", back_populates="books")
    series = relationship("BookSeries", back_populates="books")
    readers = relationship("Reader", secondary=reader_books, back_populates="books")


class Reader(Base):
    """SQLAlchemy model for the `readers` table.  
    Represents a reader and their many-to-many relationship with books."""
    __tablename__ = "readers"
    reader_id = Column(Integer, primary_key=True, index=True)
    reader_name = Column(String, nullable=False)

    books = relationship("Book", secondary=reader_books, back_populates="readers")
