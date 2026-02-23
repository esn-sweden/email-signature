# ESN Email Siganture Generator

Generates VIM complient email signatures with autofill of section/NO information

Based on specifications in [ESN Signature Template & Tutorial](https://docs.google.com/document/d/1IVG5MqWnspUfaJZFDlPMfkOiT9BgvSo4RQYpRWjdSM8/view).

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

[!NOTE]
Using pinned sass at 1.78 to avoid very long deprecation warnings. See [issue](https://github.com/twbs/bootstrap/issues/40962).
