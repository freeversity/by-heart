import { styled } from '@linaria/react';
import { Flex } from 'antd';
import { useAtom } from 'jotai';
import { Paginator } from 'primereact/paginator';
import { Panel } from 'primereact/panel';
import { TabPanel, TabView } from 'primereact/tabview';
import { type FC, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ModeStats } from '../components/ModeStats';
import { PageLayout } from '../components/PageLayout';
import { TermLink } from '../components/TermLink/TermLink';

import { useListId, useSubj } from '../hooks/useSubj';
import { Container } from '../layout/Container';
import {
  currentListAtom,
  currentListDef,
  currentListeningTests,
  currentReadingTests,
} from '../state/currentList/atoms';
import { DEF_PAGE_SIZE } from '../state/definitions/atoms';

const listsTitles: Record<string, string> = {
  fr_50k: 'French 50K',
  tcf: 'TCF Tests',
};

const PAGE_SIZE = 50;

export const DefList: FC = () => {
  const subj = useSubj();
  const listId = useListId();

  const [defList] = useAtom(currentListDef({ subj, id: listId }));
  const [listeningTests] = useAtom(currentListeningTests({ subj, id: listId }));
  const [readingTests] = useAtom(currentReadingTests({ subj, id: listId }));
  const [params, setParams] = useSearchParams();

  const page = +(params.get('page') ?? 1);

  const [activeTab, setActiveTab] = useState(0);

  const mode = ['forward', 'reverse', 'spelling'][activeTab] ?? 'forward';

  const pageItems = useMemo(
    () => defList.slice((page - 1) * DEF_PAGE_SIZE, page * DEF_PAGE_SIZE),
    [defList, page],
  );

  return (
    <PageLayout>
      <Content>
        <h1>{listsTitles[listId]}</h1>
        {!!defList.length && (
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
        )}

        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
        >
          {[
            ...(defList.length
              ? [
                  <TabPanel key="forward" header="Forward">
                    <ModeStats
                      mode={'forward'}
                      listId={listId}
                      list={defList}
                      subj={subj}
                    />
                  </TabPanel>,
                  <TabPanel key="reverse" header="Reverse">
                    <ModeStats
                      mode={'reverse'}
                      listId={listId}
                      list={defList}
                      subj={subj}
                    />
                  </TabPanel>,
                  <TabPanel key="spelling" header="Spelling Bee">
                    <ModeStats
                      mode="spelling"
                      listId={listId}
                      list={defList}
                      subj={subj}
                    />
                  </TabPanel>,
                ]
              : []),
            ...(listeningTests.length
              ? [
                  <TabPanel key="listening" header="Listening">
                    <TestsList>
                      {listeningTests.map(({ id, title }) => (
                        <li key={id}>
                          <Link
                            to={`/subjs/${subj}/lists/${listId}/listening/${id}`}
                          >
                            {title}
                          </Link>
                        </li>
                      ))}
                    </TestsList>
                  </TabPanel>,
                ]
              : []),
            ...(readingTests.length
              ? [
                  <TabPanel key="reading" header="Reading">
                    <TestsList>
                      {readingTests.map(({ id, title }) => (
                        <li key={id}>
                          <Link
                            to={`/subjs/${subj}/lists/${listId}/reading/${id}`}
                          >
                            {title}
                          </Link>
                        </li>
                      ))}
                    </TestsList>
                  </TabPanel>,
                ]
              : []),
          ]}
        </TabView>
        {!!defList.length && (
          <Panel
            header={`Definitions (${Intl.NumberFormat().format(
              defList.length,
            )})`}
            footer={
              <Paginator
                first={(page - 1) * PAGE_SIZE}
                rows={PAGE_SIZE}
                totalRecords={defList.length}
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
        )}
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
  gap: 20px;
`;

const TestsList = styled.ul`
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 10px;
`;
