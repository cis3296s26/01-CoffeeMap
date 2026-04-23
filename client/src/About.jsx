import { useState } from 'react';

function CoffeeImageAPI({ id }) {
    const coffeeUrl = `https://coffee.alexflipnote.dev/random?sig=${id}`;

    return (
        <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 h-100">
                <img 
                    src={coffeeUrl} 
                    alt="Coffee" 
                    className="card-img-top rounded" 
                    style={{ height: '250px', objectFit: 'cover' }} 
                />
            </div>
        </div>
    );
}
//Random coffee images from the Coffee API
export default function About() {
    const [seeds] = useState([
        Math.random(), 
        Math.random(), 
        Math.random()
    ]);

    return (
        <section className="container-xl py-5" style={{ backgroundColor: '#e8e5da', minHeight: '100vh' }}>
            <div className="text-center mb-5">
                <h2 className="display-4 fw-bold">About</h2>
            </div>

            {/* Three Vertical Columns of Text for each section */}
            <div className="row g-4 text-center text-md-start mb-5">
        
                <div className="col-md-4">
                    <h4 className="fw-bold">What is this project?</h4>
                    <p className="lead fs-6" style={{ lineHeight: '1.6' }}>
                        Coffee Harvest Tracker is an interactive 
                        visualization tool that aims to help users make educated purchasing decisions. 
                        A lot of research goes into making a good cup of coffee, from knowing which countries
                        are currently in their prime harvest season to knowing what to expect a certain bean 
                        and variety to taste like.
                    </p>
                </div>

                <div className="col-md-4 border-start border-end px-md-4">
                    <h4 className="fw-bold">What does the website offer?</h4>
                    <p className="lead fs-6" style={{ lineHeight: '1.6' }}>
                        Through Coffee Harvest Tracker, you will be able to interact 
                        with a map that highlights countries in the “Coffee Belt” (the latitudes in which the Arabica 
                        and Robusta coffee plants can grow) and when their harvesting season is. Countries 
                        currently in harvesting season will be displayed based on the date.
                    </p>
                </div>

                <div className="col-md-4">
                    <h4 className="fw-bold">What information can you find?</h4>
                    <p className="lead fs-6" style={{ lineHeight: '1.6' }}>
                        You will be able to explore the kinds of varieties available from these countries, with information about the 
                        flavor profile, grading, and origin of these beans. With this information, whether you
                        are a local café-goer or the aspiring business owner of a small roaster, you will be taking steps towards a better cup of coffee!
                    </p>
                </div>
            </div>

            {/* Pictures Section */}
            <div className="row mt-5">
                {seeds.map((seed, index) => (
                    <CoffeeImageAPI key={index} id={seed} />
                ))}
            </div>
        </section>
    );
}