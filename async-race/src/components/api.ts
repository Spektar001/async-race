import { CarData, NewCarData, UpdateCarData, WinnerData, WinnersData } from './types/types';

const baseUrl = 'http://localhost:3000';

const garage = `${baseUrl}/garage`;
const engine = `${baseUrl}/engine`;
const winners = `${baseUrl}/winners`;

/* GARAGE ------------------------------------------------- */

export const getCars = async (page = 1, limit = 7): Promise<{ cars: CarData[]; count: string }> => {
    const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);

    return {
        cars: await response.json(),
        count: response.headers.get('X-Total-Count') || '0',
    };
};

export const getCar = async (id: number): Promise<CarData> => {
    const response = await fetch(`${garage}/${id}`);
    return await response.json();
};

export const createCar = async (car: NewCarData): Promise<void> => {
    const response = await fetch(`${garage}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    });
    return await response.json();
};

export const deleteCar = async (id: number): Promise<void> => {
    const response = await fetch(`${garage}/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
};

export const updateCar = async (id: number, car: UpdateCarData): Promise<void> => {
    const response = await fetch(`${garage}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    });
    return await response.json();
};

/* ENGINE ------------------------------------------------- */

export const startEngine = async (id: number) => {
    const response = await fetch(`${engine}?id=${id}&status=started`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};

export const stopEngine = async (id: number) => {
    const response = await fetch(`${engine}?id=${id}&status=stopped`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};

export const drive = async (id: number) => {
    const response = await fetch(`${engine}?id=${id}&status=drive`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.status !== 200 ? { success: false } : { ...(await response.json()) };
};

/* Winners ------------------------------------------------- */

export const getWinners = async (page: number, limit = 10, sort: string, order: string): Promise<WinnersData> => {
    const response = await fetch(`${winners}?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}}`);
    return {
        winners: await response.json(),
        count: response.headers.get('X-Total-Count') || '0',
    };
};

export const getWinner = async (id: number): Promise<WinnerData> => {
    const response = await fetch(`${winners}/${id}`);
    return await response.json();
};

export const createWinner = async (winner: WinnerData): Promise<WinnerData> => {
    const response = await fetch(`${winners}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(winner),
    });
    return await response.json();
};

export const deleteWinner = async (id: number): Promise<void> => {
    const response = await fetch(`${winners}/${id}`, {
        method: 'DELETE',
    });
    return await response.json();
};

export const updateWinner = async (id: number, winner: WinnerData): Promise<WinnerData> => {
    const response = await fetch(`${winners}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(winner),
    });
    return await response.json();
};

export const getWinnerStatus = async (id: number) => (await fetch(`${winners}/${id}`)).status;

export const saveWinner = async ({
    id,
    time,
    color,
    name,
}: {
    id: number;
    time: number;
    color: string;
    name: string;
}) => {
    const winnerStatus = await getWinnerStatus(id);

    if (winnerStatus === 404) {
        await createWinner({
            id,
            wins: 1,
            time,
            color,
            name,
        });
    } else {
        const winner = await getWinner(id);
        await updateWinner(id, {
            id,
            wins: winner.wins + 1,
            time: time < winner.time ? time : winner.time,
            color: winner.color,
            name: winner.name,
        });
    }
};
