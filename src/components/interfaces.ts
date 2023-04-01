export interface IMockupElement {
    name: string;
    ingredients: string[];
    type: ERecipeType;
    difficulty?: EDifficulty;
    isVegetarian: boolean;
}

export enum ERecipeType {
    BREAKFAST = 'breakfast',
    DINNER = 'dinner',
}

export enum EDifficulty {
    EASY = 'easy',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
}
