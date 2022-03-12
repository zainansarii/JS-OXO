window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    // this is just the in-memory board state!
    let board = ['','','','','','','','','']

    const updateBoard = (tile, index) => {
        tile.innerText = "X"
    }

    tiles.forEach((tile, index) => {
        console.log(tile)
        tile.addEventListener('click', () => updateBoard(tile, index));
    })


})