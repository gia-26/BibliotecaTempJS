fetch("/BibliotecaTempJS/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  });

fetch("/BibliotecaTempJS/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });

fetch("/BibliotecaTempJS/header-dashboard.html")
  .then(res => res.text())
  .then(data => {
    const headerDashboard = document.getElementById("header-dashboard");
    if(headerDashboard) {
      headerDashboard.innerHTML = data;
    }

  });