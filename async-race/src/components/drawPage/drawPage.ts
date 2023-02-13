import './drawPage.css';
import { renderGarage, renderWinners } from '../render';
import {
    createCarBtn,
    generateButton,
    removeCarBtn,
    changeView,
    listenerBtnUpdateCar,
    sortTime,
    sortWinsDesc,
} from '../utils';
import { setPaginationPage, prevBtn, nextBtn } from '../pagination';
import { listenerBtnControlRace } from '../controlRace/controlRace';

export const page = () => {
    const html = `
<header class="header">
<div class="container">
  <div class="header__body">
    <h1 class="header__logo">
      Async Race
    </h1>
  </div>
</div>
</header>
<main>
    <div class="container">
    <div class='menu'>
      <button class='button garage-menu-btn' id='garage-menu'>To garage</button>
      <button class='button winners-menu-btn' id='winners-menu'>To winners</button>
    </div>
    <div class='garage-view'>
      <div>
        <div class='form' id='create'>
          <input class='create-name' id='create-name' type='text'>
          <input class='create-color' id='create-color' type='color'>
          <button class='button create-btn' id='create-submit'>Create</button>
        </div>
        <div class='form' id='update'>
          <input class='update-name disabled' id='update-name' type='text' disabled>
          <input class='update-color disabled' id='update-color' type='color' disabled>
          <button class='button update-btn disabled' id='update-submit' disabled>Update</button>
        </div>
      </div>
      <div class='race-controls'>
        <button class='button race-button' id='race'>Race</button>
        <button class='button reset-button disabled' id='reset' disabled>Reset</button>
        <button class='button generate-button' id='generate'>Generate cars</button>
      </div>
      <div>
        <p class='message' id='message' style='display: none'></p>
      </div>
      <div id='garage'></div>
    </div>
      <div class='winners-view' id='winners-view' style='display: none'></div>
      <div class='pagination'>
        <button class='button prev-button disabled' id='prev' disabled>Prev</button>
        <span class='pagination-pages'></span>
        <button class='button next-button disabled' id='next' disabled>Next</button>
      </div>
  </div>
</main>
<footer class="footer">
<div class="container">
  <div class="footer__body">
    <div class="footer__github_container">
      <a class="footer__github-link" target="_blank" href="https://github.com/Spektar001">
        <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="48px" height="48px">    <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"/></svg>
      </a>
    </div>
    <p class="footer__year">2023</p>
    <a class="footer__rs-link" target="_blank" href="https://rs.school/js/">
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="125.000000pt" height="125.000000pt" viewBox="0 0 225.000000 225.000000"
    preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)"
    fill="#FFFFFF" stroke="none">
    <path d="M355 1646 c-11 -8 -28 -16 -37 -16 -17 0 -18 -31 -18 -515 l0 -515
    150 0 150 0 2 213 3 212 30 3 c63 6 91 -28 196 -233 l96 -190 163 -3 c94 -1
    166 1 169 7 4 6 24 6 51 1 25 -5 96 -9 159 -10 265 -1 411 86 466 275 20 66
    15 113 -17 187 -43 101 -158 168 -378 218 -148 34 -189 50 -206 76 -37 55 20
    114 111 114 70 0 114 -26 145 -85 l24 -48 90 7 c49 3 116 6 148 6 52 0 59 2
    54 18 -3 9 -10 35 -15 58 -24 92 -103 169 -205 200 -173 52 -420 34 -527 -39
    l-34 -23 -35 27 c-69 54 -118 61 -430 66 -247 4 -288 3 -305 -11z m484 -216
    c25 -13 51 -60 51 -92 0 -34 -36 -87 -68 -99 -15 -6 -70 -12 -122 -13 l-95 -1
    -3 99 c-1 55 0 106 3 114 5 12 23 14 110 9 57 -3 113 -11 124 -17z m556 -386
    c157 -41 184 -52 214 -90 31 -40 27 -80 -12 -119 -88 -88 -267 -35 -297 88
    l-11 42 -101 -3 -100 -4 -39 41 c-22 22 -51 44 -64 47 -37 9 -31 18 29 43 29
    12 63 32 76 45 l22 24 71 -38 c46 -25 122 -52 212 -76z"/>
  </g>
      </svg>
    </a>
  </div>
</div>
</footer>
`;
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    wrapper.innerHTML = html;
    document.body.append(wrapper);
    renderGarage();
    renderWinners();
    createCarBtn();
    setPaginationPage();
    prevBtn();
    nextBtn();
    generateButton();
    listenerBtnUpdateCar();
    removeCarBtn();
    changeView();
    listenerBtnControlRace();
    sortTime();
    sortWinsDesc();
};
