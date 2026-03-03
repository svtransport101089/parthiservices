import { motion, useScroll, useTransform } from 'motion/react';
import {
  Code,
  Cookie,
  SprayCan,
  Sparkles,
  Home,
  Leaf,
  Car,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  FlaskConical,
  Heart,
  Loader2,
  Brush,
  X,
  Shield,
  FileText,
  Mail
} from 'lucide-react';
import React, { useState } from 'react';
import { supabase } from './supabase';

const services = [
  {
    title: 'Software Programming',
    description: 'Custom software solutions, web development, and tech support.',
    icon: Code,
    color: 'bg-blue-100 text-blue-600',
    price: '₹500 / hr',
  },
  {
    title: 'Snacks Distribution',
    description: 'UNIBIC, A2B (5,10,20,35), OTTER, DONUT ZIGGY, NATURO JELLY',
    icon: Cookie,
    color: 'bg-amber-100 text-amber-600',
    price: 'MRP Based',
  },
  {
    title: 'Housekeeping Materials',
    description: 'High-quality cleaning supplies and housekeeping materials distributor.',
    icon: SprayCan,
    color: 'bg-teal-100 text-teal-600',
    price: 'Wholesale Rates',
  },
  {
    title: 'Deep Cleaning Services',
    description: 'Thorough deep cleaning for homes and offices to ensure a spotless environment.',
    icon: Sparkles,
    color: 'bg-emerald-100 text-emerald-600',
    price: '₹1,500 / session',
  },
  {
    title: 'Housekeeping Services',
    description: 'Regular housekeeping and maintenance to keep your space organized.',
    icon: Home,
    color: 'bg-indigo-100 text-indigo-600',
    price: '₹600 / day',
  },
  {
    title: 'Gardening Work',
    description: 'Professional gardening, landscaping, and plant care services.',
    icon: Leaf,
    color: 'bg-green-100 text-green-600',
    price: '₹500 / visit',
  },
  {
    title: 'Car Cleaning with Cloth Only',
    description: 'Detailed interior and exterior car cleaning with cloth only.',
    icon: Car,
    color: 'bg-slate-100 text-slate-600',
    price: '₹400 / wash',
  },
  {
    title: 'Gate Cleaning',
    description: 'Detailed gate scrubbing and high-ceiling dust removal using specialized brushing tools.',
    icon: Brush,
    color: 'bg-orange-100 text-orange-600',
    price: '₹300 / gate',
  },
];

const areas = [
  'Mambalam to Guduvanchery',
  'Padappai to Medavakkam',
  'Anakaputhur to Tambaram',
];

