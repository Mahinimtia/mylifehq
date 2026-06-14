const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-memory store ──────────────────────────────────────────────
const db = {
  transactions: [],
  notes: [],
  events: [],
  goals: [],
  holdings: [],
  budgetcats: []
};

// ── CORS (handy during dev) ──────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── SUMMARY ──────────────────────────────────────────────────────
app.get('/summary', (req, res) => {
  const txns = db.transactions;
  const income   = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings  = txns.filter(t => t.type === 'savings').reduce((s, t) => s + t.amount, 0);
  const invVal   = db.holdings.reduce((s, h) => s + h.val, 0);

  const spendByCat = {};
  txns.filter(t => t.type === 'expense').forEach(t => {
    spendByCat[t.cat] = (spendByCat[t.cat] || 0) + t.amount;
  });

  res.json({ income, expenses, savings, netWorth: savings + invVal, spendByCat });
});

// ── TRANSACTIONS ─────────────────────────────────────────────────
app.get('/transactions', (req, res) => {
  let list = [...db.transactions].sort((a, b) => b.date.localeCompare(a.date));
  if (req.query.type && req.query.type !== 'all') list = list.filter(t => t.type === req.query.type);
  if (req.query.cat  && req.query.cat  !== 'all') list = list.filter(t => t.cat  === req.query.cat);
  res.json(list);
});

app.post('/transactions', (req, res) => {
  const t = { id: uuidv4(), ...req.body };
  db.transactions.unshift(t);
  res.status(201).json(t);
});

app.delete('/transactions/:id', (req, res) => {
  db.transactions = db.transactions.filter(t => t.id !== req.params.id);
  res.json({ ok: true });
});

// ── NOTES ────────────────────────────────────────────────────────
app.get('/notes', (req, res) => {
  let list = [...db.notes].sort((a, b) => b.date.localeCompare(a.date));
  if (req.query.type && req.query.type !== 'all') list = list.filter(n => n.type === req.query.type);
  res.json(list);
});

app.post('/notes', (req, res) => {
  const n = { id: uuidv4(), date: new Date().toISOString().split('T')[0], ...req.body };
  db.notes.unshift(n);
  res.status(201).json(n);
});

app.delete('/notes/:id', (req, res) => {
  db.notes = db.notes.filter(n => n.id !== req.params.id);
  res.json({ ok: true });
});

// ── EVENTS ───────────────────────────────────────────────────────
app.get('/events', (req, res) => {
  res.json([...db.events].sort((a, b) => a.date.localeCompare(b.date)));
});

app.post('/events', (req, res) => {
  const e = { id: uuidv4(), ...req.body };
  db.events.push(e);
  res.status(201).json(e);
});

app.delete('/events/:id', (req, res) => {
  db.events = db.events.filter(e => e.id !== req.params.id);
  res.json({ ok: true });
});

// ── GOALS ────────────────────────────────────────────────────────
app.get('/goals', (req, res) => res.json(db.goals));

app.post('/goals', (req, res) => {
  const g = { id: uuidv4(), ...req.body };
  db.goals.push(g);
  res.status(201).json(g);
});

app.delete('/goals/:id', (req, res) => {
  db.goals = db.goals.filter(g => g.id !== req.params.id);
  res.json({ ok: true });
});

// ── HOLDINGS ─────────────────────────────────────────────────────
app.get('/holdings', (req, res) => res.json(db.holdings));

app.post('/holdings', (req, res) => {
  const h = { id: uuidv4(), ...req.body };
  db.holdings.push(h);
  res.status(201).json(h);
});

app.delete('/holdings/:id', (req, res) => {
  db.holdings = db.holdings.filter(h => h.id !== req.params.id);
  res.json({ ok: true });
});

// ── BUDGET CATEGORIES ────────────────────────────────────────────
app.get('/budgetcats', (req, res) => res.json(db.budgetcats));

app.post('/budgetcats', (req, res) => {
  const bc = { id: uuidv4(), ...req.body };
  db.budgetcats.push(bc);
  res.status(201).json(bc);
});

app.delete('/budgetcats/:id', (req, res) => {
  db.budgetcats = db.budgetcats.filter(bc => bc.id !== req.params.id);
  res.json({ ok: true });
});

// ── CATCH-ALL → serve index.html ─────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── START ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`My Life HQ running on port ${PORT}`));
