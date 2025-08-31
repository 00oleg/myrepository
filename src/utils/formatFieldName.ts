function formatFieldName(fieldName: string): string {
  return fieldName
    .split('_')
    .map((word) => {
      const lower = word.toLowerCase();
      if (['co2', 'gdp', 'ghg', 'lucf', 'luc'].includes(lower)) {
        return word.toUpperCase();
      }
      if (lower === 'prct') {
        return '%';
      }
      if (lower === 'abs') {
        return 'absolute';
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export default formatFieldName;
