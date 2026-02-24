import './styles.scss'
import 'bootstrap';
import { loadActiveOrgs } from "./api"
import type { ESNOrg } from "./api"
import { icons } from './icons';

interface Model {
  searchResults: ESNOrg[]
  org: ESNOrg | null
  showOrgDetails: boolean
  showHTML: boolean
  ESNOrgs: ESNOrg[]
  apiError: string
}

let model: Model = {
  searchResults: [],
  org: null,
  showOrgDetails: false,
  showHTML: false,
  ESNOrgs: [],
  apiError: "",
}


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
                    <label for="linkedinPers" class="form-label">LinkedIn (optional)</label>
                    <input type="tel" id="linkedinPers" class="form-control" />
                </div>

                <h3>Organisation information</h3>

                <div class="mb-4 position-relative">
                    <label class="form-label fw-bold">Search organisation</label>
                    <input type="text" id="org-search" class="form-control form-control-lg"
                        placeholder="Start typing the name of your section/NO...">
                    <div id="org-results" class="list-group position-absolute w-100 shadow"></div>
                    <button id="revealOrgInfo" class="btn btn-link">select manually</button>
                </div>

                <div id="error" class="alert alert-danger p-3 mb-3 d-none" role="alert"></div>

                <div id="org-details" class="d-none">
                    <div class="mb-3">
                        <label for="orgName" class="form-label">Name of ESN section/country</label>
                        <input type="text" id="orgName" class="form-control" placeholder="ESN Havana" />
                    </div>

                    <div class="mb-3">
                        <label for="address" class="form-label">Address</label>
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

                    <p>Paste the links to your social media</p>

                    <div class="mb-3">
                        <label for="facebook" class="form-label">Facebook</label>
                        <input type="text" id="facebook" class="form-control" />
                    </div>

                    <div class="mb-3">
                        <label for="instagram" class="form-label">Instagram</label>
                        <input type="text" id="instagram" class="form-control" />
                    </div>

                    <div class="mb-3">
                        <label for="x" class="form-label">X</label>
                        <input type="text" id="x" class="form-control" />
                    </div>

                    <div class="mb-3">
                        <label for="bluesky" class="form-label">Bluesky</label>
                        <input type="text" id="bluesky" class="form-control" value="" />
                    </div>
                    <div class="mb-3">
                        <label for="youtube" class="form-label">YouTube</label>
                        <input type="text" id="youtube" class="form-control" value="" />
                    </div>
                    <div class="mb-3">
                        <label for="linkedinOrg" class="form-label">LinkedIn</label>
                        <input type="text" id="linkedinOrg" class="form-control" value="" />
                    </div>
                    <div class="mb-3">
                        <label for="tiktok" class="form-label">TikTok</label>
                        <input type="text" id="tiktok" class="form-control" value="" />
                    </div>
                    <div class="mb-3">
                        <label for="flickr" class="form-label">Flickr</label>
                        <input type="text" id="flickr" class="form-control" value="" />
                    </div>
                    <div class="mb-3">
                        <label for="whatsapp" class="form-label">WhatsApp</label>
                        <input type="text" id="whatsapp" class="form-control" value="" />
                    </div>
                    <div class="mb-3">
                        <label for="skype" class="form-label">Skype</label>
                        <input type="text" id="skype" class="form-control" value="" />
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
  linkedinPers: document.querySelector<HTMLInputElement>('#linkedinPers')!,
  logo: document.querySelector<HTMLInputElement>('#logo')!,
  address: document.querySelector<HTMLTextAreaElement>('#address')!,
  orgName: document.querySelector<HTMLInputElement>('#orgName')!,
  website: document.querySelector<HTMLInputElement>('#website')!,
  facebook: document.querySelector<HTMLInputElement>('#facebook')!,
  instagram: document.querySelector<HTMLInputElement>('#instagram')!,
  x: document.querySelector<HTMLInputElement>('#x')!,
  bluesky: document.querySelector<HTMLInputElement>('#bluesky')!,
  youtube: document.querySelector<HTMLInputElement>('#youtube')!,
  linkedinOrg: document.querySelector<HTMLInputElement>('#linkedinOrg')!,
  tiktok: document.querySelector<HTMLInputElement>('#flickr')!,
  whatsapp: document.querySelector<HTMLInputElement>('#whatsapp')!,
  skype: document.querySelector<HTMLInputElement>('#skype')!,


}
const preview = document.querySelector<HTMLDivElement>('#preview')!
const htmlOutput = document.querySelector<HTMLTextAreaElement>('#htmlOutput')!
const searchInput = document.querySelector<HTMLInputElement>("#org-search")!
const resultsContainer = document.querySelector<HTMLDivElement>("#org-results")!
const toggleHtmlBtn = document.querySelector<HTMLButtonElement>('#toggleHtmlBtn')!;
const revealOrgBtn = document.querySelector<HTMLButtonElement>('#revealOrgInfo')!;
const htmlContainer = document.querySelector<HTMLDivElement>('#htmlContainer')!;
const details = document.querySelector<HTMLDivElement>('#org-details')!;

const mandatoryFields: (keyof typeof inputs)[] = [
  "name",
  "title",
  "email",
  "orgName",
  "address",
  "logo",
];



