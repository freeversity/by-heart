import {
  EditOutlined,
  PlayCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Button, Flex, Pagination, Typography } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAtom } from 'jotai';
import { Paginator } from 'primereact/paginator';
import { Panel } from 'primereact/panel';
import { TabPanel, TabView } from 'primereact/tabview';
import { type FC, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ModeStats } from '../components/ModeStats';
import { PageLayout } from '../components/PageLayout';
import { SubjShortStats } from '../components/SubjShortStats';
import { TermLink } from '../components/TermLink/TermLink';
import { db } from '../db';
import { useListId, useSubj } from '../hooks/useSubj';
import { Container } from '../layout/Container';
import { currentListAtom } from '../state/currentList/atoms';
import { DEF_PAGE_SIZE } from '../state/definitions/atoms';
import { formatDuration } from '../utils/formatDuration';

const listsTitles: Record<string, string> = {
  fr_50k: 'French 50K',
};

const PAGE_SIZE = 50;

export const DefList: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [list] = useAtom(currentListAtom({ subj, id: listId }));
  const [params, setParams] = useSearchParams();

  const page = +(params.get('page') ?? 1);

  const [activeTab, setActiveTab] = useState(0);

  const mode = ['forward', 'reverse', 'spelling'][activeTab] ?? 'forward';

  const pageItems = useMemo(
    () => list.slice((page - 1) * DEF_PAGE_SIZE, page * DEF_PAGE_SIZE),
    [list, page],
  );

  return (
    <PageLayout>
      <Content>
        <h1>{listsTitles[listId]}</h1>
        <ButtonsWrapper>
          <Link
            className="p-button font-bold"
            color="blue"
            // icon={<PlayCircleFilled />}
            to={`/subjs/${subj}/lists/${listId}/play/forward`}
          >
            <i className="pi pi-chevron-circle-right" /> Play forward
          </Link>

          <Link
            className="p-button font-bold"
            color="blue"
            // icon={<PlayCircleFilled />}
            to={`/subjs/${subj}/lists/${listId}/play/reverse`}
          >
            <i className="pi pi-undo" /> Play reverse
          </Link>

          <Link
            className="p-button font-bold"
            color="blue"
            // icon={<PlayCircleFilled />}
            to={`/subjs/${subj}/lists/${listId}/play/spelling`}
          >
            <i className="pi pi-pen-to-square" /> Spelling Bee
          </Link>
        </ButtonsWrapper>

        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
        >
          <TabPanel header="Forward">
            <ModeStats
              mode={'forward'}
              listId={listId}
              list={list}
              subj={subj}
            />
          </TabPanel>
          <TabPanel header="Reverse">
            <ModeStats
              mode={'reverse'}
              listId={listId}
              list={list}
              subj={subj}
            />
          </TabPanel>
          <TabPanel header="Spelling Bee">
            <ModeStats
              mode="spelling"
              listId={listId}
              list={list}
              subj={subj}
            />
          </TabPanel>
        </TabView>
        <Panel
          header={`Definitions (${Intl.NumberFormat().format(list.length)})`}
          footer={
            <Paginator
              first={(page - 1) * PAGE_SIZE}
              rows={PAGE_SIZE}
              totalRecords={list.length}
              // ={page}
              onPageChange={({ page }) => {
                const params = new URLSearchParams([['page', `${page + 1}`]]);

                setParams(params);
              }}
            />
          }
        >
          <Flex wrap="wrap" gap="5px 15px">
            {pageItems.map((def) => (
              <TermLink key={def} mode={mode} term={def} subj={subj} />
            ))}
          </Flex>
        </Panel>
      </Content>
    </PageLayout>
  );
};

const ButtonsWrapper = styled.div`
  justify-content: center;
  
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const Content = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 20px
`;
