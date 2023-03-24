import {
    createBrowserRouter
} from "react-router-dom";
import Nav from '../components/Nav';
import FrontDesk from '../components/FrontDesk';
import RoomManagement from "../components/RoomManagement";

const router = createBrowserRouter([
{
    path: "/",
    element: <Nav />,
    children: [
    {
        path: "frontdesk",
        element: <FrontDesk />,
    },
    {
        path: "roommanagement",
        element: <RoomManagement />,
    },
    ],
}
]);


export default router;