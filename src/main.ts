import "./styles.scss";
import "bootstrap";
import "./api";
import { loadActiveOrgs } from "./api";
import type { ESNOrg } from "../src/types/esn-org";
import { createSignature } from "./signature"
import { inputs } from "./inputs"

interface Model {
  searchResults: ESNOrg[];
  ESNOrgs: ESNOrg[];
  apiError: string;
}

let model: Model = {
  searchResults: [],
  ESNOrgs: [],
  apiError: "",
};

const togglePronouns = document.getElementById(
  "togglePronouns",
) as HTMLInputElement;
const preview = document.getElementById("preview") as HTMLDivElement;

const searchInput = document.getElementById("org-search") as HTMLInputElement;
const resultsContainer = document.getElementById(
  "org-results",
) as HTMLDivElement;

const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const copyStatus = document.getElementById("copy-status") as HTMLSpanElement;
const copyError = document.getElementById("copy-error") as HTMLSpanElement;

const apiErrorBox = document.getElementById("error") as HTMLDivElement;


function view() {
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



}

async function initOrganisations() {
  try {
    model.ESNOrgs = await loadActiveOrgs();
    searchInput.placeholder = "Type to search..."
    searchInput.disabled = false;
  } catch (error) {
    console.error("Failed to fetch data from ESN API:", error);

    if (apiErrorBox) {
      apiErrorBox.textContent = "Failed to load organisations. Please try again later.";
      apiErrorBox?.classList.remove("d-none");
    }
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

  // currently not supported in ESN Accounts, populated from yaml in repo
  inputs.bluesky.value = org.bluesky ?? "";
  inputs.youtube.value = org.youtube ?? "";
  inputs.linkedinOrg.value = org.linkedinOrg ?? "";
  inputs.tiktok.value = org.tiktok ?? "";
  inputs.flickr.value = org.flickr ?? "";
  inputs.whatsapp.value = org.whatsapp ?? "";
  inputs.skype.value = org.skype ?? "";
}

// Selecting a result from the drop-down
function handleOrgSelect(e: MouseEvent) {
  const target = e.target as HTMLElement;
  const item = target.closest("[data-code]") as HTMLElement;
  if (!item) return;

  const code = item.dataset.code!;
  const fullData = model.ESNOrgs.find((s) => s.code === code);

  if (!fullData) return;
  populateOrgInfo(fullData);
  searchInput.value = fullData.label;
  model.searchResults = [];
  view();
  try {
    preview.innerHTML = createSignature();
    copyBtn.disabled = false
  } catch (error: unknown) {
    if (error instanceof Error) {
      preview.innerHTML = error.message
      copyBtn.disabled = true
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

function renderSignature() {
  try {
    preview.innerHTML = createSignature();
    copyBtn.disabled = false
  } catch (error: unknown) {
    if (error instanceof Error) {
      preview.innerHTML = error.message
      copyBtn.disabled = true
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

async function copyToClipboard() {
  try {
    const blob = new Blob([preview.innerHTML], { type: "text/html" });
    const plainBlob = new Blob([preview.innerText.trim()], {
      type: "text/plain",
    });
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
        [plainBlob.type]: plainBlob,
      }),
    ]);

    copyStatus.style.display = "inline";
    setTimeout(() => {
      copyStatus.style.display = "none";
    }, 2000);
  } catch (err) {
    copyError.classList.remove("d-none");
    setTimeout(() => {
      copyError.classList.add("d-none");
    }, 5000);
  }
}


// --------------------- Event listeners --------------------------------


togglePronouns.addEventListener("change", () => {
  inputs.pronouns.disabled = !togglePronouns.checked;
  renderSignature()
});

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
resultsContainer.addEventListener("click", handleOrgSelect);

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
  input.addEventListener("input",
    renderSignature
  )
});

copyBtn.addEventListener("click", copyToClipboard);



// Init
document.getElementById("loading")!.style.visibility = "hidden";
document.getElementById("app")!.style.visibility = "visible";
view();
initOrganisations();
