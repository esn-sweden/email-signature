import './styles.scss'
import 'bootstrap';
import { loadActiveOrgs } from "./api"
import type { ESNOrg } from "./api"
import { icons } from './icons';


let organisations: ESNOrg[] = []


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="container py-5">
    <h1>ESN Email Signature Generator</h1>
    <div class="row">
        <div class="col-md-6">
            <form id="signatureForm" class="mb-4">

                <h3>Personal information</h3>

                <div class="mb-3">
                    <label for="name" class="form-label">Full Name</label>
                    <input type="text" id="name" class="form-control" placeholder="Desiderius Erasmus Roterodamus" />
                </div>
                <div class="mb-3">
                    <label for="title" class="form-label">Position</label>
                    <input type="text" id="title" class="form-control" placeholder="Philologist" />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-control" placeholder="example@esnhavana.org" />
                </div>
                <div class="mb-3">
                    <label for="phone" class="form-label">Phone (optional)</label>
                    <input type="tel" id="phone" class="form-control" />
                </div>

                <div class="mb-3">
                    <label for="linkedIn" class="form-label">LinkedIn (optional)</label>
                    <input type="tel" id="linkedIn" class="form-control" />
                </div>

                <h3>Section information</h3>

                <div class="mb-4 position-relative">
                    <label class="form-label fw-bold">Search Organisation</label>
                    <input type="text" id="org-search" class="form-control form-control-lg"
                        placeholder="Start typing the name of your section/NO...">
                    <div id="org-results" class="list-group position-absolute w-100 shadow"></div>
                </div>

                <div id="org-details" class="d-none">
                    <div class="mb-3">
                        <label for="section" class="form-label">ESN section/country/body</label>
                        <input type="text" id="section" class="form-control" placeholder="ESN Havana" />
                    </div>

                    <div class="mb-3">
                        <label for="address" class="form-label">Section address</label>
                        <textarea name="address" id="address" class="form-control" rows="4"
                            placeholder="Road1\nÅrhus\nSweden"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="website" class="form-label">Website</label>
                        <input type="text" id="website" class="form-control" placeholder="www.esnhavana.org" />
                    </div>

                    <div class="mb-3">
                        <label for="logo" class="form-label">Logo url</label>
                        <input type="text" id="logo" class="form-control" />
                    </div>

                    <h4>Social Media (optional)</h4>

                    <div class="mb-3">
                        <label for="facebook" class="form-label">Facebook</label>
                        <input type="text" id="facebook" class="form-control"
                            placeholder="https://www.facebook.com/esn_havana/" />
                    </div>


                    <div class="mb-3">
                        <label for="instagram" class="form-label">Instagram</label>
                        <input type="text" id="instagram" class="form-control"
                            placeholder="https://www.instagram.com/esn_havana/" />
                    </div>

                    <div class="mb-3">
                        <label for="x" class="form-label">X</label>
                        <input type="text" id="x" class="form-control" placeholder="https://x.com/esn_havana" />
                    </div>
                </div>


            </form>

        </div>
        <div class="col-md-6">
            <h3>Preview</h3>
            <div id="preview" class="border p-3 bg-light mb-3"></div>
            <button id="toggleHtmlBtn" class="btn">Show HTML</button>
            <div id="htmlContainer" class="d-none">
                <textarea id="htmlOutput" class="form-control" rows="6" readonly></textarea>
            </div>
        </div>
    </div>