function view() {

  if (model.org) {
    inputs.orgName.value = model.org.label
    inputs.address.value = model.org.address
    inputs.website.value = model.org.website
    inputs.logo.value = model.org.logo
    inputs.facebook.value = model.org.facebook
    inputs.instagram.value = model.org.instagram
    inputs.x.value = model.org.x
  }

  if (model.showOrgDetails) {
    details.classList.remove('d-none');
    revealOrgBtn.classList.add('d-none');
  }

  if (model.showHTML) {
    htmlContainer.classList.remove('d-none');
    toggleHtmlBtn.textContent = 'Hide HTML';
  } else {
    htmlContainer.classList.add('d-none');
    toggleHtmlBtn.textContent = 'Show HTML';
  }

  if (model.searchResults.length > 0) {
    resultsContainer.innerHTML = model.searchResults
      .map(org => `
      <div class="list-group-item list-group-item-action" data-code="${org.code}">
        ${org.label}
      </div>
    `)
      .join("")
  } else {
    resultsContainer.innerHTML = ''
  }

  const el = document.getElementById("error");
  if (el) el.textContent = model.apiError;
  if (model.apiError) {
    el?.classList.remove("d-none")
  } else {
    el?.classList.add("d-none")
  }





  const name = inputs.name.value
  const title = inputs.title.value
  const email = inputs.email.value
  const orgName = inputs.orgName.value
  const address = inputs.address.value.replace(/\n/g, "<br>")
  const website = inputs.website.value
  const websiteShort = website.replace(/^.*\:\/\//, "").replace(/\/+$/, "")
  const logo = inputs.logo.value
  const phone = inputs.phone.value
  const linkedinPers = inputs.linkedinPers.value
  const facebook = inputs.facebook.value
  const instagram = inputs.instagram.value
  const x = inputs.x.value
  const bluesky = inputs.bluesky.value
  const youtube = inputs.youtube.value
  const linkedinOrg = inputs.linkedinOrg.value
  const tiktok = inputs.tiktok.value
  const whatsapp = inputs.whatsapp.value
  const skype = inputs.skype.value

  const signatureHTML = `
<div style="font-family:Arial, sans-serif; font-size:10pt; color:#000000; line-height:1.4;">
    <b>${name}</b><br>
    <i>${title}</i><br>
    <a href="mailto:${email}" style="color:#1155cc" target="_blank">${email}</a><br>
    ${phone ? `${phone}<br>` : ''}
    ${linkedinPers ? `LinkedIn: ${linkedinPers}<br>` : ''}
    ——<br>
    <b>${orgName}</b><br>
    ${address}<br>
    ${website ? `<a href="${website}" style="color:#1155cc" target="_blank">${websiteShort}</a><br>` : ''}

    <img src="${logo}" alt="ESN logo" style="width:140px; height:auto; margin:10px 0;"><br>

    ${instagram ? `<a href="${instagram}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.instagram} alt="Instagram" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${facebook ? `<a href="${facebook}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.facebook} alt="Facebook" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${x ? `<a href="${x}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.x} alt="X" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${bluesky ? `<a href="${bluesky}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.bluesky} alt="Bluesky" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${youtube ? `<a href="${youtube}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.youtube} alt="YouTube" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${linkedinOrg ? `<a href="${linkedinOrg}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.linkedin} alt="LinkedIn" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${tiktok ? `<a href="${tiktok}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.tiktok} alt="TikTok" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${whatsapp ? `<a href="${whatsapp}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.whatsapp} alt="WhatsApp" style="vertical-align:middle; border:none;">
    </a>`: ''}

    ${skype ? `<a href="${skype}" target="_blank" style="display:inline-block;">
        <img width="20" height="20" src=${icons.skype} alt="Skype" style="vertical-align:middle; border:none;">
    </a>`: ''}
</div>
`.trim()


  let errorCount = 0;
  mandatoryFields.forEach(key => {
    const input = inputs[key];

    if (!input.value.trim()) {
      input.classList.add("is-invalid");
      errorCount++;
    } else {
      input.classList.remove("is-invalid");
    }
  });


  if (errorCount == 0) {
    preview.innerHTML = signatureHTML
    htmlOutput.value = signatureHTML
  } else {
    preview.innerHTML = "Fill in the required fields to see the signature"
    htmlOutput.value = ""
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





// --------------------- Event listeners --------------------------------

// Typing in the search bar
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase()

  model.searchResults = model.ESNOrgs.filter(org =>
    org.label.toLowerCase().includes(query)).slice(0, 10) // limit to 10 results
  view()
})

// Selecting a result from the drop-down
resultsContainer.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement
  const item = target.closest("[data-code]") as HTMLElement
  if (!item) return

  const code = item.dataset.code!
  const fullData = model.ESNOrgs.find(s => s.code === code)

  if (!fullData) return

  model.org = fullData
  model.showOrgDetails = true
  searchInput.value = fullData.label
  model.searchResults = []
  view()
})


// Select first search result when enter is pressed
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // prevent form submission

    const firstItem = resultsContainer.querySelector<HTMLElement>('.list-group-item');
    if (firstItem) {
      firstItem.click();
    }
  }
});



// Update preview as user types
Object.values(inputs).forEach(input => {
  input.addEventListener('input', view)
})


// Show HTML
toggleHtmlBtn.addEventListener('click', () => {
  if (model.showHTML) {
    model.showHTML = false
  } else {
    model.showHTML = true
  }
  view()
});


revealOrgBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form submission
  model.showOrgDetails = true
  view()
});



// Init
view()
initOrganisations()
