"use client";
import UMLCanvas from "./UMLCanvas.client";
import { IFolder } from "./component/Interfaces";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <div className="App">
        <UMLCanvas />
      </div>
    </Provider>
  );
}
