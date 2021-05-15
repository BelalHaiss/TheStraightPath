const sanitizeHtml = require('sanitize-html');

console.log(sanitizeHtml("<img src=x onerror=alert('img') /> sadasdas"));