const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);
console.log('Is pdf a function?', typeof pdf === 'function');
console.log('pdf properties:', Object.keys(pdf));
if (typeof pdf === 'object') {
    console.log('pdf.default:', pdf.default);
}

try {
    const fs = require('fs');
    const buffer = fs.readFileSync(__filename); // Just read self as dummy buffer
    pdf(buffer).then(data => console.log('Parsed successfully')).catch(e => console.log('Parse error:', e.message));
} catch (e) {
    console.log('Execution error:', e);
}