`

const inputs = {
  name: document.querySelector<HTMLInputElement>('#name')!,
  title: document.querySelector<HTMLInputElement>('#title')!,
  email: document.querySelector<HTMLInputElement>('#email')!,
  phone: document.querySelector<HTMLInputElement>('#phone')!,
  linkedIn: document.querySelector<HTMLInputElement>('#linkedIn')!,
  logo: document.querySelector<HTMLInputElement>('#logo')!,
  address: document.querySelector<HTMLTextAreaElement>('#address')!,
  section: document.querySelector<HTMLInputElement>('#section')!,
  website: document.querySelector<HTMLInputElement>('#website')!,
  facebook: document.querySelector<HTMLInputElement>('#facebook')!,
  instagram: document.querySelector<HTMLInputElement>('#instagram')!,
  x: document.querySelector<HTMLInputElement>('#x')!,
}
const preview = document.querySelector<HTMLDivElement>('#preview')!
const htmlOutput = document.querySelector<HTMLTextAreaElement>('#htmlOutput')!
const searchInput = document.querySelector<HTMLInputElement>("#org-search")!
const resultsContainer = document.querySelector<HTMLDivElement>("#org-results")!
const toggleHtmlBtn = document.querySelector<HTMLButtonElement>('#toggleHtmlBtn')!;
const htmlContainer = document.querySelector<HTMLDivElement>('#htmlContainer')!;

const mandatoryFields: (keyof typeof inputs)[] = [
  "name",
  "title",
  "email",
  "section",
  "address",
  "website",
  "logo",
];




async function initOrganisations() {
  organisations = await loadActiveOrgs()
}

function renderResults(filtered: ESNOrg[]) {
  resultsContainer.innerHTML = filtered
    .map(org => `
      <div class="list-group-item list-group-item-action" data-code="${org.code}">
        ${org.label}
      </div>
    `)
    .join("")
}

function showOrgDetails() {
  const details = document.querySelector<HTMLDivElement>('#org-details')!;
  details.classList.remove('d-none');
}


function updateSignature() {
  // Validate mandatory fields
  mandatoryFields.forEach(key => {
    const input = inputs[key];
    if (!input.value.trim()) {
      input.classList.add("is-invalid"); // Bootstrap class
    } else {
      input.classList.remove("is-invalid")
    }
  });


  // Mandatory fields
  const name = inputs.name.value || inputs.name.placeholder
  const title = inputs.title.value || inputs.title.placeholder
  const email = inputs.email.value || inputs.email.placeholder
  const section = inputs.section.value || inputs.section.placeholder
  const address = inputs.address.value || inputs.address.placeholder
  const website = inputs.website.value || inputs.website.placeholder
  const logo = inputs.logo.value || inputs.logo.placeholder

  // Removing protocol and trailing slashes
  const websiteShort = website.replace(/^.*\:\/\//, "").replace(/\/+$/, "")

  // Optional fields
  const phone = inputs.phone.value
  const linkedIn = inputs.linkedIn.value
  const facebook = inputs.facebook.value
  const instagram = inputs.instagram.value
  const x = inputs.x.value

  const signatureHTML = `
<div style="font-family:Arial, sans-serif; font-size:10pt; color:#000000; line-height:1.4;">
    <b>${name}</b><br>
    <i>${title}</i><br>
    <a href="mailto:${email}" style="color:#1155cc" target="_blank">${email}</a><br>
    ${phone ? `${phone}<br>` : ''}
    ${linkedIn ? `LinkedIn: ${linkedIn}<br>` : ''}
    ——<br>
    <b>${section}</b><br>
    ${address.replace(/\n/g, "<br>")}<br>
    <a href="${website}" style="color:#1155cc" target="_blank">${websiteShort}</a><br>

    <img src="${logo}" alt="ESN logo" style="width:140px; height:auto; margin:10px 0;"><br>

    ${instagram ? `<a href="${instagram}" target="_blank" style="display:inline-block; margin:5px;">
        <img width="20" height="20"
            src=${icons.instagram}
            alt="Instagram" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${facebook ? `<a href="${facebook}" target="_blank" style="display:inline-block;">
        <img width="20" height="20"
            src=${icons.facebook}
            alt="Facebook" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${x ? `<a href="${x}" target="_blank" style="display:inline-block;">
        <img width="20" height="20"
            src=${icons.x}
            alt="X" style="vertical-align:middle; border:none;">
    </a>`: ''}
</div>
`.trim()

  preview.innerHTML = signatureHTML
  htmlOutput.value = signatureHTML
}


function populateForm(section: ESNOrg) {
  inputs.section.value = section.label
  inputs.address.value = section.address
  inputs.website.value = section.website
  inputs.logo.value = section.logo
  inputs.facebook.value = section.facebook
  inputs.instagram.value = section.instagram
  inputs.x.value = section.x

  updateSignature()
}




// --------------------- Event listeners --------------------------------

// Typing in the search bar
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase()

  const filtered = organisations.filter(org =>
    org.label.toLowerCase().includes(query)
  )

  renderResults(filtered.slice(0, 10)) // limit results
})

// Selecting a result from the drop-down
resultsContainer.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement
  const item = target.closest("[data-code]") as HTMLElement
  if (!item) return

  const code = item.dataset.code!
  const fullData = organisations.find(s => s.code === code)

  if (!fullData) return

  populateForm(fullData)
  showOrgDetails();
  searchInput.value = fullData.label
  resultsContainer.innerHTML = ""
})

// if user types manually, show fields once they focus the first field
inputs.section.addEventListener('focus', showOrgDetails);


// ???????
document.addEventListener("click", (e) => {
  if (!(e.target as HTMLElement).closest(".position-relative")) {
    resultsContainer.innerHTML = ""
  }
})


// Update preview as user types
Object.values(inputs).forEach(input => {
  if (input.id !== 'logo') {
    input.addEventListener('input', updateSignature)
  }
})


// Show HTML
toggleHtmlBtn.addEventListener('click', () => {
  htmlContainer.classList.toggle('d-none');
  toggleHtmlBtn.textContent = htmlContainer.classList.contains('d-none') ? 'Show HTML' : 'Hide HTML';
});


// Init
initOrganisations()
