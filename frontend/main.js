fetch("/Biblioteca/frontend/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

fetch("/Biblioteca/frontend/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

fetch("/Biblioteca/frontend/header-dashboard.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header-dashboard").innerHTML = data;
  });