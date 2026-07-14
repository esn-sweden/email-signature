import socialMediaYaml from "./data/extra-social-media.yaml";
import OrgsYaml from "./data/extra-orgs.yaml";
import type { ESNOrg, ExtraSocialMedia } from "./types/esn-org";
import type { ESNOrgApi } from "./types/esn-api";

const extraSocialMedia: ExtraSocialMedia = { ...socialMediaYaml };

const extraOrgs: ESNOrg[] = OrgsYaml;

function getAddress(section: ESNOrgApi): string {
  const adr = section.address;
  return [
    adr.address_line1,
    adr.address_line2,
    adr.postal_code + " " + adr.locality,
  ]
    .filter(Boolean)
    .join("\n");
}

async function loadCountries(): Promise<ESNOrgApi[]> {
  const response = await fetch("api/v2/countries");

  if (!response.ok) {
    throw new Error("Failed to load NOs");
  }

  return response.json();
}

async function loadSections(): Promise<ESNOrgApi[]> {
  const response = await fetch("api/v2/sections");

  if (!response.ok) {
    throw new Error("Failed to load sections");
  }

  return response.json();
}

export async function loadActiveOrgs(): Promise<ESNOrg[]> {
  const [countries, sections] = await Promise.all([
    loadCountries(),
    loadSections(),
  ]);

  const activeOrgs = countries
    .concat(sections)
    .filter((org) => org.state === "active")
    .sort((a, b) => a.code.localeCompare(b.code));

  const esnOrgs = activeOrgs.map((org) => {
    const ext = extraSocialMedia[org.code] ?? {};

    return {
      ...org,
      address: getAddress(org),
      x: org.twitter,
      ...ext, // Extra data from yaml
    };
  });

  return [...esnOrgs, ...extraOrgs];
}
