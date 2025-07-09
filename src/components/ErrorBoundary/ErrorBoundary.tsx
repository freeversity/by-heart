import { Alert, Typography } from 'antd';
import { isAxiosError } from 'axios';
import { Component, type ReactNode } from 'react';

const defUrlRegex =
  /https\:\/\/wiktionary.freeversity.io\/v0\/(\w+)\/defs\/([\w-_]+).json/;

const anchorseBySubj: Record<string, string | undefined> = {
  fr: 'French',
};

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error?: unknown }
> {
  state: { error?: unknown } = {};

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    if (!isAxiosError(error) || error.status !== 404 || !error.config?.url)
      return <Alert type="error" message="Something went wrong" />;

    let [, subj, encodedTerm] = defUrlRegex.exec(error.config.url) ?? [];

    encodedTerm = encodedTerm?.replace(/-/g, '+').replace(/_/g, '/');

    if (!encodedTerm || !subj)
      return <Alert type="error" message="Something went wrong" />;

    while (encodedTerm.length % 4) {
      encodedTerm += '=';
    }

    const term = atob(encodedTerm);

    const anchor = anchorseBySubj[subj] ? `#${anchorseBySubj[subj]}` : '';

    return (
      <Alert
        type="warning"
        message={
          <Typography.Text>
            Term "{term}" was not found in our base. Check Wiktionary, it might
            be there:{' '}
            <a
              href={`https://en.wiktionary.com/wiki/${term}${anchor}`}
              target="_blank"
              rel="noreferrer"
            >
              {term}
            </a>
          </Typography.Text>
        }
      />
    );
  }
}
