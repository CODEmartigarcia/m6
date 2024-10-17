function carregar() {
  const stringRecuperat = localStorage.getItem("Apple Info");

  if (!stringRecuperat) {
    const apiKey = "5GWHDK9LCNJ4JOMC";
    const symbol = "AAPL";

    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    )
      .then(function (resposta) {
        if (!resposta.ok) {
          console.log("Està donant error! ( no és de 200 a 299! )");
        }
        return resposta.json();
      })
      .then(function (data) {
        const infoRebuda = data["Time Series (Daily)"];
        if (!infoRebuda) {
          console.log("No hi ha dades de l'API");
          return;
        }

        const infoRebudaString = JSON.stringify(infoRebuda);
        localStorage.setItem("Apple Info", infoRebudaString);

        mostrarDades(infoRebuda);
      })
      .catch(function (error) {
        console.log("Hi ha un problema.", error);
      });
  } else {
    const infoObject = JSON.parse(stringRecuperat);
    mostrarDades(infoObject);
  }
}

function mostrarDades(infoObject) {
  const tbody = document.getElementById("tbodyid");
  tbody.innerHTML = "";  // llimpiar la taula

  for (const dia in infoObject) {
    let tr = document.createElement("tr");

    let td = document.createElement("td");
    td.textContent = dia;
    tr.appendChild(td);

    let tdOpen = document.createElement("td");
    tdOpen.textContent = infoObject[dia]["1. open"];
    tr.appendChild(tdOpen);

    let high = document.createElement("td");
    high.textContent = infoObject[dia]["2. high"];
    tr.appendChild(high);

    let low = document.createElement("td");
    low.textContent = infoObject[dia]["3. low"];
    tr.appendChild(low);

    let close = document.createElement("td");
    close.textContent = infoObject[dia]["4. close"];
    tr.appendChild(close);

    let volume = document.createElement("td");
    volume.textContent = infoObject[dia]["5. volume"];
    tr.appendChild(volume);

    tbody.appendChild(tr);

    let delButton = document.createElement("button");
    delButton.textContent = "Eliminar";
    delButton.addEventListener("click", function () {
      borrarRegistre(dia);
    });
    tr.appendChild(delButton);
  }
}

function borrarRegistre(dia) {
  const stringRecuperat = localStorage.getItem("Apple Info");
  const infoObject = JSON.parse(stringRecuperat);

  delete infoObject[dia];

  localStorage.setItem("Apple Info", JSON.stringify(infoObject));
  mostrarDades(infoObject);
}
