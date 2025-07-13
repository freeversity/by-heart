import { styled } from '@linaria/react';
import { Button, Flex, Skeleton } from 'antd';
import { useAtom } from 'jotai';
import { type FC, useRef } from 'react';
import { Colors } from '../../consts/colors';
import { definitionAtom } from '../../state/currentDef/atoms';
import { speak } from '../../utils/speak';
import { TermStatus } from '../TermStatus/TermStatus';

export const FlashCard: FC<{
  term: string;
  def?: string;
  subj: string;
  mode: string;
  className?: string;
  hidden?: boolean;
  ipaHidden?: boolean;
  setIpaHidden?: (isHidden: boolean) => void;
}> = ({
  term,
  subj,
  className,
  hidden,
  setIpaHidden,
  ipaHidden,
  mode,
  def,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [defPayload] = useAtom(definitionAtom({ subj, def: term }));

  const [audio] = defPayload.audios ?? [];

  return (
    <div className={className}>
      <DefHeading>
        {!hidden && (
          <TermStatus subj={subj} mode={mode} term={term} def={def} />
        )}
        {hidden ? <HiddenTitle /> : defPayload.title}{' '}
        <VoiceBtn
          shape="circle"
          size="middle"
          onClick={() => {
            const audio = audioRef.current;

            setIpaHidden?.(false);

            if (audio) {
              audio.play();
            } else {
              speak(defPayload.title, subj);
            }
          }}
        >
          {audio ? '🔊' : '🤖'}
        </VoiceBtn>
        {audio && (
          <audio ref={audioRef} key={audio.url}>
            <source src={audio.url} />
          </audio>
        )}
      </DefHeading>
      {!ipaHidden && (
        <IpasList wrap="wrap" component="ul" justify="center">
          {defPayload.ipas?.map((ipa) => (
            <IpaItem key={ipa}>{ipa}</IpaItem>
          ))}
        </IpasList>
      )}
    </div>
  );
};

const VoiceBtn = styled(Button)`
  font-size: 14px;
`;

const DefHeading = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  text-align: center;
  margin-bottom: 5px;
`;

const IpasList = styled(Flex)`
  margin: 10px 0;
  list-style: none;
  flex-wrap: wrap;
`;

const IpaItem = styled.li`
  margin: 0 4px;

  &:not(:last-child)::after {
    margin-left: 8px;
    display: inline-block;
    content: '•';
    color: ${Colors.greys[0]};
  }
`;

const HiddenTitle = styled(Skeleton.Input)`
  margin: 5px 0;
`;
