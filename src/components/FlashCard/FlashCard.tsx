import { styled } from '@linaria/react';
import { Button, Flex, Skeleton, Typography } from 'antd';
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
  type: string;
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
  type,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [defPayload] = useAtom(definitionAtom({ subj, def: term }));

  const [audio] = defPayload.audios ?? [];

  return (
    <div className={className}>
      <Flex justify="space-between" align="center">
        {hidden ? (
          <span style={{ width: '30px' }} />
        ) : (
          <TermStatus
            subj={subj}
            mode={mode}
            term={term}
            type={type}
            def={def}
          />
        )}

        <DefHeading>
          {hidden ? (
            <HiddenTitle />
          ) : (
            <>
              {defPayload.title} {type && <TypeLabel>({type})</TypeLabel>}
            </>
          )}
        </DefHeading>
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
      </Flex>

      {audio && (
        <audio ref={audioRef} key={audio.url}>
          <source src={audio.url} />
        </audio>
      )}
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
  margin: 0;
`;

const TypeLabel = styled(Typography.Text)`
  color: ${Colors.neutral[6]};
  font-size: 0.8em;
  font-style: italic;
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
