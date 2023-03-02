import {
    createBrowserRouter
} from "react-router-dom";
import Nav from '../components/Nav';
import FrontDesk from '../components/FrontDesk';

const router = createBrowserRouter([
{
    path: "/",
    element: <Nav />,
    children: [
    {
        path: "frontdesk",
        element: <FrontDesk />,
    },
    ],
}
]);


export default router;