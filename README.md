# html2pdf

PDF screenshot API based on PhantomJS

##### Node version
version >= `4.0.0`

## Usage

```bash
$ NODE_ENV=production npm install
$ NODE_ENV=production PORT=4005 npm start
```

```
Open http://localhost:4005/export?url=http://www.google.com&filename=google.pdf&format=A4&orientation=portrait
```

### Usage with SPA

```js
// on page_load
window.phantomWaitForCallback = true;

// when you are done fetching your api and rendering the page
if (typeof window.callPhantom === 'function') {
 window.callPhantom({ event: 'loaded' });
}
```
