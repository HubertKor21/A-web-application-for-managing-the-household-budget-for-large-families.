import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState(""); // For registration
    const [password2, setPassword2] = useState(""); // For registration
    const [password, setPassword] = useState(""); // For login
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const title = method === "login" ? "Login now!" : "Register now!";
    const buttonText = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data based on method
            const data = method === "login"
                ? { email, password } // For login
                : { email, password1, password2: password2 || undefined }; // For registration

            const res = await api.post(route, data);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">{title}</h1>
                    <p className="py-6">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form onSubmit={handleSubmit} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {method === "register" && ( // Registration specific fields
                            <>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="password"
                                        className="input input-bordered"
                                        value={password1}
                                        onChange={(e) => setPassword1(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Confirm Password (optional)</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="confirm password"
                                        className="input input-bordered"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {method === "login" && ( // Login specific field
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="password"
                                    className="input input-bordered"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                            </div>
                        )}

                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? "Loading..." : buttonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Form;
