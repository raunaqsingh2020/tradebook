// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
//import renderer from 'react-test-renderer';
import 'regenerator-runtime/runtime';

test('renders login', () => {
  render(<App />);
  const linkElement = screen.getByText(/Log in./i);
  expect(linkElement).toBeInTheDocument();
});

test('renders dont have an account', () => {
  render(<App />);
  const linkElement = screen.getByText(/Don't have an account?/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders forgot password', () => {
  render(<App />);
  userEvent.click(screen.getByText(/Forgot password?/i));
  const linkElement = screen.getByText(/Forgot your password?/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders tag', () => {
  render(<App />);
  const linkElement = screen.getByText(/Connect with students that have the textbooks you need!/i);
  expect(linkElement).toBeInTheDocument();
});

// test('renders register link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Register/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('renders title', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Textbooks are $$$/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('renders forgotPassword link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Forgot password?/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('renders email', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Email/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('renders password', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Password/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('renders no account', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/Don't have an account?/i);
//   expect(linkElement).toBeInTheDocument();
// });


test('renders after login', () => {
  render(<App />);
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'r');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'a');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'u');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'n');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'a');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'q');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), '@');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'g');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'm');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'a');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'i');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'l');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), '.');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'c');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'o');
  userEvent.type(screen.getByPlaceholderText('joe@email.com'), 'm');

  // userEvent.type(screen.getByRole('input type=password'), 'f');
  // userEvent.type(screen.getByRole('input type=password'), 'u');
  // userEvent.type(screen.getByRole('input type=password'), 'c');
  // userEvent.type(screen.getByRole('input type=password'), 'k');
  // userEvent.type(screen.getByRole('input type=password'), 'f');
  // userEvent.type(screen.getByRole('input type=password'), 'u');
  // userEvent.type(screen.getByRole('input type=password'), 'c');
  // userEvent.type(screen.getByRole('input type=password'), 'k');
  // userEvent.type(screen.getByRole('input type=password'), 'f');
  // userEvent.type(screen.getByRole('input type=password'), 'u');
  // userEvent.type(screen.getByRole('input type=password'), 'c');
  // userEvent.type(screen.getByRole('input type=password'), 'k');

  userEvent.click(screen.getByRole('button'));

  //const linkElement = screen.getByText(/Find your tradebooks./i);
  // /expect(linkElement).toBeInTheDocument();  
});