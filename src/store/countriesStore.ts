import { create } from 'zustand';
import countriesAll from '../utils/countriesAll';

interface CountriesState {
  list: string[];
}

export const useCountriesStore = create<CountriesState>(() => ({
  list: [...countriesAll],
}));
