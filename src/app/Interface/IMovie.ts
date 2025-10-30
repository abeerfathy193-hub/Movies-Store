export interface IMovie {
    id: number;
    title: string;
    genre_ids: number[];
    genre_names: string[];
    full_poster_path: string;
    full_backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average?: number;
    price?: number;
    trailer: string;
    reviews?: { author: string; content: string}[];
    language: string;
    casting: string[];
}