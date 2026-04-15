import {useState, useEffect} from 'react'

function FetchCoffeeImage() {
    const randomSeed = Date.now()
    const coffeeUrl= `https://coffee.alexflipnote.dev/random?${randomSeed}`

    return(
        <div>
            <img src={coffeeUrl} alt='coffee'/>
        </div>
    )
}

export default FetchCoffeeImage;