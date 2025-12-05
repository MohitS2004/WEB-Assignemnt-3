import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import { Spinner } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import BookDetails from '@/components/BookDetails';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch work');
    }
    return res.json();
  });

const WorkDetailsPage = () => {
  const router = useRouter();
  const { workId } = router.query;

  const { data, error } = useSWR(
    workId ? `https://openlibrary.org/works/${workId}.json` : null,
    fetcher
  );

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return (
      <>
        <PageHeader text="Loading Book Details..." />
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader text={data?.title ?? 'Book Details'} subtext={`Work ID: ${workId}`} />
      <BookDetails book={data} workId={workId} />
    </>
  );
};

export default WorkDetailsPage;
