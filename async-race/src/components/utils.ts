import { state, setStateCars, setStateWinnersCars } from './state';
import { checkedQuerySelector } from './types/types';
import { createCar, updateCar, deleteCar, getCar, getWinners, deleteWinner, updateWinner, getWinner } from './api';
import { renderGarage, renderWinners } from './render';
import { setPaginationPage } from './pagination';
import { listenerBtnControlRace } from './controlRace/controlRace';

export const createCarBtn = (): void => {
    const createName = <HTMLInputElement>checkedQuerySelector(document, '.create-name');
    const createColor = <HTMLInputElement>checkedQuerySelector(document, '.create-color');
    const createBtn = checkedQuerySelector(document, '.create-btn');
    createBtn.addEventListener('click', async () => {
        if (createName.value === '') {
            await createCar({ name: `${getRandomName()}`, color: `${createColor.value}` });
            await setStateCars();
            renderGarage();
            setPaginationPage();
        } else {
            await createCar({ name: `${createName.value}`, color: `${createColor.value}` });
            await setStateCars();
            renderGarage();
            setPaginationPage();
        }
        createName.value = '';
        createColor.value = '#000000';
    });
};

export const listenerBtnUpdateCar = () => {
    document.addEventListener('click', async (e) => {
        const target = <HTMLButtonElement>e.target;
        if (target.classList.contains('select-btn')) {
            const num = +target.id.slice(11);
            selectCarBtn(num);
            updateCarBtn();
        }
    });
};

const updateCarBtn = (): void => {
    const inputName = <HTMLInputElement>checkedQuerySelector(document, '.update-name');
    const inputColor = <HTMLInputElement>checkedQuerySelector(document, '.update-color');
    const updateBtn = <HTMLButtonElement>checkedQuerySelector(document, '.update-btn');
    updateBtn.addEventListener('click', async () => {
        if (state.updateCar.id) {
            const winnerCar = await getWinner(state.updateCar.id);
            const newValuesCar = { name: `${inputName.value}`, color: `${inputColor.value}` };
            await updateCar(state.updateCar.id, newValuesCar);
            await updateWinner(state.updateCar.id, {
                id: state.updateCar.id,
                wins: winnerCar.wins,
                time: winnerCar.time,
                name: `${inputName.value}`,
                color: `${inputColor.value}`,
            });
            inputName.value = '';
            inputColor.value = '#000000';
            await setStateCars();
            await setStateWinnersCars();
            renderGarage();
            renderWinners();
            updateBtn.disabled = true;
            inputName.disabled = true;
            inputColor.disabled = true;
            updateBtn.classList.add('disabled');
            inputName.classList.add('disabled');
            inputColor.classList.add('disabled');
        }
    });
};

const selectCarBtn = async (id: number): Promise<void> => {
    const updateName = <HTMLInputElement>checkedQuerySelector(document, '.update-name');
    const updateColor = <HTMLInputElement>checkedQuerySelector(document, '.update-color');
    const updateBtn = <HTMLButtonElement>checkedQuerySelector(document, '.update-btn');
    const car = await getCar(id);
    updateName.value = car.name;
    updateColor.value = car.color;
    state.updateCar = { id: car.id, name: car.name, color: car.color };
    updateBtn.disabled = false;
    updateName.disabled = false;
    updateColor.disabled = false;
    updateName.classList.remove('disabled');
    updateColor.classList.remove('disabled');
    updateBtn.classList.remove('disabled');
};

export const removeCarBtn = (): void => {
    document.addEventListener('click', async (e) => {
        const target = <HTMLButtonElement>e.target;
        if (target.classList.contains('remove-btn')) {
            const num = +target.id.slice(11);
            await deleteCar(num);
            await deleteWinner(num);
            await setStateCars();
            await setStateWinnersCars();
            renderGarage();
            renderWinners();
            setPaginationPage();
        }
    });
};

const models = [
    'Audi',
    'BMW',
    'Ford',
    'Honda',
    'KIA',
    'Mazda',
    'Mercedes',
    'Nissan',
    'Skoda',
    'Toyota',
    'Bentley',
    'Bugatti',
    'Ferrari',
    'Porsche',
    'Lamborghini',
    'Lexus',
    'Volvo',
    'Infiniti',
    'Tesla',
    'Cadillac',
    'Dodge',
];
const names = [
    'A8',
    'Q7',
    'Clio',
    'Megan',
    'Panamera',
    'X7',
    'Fusion',
    'Civic',
    'Rio',
    'RX-7',
    'CLS',
    '350Z',
    'Rapid',
    'Camry',
    'Viper',
    'Cayman',
    'Aventador',
    'Model X',
    'e-tron',
];

const getRandomName = (): string => {
    const model = models[Math.floor(Math.random() * models.length)];
    const name = names[Math.floor(Math.random() * names.length)];

    return `${model} ${name}`;
};

const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};

export const generateRandomCars = (count = 100) => {
    const arrRandomCars = new Array(count).fill(1).map((_) => ({
        name: getRandomName(),
        color: getRandomColor(),
    }));

    return arrRandomCars;
};

export const generateButton = () => {
    const generateBtn = <HTMLButtonElement>checkedQuerySelector(document, '.generate-button');
    generateBtn.addEventListener('click', async () => {
        generateBtn.classList.add('disabled');
        generateBtn.disabled = true;
        const generatedCars = generateRandomCars();
        const generatedCarsPromises = generatedCars.map((car) => {
            createCar(car);
        });
        await Promise.all(generatedCarsPromises);
        await setStateCars();
        renderGarage();
        setPaginationPage();
        listenerBtnControlRace();
        if (state.carsCount + 100) {
            generateBtn.classList.remove('disabled');
            generateBtn.disabled = false;
        }
    });
};

export const changeView = (): void => {
    const toWinBtn = checkedQuerySelector(document, '.winners-menu-btn');
    const winnersView = <HTMLElement>checkedQuerySelector(document, '.winners-view');
    const toGarBtn = checkedQuerySelector(document, '.garage-menu-btn');
    const garageView = checkedQuerySelector(document, '.garage-view');
    toWinBtn.addEventListener('click', async () => {
        state.view = 'winners';
        garageView.style.display = 'none';
        winnersView.style.display = 'block';
        renderWinners();
        setPaginationPage();
    });
    toGarBtn.addEventListener('click', async () => {
        state.view = 'garage';
        garageView.style.display = 'block';
        winnersView.style.display = 'none';
        renderGarage();
        setPaginationPage();
    });
};

export const sortWinsDesc = () => {
    document.addEventListener('click', async () => {
        getWinners(
            state.winnersPage,
            10,
            (state.sort = 'wins'),
            state.sortOrder === '' ? (state.sortOrder = 'asc') : ''
        );
        await setStateWinnersCars();
        renderWinners();
    });
};

export const sortTime = () => {
    document.addEventListener('click', async (e) => {
        const target = <HTMLElement>e.target;
        if (target.classList.contains('sort-time')) {
            if (state.sortOrder === 'asc') {
                getWinners(state.winnersPage, 10, (state.sort = 'time'), (state.sortOrder = 'desc'));
                await setStateWinnersCars();
            } else {
                getWinners(state.winnersPage, 10, (state.sort = 'time'), (state.sortOrder = 'asc'));
                await setStateWinnersCars();
            }
        }
        renderWinners();
    });
};

export function handleDisabled(elements: HTMLButtonElement[]) {
    elements.forEach((element) => {
        element.disabled = !element.disabled;
        if (element.disabled) {
            element.classList.add('disabled');
        } else {
            element.classList.remove('disabled');
        }
    });
}
