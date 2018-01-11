# html2pdf

PDF screenshot API based on Puppeteer.

##### Node version
version >= `8.0.0`

## Usage

```bash
$ NODE_ENV=production npm install
$ NODE_ENV=production PORT=4005 npm start

$ DEBUG=1 NODE_ENV=production PORT=4005 npm start
```


```
Open http://localhost:4005/export?url=http://www.google.com&filename=google.pdf&format=A4&orientation=portrait
```
