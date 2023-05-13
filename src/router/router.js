import {
    createBrowserRouter
} from "react-router-dom";
import Nav from '../components/Nav';
import FrontDesk from '../components/FrontDesk';
import RoomManagement from "../components/RoomManagement";
import FastPost from '../components/FastPost';

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
        path: "frontdesk/:reservation_id",
        element: <FrontDesk />,
    },
    {
        path: "roommanagement",
        element: <RoomManagement />,
    },
    {
        path: "fastpost",
        element: <FastPost />,
    },
    ],
}
]);


export default router;