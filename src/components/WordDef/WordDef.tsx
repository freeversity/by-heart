import { styled } from '@linaria/react';
import { Button, Card, Flex } from 'antd';
import { type FC, useRef } from 'react';
import type { WordDefinition } from '../../api/defs';
import { Colors } from '../../consts/colors';
import { speak } from '../../utils/speak';
import { WordTypeInfo } from '../WordTypeInfo';

export const WordDef: FC<{
  def: WordDefinition;
  lang: string;
  className?: string;
}> = ({ def, lang, className }) => {
  const [audio] = def.audios ?? [];

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <Card
      title={
        <>
          <DefHeading>
            {def.title}{' '}
            <VoiceBtn
              shape="circle"
              size="middle"
              onClick={() => {
                const audio = audioRef.current;

                if (audio) {
                  audio.play();
                } else {
                  speak(def.title, lang);
                }
              }}
            >
              {audio ? '🔊' : '🤖'}
            </VoiceBtn>
          </DefHeading>
          <IpasList component="ul" justify="center">
            {def.ipas.map((ipa) => (
              <IpaItem key={ipa}>{ipa}</IpaItem>
            ))}
            {audio && (
              <audio ref={audioRef}>
                <source src={audio?.url} />
              </audio>
            )}
          </IpasList>
        </>
      }
      className={className}
    >
      {def.types && (
        <div>
          {def.types.map((type) => (
            <WordTypeInfo key={type.type} type={type} />
          ))}
        </div>
      )}
    </Card>
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
  margin: 0 10px;

  &:not(:last-child)::after {
    margin-left: 8px;
    display: inline-block;
    content: '•';
    color: ${Colors.greys[0]};
  }
`;

const TypeHeading = styled.h2`
  text-align: left;

  
`;

const FromLabel = styled.span`
    color: ${Colors.greys[2]};
    font-size: 0.8em;
    font-weight: 400;
    font-style: italic;
`;

const TransList = styled.ul`
  text-align: left;
`;
