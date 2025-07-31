import React from 'react';
import QuoteList from './QuoteList';
import QuoteForm from './QuoteForm';

const QuoteModule: React.FC = () => (
  <div>
    <h1>Quote Management</h1>
    <QuoteForm />
    <QuoteList />
  </div>
);

export default QuoteModule; 