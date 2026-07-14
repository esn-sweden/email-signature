# ESN Email Siganture Generator

Generates VIM complient email signatures with autofill of section/NO information

Based on specifications in [ESN Signature Template & Tutorial](https://docs.google.com/document/d/1IVG5MqWnspUfaJZFDlPMfkOiT9BgvSo4RQYpRWjdSM8/view).

## Changing organisation information

All data is taken from ESN Accounts, please update your information there and it will be reflected in the signature generator.

> [!NOTE]
> The "Organisation name" part of the address is not visible in the ESN Accounts API. If you need to include that, put that on the first or second address line instead.

If you would like to add any social media which are not available in ESN Accounts, you can make a pull request to `src/extra-social-media.yaml`. Use the section **code** as the key. You may also contact the maintainer for assistance.

## Adding a new organisation

If you have an organisation which is related to ESN and want to use the same signature template, you are welcome to make a pull request to `src/extra-orgs.yaml`. 

## Development

````sh
git clone https://github.com/esn-sweden/email-signature.git
cd email-signature
npm install
````

### Run dev server

````sh
npm run dev
````

### Build distribution

````sh
npm run build
````
