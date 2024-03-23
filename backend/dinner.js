const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRecipes(url) {
    try {
        let page = 0;
        while (true) {
            const response = await axios.get(`${url}?offset=${page * 29}`);
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

                        const commentsLink = $recipe('li span a[href="#comments"]');
                        let difficultyText, cook_time;

                        const h4Tag = $recipe('h4.marked');

                        if (h4Tag.length > 0) {
                            if (commentsLink.length > 0) {
                                difficultyText = $recipe('header.col-60 li:has(span)').eq(2).text();
                                cook_time = $recipe('header.col-60 li:has(span)').eq(3).text().trim();
                            } else {
                                difficultyText = $recipe('header.col-60 li:has(span)').eq(1).text();
                                cook_time = $recipe('header.col-60 li:has(span)').eq(2).text().trim();
                            }
                        }
                        else {
                            if (commentsLink.length > 0) {
                                difficultyText = $recipe('div.col-auto.col-lg-45.col-md-60 li:has(span)').eq(1).text();
                                cook_time = $recipe('div.col-auto.col-lg-45.col-md-60 li:has(span)').eq(2).text().trim();
                            } else {
                                difficultyText = $recipe('div.col-auto.col-lg-45.col-md-60 li:has(span)').first().text();
                                cook_time = $recipe('div.col-auto.col-lg-45.col-md-60 li:has(span)').eq(1).text().trim();
                            }
                        }
                        const recipeImage = $recipe('img.gallery-picture-no').attr('src');
                        const difficulty = difficultyText.replace(/TRUDNOŚĆ:\s*/i, '');

                        await axios.post('http://localhost:8081/dinner', { recipeTitle, ingredients, recipeUrl, recipeImage, difficulty, cook_time });




                        console.log(`Title: ${recipeTitle}`);
                        console.log('Ingredients:', ingredients);
                        console.log('UrlPage:', recipeUrl);
                        console.log('Image:', recipeImage);
                        console.log('dif', difficulty);
                        console.log('cook_time', cook_time);
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

const mainPageUrl = 'https://gotujmy.pl/przepisy-przepisy-na-obiad.html';
scrapeRecipes(mainPageUrl);
