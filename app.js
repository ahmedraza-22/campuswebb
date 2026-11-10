const navigation = [
  { label: "Home", href: "index.html", page: "index.html" },
  { label: "Campus news", href: "news.html", page: "news.html" },
  { label: "Presentations", href: "presentations.html", page: "presentations.html" },
  { label: "About", href: "about.html", page: "about.html" }
];

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const profileKey = "campus-demo-profile";
const presentationsKey = "campus-demo-presentations";

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(profileKey) || "null");
  } catch {
    return null;
  }
}

function renderShell() {
  const header = document.querySelector("#site-header");
  const footer = document.querySelector("#site-footer");
  const activePage = currentPage === "" ? "index.html" : currentPage;
  const profile = getProfile();

  if (header) {
    const accountLinks = profile
      ? `<span class="account-greeting">Hi, ${escapeHTML(profile.name.split(" ")[0])}</span><button class="nav-logout" type="button" data-logout>Sign out</button>`
      : `<a class="nav-login" href="login.html">Sign in <span aria-hidden="true">↗</span></a>`;
    header.innerHTML = `
      <header class="site-header">
        <div class="header-inner wrap">
          <a class="brand" href="index.html" aria-label="Campus home"><span class="brand-mark">C.</span><span class="brand-name">campus<span class="brand-period">.</span></span></a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation"><span></span><span></span></button>
          <nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">
            ${navigation.map((item) => `<a href="${item.href}"${activePage === item.page ? ' aria-current="page"' : ""}>${item.label}</a>`).join("")}
            <span class="nav-account">${accountLinks}</span>
          </nav>
        </div>
      </header>`;
  }

  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="footer-main wrap">
          <div class="footer-brand"><a class="brand brand-footer" href="index.html"><span class="brand-mark">C.</span><span class="brand-name">campus<span class="brand-period">.</span></span></a><p>A little more connected.<br>A little more you.</p></div>
          <div class="footer-links"><span class="eyebrow">FIND YOUR WAY</span>${navigation.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}</div>
          <div class="footer-links"><span class="eyebrow">MAKE YOURSELF AT HOME</span><a href="signup.html">Create an account</a><a href="login.html">Sign in</a><a href="presentations.html#share-work">Share your work</a></div>
          <div class="footer-signoff"><span aria-hidden="true">✳</span><p>Good things<br>grow here.</p></div>
        </div>
        <div class="footer-bottom wrap"><span>© ${new Date().getFullYear()} Campus student community</span><span>A student space for learning, sharing, and belonging.</span></div>
      </footer>`;
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("nav-open", !isOpen);
    });
  }

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem(profileKey);
    window.location.reload();
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function readPresentations() {
  try {
    const saved = JSON.parse(localStorage.getItem(presentationsKey) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

const samplePresentations = [
  {
    title: "A greener kind of commute",
    course: "Environmental Studies",
    author: "Jordan Lee",
    description: "A student-led look at small changes that can make getting to campus a little kinder to the planet.",
    url: "",
    initials: "JL",
    color: "mint",
    date: "SHARED BY A STUDENT"
  },
  {
    title: "Designing for the in-between",
    course: "Visual Communication",
    author: "Maya Chen",
    description: "Exploring the little moments in public spaces that help a place feel welcoming to everyone.",
    url: "",
    initials: "MC",
    color: "peach",
    date: "SHARED BY A STUDENT"
  },
  {
    title: "The story hidden in data",
    course: "Data & Society",
    author: "Alex Morgan",
    description: "What happens when we look beyond the numbers? A project about people, patterns, and perspective.",
    url: "",
    initials: "AM",
    color: "lilac",
    date: "SHARED BY A STUDENT"
  }
];

function renderPresentations() {
  const list = document.querySelector("#presentation-list");
  if (!list) return;

  const items = [...readPresentations().reverse(), ...samplePresentations];
  list.innerHTML = items.map((item) => `
    <article class="presentation-card">
      <div class="presentation-art ${escapeHTML(item.color || "mint")}" aria-hidden="true"><span>${escapeHTML((item.course || "STUDENT PROJECT").toUpperCase())}</span><b>✳</b><i></i></div>
      <div class="presentation-content">
        <div class="presentation-meta"><span class="tag tag-green">${escapeHTML(item.course)}</span><span>${escapeHTML(item.date || "JUST SHARED")}</span></div>
        <h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p>
        <div class="presentation-author"><span class="author-avatar">${escapeHTML(item.initials || item.author.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase())}</span><span>Shared by <strong>${escapeHTML(item.author)}</strong></span>${item.url ? `<a class="presentation-open" href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHTML(item.title)}">↗</a>` : ""}
        </div>
      </div>
    </article>`).join("");
}

function showFeedback(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("feedback-error", isError);
}

function handleSignup() {
  const form = document.querySelector("#signup-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const email = String(values.get("email") || "").trim();
    if (name.length < 2 || !email) {
      showFeedback(document.querySelector("#signup-feedback"), "Add your name and a valid email address.", true);
      return;
    }
    try {
      localStorage.setItem(profileKey, JSON.stringify({ name, email }));
    } catch {
      showFeedback(document.querySelector("#signup-feedback"), "Your browser couldn’t save this demo profile. Check your storage settings and try again.", true);
      return;
    }
    window.location.href = "index.html";
  });
}

function handleLogin() {
  const form = document.querySelector("#login-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const email = String(values.get("email") || "").trim();
    const password = String(values.get("password") || "");
    if (!email || password.length < 6) {
      showFeedback(document.querySelector("#login-feedback"), "Enter a valid email and a password of at least 6 characters.", true);
      return;
    }
    const savedProfile = getProfile();
    const name = savedProfile?.email?.toLowerCase() === email.toLowerCase()
      ? savedProfile.name
      : email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    try {
      localStorage.setItem(profileKey, JSON.stringify({ name, email }));
    } catch {
      showFeedback(document.querySelector("#login-feedback"), "Your browser couldn’t save this demo profile. Check your storage settings and try again.", true);
      return;
    }
    window.location.href = "index.html";
  });
}

function handlePresentationForm() {
  const form = document.querySelector("#presentation-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const presentation = {
      title: String(values.get("title") || "").trim(),
      course: String(values.get("course") || "").trim(),
      author: String(values.get("author") || "").trim(),
      description: String(values.get("description") || "").trim(),
      url: String(values.get("url") || "").trim(),
      initials: String(values.get("author") || "").trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
      color: ["mint", "peach", "lilac", "blue"][Math.floor(Math.random() * 4)],
      date: "JUST SHARED"
    };
    const feedback = document.querySelector("#presentation-feedback");
    try {
      const presentations = readPresentations();
      presentations.push(presentation);
      localStorage.setItem(presentationsKey, JSON.stringify(presentations));
    } catch {
      showFeedback(feedback, "Your browser couldn’t save this presentation. Check your storage settings and try again.", true);
      return;
    }
    form.reset();
    renderPresentations();
    showFeedback(feedback, "Your presentation has been added to this browser’s student showcase.");
    document.querySelector("#presentation-list").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

renderShell();
renderPresentations();
handleSignup();
handleLogin();
handlePresentationForm();
