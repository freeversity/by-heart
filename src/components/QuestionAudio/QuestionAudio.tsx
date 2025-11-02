import { styled } from '@linaria/react';
import { Button } from 'primereact/button';
import { type FC, useState } from 'react';
import { Colors } from '../../consts/colors';

export const QuestionAudio: FC<{
  subPath: string | null;
  src: string;
  subsOpen: boolean;
  subs: string | null;
}> = ({ src, subPath, subsOpen, subs }) => {
  const [cueText, setCueText] = useState('');
  const [fullSubs, setSubsFull] = useState(false);

  return (
    <div>
      <audio
        crossOrigin="anonymous"
        controls
        ref={(audio) => {
          const handler = () => {
            const cue = audio?.textTracks[0]?.activeCues?.[0];

            if (!cue || !('text' in cue) || typeof cue.text !== 'string')
              return;

            setCueText(cue.text);
          };

          audio?.textTracks[0]?.addEventListener('cuechange', handler);

          return () => {
            audio?.textTracks[0]?.removeEventListener('cuechange', handler);
          };
        }}
      >
        <source src={src} />
        {subPath && (
          <track kind="subtitles" src={subPath} default srcLang="fr" />
        )}
      </audio>
      {subPath && subsOpen && (
        <Subtitles>
          <FullSubBtn
            size="small"
            className={`pi ${fullSubs ? 'pi-chevron-down' : 'pi-chevron-up'}`}
            onClick={() => {
              setSubsFull((show) => !show);
            }}
            severity="secondary"
            rounded
          />
          <pre>{fullSubs ? subs : cueText}</pre>
        </Subtitles>
      )}
    </div>
  );
};

const Subtitles = styled.div`
  position: relative;
  min-height: 40px;
  border: 1px solid ${Colors.gray[2]};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullSubBtn = styled(Button)`
  position: absolute;
  top: 5px;
  right: 5px;

  .p-button-label {
    display: none;
  }
`;
