import {describe, it, expect, test, vi, beforeEach} from 'vitest';
import {applyFilters} from './src/BeanSearch.jsx'
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LogIn from './src/LogIn';
import Favorites from './src/Favorites.jsx';
import { getFavorites } from './src/favoriteDB.jsx';
import { useAuth } from './src/AuthContext.jsx';

const sampleBeans = [
    {"Country.of.Origin": "Ethiopia", "Region": "Yirgacheffe", "Aroma": "8.5", "Species": "Arabica"},
    {"Country.of.Origin": "Colombia", "Region": "Huila", "Aroma": "7.0", "Species": "Arabica"},
]


//--------Tests for BeanSearch.jsx--------
describe('applyFilters', () => {
    //Check if the function returns true when no filters are applied
    it('returns true when no filters are applied', () => {
        expect(applyFilters(sampleBeans[0], {country: [], region: [], aroma: [], species: [], minScore: 0, minFlavor: 0, minAcidity: 0, minSweetness: 0})).toBe(true)
    })

    //Check if the function returns true when the country filter matches
    it('filters by country', () => {
        expect(applyFilters(sampleBeans[0], {country: ['Ethiopia'], region: [], aroma: [], species: [], minScore: 0, minFlavor: 0, minAcidity: 0, minSweetness: 0})).toBe(true)
    })

    //Check if the function returns false when the country filter doesn't match
    it('returns false when country doesn\'t match', () => {
        expect(applyFilters(sampleBeans[0], {country: ['Colombia'], region: [], aroma: [], species: [], minScore: 0, minFlavor: 0, minAcidity: 0, minSweetness: 0})).toBe(false)
    })
})



//---------Tests for LogIn.jsx--------
//mock firebase so real authentication is not used
vi.mock('./firebase', () => ({ auth: {} }));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(), 
  getAuth: vi.fn(() => ({})),
}));

//clear mocks before calling each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe('LogIn', () => {
    test('user enters email and password', async () => {
        const user = userEvent.setup();
        render(<LogIn />);

        await user.type(screen.getByLabelText('Email'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'mypassword');

        expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('mypassword');
    });

    test('calls signInWithEmailAndPassword on submit', async () => {
        const user = userEvent.setup();
        signInWithEmailAndPassword.mockResolvedValueOnce({});
        render(<LogIn />);

        await user.type(screen.getByLabelText('Email'), 'test@example.com');
        await user.type(screen.getByLabelText('Password'), 'mypassword');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'test@example.com',
        'mypassword'
        );
    });

    test('shows error message on invalid credentials', async () => {
        const user = userEvent.setup();
        signInWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
        render(<LogIn />);

        await user.type(screen.getByLabelText('Email'), 'bad@example.com');
        await user.type(screen.getByLabelText('Password'), 'wrongpassword');
        await user.click(screen.getByRole('button', { name: /log in/i }));

        expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
    });
})

//---------Tests for Favorites.jsx--------
//mock firebase functions so real database is not used
vi.mock('./src/favoriteDB', () => ({
    getFavorites: vi.fn()
}))

vi.mock('./src/AuthContext', () => ({
    useAuth: vi.fn()
    
}))
describe('Favorites', () => {

    //Check if the component shows the login message when there is no user
    it('Shows login message when no favorites are found', () => {
        useAuth.mockReturnValue({user: null})
        render(<Favorites />)
        expect(screen.getByText('please log in to view your favorite coffee beans.')).toBeInTheDocument();
        
       
    })

    //Check if the component shows the warning message when there are no favorites
    it('Shows warning message when there is no favorites', () => {
        useAuth.mockReturnValue({user: {UserId: '123'}})
        getFavorites.mockImplementation((userId, callback) => {
            callback([]);
            return () => {};
        })
        render(<Favorites />)
        expect(screen.getByText("you haven't added any favorite coffee beans yet...")).toBeInTheDocument();
    })
})