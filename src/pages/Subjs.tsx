import { styled } from '@linaria/react';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import type { FC } from 'react';
import { Link } from 'react-router';
import { PageLayout } from '../components/PageLayout';
import { Container } from '../layout/Container';

const subjects = [
  {
    id: 'fr',
    title: 'French',
    description: 'Flashcards to help you with learning French',
    img: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg',
    alt: 'French flag"',
  },
];

export const Subjs: FC = () => {
  return (
    <PageLayout>
      <Container>
        <Panel header={'Subjects'}>
          {subjects.map(({ id, title, img, alt, description }) => (
            <Link key={id} to={`/subjs/${id}`}>
              <SubjCard
                header={<img src={img} alt={alt} />}
                title={`📚 ${title}`}
              >
                {description}
              </SubjCard>
            </Link>
          ))}
        </Panel>
      </Container>
    </PageLayout>
  );
};

const SubjCard = styled(Card)`
  max-width: 400px;
  overflow: hidden;
`;
