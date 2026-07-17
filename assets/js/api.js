export async function fetchSongs(term) {

    const response = await fetch(
        `https://itunes.apple.com/search?term=${term}&entity=song&limit=20`
    );

    const data = await response.json();

    return data.results;
}