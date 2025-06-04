async function cargarInfoProfesor() {
  const response = await fetch("/api/profesor/info");
  if (!response.ok)
    throw new Error("No se pudo cargar la información del profesor");
  return await response.json();
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("sidebar.js cargado");

  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggle-sidebar");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
      this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    `;
    } else {
      this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    `;
    }
  });

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const path = href.includes("?") ? href.split("?")[0] : href;
    if (currentPath === path || currentPath.startsWith(path + "/")) {
      link.classList.add("active");
    }
  });

  try {
    const info = await cargarInfoProfesor();
    console.log("Info profesor:", info);
    const usernameDiv = document.getElementById("sidebar-username");
    const roleDiv = document.getElementById("sidebar-role");
    console.log("usernameDiv:", usernameDiv, "roleDiv:", roleDiv);

    document.getElementById("sidebar-username").textContent = info.nombre;
    document.getElementById("sidebar-role").textContent = info.rol;
  } catch (e) {
    document.getElementById("sidebar-username").textContent = "Desconocido";
    document.getElementById("sidebar-role").textContent = "Desconocido";
  }
});
