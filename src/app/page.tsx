"use client"
import UMLCanvas from './UMLCanvas.client';
import { IFolder } from './component/Interfaces';
import './App.css';

export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="App">
      <UMLCanvas />
    </div>
  );
}