import { renderGarage } from './render';
import { state, setStateCars } from './state';
import { checkedQuerySelector } from './types/types';

export const setPaginationPage = (): void => {
    const nextButton = <HTMLButtonElement>checkedQuerySelector(document, '.next-button');
    const pagPages = checkedQuerySelector(document, '.pagination-pages');

    if (state.view === 'garage') {
        pagPages.innerHTML = `${state.garagePage} | ${state.carsCount ? Math.ceil(state.carsCount / 7) : 1}`;
        if (state.garagePage < Math.ceil(state.carsCount / 7)) {
            nextButton.disabled = false;
            nextButton.classList.remove('disabled');
        }
        if (state.carsCount <= 7) {
            nextButton.disabled = true;
            nextButton.classList.add('disabled');
        }
    } else {
        pagPages.innerHTML = `${state.winnersPage} | ${state.winnersCount ? Math.ceil(state.winnersCount / 10) : 1}`;
    }
};

export const prevBtn = (): void => {
    const prevButton = <HTMLButtonElement>checkedQuerySelector(document, '.prev-button');
    const nextButton = <HTMLButtonElement>checkedQuerySelector(document, '.next-button');
    const pagPages = <HTMLButtonElement>checkedQuerySelector(document, '.pagination-pages');
    const garagePageTitle = checkedQuerySelector(document, '.garage-page');

    prevButton.addEventListener('click', async () => {
        if (state.view === 'garage') {
            if (state.garagePage > 1) {
                state.garagePage--;
                garagePageTitle.innerHTML = `Page #${state.garagePage}`;
                pagPages.innerHTML = `${state.garagePage} | ${state.carsCount ? Math.ceil(state.carsCount / 7) : 1}`;
                await setStateCars();
                renderGarage();
                setPaginationPage();
            }
        }
        if (state.view === 'garage' && state.garagePage === 1) {
            prevButton.disabled = true;
            prevButton.classList.add('disabled');
        }
        if (state.garagePage < Math.ceil(state.carsCount / 7)) {
            nextButton.disabled = false;
            nextButton.classList.remove('disabled');
        }
    });
};

export const nextBtn = (): void => {
    const nextButton = <HTMLButtonElement>checkedQuerySelector(document, '.next-button');
    const prevButton = <HTMLButtonElement>checkedQuerySelector(document, '.prev-button');
    const garagePageTitle = checkedQuerySelector(document, '.garage-page');

    if (state.view === 'garage' && state.carsCount > 7) {
        nextButton.disabled = false;
        nextButton.classList.remove('disabled');
    }

    nextButton.addEventListener('click', async () => {
        prevButton.disabled = false;
        prevButton.classList.remove('disabled');
        state.garagePage++;
        await setStateCars();
        renderGarage();
        setPaginationPage();
        garagePageTitle.innerHTML = `Page #${state.garagePage}`;

        if (state.garagePage === Math.ceil(state.carsCount / 7)) {
            nextButton.disabled = true;
            nextButton.classList.add('disabled');
        }
    });
};
