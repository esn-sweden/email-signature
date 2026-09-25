import icons from "./data/icons.json";
import DOMPurify from "dompurify";
import { inputs } from "./inputs"

const mandatoryFields: (keyof typeof inputs)[] = [
    "name",
    "title",
    "email",
    "orgName",
    "address",
    "logo",
];

export function createSignature() {
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

    const togglePronouns = document.getElementById(
        "togglePronouns",
    ) as HTMLInputElement;
    // only use the value from the pronouns field if it is enabled
    const pronouns = togglePronouns.checked ? inputs.pronouns.value : ""


    const signatureHTML = `
<div style="font-family:Arial, sans-serif; font-size:10pt; color:#000000; line-height:1.4;">
<b>${name}</b>${pronouns ? ` <i>(${pronouns})</i>` : ""}<br>
<i>${title}</i><br>
<a href="mailto:${email}" style="color:#1155cc" target="_blank">${email}</a><br>
${phone ? `${phone}<br>` : ""}
${linkedinPers ? `LinkedIn: <a href="${linkedinPers}" style="color:#1155cc" target="_blank">${linkedinPersUsername}</a><br>` : ""}
——<br>
<b>${orgName}</b><br>
${address}<br>
${website ? `<a href="${website}" style="color:#1155cc" target="_blank">${websiteShort}</a><br>` : ""}

<img src="${logo}" alt="${orgName} logo" style="width:140px; height:auto; margin:10px 0;"><br>

${instagram
            ? `<a href="${instagram}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.instagram} alt="Instagram" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${facebook
            ? `<a href="${facebook}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.facebook} alt="Facebook" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${x
            ? `<a href="${x}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.x} alt="X" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${bluesky
            ? `<a href="${bluesky}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.bluesky} alt="Bluesky" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${youtube
            ? `<a href="${youtube}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.youtube} alt="YouTube" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${linkedinOrg
            ? `<a href="${linkedinOrg}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.linkedin} alt="LinkedIn" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${tiktok
            ? `<a href="${tiktok}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.tiktok} alt="TikTok" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${flickr
            ? `<a href="${flickr}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.flickr} alt="Flickr" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${whatsapp
            ? `<a href="${whatsapp}" target="_blank" style="display:inline-block;">
    <img width="20" height="20" src=${icons.whatsapp} alt="WhatsApp" style="vertical-align:middle; border:none;">
</a>`
            : ""
        }

${skype
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
    if (errorCount === 0) {
        return DOMPurify.sanitize(signatureHTML);
    } else {
        throw new Error("Fill in the required fields to see the signature")
    }
}
