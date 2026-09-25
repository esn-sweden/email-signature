import "./styles.scss";
import "bootstrap";
import "./api";
import { loadActiveOrgs } from "./api";
import type { ESNOrg } from "../src/types/esn-org";
import { createSignature } from "./signature";
import { inputs } from "./inputs";

interface Model {
  ESNOrgs: ESNOrg[];
}

let model: Model = {
  ESNOrgs: [],
};

const loadingText = document.querySelector<HTMLDivElement>("#loading")!;
const app = document.querySelector<HTMLDivElement>("#app")!;

const togglePronouns =
  document.querySelector<HTMLInputElement>("#togglePronouns")!;

const searchInput = document.querySelector<HTMLInputElement>("#org-search")!;
const resultsContainer =
  document.querySelector<HTMLDivElement>("#org-results")!;
const apiErrorBox = document.querySelector<HTMLDivElement>("#error")!;

const copyBtn = document.querySelector<HTMLButtonElement>("#copy-btn")!;
const copyStatus = document.querySelector<HTMLSpanElement>("#copy-status")!;
const copyError = document.querySelector<HTMLSpanElement>("#copy-error")!;

const preview = document.querySelector<HTMLDivElement>("#preview")!;

async function initOrganisations() {
  try {
    model.ESNOrgs = await loadActiveOrgs();
    searchInput.placeholder = "Type to search...";
    searchInput.disabled = false;
  } catch (error) {
    console.error("Failed to fetch data from ESN API:", error);

    apiErrorBox.textContent =
      "Failed to load organisations. Please try again later.";
    apiErrorBox?.classList.remove("d-none");
  }
}

function renderSignature() {
  try {
    preview.innerHTML = createSignature();
    copyBtn.disabled = false;
  } catch (error: unknown) {
    if (error instanceof Error) {
      preview.innerHTML = error.message;
      copyBtn.disabled = true;
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
}

// --------------------- Event handlers --------------------------------

function handleSearchTyping() {
  const query = searchInput.value.toLowerCase();

  if (!query) {
    resultsContainer.innerHTML = "";
    return;
  }

  let results = model.ESNOrgs.filter((org) =>
    org.label.toLowerCase().includes(query),
  ).slice(0, 10); // limit to 10 results

  if (results.length > 0) {
    resultsContainer.innerHTML = results
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

function handleOrgSelect(e: MouseEvent) {
  resultsContainer.innerHTML = "";

  const target = e.target as HTMLElement;
  const item = target.closest("[data-code]") as HTMLElement;
  if (!item) return;

  const code = item.dataset.code!;
  const org = model.ESNOrgs.find((s) => s.code === code);
  if (!org) return;

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

  searchInput.value = org.label;

  renderSignature();
}

function handleEnterOnSearch(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent form submission

    const firstItem =
      resultsContainer.querySelector<HTMLElement>(".list-group-item");
    if (firstItem) {
      firstItem.click();
    }
  }
}

async function handleCopyToClipboard() {
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

// Typing in the search bar
searchInput.addEventListener("input", handleSearchTyping);

// Selecting a result from the drop-down
resultsContainer.addEventListener("click", handleOrgSelect);

// Selecting first search result when enter is pressed
searchInput.addEventListener("keydown", handleEnterOnSearch);

// Update signature based on pronouns enabled/disabled
togglePronouns.addEventListener("change", () => {
  inputs.pronouns.disabled = !togglePronouns.checked;
  renderSignature();
});

// Update preview as user types
Object.values(inputs).forEach((input) => {
  input.addEventListener("input", renderSignature);
});

// Clicking on the copy signature button
copyBtn.addEventListener("click", handleCopyToClipboard);

// --------------------- Init --------------------------------
function init() {
  initOrganisations();
  // Only display the page after all styles have finished loading
  loadingText.style.visibility = "hidden";
  app.style.visibility = "visible";
}

init();
