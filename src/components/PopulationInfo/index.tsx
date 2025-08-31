import type { PopulationInfoProps } from '../../types/country';
import getLatestPopulation from '../../utils/getLatestPopulation';
import getPopulationForYear from '../../utils/getPopulationForYear';

export function PopulationInfo({
  data,
  selectedYear,
  isHighlighted,
}: PopulationInfoProps) {
  const populationValue = selectedYear
    ? getPopulationForYear(data, selectedYear)
    : getLatestPopulation(data);

  return (
    <div className={`population-info ${isHighlighted ? 'highlighted' : ''}`}>
      <strong>
        Population {selectedYear ? `(${selectedYear})` : '(latest)'}:
      </strong>{' '}
      {populationValue}
    </div>
  );
}
