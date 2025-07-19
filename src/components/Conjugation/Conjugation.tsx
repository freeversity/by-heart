import { styled } from '@linaria/react';
import { Card } from 'primereact/card';
import type { FC } from 'react';
import { FrMod, FrTense, type WordConjugation } from '../../api/defs';

const modLabel = {
  [FrMod.Indc]: 'Indicatif',
  [FrMod.Subj]: 'Subjunctive',
  [FrMod.Cond]: 'Conditionnel',
  [FrMod.Part]: 'Participe',
  [FrMod.Infn]: 'Infinitif',
  [FrMod.Gern]: 'Gerund',
};

const tenseLabel = {
  [FrTense.Pres]: 'Présent',
  [FrTense.PassC]: 'Passé composé',
  [FrTense.Impf]: 'Imparfait',
  [FrTense.Pqpf]: 'Plus-que-parfait',
  [FrTense.PassS]: 'Passé simple',
  [FrTense.PassA]: 'Passé antérieur',
  [FrTense.Futr]: 'Futur simple',
  [FrTense.FutrA]: 'Futur antérieur',
  [FrTense.SubjPr]: 'Présent',
  [FrTense.SubjPs]: 'Passé',
  [FrTense.SubjIm]: 'Imparfait',
  [FrTense.SubjPq]: 'Plus-que-parfait',
  [FrTense.CondPr]: 'Présent',
  [FrTense.CondPp]: 'Passé première',
  [FrTense.CondPd]: 'Passé deuxième',
  [FrTense.ImprPr]: 'Présent',
  [FrTense.ImprPs]: 'Passé',
  [FrTense.PartPr]: 'Présent',
  [FrTense.PartPs]: 'Passé',
  [FrTense.InfnPr]: 'Présent',
  [FrTense.InfnPs]: 'Passé',
  [FrTense.GernPr]: 'Présent',
  [FrTense.GernPs]: 'Passé',
};

export const Conjugation: FC<{
  conj: WordConjugation[];
  className?: string;
}> = ({ conj, className }) => {
  return (
    <div className={className}>
      {conj.map(({ mod, tenses }) => (
        <section key={mod}>
          <CardHeading>{modLabel[mod]}</CardHeading>
          <Mod>
            {tenses.map(({ tense, forms }) => (
              <ConjCard key={tense} title={tenseLabel[tense]}>
                <ConjList>
                  {forms.map((row, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: no sorting
                    <ConjItem key={index}>{row.join('')}</ConjItem>
                  ))}
                </ConjList>
              </ConjCard>
            ))}
          </Mod>
        </section>
      ))}
    </div>
  );
};

const Mod = styled.div`
    gap: 5px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const ConjCard = styled(Card)`
  flex-basis: 25%;
  flex-grow: 1;
  min-width: 200px;

  .p-card-title {
    font-size: 18px;
    flex-wrap: nowrap;
  }

  .ant-card-body {
    padding: 5px 12px;
  }
`;

const CardHeading = styled.h4`
  font-size: 20px;  
`;

const ConjList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ConjItem = styled.li`
  line-height: 1.8;
`;
