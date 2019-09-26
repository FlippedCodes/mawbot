const FListApiClient = require('flist-api');
const _ = require('lodash');
const Promise = require('bluebird');

const apiTest = new FListApiClient('philflipper', 'D4^3qEmvZwg5&N9h');

module.exports.run = async (client, message, args, con, config) => {
  function reduceInfo(info, name) {
    return _.chain(info)
      .find({ group: name })
      .get('items')
      .transform(
        (result, value) => { result[value.name] = value.value; },
        {}
      ).value();
  }

  apiTest.request('character-info')
    .get('info')
    .then(info =>
      ({
        contact: reduceInfo(info, 'Contact details/Sites'),
        sexualDetails: reduceInfo(info, 'Sexual details'),
        generalDetails: reduceInfo(info, 'General Details'),
        RPprefs: reduceInfo(info, 'RPing preferences'),
      }));

      
  fetchFListInfo('degon')
  .then(data => console.log(data), error => console.error(error.stack));

  'use strict';

  // function fetchFListInfo(name) {
  //   const options = {
  //     params: {
  //       name
  //     }
  //   };
  //   return Promise.props({
  //     kinks: apiTest.request('character-kinks', options)
  //     .get('kinks')
  //     .then(info => _.chain(info)
  //       .map('items')
  //       .flatten()
  //       .transform(
  //         (result, value) => {
  //           result[value.name] = value.choice;
  //         },
  //         {}
  //       )
  //       .invert(true)
  //       .value()),

  //     customKinks: apiTest.request('character-customkinks', options)
  //     .get('kinks')
  //     .then(data => _.transform(data, (result, value) => {
  //       result[value.name] = value.description;
  //     }, {})),

  //     accountInfo: apiTest.request('character-get', options)
  //     .get('character'),

  //     advanced: apiTest.request('character-info', options)
  //     .get('info')
  //     .then(info =>
  //       ({
  //         contact: reduceInfo(info, 'Contact details/Sites'),
  //         sexualDetails: reduceInfo(info, 'Sexual details'),
  //         generalDetails: reduceInfo(info, 'General Details'),
  //         RPprefs: reduceInfo(info, 'RPing preferences')
  //       })),

  //     images: apiTest.request('character-images', options)
  //     .get('images'),
  //   });
  // }
  
  // fetchFListInfo('degon')
  // .then(data => console.log(data), error => console.error(error.stack));
  
};

module.exports.help = {
  name: 'flist',
};
