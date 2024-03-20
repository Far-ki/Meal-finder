const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRecipes(url) {
    try {
        let page = 0;
        while (true) {
            const response = await axios.get(`${url}?offset=${page * 13}`);
            const html = response.data;
            const $ = cheerio.load(html);

            console.log(`Scraping page: ${response.config.url}\n`);

            const recipes = $('div.tile');

            if (recipes.length === 0) {
                console.log('No more recipes found.');
                break;
            }

            for (let i = 0; i < recipes.length; i++) {
                const recipeElement = recipes[i];
                try {
                    const recipeUrl = $(recipeElement).find('a.tile-inner').attr('href');

                    if (recipeUrl !== undefined) {
                        const recipeResponse = await axios.get(recipeUrl);
                        const recipeHtml = recipeResponse.data;
                        const $recipe = cheerio.load(recipeHtml);

                        const recipeTitle = $recipe('h1').text();

                        const ingredients = [];
                        $recipe('li[itemprop="recipeIngredient"]').each((index, element) => {
                            let ingredient = $(element).text().trim();
                            if (ingredient.endsWith(',')) {
                                ingredient = ingredient.slice(0, -1);
                            }
                            ingredients.push(ingredient);
                        });

                        const recipeImage = $recipe('img.gallery-picture-no').attr('src');


                            await axios.post('http://localhost:8081/recipes', { recipeTitle, ingredients, recipeUrl, recipeImage });
           
   



                        console.log(`Title: ${recipeTitle}`);
                        console.log('Ingredients:', ingredients);
                        console.log('UrlPage:', recipeUrl);
                        console.log('Image:',recipeImage);
                    }
                } catch (error) {
                    console.error(`Error while scraping recipe data: ${error}`);
                }
            } 

            page++;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('Error while scraping the page:', error);
    }
}

const mainPageUrl = 'https://gotujmy.pl/przepisy.html';
scrapeRecipes(mainPageUrl);
