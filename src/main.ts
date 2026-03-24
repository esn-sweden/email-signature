import "./styles.scss";
import "bootstrap";
import { loadActiveOrgs } from "./api";
import type { ESNOrg } from "./api";
import { icons } from "./icons";
import DOMPurify from "dompurify";

interface Model {
  searchResults: ESNOrg[];
  showOrgDetails: boolean;
  ESNOrgs: ESNOrg[];
  apiError: string;
}

let model: Model = {
  searchResults: [],
  showOrgDetails: false,
  ESNOrgs: [],
  apiError: "",
};

const inputs = {
  name: document.querySelector<HTMLInputElement>("#name")!,
  title: document.querySelector<HTMLInputElement>("#title")!,
  email: document.querySelector<HTMLInputElement>("#email")!,
  phone: document.querySelector<HTMLInputElement>("#phone")!,
  linkedinPers: document.querySelector<HTMLInputElement>("#linkedinPers")!,
  logo: document.querySelector<HTMLInputElement>("#logo")!,
  address: document.querySelector<HTMLTextAreaElement>("#address")!,
  orgName: document.querySelector<HTMLInputElement>("#orgName")!,
  website: document.querySelector<HTMLInputElement>("#website")!,
  facebook: document.querySelector<HTMLInputElement>("#facebook")!,
  instagram: document.querySelector<HTMLInputElement>("#instagram")!,
  x: document.querySelector<HTMLInputElement>("#twitter")!,
  bluesky: document.querySelector<HTMLInputElement>("#bluesky")!,
  youtube: document.querySelector<HTMLInputElement>("#youtube")!,
  linkedinOrg: document.querySelector<HTMLInputElement>("#linkedinOrg")!,
  tiktok: document.querySelector<HTMLInputElement>("#tiktok")!,
  flickr: document.querySelector<HTMLInputElement>("#flickr")!,
  whatsapp: document.querySelector<HTMLInputElement>("#whatsapp")!,
  skype: document.querySelector<HTMLInputElement>("#skype")!,
};
const preview = document.querySelector<HTMLDivElement>("#preview")!;
const searchInput = document.querySelector<HTMLInputElement>("#org-search")!;
const resultsContainer =
  document.querySelector<HTMLDivElement>("#org-results")!;
const copyBtn = document.querySelector<HTMLButtonElement>("#copy-btn")!;
const revealOrgBtn =
  document.querySelector<HTMLButtonElement>("#revealOrgInfo")!;
const details = document.querySelector<HTMLDivElement>("#org-details")!;
const copyStatus = document.querySelector<HTMLSpanElement>("#copy-status")!;

const mandatoryFields: (keyof typeof inputs)[] = [
  "name",
  "title",
  "email",
  "orgName",
  "address",
  "logo",
];

