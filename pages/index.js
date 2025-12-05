import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

const Home = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      author: '',
      title: '',
      subject: '',
      language: '',
      first_publish_year: ''
    }
  });

  const onSubmit = (data) => {
    const cleaned = Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => value !== '')
    );

    router.push({
      pathname: '/books',
      query: cleaned
    });
  };

  return (
    <>
      <PageHeader
        text="Search the Open Library"
        subtext="Filter by author, title, subject, language, or first publication year to discover new books."
      />
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Row className="gy-3">
          <Col md={6}>
            <Form.Group controlId="author">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. Douglas Adams"
                {...register('author', { required: 'Author is required' })}
                isInvalid={!!errors.author}
              />
              <Form.Control.Feedback type="invalid">
                {errors.author?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. The Hitchhiker's Guide to the Galaxy"
                {...register('title')}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="subject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. Science Fiction"
                {...register('subject')}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="language">
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. eng"
                {...register('language')}
              />
              <Form.Text muted>Use ISO 639-2 language code.</Form.Text>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="first_publish_year">
              <Form.Label>First Publish Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="eg. 1979"
                {...register('first_publish_year')}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-4">
          <Button type="submit" size="lg">
            Search
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Home;
