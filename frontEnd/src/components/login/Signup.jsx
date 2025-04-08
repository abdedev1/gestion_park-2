import React, { useState } from "react";
import Auth from "../../assets/api/auth/Auth";
import { Tabs } from 'antd';
import { ArrowRight, ArrowLeft, Check} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { createUser } from "../service/FetchData";

export default function FormTabs() {
    const [activeTab, setActiveTab] = useState("Sign Up");
    const [align, setAlign] = useState("start");
    const tabsContent = [
        { label: "Sign Up", child: <SignupForm setActiveTab={setActiveTab} /> },
        { label: "Login", child: <LoginForm setActiveTab={setActiveTab} /> }
    ];
    return (
        <div className="max-w-lg w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
            <Tabs
                activeKey={activeTab}
                animated
                centered
                onTabClick={(key) => setActiveTab(key)}
                items={tabsContent.map((t, i) => ({ label: t.label, key: t.label, children: t.child }))}
                // indicator={{
                //     size: (origin) => activeTab === "Sign Up" ? origin/2 : origin,
                //     align: align,
                // }}
            />
        </div>
    );
}

export function SignupForm({ setActiveTab }) {
    // const clients = useSelector(state => state.clients);
    // const dispatch = useDispatch();
    // const navigate = useNavigate();

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        birth_date: "",
        roleId: 1,
    });

    const [errors, setErrors] = useState({});

    // Validation function
    const validateForm = () => {
        // const newErrors = {};

        // if (clients.find(c => c.email === user.email)) {
        //     newErrors.email = "Email already registered";
        // }
        // if (user.password !== confirmPass) {
        //     newErrors.confirmPass = "Passwords do not match";
        // }

        // setErrors(newErrors);
        // return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await Auth.Register(user);
        setErrors(res.errors);
        

        // if (!validateForm()) return;
        
        // axios.post("http://localhost:3001/clients", {...user, dateCreated: new Date(), dateModified: new Date(),})
        // .then(res => {
        //         const newUser = createUser(res.data)
        //         dispatch({ type: "UPDATE_CLIENTS", payload: [...clients, newUser] });
        //         localStorage.setItem("user_email", user.email);
        //         dispatch({ type: "UPDATE_USER", payload: newUser });
        //         // navigate("/");
        //     })
        //     .catch(error => console.error("Error adding user:", error));
    };

    return (
        <fieldset className="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
             <h2 className="font-bold text-xl">Welcome to Med Cars</h2>
            <p className="text-sm max-w-sm mt-2">
                Create an account and rent a car
            </p>
            <form className="mt-1 flex flex-col gap-1.5" onSubmit={handleSubmit} >
                <div className="flex flex-col md:flex-row gap-2">
                    <label className="floating-label w-full not-focus-within:[&>span]:text-sm">
                        <input className="input w-full validator" placeholder="First name" type="text" onChange={e => setUser({ ...user, first_name: e.target.value.trim() })} value={user.first_name} required />
                        {errors?.first_name ? (<div className="text-error mb-1 text-xs">{errors?.first_name[0]}</div>) : (<div className="validator-hint mt-0 mb-1">First name is required</div>)}
                        <span className="text-xl" >First name</span>
                    </label>

                    <label className="floating-label w-full not-focus-within:[&>span]:text-sm">
                        <input className="input w-full validator" placeholder="Last name" type="text" onChange={e => setUser({ ...user, last_name: e.target.value.trim() })} value={user.last_name} required />
                        {errors?.last_name ? (<div className="text-error mb-1 text-xs">{errors?.last_name[0]}</div>) : (<div className="validator-hint mt-0 mb-1">Last name is required</div>)}
                        <span className="text-xl" >Last name</span>
                    </label>
                </div>

                <label className="floating-label w-full not-focus-within:[&>span]:text-sm">
                    <input className="input w-full validator" placeholder="Email" type="email" onChange={e => setUser({ ...user, email: e.target.value.trim() })} value={user.email} required />
                    {errors?.email ? (<div className="text-error mb-1 text-xs">{errors?.email[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter a valid email address</div>)}
                    <span className="text-xl" >Email</span>
                </label>

                <label className="floating-label w-full not-focus-within:[&>span]:text-sm">
                    <input className="input w-full validator" type="date" onChange={e => setUser({ ...user, birth_date: e.target.value })} value={user.birth_date} required max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} />
                    {errors?.birth_date ? (<div className="text-error mb-1 text-xs">{errors?.birth_date[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter a valid birthday date</div>)}
                    <span className="text-xl" >Birth date</span>
                </label>


                <div className="flex flex-col md:flex-row gap-2 mb-6">
                    <label className="floating-label w-full not-focus-within:[&>span]:text-sm relative">
                        <input className="input w-full validator" placeholder="Password" type="password" onChange={e => setUser({ ...user, password: e.target.value })}  value={user.password} minLength={8} required />
                        <span className="text-xl" >Password</span>
                        {errors?.password ? (<div className="text-error mb-1 text-xs w-96 absolute">{errors?.password[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible w-96 absolute">Password must be at least 8 characters</div>)}
                    </label>

                    <label className="floating-label w-full not-focus-within:[&>span]:text-sm">
                        <input className="input w-full validator" placeholder="Confirm Password" type="password" onChange={e => setUser({ ...user, password_confirmation: e.target.value})} value={user.password_confirmation} minLength={8} required />
                        <span className="text-xl" >Confirm Password</span>
                    </label>

                    

                    {/* <div className="w-full">
                        <label className="fieldset-label" htmlFor="password">Password</label>
                        <input id="password" className="input w-full validator" placeholder="••••••••" type="password" onChange={e => setUser({ ...user, password: e.target.value })} value={user.password} required />
                        <div className="validator-hint mt-0 mb-1 visible">Enter valid password</div>
                        </div>
                        <div className="w-full">
                        <label className="fieldset-label" htmlFor="cpassword">Confirm Password</label>
                        <input id="cpassword" className={`input w-full ${errors?.confirmPass ? "input-error" : ""}`} placeholder="••••••••" type="password" onChange={e => setConfirmPass(e.target.value)} value={confirmPass} required />
                        {errors?.confirmPass && <div className="text-error mb-1 text-xs">{errors?.confirmPass}</div>}
                        </div> */}
                </div>

                <button className="btn btn-primary w-full" type="submit" > Sign Up <Check /></button>
            </form>
            <div className="divider">Already have an account?</div>
            <button className="btn btn-secondary btn-soft w-full" onClick={() => setActiveTab("Login")}>Login</button>
        </fieldset>
    );
}


function Step1({user, setUser, confirmPass, setConfirmPass, errors, setStep, setActiveTab, setAlign, validateForm}) {

    const nextStep = (e) => {
        e.preventDefault();
        // if (!validateForm()) return;
        setStep("Step 2")
        setAlign("end")
    }

    return (
        <>
            <h2 className="font-bold text-xl">Welcome to Med Cars</h2>
            <p className="text-sm max-w-sm mt-2">
                Create an account and rent a car
            </p>
            <form className="mt-6" onSubmit={nextStep} >
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-1">
                    {/* <label className="floating-label w-full not-focus-within:[&>span]:text-sm">
                        <input className="input w-full validator" placeholder="First name" type="text" onChange={e => setUser({ ...user, firstName: e.target.value.trim() })} value={user.firstName} required />
                        <div className="validator-hint mt-0 mb-1">Enter valid name</div>
                        <span className="text-xl" >First name</span>
                    </label> */}
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="firstname">First name</label>
                        <input id="firstname" className="input w-full validator" placeholder="Enter first name" type="text" onChange={e => setUser({ ...user, firstName: e.target.value.trim() })} value={user.firstName} required />
                        <div className="validator-hint mt-0 mb-1 visible">Enter valid name</div>
                    </div>
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="lastname">Last name</label>
                        <input id="lastname" className="input w-full validator" placeholder="Enter last name" type="text" onChange={e => setUser({ ...user, lastName: e.target.value.trim() })} value={user.lastName} required />
                        <div className="validator-hint mt-0 mb-1 visible">Enter valid name</div>
                    </div>
                </div>

                <div className="mb-1">
                    <label className="fieldset-label" htmlFor="email">Email</label>
                    <input id="email" type="email" className={`input validator w-full ${errors?.email && "input-error!"}`} placeholder="rentacar@ex.com" onChange={e => setUser({ ...user, email: e.target.value.trim() })} value={user.email} required />
                    {errors?.email ? (<div className="text-error mb-1 text-xs">{errors?.email}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter valid email address</div>)}
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-3">
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="password">Password</label>
                        <input id="password" className="input w-full validator" placeholder="••••••••" type="password" onChange={e => setUser({ ...user, password: e.target.value })} value={user.password} required />
                        <div className="validator-hint mt-0 mb-1 visible">Enter valid password</div>
                        </div>
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="cpassword">Confirm Password</label>
                        <input id="cpassword" className={`input w-full ${errors?.confirmPass ? "input-error" : ""}`} placeholder="••••••••" type="password" onChange={e => setConfirmPass(e.target.value)} value={confirmPass} required />
                        {errors?.confirmPass && <div className="text-error mb-1 text-xs">{errors?.confirmPass}</div>}
                    </div>
                </div>

                <button className="btn btn-primary w-full" type="submit" > Next <ArrowRight size={20} /></button>
            </form>
            <div className="divider">Already have an account?</div>
            <button className="btn btn-secondary btn-soft w-full" onClick={() => setActiveTab("Login")}>Login</button>
        </>
    )
}


function Step2({user, setUser, setStep, setAlign, handleSubmit}) {

    const getMinDate = () => (new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0])

    const prevStep = () => {
        setStep("Step 1")
        setAlign("start")
    }

    return (
        <>
            <button className="btn btn-secondary btn-soft w-full" onClick={prevStep}><ArrowLeft />Back</button>
            <div className="divider"></div>
            <h2 className="font-bold text-xl">Additional Information</h2>
            <p className="text-sm max-w-sm mt-2">
                Please provide additional details to complete your registration
            </p>
            <form className="mt-6" onSubmit={handleSubmit} >
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-1">
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="cin">CIN</label>
                        <input id="cin" className="input w-full validator" placeholder="JB123456" type="text" onChange={e => setUser({ ...user, cin: e.target.value.trim() })} value={user.cin} required />
                        <div className="validator-hint mt-0 mb-1 visible">Enter valid CIN</div>
                    </div>
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="drivingLicenseId">Driving License ID</label>
                        <input id="drivingLicenseId" className="input w-full validator" placeholder="Enter your driving license ID" type="text" onChange={e => setUser({ ...user, drivingLicenseId: e.target.value.trim() })} value={user.drivingLicenseId} required />
                        <div className="validator-hint mt-0 mb-1 visible">Enter your driving license ID</div>
                    </div>
                </div>

                <div className="mb-1">
                    <label className="fieldset-label" htmlFor="address">Adress</label>
                    <input id="address" className="input w-full validator" placeholder="Enter your address" type="text" onChange={e => setUser({ ...user, address: e.target.value })} value={user.address} required />
                    <div className="validator-hint mt-0 mb-1 visible">Enter valid address</div>
                </div>

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-3">
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="city">City</label>
                        <input id="city" className="input w-full validator" placeholder="Enter your city" type="text" onChange={e => setUser({ ...user, city: e.target.value })} value={user.city} required />
                        <div className="validator-hint mt-0 mb-1 visible">Enter valid city</div>
                    </div>
                    <div className="w-full">
                        <label className="fieldset-label" htmlFor="birthday">Birthday</label>
                        <input id="birthday" className="input w-full validator" type="date" onChange={e => setUser({ ...user, date_birthday: e.target.value })} value={user.date_birthday} required max={getMinDate()} />
                        <div className="validator-hint mt-0 mb-1 visible">Enter valid birthday</div>
                    </div>
                </div>

                <button className="btn btn-primary w-full" type="submit" > Sign Up <Check /></button>
            </form>
        </>
    )
}

export function LoginForm({ setActiveTab }) {
    // const clients = useSelector(state => state.clients);
    // const dispatch = useDispatch();
    // const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // const client = clients.find(c => c.email === email);

        // if (client && client.password === password) {
        //     localStorage.setItem("user_email", email);
        //     dispatch({ type: "UPDATE_USER", payload: client });
        //     navigate("/");
        // } else {
        //     setError("Invalid email or password");
        // }
    };

    return (
        <fieldset className="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
            <h2 className="font-bold text-xl">Welcome to Med Cars</h2>
            <p className="text-sm max-w-sm mt-2">
                Login to your account and rent a car
            </p>
            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="fieldset-label" htmlFor="email">Email</label>
                    <input id="email" type="email" className={`input w-full ${error ? "input-error" : ""}`} placeholder="rentacar@ex.com" onChange={e => setEmail(e.target.value)} value={email} required />
                </div>

                <div className="mb-3">
                    <label className="fieldset-label" htmlFor="password">Password</label>
                    <input id="password" className={`input w-full ${error ? "input-error" : ""}`} placeholder="••••••••" type="password" onChange={e => setPassword(e.target.value)} value={password} required/>
                </div>
                <div className={`text-error text-center mb-3 text-xs ${error ? "opacity-100" : "opacity-0"}`} >{error ? error : "..."}</div>

                <button className="btn btn-primary w-full" type="submit"> Login <ArrowRight className="mt-1"/></button>
            </form>
            <div className="divider">You don't have an account yet?</div>
            <button className="btn btn-secondary btn-soft" onClick={() => setActiveTab("Sign Up")}>Sign Up</button>
        </fieldset>
    );
}
