import {useState, useEffect} from 'react';
import {onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export default function App() {
  return (
      <div>
          <p>Hello World!</p>
      </div>
  )
}