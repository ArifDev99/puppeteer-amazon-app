// const express = require('express');
import express from "express";
// const puppeteer = require('puppeteer');
import puppeteer from "puppeteer";
// const axios = require('axios');
import axios from "axios";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/searchAmazon', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword parameter' });
  }

  console.log(keyword);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to Amazon and search for the provided keyword
    // https://www.amazon.in/s?k=fastrack&ref=nb_sb_noss
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`);
    // console.log(page);
    await page.screenshot({path: 'screenshot.png'});

    const title = await page.$$eval("h2 span.a-color-base", (nodes) =>
    nodes.map((n) => n.innerText));

    const price = await page.$$eval(
      "span.a-price[data-a-color='base'] span.a-offscreen",
      (nodes) => nodes.map((n) => n.innerText)
    );

    const ratingNode=await page.$$eval(
      "div.a-row.a-size-small span[aria-label]"
      ,(nodes)=>nodes.map((n)=>n.ariaLabel)
    )
    
    // let ratingText=[]
    // for(let i=0 ;i<ratingNode.length ;i++){
    //   if(i%2==0){
    //     ratingText.push(ratingNode[i]);
    //   }
    // }


    const amazonSearchArray = title.slice(0, 5).map((value, index) => {
      return {
        title: title[index],
        price: price[index],
        rating: ratingNode[2*index],
        no_of_review:ratingNode[2*index+1]
      };
    });

    // Extract details of the first 4 products
    // const products = await page.evaluate(() => {
    //   const results = [];

    //   const productElements = document.querySelectorAll('.s-result-item');
    //   for (let i = 0; i < 4 && i < productElements.length; i++) {
    //     const product = productElements[i];

    //     const name = product.querySelector('h2 span').innerText.trim();
    //     const description = product.querySelector('.s-line-clamp-2').innerText.trim();
    //     const rating = parseFloat(product.querySelector('.a-icon-star .a-icon-alt').innerText.replace(/[^0-9.]/g, ''));
    //     const reviews = parseInt(product.querySelector('.s-link-normal .a-size-base').innerText.replace(/[^0-9]/g, ''));
    //     const price = product.querySelector('.a-offscreen').innerText.trim();

    //     results.push({ name, description, rating, reviews, price });
    //   }

    //   return results;
    // });

    // Close the browser
    await browser.close();

    res.json(amazonSearchArray);
    // res.json(ratingNode)
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




// a-size-small a-color-secondary a-text-normal--->span
// a-size-small a-color-base a-text-normal--->span