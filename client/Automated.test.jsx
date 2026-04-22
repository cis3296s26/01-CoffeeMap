import {describe, it, expect, test, vi, beforeEach} from 'vitest';
import {applyFilters} from './src/BeanSearch.jsx'
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LogIn from './src/LogIn';

const sampleBeans = [
    {"Country.of.Origin": "Ethiopia", "Region": "Yirgacheffe", "Aroma": "8.5", "Species": "Arabica"},
    {"Country.of.Origin": "Colombia", "Region": "Huila", "Aroma": "7.0", "Species": "Arabica"},
]

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