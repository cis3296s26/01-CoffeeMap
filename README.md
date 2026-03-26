<img width="468" height="127" alt="image" src="https://github.com/user-attachments/assets/433b0c21-280c-458c-bb76-7f52a272473a" /># Coffee Map
Coffee Map is a website that serves as a centralized resource hub for coffee drinkers interested in making personalized and educated coffee bean purchases. Users can access the service as an informational guide on sources and flavor profiles by searching for beans by branded bag using the search bar or by country using the interactive map. Users can become members of the Coffee Map community by creating an account while enables additional personalized features, allowing individuals to log coffee beans they've already tried and bookmark ones that are of interest. 

## Vision Statement
FOR coffee enjoyers looking to purchase or try new beans WHO want to learn about coffee bean sources, the COFFEE MAP is a web-based service THAT maps and tracks bean sources alongside useful tasting metrics and harvesting schedules for users to reference when purchasing coffee. UNLIKE existing databases or harvest calendars, OUR PRODUCT will combine the overwhelming amount of available information into a single, easy-to-use resource catered to the user.

## Original Proof of Concept
https://github.com/aidanross430/CIS3296-coffeemap-proofofconcept/tree/main 

## Installation
### Development Environment

For MacOS:
Create a virtual environment for this project. Navigate to the root directory folder of the project in terminal and activate your created virtual environment if not active already:
```
source .venv/bin/activate
```
Install homebrew:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" 
```
Install node and check that it worked by checking the version:
```
brew install node
node -v
npm -v
```
Navigate to client and install packages from npm:
```
cd client
npm install
npm install react-router-dom
npm install firebase
npm install papaparse
```
Run the program:
```
npm run dev
```
To open the webpage in an external browser, press: o + 
We recommend creating a .gitignore file for the installations.

## How to contribute
Follow this project board to know the latest status of the project: https://github.com/orgs/cis3296s26/projects/34/views/1

