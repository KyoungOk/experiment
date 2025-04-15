// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./index.css";
import HowItWorks from "./HowItWorks";
import ChooseTM from "./ChooseTM";
import Signup from "./Signup";
import ProfileTester from "./RegisterTester";
import RegisterMaker from "./RegisterMaker.jsx";
import Success from "./Success";
import HomeMaker from "./HomeMaker";
import HomeTester from "./HomeTester";
import AddTest from "./AddTest";
import Home from "./Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/howItWorks" element={<HowItWorks />} />
				<Route path="/choose" element={<ChooseTM />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/registerTester" element={<ProfileTester />} />
				<Route path="/success" element={<Success />} />
				<Route path="/registerMaker" element={<RegisterMaker />} />
				<Route path="/makerHome" element={<HomeMaker />} />
				<Route path="/testerHome" element={<HomeTester />} />
				<Route path="/addTest" element={<AddTest />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