function view() {
  if (model.showOrgDetails) {
    details.classList.remove("d-none");
    revealOrgBtn.classList.add("d-none");
  }

  if (model.searchResults.length > 0) {
    resultsContainer.innerHTML = model.searchResults
      .map(
        (org) => `
      <div class="list-group-item list-group-item-action" data-code="${org.code}">
        ${org.label}
      </div>
    `,
      )
      .join("");
  } else {
    resultsContainer.innerHTML = "";
  }

  const el = document.getElementById("error");
  if (el) el.textContent = model.apiError;
  if (model.apiError) {
    el?.classList.remove("d-none");
  } else {
    el?.classList.add("d-none");
  }

  const name = inputs.name.value;
  const title = inputs.title.value;
  const email = inputs.email.value;
  const orgName = inputs.orgName.value;
  const address = inputs.address.value.replace(/\n/g, "<br>");
  const website = inputs.website.value;
  const websiteShort = website.replace(/^.*\:\/\//, "").replace(/\/+$/, "");
  const logo = inputs.logo.value;
  const phone = inputs.phone.value;
  const linkedinPers = inputs.linkedinPers.value;
  const linkedinPersUsername = linkedinPers.replace(
    /.*linkedin\.com\/in\/([\w.-]+)\/.*/,
    "$1",
  );
  const facebook = inputs.facebook.value;
  const instagram = inputs.instagram.value;
  const x = inputs.x.value;
  const bluesky = inputs.bluesky.value;
  const youtube = inputs.youtube.value;
  const linkedinOrg = inputs.linkedinOrg.value;
  const tiktok = inputs.tiktok.value;
  const flickr = inputs.flickr.value;
  const whatsapp = inputs.whatsapp.value;
  const skype = inputs.skype.value;

  const signatureHTML = `
<div style="font-family:Arial, sans-serif; font-size:10pt; color:#000000; line-height:1.4;">
    <b>${name}</b><br>
    <i>${title}</i><br>
    <a href="mailto:${email}" style="color:#1155cc" target="_blank">${email}</a><br>
    ${phone ? `${phone}<br>` : ""}
    ${linkedinPers ? `LinkedIn: <a href="${linkedinPers}" style="color:#1155cc" target="_blank">${linkedinPersUsername}</a><br>` : ""}
    ——<br>
    <b>${orgName}</b><br>
    ${address}<br>
    ${website ? `<a href="${website}" style="color:#1155cc" target="_blank">${websiteShort}</a><br>` : ""}

    <img src="${logo}" alt="ESN logo" style="width:140px; height:auto; margin:10px 0;"><br>

    ${
      instagram
        ? `<a href="${instagram}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.instagram} alt="Instagram" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      facebook
        ? `<a href="${facebook}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.facebook} alt="Facebook" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      x
        ? `<a href="${x}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.x} alt="X" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      bluesky
        ? `<a href="${bluesky}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.bluesky} alt="Bluesky" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      youtube
        ? `<a href="${youtube}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.youtube} alt="YouTube" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      linkedinOrg
        ? `<a href="${linkedinOrg}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.linkedin} alt="LinkedIn" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      tiktok
        ? `<a href="${tiktok}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.tiktok} alt="TikTok" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      flickr
        ? `<a href="${flickr}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.flickr} alt="TikTok" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      whatsapp
        ? `<a href="${whatsapp}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.whatsapp} alt="WhatsApp" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }

    ${
      skype
        ? `<a href="${skype}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.skype} alt="Skype" style="vertical-align:middle; border:none;">
    </a>`
        : ""
    }
</div>
`.trim();

  let errorCount = 0;
  mandatoryFields.forEach((key) => {
    const input = inputs[key];

    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      errorCount++;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  if (errorCount == 0) {
    preview.innerHTML = DOMPurify.sanitize(signatureHTML);
  } else {
    preview.innerHTML = "Fill in the required fields to see the signature";
  }
}

async function initOrganisations() {
  try {
    model.ESNOrgs = await loadActiveOrgs();
  } catch (error) {
    console.error("Failed to fetch data from ESN API:", error);
    model.apiError = "Failed to load organisations. Please try again later.";
  }
}

function populateOrgInfo(org: ESNOrg) {
  inputs.orgName.value = org.label;
  inputs.address.value = org.address;
  inputs.website.value = org.website;
  inputs.logo.value = org.logo;
  inputs.facebook.value = org.facebook;
  inputs.instagram.value = org.instagram;
  inputs.x.value = org.x;
}

// --------------------- Event listeners --------------------------------

// Typing in the search bar
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  if (query) {
    model.searchResults = model.ESNOrgs.filter((org) =>
      org.label.toLowerCase().includes(query),
    ).slice(0, 10); // limit to 10 results
    view();
  } else {
    model.searchResults = [];
    view();
  }
});

// Selecting a result from the drop-down
resultsContainer.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const item = target.closest("[data-code]") as HTMLElement;
  if (!item) return;

  const code = item.dataset.code!;
  const fullData = model.ESNOrgs.find((s) => s.code === code);

  if (!fullData) return;

  populateOrgInfo(fullData);
  model.showOrgDetails = true;
  searchInput.value = fullData.label;
  model.searchResults = [];
  view();
});

// Select first search result when enter is pressed
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submission

    const firstItem =
      resultsContainer.querySelector<HTMLElement>(".list-group-item");
    if (firstItem) {
      firstItem.click();
    }
  }
});

// Update preview as user types
Object.values(inputs).forEach((input) => {
  input.addEventListener("input", view);
});

revealOrgBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form submission
  model.showOrgDetails = true;
  view();
});

copyBtn.addEventListener("click", () => {
  const html = preview.innerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const data = [new ClipboardItem({ "text/html": blob })];

  navigator.clipboard.write(data);

  copyStatus.style.display = "inline";
  setTimeout(() => {
    copyStatus.style.display = "none";
  }, 2000);
});

// Init
view();
initOrganisations();
