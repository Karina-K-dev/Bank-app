"use strict";
const account1 = {
  owner: "Hedi Rivas",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}"> ${i + 1} ${type}
  </div>
  <div class="movements__date">3 days ago</div>
  <div class="movements__value">${mov}</div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}
displayMovements(account1.movements);

function createUsernames(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}
createUsernames(accounts);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});
const balance = movements.reduce(function (acc, curr, i) {
  return acc + curr;
}, 0);

const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);

function calcDisplayBalance(movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}€`;
}
calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (movements) {
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * 1.2) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};
calcDisplaySummary(account1.movements);
const firstWithdrawal = movements.find((mov) => mov < 0);

let currentAccount;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  currentAccount.balance = currentAccount.movements.reduce(
    (acc, curr) => acc + curr,
    0
  );
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = "";

    inputLoginPin.value = "";
    displayMovements(currentAccount.movements);
    calcDisplaySummary(currentAccount.movements);
  }
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    displayMovements(currentAccount.movements);
    calcDisplaySummary(currentAccount.movements);
    calcDisplayBalance(currentAccount.movements);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});
function UpdateAccount() {
  displayMovements(currentAccount.movements);
  calcDisplaySummary(currentAccount.movements);
  calcDisplayBalance(currentAccount.movements);
}

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (user === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const requestedAmount = currentAccount.movements.some(
    (mov) => mov >= loanAmount * 0.1
  );
  if (loanAmount > 0 && requestedAmount) {
    currentAccount.movements.push(loanAmount);
    UpdateAccount();
    inputLoanAmount.value = "";
  }
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
