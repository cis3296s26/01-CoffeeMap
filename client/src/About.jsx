export default function About() {
    return (
        <section id="about"style={{ padding: '20px',  backgroundColor: '#e8e5da', minHeight: '100vh', boxSizing: 'border-box' , display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center'}}>
            <h2>About</h2>
            <p>Coffee Harvest Tracker is an interactive 
                visualization tool that aims to help users make educated purchasing decisions. 
                A lot of research goes into making a good cup of coffee, from knowing which countries
                 are currently in their prime harvest season to knowing what to expect a certain bean 
                 and variety to taste like. Through Coffee Harvest Tracker, you will be able to interact 
                 with a map that highlights countries in the “Coffee Belt” (the latitudes in which the Arabica 
                 and Robusta coffee plants can grow) and when their prime harvesting season is. The countries 
                 currently in their harvesting season will be displayed based on the date. You will also be able
                  to explore the kinds of varieties available from these countries, with information about the 
                  flavor profile, grading, and origin of these beans. With this information, whether you
                  are a local café-goer or the aspiring business owner of a small roaster, you will be taking steps towards a better cup of coffee! </p>
        </section>
    )
}