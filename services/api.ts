export async function getData(url: any) {
    try {
        const reponse = await fetch(url);
        const data = await reponse.json();
        return data;

    } catch(e) {
        console.log('Error getting data', e)
    }
}