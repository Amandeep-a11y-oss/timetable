import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DepartmentData from "./pages/DepartmentData";
import TodayPeriod from "./components/TodayPeriod";
import Update from "./components/Update";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<div
			className='bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900'
		>

			<Routes>

				<Route
					path='/'
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				>
					<Route
						path='api/auth/get-Department/:id'
						element={
							<ProtectedRoute>
								<DepartmentData redirect={true} />
							</ProtectedRoute>
						}
					/>

					<Route
						path='department123/:id'
						element={
							<ProtectedRoute>
								<DepartmentData />
							</ProtectedRoute>
						}
					/>

					<Route
						path="todayperoid"
						element={
							<ProtectedRoute>
								<TodayPeriod />
							</ProtectedRoute>
						}
					/>

					<Route
						path="update-timetable"
						element={
							<ProtectedRoute>
								<Update />
							</ProtectedRoute>
						}
					/>


				</Route>

				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route path='*' element={<Navigate to='/' replace />} />

			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
