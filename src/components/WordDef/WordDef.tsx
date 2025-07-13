import { styled } from '@linaria/react';
import { Button, Divider, Flex } from 'antd';
import { type FC, useRef } from 'react';
import type { WordDefinition } from '../../api/defs';
import { Colors } from '../../consts/colors';
import { speak } from '../../utils/speak';
import { TermStatus } from '../TermStatus/TermStatus';
import { WordTypeInfo } from '../WordTypeInfo';

export const WordDef: FC<{
  def: WordDefinition;
  lang: string;
  className?: string;
  detailed?: boolean;
}> = ({ def, lang, className, detailed }) => {
  const [audio] = def.audios ?? [];

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className={className}>
      <DefHeading>
        <TermStatus subj={lang} mode={'forward'} term={def.title} />
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
        {audio && (
          <audio ref={audioRef} key={audio.url}>
            <source src={audio.url} />
          </audio>
        )}
      </DefHeading>
      <IpasList component="ul" justify="center">
        {def.ipas?.map((ipa) => (
          <IpaItem key={ipa}>{ipa}</IpaItem>
        ))}
      </IpasList>
      <Divider />
      {def.types && (
        <div>
          {def.types.map((type, index, types) => (
            <div key={type.type}>
              <SWordTypeInfo subj={lang} detailed={detailed} type={type} />
              {index < types.length - 1 && <Divider />}
            </div>
          ))}
        </div>
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

const SWordTypeInfo = styled(WordTypeInfo)`
  width: 100%;
`;
