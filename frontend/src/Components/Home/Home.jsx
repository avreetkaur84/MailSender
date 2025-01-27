import { useNavigate } from "react-router-dom";
import invitation from "../../assets/Images/invitation.jpg"; // Replace with your actual image path
import thanks from "../../assets/Images/thanks.jpg"; // Replace with your actual image path

const mailTypes = [
    { name: "Invitation Mail", route: "invitation", image: invitation },
    { name: "Thank You Mail", route: "thank-you", image: thanks },
];

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-10">
            <h1 className="text-5xl font-bold text-rose-500">
                Mail Sender
            </h1>

            <div className="flex flex-wrap justify-center gap-8">
                {mailTypes.map((mail, index) => (
                    <div
                        key={index}
                        className="rounded-lg shadow-md hover:shadow-lg transition cursor-pointer bg-white w-80 mx-10 my-16"
                        onClick={() => navigate(mail.route)}
                    >
                        <img
                            src={mail.image}
                            alt={mail.name}
                            className="rounded-t-lg h-60 w-full object-cover"
                        />
                        <div className="p-4 text-center">
                            <h2 className="text-xl font-semibold">{mail.name}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;