import { type FC, Suspense, useState } from 'react';
import { QuestionAudioSubs } from '../QuestionAudioSubs/QuestionAudioSubs';

export const QuestionAudio: FC<{
  subPath: string | null;
  src: string;
  subsOpen: boolean;
}> = ({ src, subPath, subsOpen }) => {
  const [cueText, setCueText] = useState('');

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
        <Suspense>
          <QuestionAudioSubs cueText={cueText} />
        </Suspense>
      )}
    </div>
  );
};
