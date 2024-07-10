export async function GetValorConta(){
    try{
     const response = await fetch('...',{
        headers: {
            Accept:""
        }

        });
        if (!response.ok){
            throw new Error('Failed to fetch account value');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching account Value', error)
        return null;
    }

}