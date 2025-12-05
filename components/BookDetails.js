/* eslint-disable @next/next/no-img-element */
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Badge, Button, ListGroup } from 'react-bootstrap';
import Link from 'next/link';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

const FALLBACK_IMG = 'https://placehold.co/600x900?text=No+Cover';

const BookDetails = ({ book, workId, showFavouriteBtn = true }) => {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList.includes(workId));
  }, [favouritesList, workId]);

  const favouritesClicked = async () => {
    if (!workId) {
      return;
    }

    const updatedList = showAdded
      ? await removeFromFavourites(workId)
      : await addToFavourites(workId);

    setFavouritesList(updatedList);
    setShowAdded(updatedList.includes(workId));
  };

  const coverSrc = useMemo(() => {
    const coverId = book?.covers?.[0];
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : FALLBACK_IMG;
  }, [book]);

  const description = useMemo(() => {
    if (!book?.description) {
      return 'No description available.';
    }
    if (typeof book.description === 'string') {
      return book.description;
    }
    return book.description?.value ?? 'No description available.';
  }, [book]);

  const firstPublished = book?.first_publish_date || book?.created?.value?.split('T')[0] || 'N/A';
  const subjects = book?.subjects ?? [];
  const subjectPlaces = book?.subject_places ?? [];
  const subjectPeople = book?.subject_people ?? [];
  const links = book?.links ?? [];

  const authorList = (book?.authors ?? []).map((entry) => {
    if (typeof entry === 'string') {
      return entry;
    }
    if (entry?.name) {
      return entry.name;
    }
    if (entry?.author?.key) {
      return entry.author.key.split('/').pop();
    }
    return 'Unknown author';
  });

  return (
    <Row className="gy-4">
      <Col lg="4" md="5">
        <img
          alt={book?.title || 'Book cover'}
          className="img-fluid rounded shadow-sm"
          src={coverSrc}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </Col>
      <Col lg="8" md="7">
        <h2 className="mb-3">{book?.title ?? 'Untitled Work'}</h2>
        {authorList.length > 0 && (
          <p className="text-muted">
            {authorList.join(', ')}
          </p>
        )}
        <p className="lead">{description}</p>
        <ListGroup variant="flush" className="mb-3">
          <ListGroup.Item>
            <strong>First Published:</strong> {firstPublished}
          </ListGroup.Item>
          {book?.subject_time && (
            <ListGroup.Item>
              <strong>Subject Time:</strong> {book.subject_time.join(', ')}
            </ListGroup.Item>
          )}
          {subjectPeople.length > 0 && (
            <ListGroup.Item>
              <strong>Subject People:</strong> {subjectPeople.join(', ')}
            </ListGroup.Item>
          )}
          {subjectPlaces.length > 0 && (
            <ListGroup.Item>
              <strong>Subject Places:</strong> {subjectPlaces.join(', ')}
            </ListGroup.Item>
          )}
        </ListGroup>
        {subjects.length > 0 && (
          <div className="mb-3">
            <strong>Subjects:</strong>
            <div className="mt-2 d-flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Badge bg="secondary" key={subject}>
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {links.length > 0 && (
          <div className="mb-3">
            <strong>Links:</strong>
            <ListGroup className="mt-2">
              {links.map((link) => (
                <ListGroup.Item key={link.url}>
                  <Link href={link.url} target="_blank" rel="noreferrer">
                    {link.title || link.url}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
        {book?.key && (
          <p className="mb-4">
            View on{' '}
            <Link href={`https://openlibrary.org${book.key}`} target="_blank" rel="noreferrer">
              Open Library
            </Link>
          </p>
        )}
        {showFavouriteBtn && (
          <Button
            variant={showAdded ? 'primary' : 'outline-primary'}
            onClick={favouritesClicked}
          >
            {showAdded ? '+ Favourite (added)' : '+ Favourite'}
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default BookDetails;
