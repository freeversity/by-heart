import { styled } from '@linaria/react';
import { useAtomValue } from 'jotai';
import { Button } from 'primereact/button';
import { type FC, useState } from 'react';
import { Colors } from '../../consts/colors';
import {
  currentQuestionIndexAtom,
  currentTestIdAtom,
  testQuestionTextAtom,
} from '../../state/currentTest/atoms';

export const QuestionAudioSubs: FC<{
  cueText: string;
}> = ({ cueText }) => {
  const [fullSubs, setSubsFull] = useState(false);

  const testId = useAtomValue(currentTestIdAtom);
  const qIndex = useAtomValue(currentQuestionIndexAtom);

  if (!testId) throw new Error('Test id is not valid');

  const subs = useAtomValue(
    testQuestionTextAtom({ testId, questionIndex: qIndex }),
  );

  return (
    <div>
      Subtitles:
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
