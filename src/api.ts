interface SectionApi {
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

export interface Section {
    label: string
    code: string
    website: string
    address: string
    facebook: string
    instagram: string
    x: string
    logo: string
}


function getAddress(section: SectionApi): string {
    const adr = section.address
    return [adr.address_line1, adr.address_line2, adr.postal_code + " " + adr.locality].filter(Boolean).join("\n")
}


export async function loadActiveSections(): Promise<Section[]> {
    const response = await fetch("https://accounts.esn.org/api/v2/sections")

    if (!response.ok) {
        throw new Error("Failed to load organisations")
    }

    const data: SectionApi[] = await response.json()
    const activeSections = data
        .filter(org => org.state === "active")
        .sort((a, b) => a.code.localeCompare(b.code));

    return activeSections.map(apiSection => ({
        label: apiSection.label,
        code: apiSection.code,
        website: apiSection.website,
        address: getAddress(apiSection),
        facebook: apiSection.facebook,
        instagram: apiSection.instagram,
        x: apiSection.twitter,
        logo: apiSection.logo,
    }))
}
