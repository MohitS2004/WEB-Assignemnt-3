import { useAtom } from 'jotai';
import { Row, Col, Alert } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import BookCard from '@/components/BookCard';
import { favouritesAtom } from '@/store';

const Favourites = () => {
  const [favouritesList] = useAtom(favouritesAtom);

  if (!favouritesList) return null;

  if (!favouritesList.length) {
    return (
      <>
        <PageHeader text="No Favourites Yet" subtext="Add books to your favourites list to view them here." />
        <Alert variant="info">
          Browse search results and add books to start building your favourites collection.
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageHeader text="Favourites" subtext="Your favourite books in one place." />
      <Row className="gy-4">
        {favouritesList.map((workId) => (
          <Col key={workId} lg={3} md={6}>
            <BookCard workId={workId} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Favourites;
