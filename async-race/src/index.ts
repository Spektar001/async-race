import './global.css';
import { page } from './components/drawPage/drawPage';
import { setStateCars, setStateWinnersCars } from './components/state';
import { updateWinner } from './components/api';

export async function startApp() {
    await updateWinner(1, {
        id: 1,
        wins: 1,
        time: 10,
        name: 'Tesla',
        color: '#e6e6fa',
    });
    await setStateCars();
    await setStateWinnersCars();
    page();
}
startApp();
