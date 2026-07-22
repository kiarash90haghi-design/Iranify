export async function fetchSongs(term) {

    const response = await fetch(
        `https://itunes.apple.com/search?media=music&entity=song&term=${encodeURIComponent(term)}&limit=20`
    );

    const data = await response.json();

    return data.results;

}