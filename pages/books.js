import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Alert,
  Table,
  Pagination,
  Spinner,
  Button
} from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch results');
    }
    return res.json();
  });

const Books = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [router.query]);

  const queryEntries = useMemo(() => {
    return Object.entries(router.query ?? {}).filter(([key, value]) => key !== 'page' && value);
  }, [router.query]);

  const queryString = useMemo(() => {
    if (queryEntries.length === 0) {
      return '';
    }
    return new URLSearchParams(queryEntries).toString();
  }, [queryEntries]);

  const { data, error, isValidating } = useSWR(
    queryString ? `https://openlibrary.org/search.json?${queryString}&page=${page}&limit=10` : null,
    fetcher,
    { keepPreviousData: true }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  if (queryEntries.length === 0) {
    return (
      <>
        <PageHeader text="Search Results" subtext="Start a search from the home page to see matching books." />
        <Alert variant="info">
          Looks like you navigated here directly. Head back to the{' '}
          <Link href="/">Search page</Link> to get started.
        </Alert>
      </>
    );
  }

  const totalResults = data?.numFound ?? 0;
  const totalPages = Math.ceil(totalResults / 10);

  const subtext = queryEntries
    .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
    .join(' | ');

  return (
    <>
      <PageHeader text="Search Results" subtext={subtext} />
      {error && (
        <Alert variant="danger">
          Something went wrong while fetching results. Please try again later.
        </Alert>
      )}
      {!error && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">
              Showing page {page} of {totalPages || 1} - {totalResults.toLocaleString()} results found
            </span>
            {isValidating && <Spinner animation="border" size="sm" />}
          </div>
          <Table striped responsive hover className="shadow-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author(s)</th>
                <th>First Published</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data?.docs?.map((doc) => (
                <tr key={doc.key}>
                  <td>{doc.title}</td>
                  <td>{doc.author_name?.join(', ') ?? 'Unknown'}</td>
                  <td>{doc.first_publish_year ?? 'N/A'}</td>
                  <td className="text-end">
                    <Button
                      as={Link}
                      href={`/works/${doc.key.split('/').pop()}`}
                      size="sm"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {(!data || data.docs?.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No results found. Try adjusting your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              />
            </Pagination>
          )}
        </>
      )}
    </>
  );
};

export default Books;
