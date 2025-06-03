import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Timetable from "../pages/Timetable";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardPage = () => {

	const { user, logout } = useAuthStore();

	return (
		<>
		<Header user={user} logout={logout} />
		<Outlet/>
		<Footer/>
		
		</>
	);
};

export default DashboardPage;
