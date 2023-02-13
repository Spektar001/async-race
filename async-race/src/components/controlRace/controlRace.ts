import { CarData, checkedQuerySelector, Race, RaceWin } from '../types/types';
import { startEngine, stopEngine, drive, saveWinner } from '../api';
import { setStateWinnersCars, state } from '../state';
import { setPaginationPage } from '../pagination';
import { renderWinners } from '../render';
import { changeStylesControlRaceBtns } from './changeStyles';
import { handleDisabled } from '../utils';

export const listenerBtnControlRace = () => {
    document.addEventListener('click', async (e) => {
        const target = <HTMLButtonElement>e.target;

        if (target.classList.contains('start-engine-btn')) {
            const num = +target.id.slice(17);
            btnAstart(num);
        }

        if (target.classList.contains('stop-engine-btn')) {
            const num = +target.id.slice(16);
            btnBstop(num);
        }

        if (target.classList.contains('race-button')) {
            btnRace();
        }

        if (target.classList.contains('reset-button')) {
            btnReset();
        }
    });
};

const btnAstart = async (id: number): Promise<void> => {
    changeStylesControlRaceBtns('startA');
    const message = <HTMLElement>checkedQuerySelector(document, '.message');
    const car = <HTMLElement>document.getElementById(`${id}`);
    const buttonA = <HTMLButtonElement>document.getElementById(`start-engine-car-${id}`);
    const buttonB = <HTMLButtonElement>document.getElementById(`stop-engine-car-${id}`);
    const selectBtn = <HTMLButtonElement>document.getElementById(`select-car-${id}`);
    const removeBtn = <HTMLButtonElement>document.getElementById(`remove-car-${id}`);
    handleDisabled([buttonA, buttonB, selectBtn, removeBtn]);
    const { velocity, distance } = await startEngine(id);
    const time = distance / velocity;
    car.style.animationName = 'race';
    car.style.animationDuration = `${time}ms`;
    const { success } = await drive(id);
    console.log('success', success);
    await setStateWinnersCars();
    setPaginationPage();
    renderWinners();

    if (!success) {
        car.style.animationPlayState = 'paused';
    }
    if (state.carsCount === 1 && success === true) {
        message.style.display = 'block';
        message.textContent = `${state.cars[id - 1].name} went first ${(time / 1000).toFixed(2)}s`;
        saveWinner({
            id: id,
            time: +(time / 1000).toFixed(2),
            color: state.cars[id - 1].color,
            name: state.cars[id - 1].name,
        });
    }
};

const btnBstop = async (id: number): Promise<void> => {
    changeStylesControlRaceBtns('startB');
    const message = <HTMLElement>checkedQuerySelector(document, '.message');
    const car = <HTMLElement>document.getElementById(`${id}`);
    const buttonA = <HTMLButtonElement>document.getElementById(`start-engine-car-${id}`);
    const buttonB = <HTMLButtonElement>document.getElementById(`stop-engine-car-${id}`);
    const selectBtn = <HTMLButtonElement>document.getElementById(`select-car-${id}`);
    const removeBtn = <HTMLButtonElement>document.getElementById(`remove-car-${id}`);
    handleDisabled([buttonA, buttonB, selectBtn, removeBtn]);
    await stopEngine(id);
    message.style.display = 'none';
    car.style.animationName = '';
    car.style.animationPlayState = 'initial';
};

const btnReset = () => {
    const message = <HTMLElement>checkedQuerySelector(document, '.message');
    const resetBtn = <HTMLButtonElement>checkedQuerySelector(document, '.reset-button');
    resetBtn.disabled = true;
    resetBtn.classList.add('disabled');
    message.style.display = 'none';
    state.cars.map((car) => changeStylesControlRaceBtns('reset', car));
};

const btnRace = async () => {
    changeStylesControlRaceBtns('race');
    const resetBtn = <HTMLButtonElement>checkedQuerySelector(document, '.reset-button');
    const message = <HTMLElement>checkedQuerySelector(document, '.message');
    resetBtn.disabled = false;
    resetBtn.classList.remove('disabled');
    const racePromises = state.cars.map((car) => raceCar(car));
    const winner = await raceAll(
        racePromises,
        state.cars.map((car) => car.id)
    );
    await setStateWinnersCars();
    setPaginationPage();
    renderWinners();
    if (winner.id) {
        message.style.display = 'block';
        message.textContent = `${winner.name} went first ${winner.time}s`;
        if (winner.color && winner.name) {
            saveWinner({ id: winner.id, time: winner.time, color: winner.color, name: winner.name });
        }
    }
};

async function raceCar(car: CarData): Promise<Race> {
    const id = car.id;

    const buttonA = <HTMLButtonElement>document.getElementById(`start-engine-car-${id}`);
    const buttonB = <HTMLButtonElement>document.getElementById(`stop-engine-car-${id}`);
    const selectBtn = <HTMLButtonElement>document.getElementById(`select-car-${id}`);
    const removeBtn = <HTMLButtonElement>document.getElementById(`remove-car-${id}`);
    handleDisabled([buttonA, buttonB, selectBtn, removeBtn]);
    const carItem = <HTMLElement>document.getElementById(`${id}`);
    const { velocity, distance } = await startEngine(id);
    const time = distance / velocity;
    (document.getElementById(`${id}`) as HTMLElement).style.animationName = 'race';
    (document.getElementById(`${id}`) as HTMLElement).style.animationDuration = `${time}ms`;
    const { success } = await drive(id);
    if (!success) {
        carItem.style.animationPlayState = 'paused';
    }
    return { id, time, success };
}

async function raceAll(promises: Promise<Race>[], indexes: number[]): Promise<RaceWin> {
    const { success, id, time } = await Promise.race(promises);

    if (!success) {
        console.log('success', success);
        const failCarIdx = indexes.findIndex((idx) => idx === id);
        console.log('failCarIdx', failCarIdx);
        const restOfPromises = [...promises.slice(0, failCarIdx), ...promises.slice(failCarIdx + 1, promises.length)];
        console.log('restOfPromises', restOfPromises);
        const restOfIndexes = [...indexes.slice(0, failCarIdx), ...indexes.slice(failCarIdx + 1, indexes.length)];
        console.log('restOfIndexes', restOfIndexes);

        return raceAll(restOfPromises, restOfIndexes);
    }
    console.log('WINNER-CAR->', { ...state.cars.find((car) => car.id === id), time: +(time / 1000).toFixed(2) });

    return { ...state.cars.find((car) => car.id === id), time: +(time / 1000).toFixed(2) };
}
