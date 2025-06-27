import Navbar from "./Navbar";
import { useAuth } from "../context/auth.context.jsx";
import './Home.css'
import img1 from '/dashboard-pic-1.jpg'
function Home(){
    const { loading } =useAuth();
    if(loading)
        return <div>Loading...</div>

    return (
        <div className="Landing-page">
            <Navbar />
            <div className="home-page-content">
            <div className="text-content">
                <div className="tag">
                    <ul>
                        <li>Built for Founders. Ready to Scale.</li>
                    </ul>
                </div>
                <h1 className="heading">
                    Digital Solutions for Your <strong>Business</strong>
                </h1>
                <p className="description">
                    Whether you're building an MVP or scaling to millions, our platform gives you the tools, design, and performance to make your vision a reality — fast.
                </p>
                <button className="btn-started">Get Started →</button>
            </div>
            <div className="image-content">
                <img className='dashboard-img' src={img1} alt="business-pic" />
            </div>
            </div>
        </div>
    )
}
export default Home;