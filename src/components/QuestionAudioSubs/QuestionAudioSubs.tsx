import { styled } from '@linaria/react';
import { Button } from 'primereact/button';
import { type FC, useState } from 'react';
import { Colors } from '../../consts/colors';
import { useQuestionAtomValue } from '../../hooks/useQuestionIndex';
import { testQuestionTextAtom } from '../../state/tests/testsAtoms';

export const QuestionAudioSubs: FC<{
  cueText: string;
}> = ({ cueText }) => {
  const [fullSubs, setSubsFull] = useState(false);

  const subs = useQuestionAtomValue(testQuestionTextAtom);

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
