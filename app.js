function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);

    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');

    if (isNaN(loanAmount) || loanAmount <= 0 ||
        isNaN(interestRate) || interestRate <= 0 ||
        isNaN(loanTenure) || loanTenure <= 0) {
        errorMessage.textContent = 'Please enter valid positive numbers for all fields.';
        resultsSection.style.display = 'none';
        return;
    } else {
        errorMessage.textContent = '';
    }

    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfMonths = loanTenure * 12;
    const emi = loanAmount * monthlyInterestRate * (Math.pow(1 + monthlyInterestRate, numberOfMonths)) / (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

    const totalPayable = emi * numberOfMonths;
    const totalInterest = totalPayable - loanAmount;

    document.getElementById('monthlyEMI').textContent = emi.toFixed(2);
    document.getElementById('totalInterest').textContent = totalInterest.toFixed(2);
    document.getElementById('totalPayable').textContent = totalPayable.toFixed(2);

    populateLoanSchedule(loanAmount, monthlyInterestRate, numberOfMonths, emi);
    resultsSection.style.display = 'block';
}

function populateLoanSchedule(loanAmount, monthlyInterestRate, numberOfMonths, emi) {
    const loanScheduleBody = document.querySelector('#loanSchedule tbody');
    loanScheduleBody.innerHTML = '';

    let outstandingBalance = loanAmount;
    const startDate = new Date();

    for (let month = 1; month <= numberOfMonths; month++) {
        const interestForMonth = outstandingBalance * monthlyInterestRate;
        let principalForMonth = emi - interestForMonth;

        if (month === numberOfMonths) {
            principalForMonth = outstandingBalance;
            emi = outstandingBalance + interestForMonth;
        }

        outstandingBalance -= principalForMonth;
        if (outstandingBalance < 0) outstandingBalance = 0;

        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + month);
        const year = paymentDate.getFullYear();
        const monthName = paymentDate.toLocaleString('default', { month: 'short' });

        const row = loanScheduleBody.insertRow();
        row.insertCell().textContent = `${monthName} ${year}`;
        row.insertCell().textContent = emi.toFixed(2);
        row.insertCell().textContent = principalForMonth.toFixed(2);
        row.insertCell().textContent = interestForMonth.toFixed(2);
        row.insertCell().textContent = outstandingBalance.toFixed(2);
    }
}