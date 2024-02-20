// const express = require('express');
import express from "express";
// const puppeteer = require('puppeteer');
import puppeteer from "puppeteer";
// const axios = require('axios');

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
    


    const amazonSearchArray = title.slice(0, 5).map((value, index) => {
      return {
        title: title[index],
        price: price[index],
        rating: ratingNode[2*index],
        no_of_review:ratingNode[2*index+1]
      };
    });


    // Close the browser
    await browser.close();

    res.json(amazonSearchArray);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

