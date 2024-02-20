# Puppeteer Amazon App

The App take a keyword as input via Get API, search the word on Amazon using puppeteer and return details of the first 4 products on AmazonName, such as Rating, No of Reviews and Price in josn format.

Hit the below url in crome or postman to see output json

[http://localhost:3000/searchAmazon?keyword=mobile](http://localhost:3000/searchAmazon?keyword=mobile)

or add your own keyword 

```bash
  http://localhost:3000/searchAmazon?keyword={your_keyword}
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/ArifDev99/puppeteer-amazon-app.git
```

Go to the project directory

```bash
  cd puppeteer-amazon-app
```

Install all dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
