// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./index.css";
import HowItWorks from "./HowItWorks";
import ChooseTM from "./ChooseTM";
import Signup from "./Signup";
import RegisterTester from "./RegisterTester";
import RegisterMaker from "./RegisterMaker";
import Success from "./Success";
import HomeMaker from "./HomeMaker";
import HomeTester from "./HomeTester";
import ProfileTester from "./ProfileTester";
import ProfileMaker from "./ProfileMaker";
import AddEditTest from "./AddEditTest";
import Home from "./Home";
import FinishSignIn from "./FinishSignIn";
import Terms from "./Terms";
import Privacy from "./Privacy";
import HomeAdmin from "./HomeAdmin";
import SignupAdmin from "./SignupAdmin";
import Review from "./Review";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HowItWorks />} />
				<Route path="/howItWorks" element={<HowItWorks />} />
				<Route path="/choose" element={<ChooseTM />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/success" element={<Success />} />
				<Route path="/registerTester" element={<RegisterTester />} />
				<Route path="/registerMaker" element={<RegisterMaker />} />
				<Route path="/homeMaker" element={<HomeMaker />} />
				<Route path="/HomeTester" element={<HomeTester />} />
				{/* <Route path="/addTest" element={<AddTest />} /> */}
				<Route path="/profileTester" element={<ProfileTester />} />
				<Route path="/profileMaker" element={<ProfileMaker />} />
				<Route path="/finishSignIn" element={<FinishSignIn />} />
				<Route path="/edit-test/:testId" element={<AddEditTest />} />
				<Route path="/add-test" element={<AddEditTest />} />
				<Route path="/terms" element={<Terms />} />
				<Route path="/privacy" element={<Privacy />} />
				<Route path="/adminDashboard" element={<HomeAdmin />} />
				<Route path="/signupAdmin" element={<SignupAdmin />} />
				<Route path="/review" element={<Review />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
