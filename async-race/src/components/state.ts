import { StateData } from './types/types';
import { getCars, getWinners } from './api';

export const state: StateData = {
    cars: [],
    carsCount: 0,
    winners: [],
    winnersCount: 0,
    garagePage: 1,
    winnersPage: 1,
    view: 'garage',
    sort: 'time',
    sortOrder: 'asc',
    newCar: {},
    updateCar: {},
};

export const setStateCars = async (): Promise<void> => {
    const data = await getCars(state.garagePage);
    state.cars = data.cars;
    state.carsCount = +data.count;
};

export const setStateWinnersCars = async (): Promise<void> => {
    const data = await getWinners(state.winnersPage, 10, state.sort, state.sortOrder);
    state.winners = data.winners;
    state.winnersCount = +data.count;
};
