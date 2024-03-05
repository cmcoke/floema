require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom');

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  });
};

const handleLinkResolver = doc => {
  // if (doc.type === 'product') {
  //   return `/detail/${doc.uid}`;
  // }

  // if (doc.type === 'collections') {
  //   return '/collections';
  // }

  // if (doc.type === 'about') {
  //   return '/about';
  // }

  return '/';
};

app.use((req, res, next) => {
  // const ua = UAParser(req.headers['user-agent']);

  // res.locals.isDesktop = ua.device.type === undefined;
  // res.locals.isPhone = ua.device.type === 'mobile';
  // res.locals.isTablet = ua.device.type === 'tablet';

  // res.locals.Link = handleLinkResolver;

  // res.locals.Numbers = index => {
  //   return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 ? 'Four' : '';
  // };


  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  };

  res.locals.PrismicDOM = PrismicDOM;

  next();
});

app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/about', async (req, res) => {

  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['about', 'meta'])).then(response => {
      const { results } = response;
      const [about, meta] = results;

      console.log(about, meta);

      res.render('pages/about', {
        about,
        meta
      });
    });
  });



});

app.get('/detail/:uid', (req, res) => {
  res.render('pages/detail');
});

app.get('/collections', (req, res) => {
  res.render('pages/collections');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});