export default function App() {
  const [isBooking, setIsBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    notes: ''
  });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  const getDayName = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const selectedDay = getDayName(selectedDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Submit to Supabase (Primary Database)
      if (!supabase) {
        throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your secrets.');
      }

      const { error: supabaseError } = await supabase
        .from('bookings')
        .insert([
          {
            ...formData,
            date: selectedDate,
            time: `${selectedDay.toLowerCase()}_evening`,
          }
        ]);

      if (supabaseError) {
        console.error('Supabase Insert Error:', supabaseError);
        throw new Error(`Supabase Error: ${supabaseError.message}`);
      }

      // 2. Send Email Notification directly to parthi1010891@gmail.com
      const emailResponse = await fetch("https://formsubmit.co/ajax/parthi1010891@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `New Booking Request: ${formData.service}`,
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          Service: formData.service,
          Date: selectedDate,
          Time: `${selectedDay.toLowerCase()}_evening`,
          Location: formData.location,
          Notes: formData.notes || "None provided"
        })
      });

      if (!emailResponse.ok) {
        console.error('Email Notification Error: Failed to send email.');
      }

      setIsBooking(true);
      // Reset form
      setFormData({ name: '', email: '', phone: '', service: '', location: '', notes: '' });
      setSelectedDate('');
    } catch (err) {
      console.error('Submission Error:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200">
      {/* Navigation */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-4">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-stone-200/20 rounded-2xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-emerald-600/20">
              P
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-stone-900">Parthi Services</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-stone-600">
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">About</button>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">Services</button>
            <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-emerald-600 transition-colors">Book</button>
          </div>
          <button 
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-stone-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-stone-900/20 hover:shadow-emerald-600/30 text-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-950 pt-20">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px]" />
        </div>
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxuryhome/1920/1080?blur=2')] bg-cover bg-center opacity-20 mix-blend-overlay h-[120%]" 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-emerald-300 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Premium Home & Business Solutions
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]"
            >
              Elevate Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Space & Business
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              From custom software to deep cleaning, gardening, and premium snacks. 
              Experience multi-talented professional excellence.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-emerald-500/25 text-lg"
              >
                Book an Appointment
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md px-8 py-4 rounded-full font-medium transition-all text-lg"
              >
                Explore Services
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-stone-400 to-transparent" />
        </motion.div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-stone-900">About Parthi Services</h2>
              <p className="text-stone-600 mb-6 leading-relaxed text-lg">
                Parthi Services is a premier multi-service provider dedicated to delivering exceptional quality across various domains. Founded on the principles of reliability, professionalism, and customer satisfaction, we have grown to become a trusted partner for both residential and commercial clients.
              </p>
              <p className="text-stone-600 mb-6 leading-relaxed text-lg">
                Whether you need cutting-edge software solutions, meticulous deep cleaning, professional gardening, or reliable distribution of high-quality snacks and housekeeping materials, our team is equipped with the expertise and dedication to exceed your expectations.
              </p>
              <p className="text-stone-600 leading-relaxed text-lg">
                We pride ourselves on our flexible scheduling, transparent pricing, and unwavering commitment to excellence. Your satisfaction is our top priority, and we continuously strive to innovate and improve our service offerings to better serve our community.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-300/50 border-8 border-white"
            >
              <img 
                src="https://picsum.photos/seed/business/800/1000" 
                alt="Professional Services" 
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent flex items-end p-10">
                <div className="text-white">
                  <p className="font-display font-bold text-3xl mb-2">Committed to Excellence</p>
                  <p className="text-stone-300 text-lg">Serving our community with pride and dedication.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-white relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-stone-900">Everything You Need</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg">
              Comprehensive services tailored to your needs. Whether you need a website built, 
              your house deep cleaned, or fresh snacks delivered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-8 rounded-[2rem] bg-white border border-stone-100 shadow-xl shadow-stone-200/40 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3 text-stone-900">{service.title}</h3>
                <p className="text-stone-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-stone-100 text-stone-800 text-sm font-semibold group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                  {service.price}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Availability & Areas */}
      <section className="py-32 bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1920/1080?blur=4')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Availability & Coverage</h2>
              <p className="text-stone-400 mb-12 text-lg leading-relaxed">
                Flexible scheduling to meet your needs. Serving major routes across the city with prompt and reliable service.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-2xl mb-2">Service Area</h4>
                    <p className="text-stone-400 font-medium text-emerald-400 text-lg">Strictly within 25 km radius from Tambaram</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
                    <Clock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-2xl mb-2">Working Hours</h4>
                    <p className="text-stone-400 text-lg">Daily Evening Appointments</p>
                    <p className="text-stone-400 text-lg">Sundays Available</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/20">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-2xl mb-3">Service Routes</h4>
                    <ul className="space-y-3">
                      {areas.map((area) => (
                        <li key={area} className="flex items-center gap-3 text-stone-300 text-lg">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-[2.5rem] blur-3xl opacity-20" />
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl relative">
                <h3 className="font-display text-2xl font-bold mb-8 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                  Payment Information
                </h3>
                <div className="bg-stone-900/80 p-8 rounded-2xl border border-white/5 text-center shadow-inner">
                  <p className="text-sm text-stone-400 mb-3 uppercase tracking-widest font-semibold">Google Pay / UPI ID</p>
                  <p className="text-2xl md:text-3xl font-mono text-emerald-400 break-all font-medium">
                    parthi101089-2@oksbi
                  </p>
                </div>
                <p className="text-stone-400 text-base mt-8 text-center">
                  Secure payments accepted via GPay for all services and distributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="py-32 bg-stone-50 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200/50 border border-stone-100 p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-stone-900">Book an Appointment</h2>
              <p className="text-stone-500 text-lg">Fill out the form below to schedule a service.</p>
            </div>

            {isBooking ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-display text-3xl font-bold mb-4 text-stone-900">Request Sent!</h3>
                <p className="text-stone-600 mb-10 text-lg max-w-md mx-auto">
                  Thank you for booking. I will contact you shortly to confirm the appointment.
                </p>
                <button 
                  onClick={() => setIsBooking(false)}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors"
                >
                  Book another service
                </button>
              </motion.div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {submitError && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {submitError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                      placeholder="Your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Service Required</label>
                    <select 
                      required
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none"
                    >
                      <option value="">Select a service...</option>
                      {services.map(s => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Preferred Date</label>
                    <input 
                      required
                      type="date" 
                      name="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">Preferred Time</label>
                    <select 
                      required
                      name="time"
                      disabled={!selectedDate}
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all disabled:opacity-50 appearance-none"
                    >
                      <option value="">{selectedDate ? 'Select time...' : 'Please select a date first'}</option>
                      {selectedDay && (
                        <option value={`${selectedDay.toLowerCase()}_evening`}>
                          {selectedDay.toUpperCase()} EVENING
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Location / Area</label>
                  <select 
                    required
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none"
                  >
                    <option value="">Select your area...</option>
                    {areas.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                    <option value="other">Other (Please specify in notes)</option>
                  </select>
                  <p className="mt-3 text-sm text-emerald-600 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Note: Bookings are only accepted within a 25 km radius from Tambaram.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Additional Notes</label>
                  <textarea 
                    rows={4}
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"
                    placeholder="Any specific requirements or details..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-emerald-300 disabled:to-teal-400 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <CalendarDays className="w-6 h-6" />
                  )}
                  {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Donate for R&D Section */}
      <section className="py-32 bg-stone-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1920/1080?blur=4')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-2xl shadow-emerald-900/20">
            <FlaskConical className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Donate for R & D</h2>
          <p className="text-stone-400 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
            Your contributions fuel our Research and Development. Help us build better software, improve our services, and innovate for the future.
          </p>
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] max-w-sm mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center font-display font-bold text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                  P
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-1">Parthiban D</h3>
                <p className="text-stone-400 text-sm uppercase tracking-widest font-semibold">Scan to pay with any UPI app</p>
              </div>
              
              <div className="bg-white p-4 rounded-3xl mb-8 inline-block border-4 border-emerald-500/20 shadow-xl shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=parthi101089-2@oksbi&pn=Parthiban%20D&cu=INR" 
                  alt="Donation QR Code" 
                  className="w-48 h-48 rounded-xl"
                />
              </div>
              
              <div className="bg-stone-900/80 p-5 rounded-2xl flex items-center justify-between gap-4 text-left border border-white/5 shadow-inner">
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-1">UPI ID</p>
                  <p className="font-mono text-emerald-400 font-medium break-all text-lg">parthi101089-2@oksbi</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-white/10 pt-20 pb-10 text-stone-400 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-2xl flex items-center justify-center font-display font-bold text-2xl shadow-lg shadow-emerald-500/25">
                  P
                </div>
                <span className="font-display font-bold text-2xl text-white tracking-tight">Parthi Services</span>
              </div>
              <p className="text-stone-400 leading-relaxed mb-8 text-lg max-w-md">
                Professional multi-service provider offering software programming, deep cleaning, housekeeping, snacks distribution, and more.
              </p>
              <div className="flex items-center gap-4">
                <a href="mailto:parthi1010891@gmail.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-400 transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="md:col-span-3 md:col-start-7">
              <h3 className="font-display text-white font-bold text-xl mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-400 hover:text-emerald-400 transition-colors text-lg flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-colors" />
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-400 hover:text-emerald-400 transition-colors text-lg flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-colors" />
                    Our Services
                  </button>
                </li>
                <li>
                  <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="text-stone-400 hover:text-emerald-400 transition-colors text-lg flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500 transition-colors" />
                    Book Appointment
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="font-display text-white font-bold text-xl mb-6">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => setActiveModal('privacy')} className="text-stone-400 hover:text-emerald-400 transition-colors text-lg flex items-center gap-3 group">
                    <Shield className="w-5 h-5 text-stone-500 group-hover:text-emerald-500 transition-colors" /> 
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveModal('terms')} className="text-stone-400 hover:text-emerald-400 transition-colors text-lg flex items-center gap-3 group">
                    <FileText className="w-5 h-5 text-stone-500 group-hover:text-emerald-500 transition-colors" /> 
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} Parthi Services. All rights reserved.</p>
            <p className="text-sm flex items-center gap-2">
              Designed with <Heart className="w-4 h-4 text-emerald-500" /> for excellence
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="text-2xl font-bold text-stone-900">
                {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-stone-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-stone-600 prose prose-stone max-w-none">
              {activeModal === 'privacy' ? (
                <>
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">1. Information We Collect</h3>
                  <p>We collect information you provide directly to us when you fill out our booking form, including your name, email address, phone number, and location details. We use this information solely to provide our services and communicate with you.</p>
                  
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">2. Google AdSense & Cookies</h3>
                  <p>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
                  <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Ads Settings</a>.</p>
                  
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">3. Data Security</h3>
                  <p>We implement appropriate technical and organizational measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
                  
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">4. Contact Us</h3>
                  <p>If you have any questions about this Privacy Policy, please contact us at parthi1010891@gmail.com.</p>
                </>
              ) : (
                <>
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">1. Acceptance of Terms</h3>
                  <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                  
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">2. Service Provision</h3>
                  <p>We reserve the right to refuse service to anyone for any reason at any time. Prices for our products and services are subject to change without notice.</p>
                  
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">3. Booking and Cancellations</h3>
                  <p>When you book a service, you agree to provide current, complete, and accurate information. We reserve the right to cancel or reschedule appointments due to unforeseen circumstances.</p>
                  
                  <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-2">4. Limitation of Liability</h3>
                  <p>In no case shall Parthi Services, our directors, officers, employees, affiliates, agents, contractors, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.</p>
                </>
              )}
            </div>
            <div className="p-6 border-t border-stone-100 bg-stone-50 text-right">
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
