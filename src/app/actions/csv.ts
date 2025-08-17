'use server';

import type { SelectedItem } from '../../store/selectedItemsStore';

export async function generateCSVAction(items: SelectedItem[]) {
  try {
    const rows = items.map((item) => {
      return [item.uid, item.name, item.earthAnimal];
    });

    const csvContent = [['UUID', 'Name', 'Earth Animal'], ...rows]
      .map((e) => e.join(';'))
      .join('\r\n');

    return {
      success: true,
      data: csvContent,
      filename: `${items.length}_animals.csv`,
    };
  } catch (error) {
    console.error('Error generating CSV:', error);
    return {
      success: false,
      error: 'Failed to generate CSV file',
    };
  }
}
