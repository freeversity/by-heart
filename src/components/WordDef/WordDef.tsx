import { styled } from '@linaria/react';
import { Button, Divider, Flex } from 'antd';
import { type FC, useMemo, useRef } from 'react';
import type { WordDefinition } from '../../api/defs';
import { Colors } from '../../consts/colors';
import { speak } from '../../utils/speak';
import { TermStatus } from '../TermStatus';
import { WordTypeInfo } from '../WordTypeInfo';

export const WordDef: FC<{
  defPayload: WordDefinition;
  lang: string;
  className?: string;
  detailed?: boolean;
  mode?: string;
  def?: string;
  type?: string;
}> = ({
  defPayload,
  def,
  lang,
  className,
  detailed,
  type,
  mode = 'forward',
}) => {
  const [audio] = defPayload.audios ?? [];

  const audioRef = useRef<HTMLAudioElement>(null);

  const types = useMemo(
    () =>
      type
        ? defPayload.types.filter((typePayload) => typePayload.type === type)
        : defPayload.types,
    [defPayload.types, type],
  );

  return (
    <div className={className}>
      <Flex justify="space-between" align="center">
        {type ? (
          <TermStatus
            subj={lang}
            mode={mode ?? 'forward'}
            type={type}
            def={def}
            term={defPayload.title}
          />
        ) : (
          <span style={{ width: '30px' }} />
        )}

        <DefHeading>{defPayload.title} </DefHeading>

        <VoiceBtn
          shape="circle"
          size="middle"
          onClick={() => {
            const audio = audioRef.current;

            if (audio) {
              audio.play();
            } else {
              speak(defPayload.title, lang);
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
      <IpasList component="ul" justify="center">
        {defPayload.ipas?.map((ipa) => (
          <IpaItem key={ipa}>{ipa}</IpaItem>
        ))}
      </IpasList>
      <Divider />
      {types && (
        <div>
          {types.map((type, index, types) => (
            <div key={type.type}>
              <SWordTypeInfo
                hideStatus={!!type}
                term={defPayload.title}
                subj={lang}
                detailed={detailed}
                type={type}
                mode={mode}
                def={def}
              />
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
  margin: 0;
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
    color: ${Colors.gray[4]};
  }
`;

const SWordTypeInfo = styled(WordTypeInfo)`
  width: 100%;
`;
