import { List, Typography } from 'antd';
import type { FC } from 'react';
import { Link } from 'react-router';
import { PageLayout } from '../components/PageLayout';

const subjects = [{ id: 'fr', title: 'French' }];

export const Subjs: FC = () => {
  return (
    <PageLayout>
      <Typography.Title>Subjects</Typography.Title>
      <List>
        {subjects.map(({ id, title }) => (
          <List.Item key={id}>
            <Typography.Text title="2">
              <Link to={`/subjs/${id}`}>{title}</Link>
            </Typography.Text>
          </List.Item>
        ))}
      </List>
    </PageLayout>
  );
};
