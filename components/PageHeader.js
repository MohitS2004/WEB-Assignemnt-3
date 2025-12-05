import { Row, Col } from 'react-bootstrap';

const PageHeader = ({ text, subtext }) => (
  <header className="bg-light rounded-4 p-4 shadow-sm mb-4">
    <Row>
      <Col>
        <h1 className="mb-2">{text}</h1>
        {subtext && <p className="text-muted mb-0">{subtext}</p>}
      </Col>
    </Row>
  </header>
);

export default PageHeader;
