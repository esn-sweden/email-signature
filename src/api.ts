interface ESNOrgApi {
    label: string
    code: string
    email: string
    website: string
    country: string
    cc: string
    state: string
    joined: string
    address: {
        street_address: string,
        address_line1: string,
        address_line2: string,
        locality: string,
        postal_code: string,
        cc: string,
        country: string
    }
    cities: [{ name: string, cc: string }]
    geolocation: {
        lat: number,
        lng: number,
        lat_sin: number,
        lat_cos: number,
        lng_rad: number,
    }

    university_name: string
    university_website: string
    updated: string
    facebook: string
    instagram: string
    twitter: string
    video: string
    logo: string
    status: boolean
}

export interface ESNOrg {
    label: string
    code: string
    website: string
    address: string
    facebook: string
    instagram: string
    x: string
    logo: string
}


function getAddress(section: ESNOrgApi): string {
    const adr = section.address
    return [adr.address_line1, adr.address_line2, adr.postal_code + " " + adr.locality].filter(Boolean).join("\n")
}

async function loadCountries(): Promise<ESNOrgApi[]> {
    const response = await fetch("api/api/v2/countries")

    if (!response.ok) {
        throw new Error("Failed to load NOs")
    }

    return response.json()
}

async function loadSections(): Promise<ESNOrgApi[]> {
    const response = await fetch("api/api/v2/sections")

    if (!response.ok) {
        throw new Error("Failed to load sections")
    }

    return response.json()
}



export async function loadActiveOrgs(): Promise<ESNOrg[]> {
    const countries: ESNOrgApi[] = await loadCountries()
    const sections: ESNOrgApi[] = await loadSections()

    const activeOrgs = countries.concat(sections)
        .filter(org => org.state === "active")
        .sort((a, b) => a.code.localeCompare(b.code));

    return activeOrgs.map(org => ({
        label: org.label,
        code: org.code,
        website: org.website,
        address: getAddress(org),
        facebook: org.facebook,
        instagram: org.instagram,
        x: org.twitter,
        logo: org.logo,
    }))
}
