import { stopEngine } from '../api';
import { CarData, checkedQuerySelector } from '../types/types';
import { handleDisabled } from '../utils';

export async function changeStylesControlRaceBtns(btnClick: string, car?: CarData): Promise<void> {
    const resetBtn = <HTMLButtonElement>checkedQuerySelector(document, '.reset-button');
    const createBtn = <HTMLButtonElement>checkedQuerySelector(document, '.create-btn');
    const raceAllBtn = <HTMLButtonElement>checkedQuerySelector(document, '.race-button');
    const generateBtn = <HTMLButtonElement>checkedQuerySelector(document, '.generate-button');

    if (btnClick === 'startA' || btnClick === 'race') {
        handleDisabled([resetBtn, createBtn, raceAllBtn, generateBtn]);
    }
    if (btnClick === 'startB' || btnClick === 'reset') {
        handleDisabled([resetBtn, createBtn, raceAllBtn, generateBtn]);
        if (car) {
            const id = car.id;
            const buttonA = <HTMLButtonElement>document.getElementById(`start-engine-car-${id}`);
            const buttonB = <HTMLButtonElement>document.getElementById(`stop-engine-car-${id}`);
            const selectBtn = <HTMLButtonElement>document.getElementById(`select-car-${id}`);
            const removeBtn = <HTMLButtonElement>document.getElementById(`remove-car-${id}`);
            const carItem = <HTMLElement>document.getElementById(`${id}`);
            await stopEngine(id);
            handleDisabled([buttonB, buttonA, selectBtn, removeBtn]);
            carItem.style.animationName = '';
            carItem.style.animationPlayState = 'initial';
        }
    }
}
