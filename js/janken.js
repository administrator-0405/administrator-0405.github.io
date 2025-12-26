const rockButton = document.getElementById('rock');
const scissorsButton = document.getElementById('scissors');
const paperButton = document.getElementById('paper');
const computerHandSpan = document.getElementById('computer-hand');
const outcomeSpan = document.getElementById('outcome');

const hands = ['グー', 'チョキ', 'パー'];
let playerHand;
let computerHand;

rockButton.addEventListener('click', () => {
    playerHand = 'グー';
    playJanken();
});

scissorsButton.addEventListener('click', () => {
    playerHand = 'チョキ';
    playJanken();
});

paperButton.addEventListener('click', () => {
    playerHand = 'パー';
    playJanken();
});

function playJanken() {
    computerHand = hands[Math.floor(Math.random() * 3)];
    computerHandSpan.textContent = computerHand;

    if (playerHand === computerHand) {
        outcomeSpan.textContent = 'あいこ';
    } else if (
        (playerHand === 'グー' && computerHand === 'チョキ') ||
        (playerHand === 'チョキ' && computerHand === 'パー') ||
        (playerHand === 'パー' && computerHand === 'グー')
    ) {
        outcomeSpan.textContent = 'あなたの勝ち';
    } else {
        outcomeSpan.textContent = 'あなたの負け';
    }
}
