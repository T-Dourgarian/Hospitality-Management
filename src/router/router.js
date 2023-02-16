import {
    createBrowserRouter
} from "react-router-dom";
import Nav from '../components/Nav';
import Arrivals from '../components/Arrivals';

const router = createBrowserRouter([
{
    path: "/",
    element: <Nav />,
    children: [
    {
        path: "arrivals",
        element: <Arrivals />,
    },
    ],
}
]);


export default router;