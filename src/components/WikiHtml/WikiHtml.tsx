import { styled } from '@linaria/react';
import type { FC, KeyboardEvent, MouseEvent } from 'react';
import sanitize from 'sanitize-html';
import { Colors } from '../../consts/colors';

export const WikiHtml: FC<{ html?: string; className?: string }> = ({
  className,
  html,
}) => {
  const onNav = (e: MouseEvent | KeyboardEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      e.preventDefault();

      window.open(`https://en.wiktionary.com/${e.target.href}`, '_brank');
    }
  };
  return (
    <div
      className={className}
      onClick={onNav}
      onKeyUp={onNav}
      onKeyDown={onNav}
      onKeyPress={onNav}
    >
      <SArticle
        // biome-ignore lint/security/noDangerouslySetInnerHtml: wiki HTML
        dangerouslySetInnerHTML={{
          __html: sanitize(html ?? '', {
            allowedClasses: {
              h1: true,
              h2: true,
              h3: true,
              h4: true,
              h5: true,
              h6: true,
            },
            allowedAttributes: {
              td: ['rowspan', 'colspan'],
              th: ['rowspan', 'colspan'],
            },
          }),
        }}
      />
    </div>
  );
};

const SArticle = styled.article`
    text-align: left;

    h1 + span,
    h2 + span,
    h3 + span,
    h4 + span,
    h5 + span,
    h6 + span {
        display: none;
    }

    /* div:has(table) {
        overflow: auto;
    } */

    table  {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        border-collapse: collapse;
    }    

    td, th {
        border: 1px solid ${Colors.greys[0]};

    }
`;
