import PageHeader from '@/components/PageHeader';
import BookDetails from '@/components/BookDetails';

const featureBook = {
  key: '/works/OL82563W',
  title: 'Pride and Prejudice',
  description:
    'Pride and Prejudice is a classic romantic novel of manners written by Jane Austen, exploring themes of love, reputation, and class in Regency-era England.',
  first_publish_date: '1813',
  covers: [12652958],
  subjects: [
    'Courtship',
    'Young women',
    'Social classes',
    'England-Fiction'
  ],
  subject_people: ['Elizabeth Bennet', 'Fitzwilliam Darcy'],
  subject_places: ['England'],
  links: [
    {
      title: 'Read on Open Library',
      url: 'https://openlibrary.org/works/OL82563W'
    }
  ],
  authors: [{ name: 'Jane Austen' }]
};

const About = () => (
  <>
    <PageHeader
      text="About NextReads"
      subtext="An Assignment 2 project for WEB422 showcasing Open Library search and favourites."
    />
    <p className="lead">
      NextReads builds on the Assignment 1 foundation by enhancing the user interface, adding detailed search
      capabilities, and introducing a favourites list powered by Jotai state management. Explore the featured
      classic below to get a sense of the detail view.
    </p>
    <BookDetails
      book={featureBook}
      workId="OL82563W"
      showFavouriteBtn={false}
    />
  </>
);

export default About;
