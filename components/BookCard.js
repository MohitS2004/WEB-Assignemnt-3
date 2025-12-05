import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import Error from 'next/error';

const FALLBACK_IMG = 'https://placehold.co/400x600?text=No+Cover';

const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
});

const BookCard = ({ workId }) => {
  const { data, error } = useSWR(
    workId ? `https://openlibrary.org/works/${workId}.json` : null,
    fetcher
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return (
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex align-items-center justify-content-center">
          Loading...
        </Card.Body>
      </Card>
    );
  }

  const coverId = data.covers?.[0];
  const imgSrc = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : FALLBACK_IMG;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={imgSrc}
        alt={data.title ?? 'Book cover'}
        className="object-fit-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = FALLBACK_IMG;
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{data.title ?? ''}</Card.Title>
        <Card.Text className="text-muted">
          {data.first_publish_date ?? 'N/A'}
        </Card.Text>
        <Button
          as={Link}
          href={`/works/${workId}`}
          variant="primary"
          className="mt-auto"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
