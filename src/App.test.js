import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

jest.mock('axios');

const mockPosts = [
  { id: 1, title: 'Post 1', body: 'Body 1' },
  { id: 2, title: 'Post 2', body: 'Body 2' },
];

beforeEach(() => {
  jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockPosts });
});

test('renders posts', async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });
});

test('filters posts by title', async () => {
  render(<App />);

  const searchInput = screen.getByPlaceholderText('Search');
  userEvent.type(searchInput, '1');

  await waitFor(() => {
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.queryByText('Post 2')).not.toBeInTheDocument();
  });
});

test('filters posts by body', async () => {
  render(<App />);

  const searchInput = screen.getByPlaceholderText('Search');
  userEvent.type(searchInput, 'Body 2');

  await waitFor(() => {
    expect(screen.getByText('Post 2')).toBeInTheDocument();
    expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
  });
});

test('displays error message', async () => {
  const errorMessage = 'Error retrieving posts.';
  jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error(errorMessage));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
