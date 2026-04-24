# Overview

## Coffee Map
Coffee Map is an interactive website that serves as a centralized resource hub for coffee drinkers interested in making personalized and informed coffee bean purchases. Users can access the service as an informational guide on sources and flavor profiles by searching for beans using the search bar or the interactive map. Coffee Map integrates quantitative quality metrics from the Coffee Quality Institute and qualitative insights from retail coffee reviews which allows users to explore beans by origin, species, and flavor. Users can create an account to favorite and rate coffee beans for a more personalized experience.


<img width="2165" height="1485" alt="image" src="https://github.com/user-attachments/assets/f743b381-40df-45aa-854c-d2dac03c1af3" />


## Vision

For coffee enthusiasts looking to purchase or try new beans who want to learn about coffee bean sources, Coffee Map is a web-based service that maps and tracks bean sources alongside useful tasting metrics and harvesting schedules for users to reference when purchasing coffee. Unlike existing databases or harvest calendars, our product combines the overwhelming amount of available information into a single, easy-to-use resource catered to the user.

## What does it do?
Through Coffee Map, you will be able to interact with a map that highlights coffee-producing countries and explore the kinds of varieties available from these countries, with information about the flavor profile, grading, and origin of beans. You can also browse retail coffee reviews to discover specific roasters. With this information, whether you are a local café-goer or an aspiring business owner, you will be taking steps towards a better cup of coffee.

## Features
- Interactive world map of coffee-producing countries
- Bean search with filters by country, region, species, and quality scores
- Country detail pages with averaged quality metrics and harvesting info
- Coffee reviews dataset with roaster and rating
- User accounts with favorites and personal star ratings

## Original Proof of Concept
https://github.com/aidanross430/CIS3296-coffeemap-proofofconcept/tree/main 

## Environment
OS: Mac, Windows
Database: Firebase

## Installation
### Development Environment

#### For MacOS:

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
npm install recharts
npm install bootstrap
```
Run the program:
```
npm run dev
```
To open the webpage in an external browser, press: o + 
We recommend creating a .gitignore file for the installations.

#### For Windows:

Install dependencies npm install
```
cd client
npm install
npm install react-router-dom
npm install firebase
npm install papaparse
npm install recharts
npm install bootstrap
```
Run the program:
```
npm run dev
```
Open: http://localhost:5173/

## Testing:

Automated tests: 

Install 
```

npm install vitest --save-dev 

npm install --save-dev @testing-library/user-event 

npm install --save-dev @testing-library/jest-dom 

npm install --save-dev @testing-library/react
```

Run (test): 
```
npx vitest
```
## How to contribute

Follow this project board to know the latest status of the project: https://github.com/orgs/cis3296s26/projects/34/views/1


## Website:
https://cis3296s26.github.io/01-CoffeeMap/

