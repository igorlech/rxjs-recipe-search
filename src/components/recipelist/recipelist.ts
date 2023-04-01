import { MockupRecipes } from './mockupdata';
import { debounceTime, filter, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs';
import './recipelist.scss';

export class Recipelist {
    private form: HTMLFormElement = this.element.querySelector('#filter');
    private input: HTMLInputElement = this.element.querySelector('#input');
    private search: HTMLFormElement = this.element.querySelector('#search');
    private content = this.element.querySelector('.content');
    private recipesArray = MockupRecipes;
    private list = ``;

    constructor(private element: Element) {
        console.log(this.form, this.content, this.input, this.search);
        this.getRecipes();
        this.recipeSearch();
    }

    public getRecipes() {
        console.log(this.recipesArray);
    }

    public recipeSearch() {
        console.log(this.search.value);

        this.content.innerHTML = `${this.recipesArray
            .map(
                (recipe) =>
                    `<li><h2>${recipe.name}</h2> <div>Ingredients: ${recipe.ingredients
                        .map((ingredient) => `<span>${ingredient}</span>, `)
                        .join('')}</div></li>`
            )
            .join('')}`;

        merge(
            // fromEvent(this.form, 'reset'),
            fromEvent(this.input, 'keyup'),
            fromEvent(this.input, 'change'),
            fromEvent(this.search, 'keyup'),
            fromEvent(this.search, 'change')
        )
            .pipe(
                map(() => this.input.value || this.search.value),
                filter((result) => result.length > 2),
                debounceTime(100)
            )
            .subscribe({
                next: (result) => {
                    const formData = new FormData(this.form);
                    console.log(formData.get('type'));
                    console.log('formdata:', formData.get('search'), formData.get('type'));
                    const filteredList = this.recipesArray.filter(
                        (recipe) => recipe.name.toLowerCase().includes(result.toLowerCase()) || formData.get('type') === recipe.type
                    );

                    this.list = '';
                    filteredList.forEach((recipe) => {
                        if (this.search.value === 'all') {
                            this.list += `<li><h2>${recipe.name}</h2> <div>Ingredients: ${recipe.ingredients
                                .map((ingredient) => `<span>${ingredient}</span>, `)
                                .join('')}</div></li>`;
                            this.content.innerHTML = this.list;
                        } else if (this.search.value === recipe.type) {
                            this.input.value = '';
                            this.list += `<li><h2>${recipe.name}</h2> <div>Ingredients: ${recipe.ingredients
                                .map((ingredient) => `<span>${ingredient}</span>, `)
                                .join('')}</div></li>`;
                            this.content.innerHTML = this.list;
                        } else {
                            this.content.innerHTML = `<h2>No recipes found</h2>`;
                        }
                    });
                },
                error: (err) => console.error(err),
                complete: () => {
                    console.log('complete');
                },
            });
    }
}
