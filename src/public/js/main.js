import './toolbar.js';
import './sidebar.js';
import './buttons.js';
import './forms.js';
import './journal.js';
import './animations.js';

const urlToEmbedGoogleLink = (url) => {
  var str = url;
  var matches = str.match(/\/@([\d\.,-]+)z\//)[1];
  var splits = matches.split(',');
  var lat = splits[0];
  var long = splits[1];
  var zoom = splits[2];
  return (url =
    'http://maps.google.com/maps?q=' +
    lat +
    ',' +
    long +
    '&z=' +
    zoom +
    '&output=embed');
};

console.log(
  urlToEmbedGoogleLink(
    'https://www.google.com.ar/maps/place/Plaza+Constituci%C3%B3n/@-34.6742053,-58.4059233,15z/data=!4m5!3m4!1s0x0:0x77c3665bed4aa0a7!8m2!3d-34.6711807!4d-58.4089637'
  )
);
