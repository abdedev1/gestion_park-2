import React, { useEffect, useState } from 'react';
import { FaCar, FaMapMarkerAlt, FaSearch, FaStar, FaArrowLeft,FaCalendarAlt,FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcs, clearParcSpots } from '../Redux/slices/parcsSlice';
import { setSearchQuery } from '../Redux/slices/parcsSlice';
import ClientSubscription from "../client/ClientSubscription";
import {Spin} from "antd"
import { Loader2 } from "lucide-react"
import { fetchPricingRates } from '../Redux/slices/pricingRatesSlice';
const HomePage = () => {
    const { user } = useSelector((state) => state.auth);
  // States
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showAllParks, setShowAllParks] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const texts = ["Find Your Perfect Parking Spot", "Monthly Subscriptions Available", "Real-Time Availability"];
  const [filteredParks, setFilteredParks] = useState([]);
  const navigate = useNavigate();
  // Redux
  const dispatch = useDispatch();
  const { parks, currentParcSpots, status, searchQuery } = useSelector(state => state.parks);
  const { pricingRates } = useSelector(state => state.pricingRates);
  // Animation variants
  const parkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(fetchParcs());
    dispatch(fetchPricingRates());
  }, [dispatch]);

    // Filtrer les parcs en fonction de la recherche
    useEffect(() => {
      if (searchQuery.trim()) {
        const filtered = parks.filter((park) =>
          park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          park.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredParks(filtered);
      } else {
        setFilteredParks(parks);
      }
    }, [searchQuery, parks]);
  
    const numberSpots = (parks) => {
      if (parks && Array.isArray(parks.spots)) {
        return parks.spots.filter(spot => spot.status === "available").length;
      }
      return 0;
    };
  // Handlers Search
  const handleSearch = () => {
    setShowAllParks(false);
    dispatch(clearParcSpots());
  };

 

  const handleBackToParks = () => {
    dispatch(clearParcSpots());
  };

  const handleViewAllParks = () => {
    setShowAllParks(true);
    dispatch(clearParcSpots());
  };

  const getStarted = () => {
    if (user) {
      setShowSubscriptionModal(true)
    }
    else {
      navigate("/sign")
    }
  };

  // Display logic
  const displayedParks = showAllParks ? filteredParks : filteredParks.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
     
      <section className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Parking lot" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            key={currentTextIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {texts[currentTextIndex]}
          </motion.h1>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover and reserve parking spots with our easy-to-use platform
          </p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-1 flex"
          >
            <div className="flex-1 flex items-center px-4">
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search for parks near..." 
                className=" w-full focus:outline-none text-gray-700"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={handleSearch}
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </motion.div>
        </div>
      </section>

      {/* Parks/Spots Section */}
      <section className="py-16 bg-gray-100" id='avp'>
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Available Parks
          </motion.h2>
          {status === 'loading' ? (
            <div className="flex justify-center my-8">
              <Spin 
              indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedParks.map((park, i) => (
                  <motion.div
                    key={park.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    variants={parkVariants}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                  >
                    <div className="h-48 bg-blue-200 relative flex items-center justify-center">
                      <FaCar className="text-4xl text-primary" />
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <FaStar className="text-yellow-400 mr-1" /> 4.5 {park.rating}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-1">{park.name}</h3>
                      <p className="text-gray-600 mb-4">
                        {park.address.length > (57) ? park.address.slice(0, 57) + "..." : park.address}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="text-gray-500 text-sm">Available spots</p>
                          <p className="font-semibold">{numberSpots(park)} spots</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-sm">Starting from</p>
                          <p className="font-bold text-primary">MAD {park.price}/Hour</p>
                        </div>
                      </div>
                      <button onClick={() => navigate(`parks/${park.id}`)} className="w-full btn btn-primary">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {!showAllParks && parks.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <button 
                    className="btn btn-primary btn-outline"
                    onClick={handleViewAllParks}
                  >
                    View All Parking Locations
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
            <div className="container mx-auto py-16 px-4">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center mb-12 text-gray-800"
              >
                How It Works
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <FaSearch className="text-4xl" />,
                    title: "Find Parks",
                    description: "Browse available parking spots with real-time availability updates"
                  },
                  {
                    icon: <FaCalendarAlt className="text-4xl" />,
                    title: "Subscribe",
                    description: "Choose monthly plans that fit your parking needs"
                  },
                  {
                    icon: <FaCar className="text-4xl" />,
                    title: "Park Stress-Free",
                    description: "Guaranteed spot available whenever you need it"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
                  >
                    <div className="text-primary mb-4 mx-auto w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
      
            {
              !user?.role_data?.cart && (
              <div className="py-16 bg-white" id='pracing'>
              <div className="container mx-auto px-4">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-center mb-4 text-gray-800"
                >
                  Flexible Pricing Plans
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto"
                  >
                  Choose the plan that fits your parking needs
                </motion.p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {pricingRates.map((plan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`border rounded-xl p-8 hover:shadow-lg transition duration-300 ${plan.recommended ? "border-2 border-primary shadow-lg transform lg:scale-105" : "border-gray-200"}`}
                      >
                      {plan.recommended ? (
                        <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                          MOST POPULAR
                        </div>
                      ) : "" }
                      <h3 className="text-2xl font-bold mb-2">{plan.rate_name}</h3>
                      <p className="text-4xl font-bold mb-4">
                        {plan.price} MAD<span className="text-lg text-gray-500">/Lifetime</span>
                      </p>
                      <div className="mb-8 flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{plan.feature}</span>
                          
                      </div>
                      <button onClick={getStarted} className={`w-full py-3 rounded-lg font-medium transition ${plan.recommended ? "btn btn-primary" : "btn btn-soft"}`}>
                        Get Started
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            )}
      
            {/* Testimonials */}
            <div className="bg-gray-100 py-16">
              <div className="container mx-auto px-4">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold text-center mb-12 text-gray-800"
                >
                  What Our Customers Say
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      quote: "ParkSpot saved me hours of searching for parking every week. The guaranteed spot is worth every penny!",
                      author: "Sarah Johnson",
                      role: "Business Executive"
                    },
                    {
                      quote: "I love the real-time availability feature. No more driving around in circles looking for parking.",
                      author: "Michael Chen",
                      role: "Sales Manager"
                    },
                    {
                      quote: "The monthly subscription is so convenient. I've recommended ParkSpot to all my colleagues.",
                      author: "Emma Rodriguez",
                      role: "Marketing Director"
                    }
                  ].map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-8 rounded-xl shadow-md"
                    >
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
      
            {/* CTA Section */}
            <div className="bg-primary text-white py-16">
              <div className="container mx-auto px-4 text-center">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-6"
                >
                  Ready to Simplify Your Parking?
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-xl mb-8 max-w-2xl mx-auto"
                >
                  Join thousands of satisfied customers parking with ease
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <Link  to="/sign" className="btn btn-primary btn-soft px-8 py-3 rounded-lg font-medium transition">
                    Sign Up Now
                  </Link>
                </motion.div>
              </div>
            </div>
      
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <FaCar className="text-2xl text-blue-400" />
                      <span className="text-xl font-bold">ParkSpot</span>
                    </div>
                    <p className="text-gray-400">
                      Professional parking management solution for businesses and individuals.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link to="#" className="hover:text-white transition">About Us</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Careers</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Blog</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Press</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg mb-4">Resources</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link to="#" className="hover:text-white transition">Help Center</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Partners</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Guides</Link></li>
                      <li><Link to="#" className="hover:text-white transition">API Docs</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg mb-4">Legal</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link to="#" className="hover:text-white transition">Privacy</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Terms</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Cookie Policy</Link></li>
                      <li><Link to="#" className="hover:text-white transition">Licenses</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 mb-4 md:mb-0">
                    &copy; 2025 ParkSpot. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <Link to="#" className="text-gray-400 hover:text-white transition">Facebook</Link>
                    <Link to="#" className="text-gray-400 hover:text-white transition">Twitter</Link>
                    <Link to="#" className="text-gray-400 hover:text-white transition">LinkedIn</Link>
                    <Link to="#" className="text-gray-400 hover:text-white transition">Instagram</Link>
                  </div>
                </div>
              </div>
            </footer>
            {showSubscriptionModal && <ClientSubscription onClose={() => setShowSubscriptionModal(false)} />}
    </div>
  );
};

export default HomePage;