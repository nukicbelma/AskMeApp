import App from './Pages/App';
import PostCreator from './Pages/CreatePostPage';
import PostPage from './Pages/PostPage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignUpPage';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const AppRouter = () => {
	return (
		<>
			<Router>
			<Route exact path='/' component={App} />
				<Route path='/create' component={PostCreator} />
				<Route path='/comment' component={PostCreator} />
				<Route path='/posts/:id' component={PostPage} />
				<Route path='/login' component={LoginPage} />
				<Route path='/signup' component={SignupPage} />
			</Router>
		</>
	);
};
ReactDOM.render(<AppRouter />, document.getElementById('root'));
