const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg =  document.querySelector(".msg")

for (let select of dropdown) {
    for (let currcode in countryList) {
        let option = document.createElement("option");
        option.innerText = currcode;
        option.value = currcode;
        if (select.name === "from" && currcode === "USD") {
            option.selected = "selected";
        } else if (select.name === "to" && currcode === "PKR") {
            option.selected = "selected";
        }
        select.append(option);
    }
    select.addEventListener("change", (evt) => {
        updateflag(evt.target);
    });
}

const updateExchangeRate = async () => {
    const amount = document.querySelector(".amount input");
    let amtval = amount.value;
    if (amtval === "" || amtval < 1) {
        amtval = 1;
        amount.value = "1";
    }

    const url = `https://api.fastforex.io/fetch-one?from=${fromcurr.value}&to=${tocurr.value}&api_key=3443575d90-3edec4e4cb-shu0jn`;
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        let exchangeRate = data.result[tocurr.value];
        let finalAmount = amtval * exchangeRate;
        msg.innerText = `${amtval} ${fromcurr.value} = ${finalAmount} ${tocurr.value}`;
    } catch (error) {
        console.error('Error fetching the exchange rate:', error);
    }
}

const updateflag = (element) => {
    let country = element.value;
    let countrycode = countryList[country];
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newsrc;
}

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load" , ()=>{
    updateExchangeRate();
});
