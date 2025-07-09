import { styled } from '@linaria/react';
import { Button, Flex } from 'antd';
import { useAtom } from 'jotai';
import { type FC, useRef } from 'react';
import { Colors } from '../../consts/colors';
import { definitionAtom } from '../../state/currentDef/atoms';
import { speak } from '../../utils/speak';

export const FlashCard: FC<{
  def: string;
  subj: string;
  className?: string;
}> = ({ def, subj, className }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [defPayload] = useAtom(definitionAtom({ subj, def }));

  const [audio] = defPayload.audios ?? [];

  return (
    <div className={className}>
      <DefHeading>
        {defPayload.title}{' '}
        <VoiceBtn
          shape="circle"
          size="middle"
          onClick={() => {
            const audio = audioRef.current;

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
      <IpasList component="ul" justify="center">
        {defPayload.ipas?.map((ipa) => (
          <IpaItem key={ipa}>{ipa}</IpaItem>
        ))}
      </IpasList>
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
