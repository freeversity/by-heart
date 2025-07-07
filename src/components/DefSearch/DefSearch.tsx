import { SearchOutlined } from '@ant-design/icons';
import { styled } from '@linaria/react';
import { Input, Popover } from 'antd';
import { useAtom } from 'jotai';
import { debounce } from 'lodash';
import { type FC, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { currentSearchQuery } from '../../state/search/atoms';
import { DefSearchResults } from '../DefSearchResults/DefSearchResults';

export const DefSearch: FC<{ className?: string; subj: string }> = ({
  subj,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useAtom(currentSearchQuery);

  const onClose = () => {
    setOpen(false);
  };

  const debouncedOnChange = useMemo(
    () =>
      debounce((query) => {
        setQuery(query);
      }, 500),
    [setQuery],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        wrapperRef.current?.contains(e.target)
      )
        return;

      setOpen(false);
    };

    document.addEventListener('click', onClickOutside);

    return () => {
      document.removeEventListener('click', onClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={wrapperRef}>
      <Popover
        open={isOpen && !!query}
        arrow={false}
        placement="bottom"
        content={
          <ResultsWrapper>
            <Suspense fallback="Loading">
              <DefSearchResults subj={subj} onClose={onClose} />
            </Suspense>
          </ResultsWrapper>
        }
      >
        <SearchInput
          prefix={<SearchOutlined />}
          allowClear
          placeholder="Search"
          defaultValue={query}
          onChange={(e) => {
            debouncedOnChange(e.target.value);
          }}
          onFocus={() => {
            setOpen(true);
          }}
        />
      </Popover>
    </div>
  );
};

const ResultsWrapper = styled.div`
    max-height: 500px;
    width: 250px;
    overflow: auto;
    box-sizing: border-box;
`;

const SearchInput = styled(Input)`
    width: 275px;
`;
