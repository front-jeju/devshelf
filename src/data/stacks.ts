import React from 'react';
import { Atom, FileCode, Triangle, Layers, Server, Code, Palette, Leaf, Network, Box } from 'lucide-react';
import type { TechStack } from '../types';

export const ALL_STACKS: TechStack[] = [
  'React', 'TypeScript', 'Next.js', 'Vue', 'Node.js', 'Python', 'UI/UX', 'Spring', 'GraphQL', 'Three.js',
];

export const STACK_ICONS: Record<TechStack, React.ReactNode> = {
  React:      React.createElement(Atom,     { size: 13 }),
  TypeScript: React.createElement(FileCode, { size: 13 }),
  'Next.js':  React.createElement(Triangle, { size: 13 }),
  Vue:        React.createElement(Layers,   { size: 13 }),
  'Node.js':  React.createElement(Server,   { size: 13 }),
  Python:     React.createElement(Code,     { size: 13 }),
  'UI/UX':    React.createElement(Palette,  { size: 13 }),
  Spring:     React.createElement(Leaf,     { size: 13 }),
  GraphQL:    React.createElement(Network,  { size: 13 }),
  'Three.js': React.createElement(Box,      { size: 13 }),
};

export const TECH_COLORS: Record<string, string> = {
  React: '#61DAFB',
  TypeScript: '#3178C6',
  'Next.js': '#171717',
  Vue: '#42B883',
  'Node.js': '#339933',
  Python: '#FFD43B',
  'UI/UX': '#FF6B9D',
  Spring: '#6DB33F',
  GraphQL: '#E10098',
  'Three.js': '#049EF4',
};
