export interface StateData {
    cars: CarData[];
    winners: WinnerData[];
    carsCount: number;
    winnersCount: number;
    garagePage: number;
    winnersPage: number;
    view: string;
    sort: string;
    sortOrder: string;
    newCar: Partial<NewCarData>;
    updateCar: Partial<CarData>;
}

export interface CarData {
    name: string;
    color: string;
    id: number;
}

export interface Race {
    time: number;
    success: boolean;
    id: number;
}

export interface RaceWin {
    name?: string;
    color?: string;
    time: number;
    id?: number;
}

export interface NewCarData {
    name: string;
    color: string;
}

type Partial<T> = {
    [P in keyof T]?: T[P];
};

export interface UpdateCarData {
    name: string;
    color: string;
}

export interface WinnerData {
    id: number;
    wins: number;
    time: number;
    color: string;
    name: string;
}

export interface WinnersData {
    winners: WinnerData[];
    count: string;
}

export function checkedQuerySelector(parent: Element | Document, selector: string): HTMLElement {
    const el = parent.querySelector(selector);
    if (!el) {
        throw new Error(`Selector ${selector} didn't match any elements.`);
    }
    return el as HTMLElement;
}
