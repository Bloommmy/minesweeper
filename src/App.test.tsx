import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";

const getCell = (container: Element, x: number, y: number) => container.querySelector<HTMLDivElement>(`[data-row="${x}"][data-column="${y}"]`)!;
const getGameStatus = (container: Element) => container.querySelector<HTMLDivElement>(`[class^="Smile"]`)!;

test('first click not mine', async () => {
  const { container } = render(<App />);
  const cell = getCell(container, 8, 9);

  expect(cell.dataset.state).toBe('close');

  await act(async () => {
    await userEvent.click(cell);
  });

  expect(cell).toBeInTheDocument();
  expect(cell.dataset.state).not.toBe('close');
  expect(cell.dataset.state).not.toBe('mine');
});

test('mouse down apply wow game state', async () => {
  const { container } = render(<App />);
  const gameStatusEl = getGameStatus(container);

  expect(gameStatusEl).toBeInTheDocument();
  expect(gameStatusEl.dataset.gameStatus).toBe('game');

  const cell = getCell(container, 8, 9);
  await act(async () => {
    fireEvent.mouseDown(cell);
  });

  expect(gameStatusEl.dataset.gameStatus).toBe('wow');

  await act(async () => {
    fireEvent.mouseUp(cell);
  });

  expect(gameStatusEl.dataset.gameStatus).toBe('game');
});

test('right click put flag and question', async () => {
  const { container } = render(<App />);
  const cell = getCell(container, 8, 9);

  expect(cell.dataset.state).toBe('close');

  await act(async () => {
    await userEvent.click(cell, { button: 2 });
  });

  expect(cell.dataset.state).toBe('flag');

  await act(async () => {
    await userEvent.click(cell, { button: 2 });
  });

  expect(cell.dataset.state).toBe('question');

  await act(async () => {
    await userEvent.click(cell, { button: 2 });
  });

  expect(cell.dataset.state).toBe('close');
});

test('flag not click', async () => {
  const { container } = render(<App />);
  const cell = getCell(container, 8, 9);

  expect(cell.dataset.state).toBe('close');

  await act(async () => {
    await userEvent.click(cell, { button: 2 });
  });

  expect(cell.dataset.state).toBe('flag');

  await act(async () => {
    await userEvent.click(cell, { button: 0 });
  });

  expect(cell.dataset.state).toBe('flag');
});

test('question click', async () => {
  const { container } = render(<App />);
  const cell = getCell(container, 8, 9);

  expect(cell.dataset.state).toBe('close');

  await act(async () => {
    await userEvent.click(cell, { button: 2 });
  });

  expect(cell.dataset.state).toBe('flag');

  await act(async () => {
    await userEvent.click(cell, { button: 2 });
  });

  expect(cell.dataset.state).toBe('question');

  await act(async () => {
    await userEvent.click(cell, { button: 0 });
  });

  expect(cell).toBeInTheDocument();
  expect(cell.dataset.state).not.toBe('close');
  expect(cell.dataset.state).not.toBe('mine');
  expect(cell.dataset.state).not.toBe('question');
  expect(cell.dataset.state).not.toBe('flag');
});